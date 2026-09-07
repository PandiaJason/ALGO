import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql, and, ne } from "drizzle-orm";
import { z } from "zod";

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "api",
  "auth",
  "challenges",
  "challenge",
  "explore",
  "leaderboard",
  "leaderboards",
  "profile",
  "profiles",
  "settings",
  "setting",
  "signin",
  "sign-in",
  "signout",
  "sign-out",
  "login",
  "logout",
  "register",
  "signup",
  "sign-up",
  "static",
  "public",
  "favicon",
  "robots",
  "sitemap",
  "user",
  "users",
  "system",
  "root",
  "support",
  "help",
  "terms",
  "privacy",
  "status",
  "about",
  "blog",
  "docs",
  "submissions",
  "submission",
  "null",
  "undefined",
]);

const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "ID must be at least 3 characters")
    .max(30, "ID cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "ID can only contain letters, numbers, and underscores")
    .transform((val) => val.toLowerCase().trim()),
  name: z.string().max(100, "Display name cannot exceed 100 characters").optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);
    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { username: requestedUsername, name: requestedName } = result.data;

    // 1. Check reserved list
    if (RESERVED_USERNAMES.has(requestedUsername)) {
      return NextResponse.json(
        { error: `'@${requestedUsername}' is a system reserved handle. Please choose another.` },
        { status: 400 }
      );
    }

    // 2. Identify the active user record in database
    let currentUser = null;
    if (session.user.id) {
      const [u] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
      currentUser = u;
    }
    if (!currentUser && session.user.email) {
      const [u] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email.toLowerCase().trim()))
        .limit(1);
      currentUser = u;
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User account not found in database." }, { status: 404 });
    }

    // 3. Collision check: Ensure no OTHER user holds this username (case-insensitive)
    const [conflictingUser] = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(
        and(
          sql`LOWER(${users.username}) = LOWER(${requestedUsername})`,
          ne(users.id, currentUser.id)
        )
      )
      .limit(1);

    if (conflictingUser) {
      return NextResponse.json(
        {
          error: `The ID '@${requestedUsername}' is already claimed by another engineer. Please choose a different handle.`,
          isConflict: true,
        },
        { status: 409 }
      );
    }

    // 4. Update the user record atomically
    const [updatedUser] = await db
      .update(users)
      .set({
        username: requestedUsername,
        name: requestedName !== undefined ? requestedName.trim() : currentUser.name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id))
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    console.error("[Profile Update Error]:", error);

    // PostgreSQL unique constraint safety net (23505 = unique_violation)
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "This ID was just claimed by another user. Please choose another.", isConflict: true },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile. Please try again later." },
      { status: 500 }
    );
  }
}
