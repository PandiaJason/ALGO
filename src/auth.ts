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

      const isOwnerAdmin = user.email.toLowerCase() === "pandiajason@gmail.com";
      const baseUsername =
        (user.name || user.email.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 30) || "engineer";
      const defaultUsername = isOwnerAdmin ? "jasonpandian" : baseUsername;

      // Ensure user attributes exist on the user object for JWT token generation
      (user as { role?: string }).role = isOwnerAdmin ? "ADMIN" : "STUDENT";
      (user as { username?: string }).username = defaultUsername;
      if (!user.id) {
        user.id = `usr_${Buffer.from(user.email).toString("hex").slice(0, 16)}`;
      }

      // Sync user with PostgreSQL if database is reachable
      if (account?.provider !== "credentials") {
        try {
          const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          let dbUserId = existingUsers[0]?.id;

          if (!existingUsers[0]) {
            const uniqueUsername = isOwnerAdmin
              ? "jasonpandian"
              : `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

            const [newUser] = await db
              .insert(users)
              .values({
                name: isOwnerAdmin ? "Jason Pandian" : user.name || "Curious Engineer",
                username: uniqueUsername,
                email: user.email,
                avatarUrl: user.image,
                role: isOwnerAdmin ? "ADMIN" : "STUDENT",
              })
              .returning();

            if (newUser) {
              dbUserId = newUser.id;
              (user as { role?: string }).role = newUser.role;
              (user as { username?: string }).username = newUser.username;
            }
          } else {
            if (isOwnerAdmin && existingUsers[0].role !== "ADMIN") {
              await db
                .update(users)
                .set({ role: "ADMIN", name: "Jason Pandian" })
                .where(eq(users.id, existingUsers[0].id));
              existingUsers[0].role = "ADMIN";
            }
            (user as { role?: string }).role = existingUsers[0].role;
            (user as { username?: string }).username = existingUsers[0].username;
          }

          if (dbUserId) {
            user.id = dbUserId;
          }
        } catch (dbErr) {
          console.warn("Database sync skipped during OAuth sign-in (falling back to JWT session):", dbErr);
        }
      }

      return true;
    },
  },
});
