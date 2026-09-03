import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import crypto from "crypto";

function verifyPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash) return false;
  const salt = "algo_dev_salt_2026";
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === storedHash;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // 1. Credentials Provider (Dev / Immediate Testing)
    Credentials({
      name: "ALGO Account",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = String(credentials.identifier).trim().toLowerCase();
        const password = String(credentials.password);

        const foundUsers = await db
          .select()
          .from(users)
          .where(or(eq(users.email, identifier), eq(users.username, identifier)))
          .limit(1);

        const user = foundUsers[0];
        if (!user || !user.passwordHash) return null;

        const isValid = verifyPassword(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
          role: user.role,
          username: user.username,
        };
      },
    }),

    // 2. GitHub OAuth (Enabled when credentials provided)
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),

    // 3. Google OAuth (Enabled when credentials provided)
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            checks: ["state"],
          }),
        ]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Ensure user exists in PostgreSQL for OAuth providers
      if (account?.provider !== "credentials") {
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        let dbUserId = existingUsers[0]?.id;

        if (!existingUsers[0]) {
          const baseUsername =
            (user.name || user.email.split("@")[0])
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "")
              .slice(0, 30) || "engineer";
          
          const uniqueUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

          const [newUser] = await db
            .insert(users)
            .values({
              name: user.name || "Curious Engineer",
              username: uniqueUsername,
              email: user.email,
              avatarUrl: user.image,
              role: "STUDENT",
            })
            .returning();

          dbUserId = newUser.id;
          (user as { role?: string }).role = newUser.role;
          (user as { username?: string }).username = newUser.username;
        } else {
          (user as { role?: string }).role = existingUsers[0].role;
          (user as { username?: string }).username = existingUsers[0].username;
        }

        user.id = dbUserId!;
      }

      return true;
    },
  },
});
