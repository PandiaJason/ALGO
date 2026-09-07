import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql, and, ne } from "drizzle-orm";

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

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const rawUsername = searchParams.get("username");

    if (!rawUsername) {
      return NextResponse.json(
        { available: false, reason: "Username parameter is required" },
        { status: 400 }
      );
    }

    const username = rawUsername.toLowerCase().trim();

    // 1. Format checks
    if (username.length < 3) {
      return NextResponse.json({
        available: false,
        reason: "Must be at least 3 characters",
      });
    }

    if (username.length > 30) {
      return NextResponse.json({
        available: false,
        reason: "Cannot exceed 30 characters",
      });
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json({
        available: false,
        reason: "Can only contain letters, numbers, and underscores",
      });
    }

    // 2. Reserved handle check
    if (RESERVED_USERNAMES.has(username)) {
      return NextResponse.json({
        available: false,
        reason: "This ID is reserved by the platform",
      });
    }

    // 3. Collision check in DB
    const currentUserId = session?.user?.id;
    let currentUser = null;
    if (currentUserId) {
      const [u] = await db.select().from(users).where(eq(users.id, currentUserId)).limit(1);
      currentUser = u;
    }
    if (!currentUser && session?.user?.email) {
      const [u] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email.toLowerCase().trim()))
        .limit(1);
      currentUser = u;
    }

    // If it's already the user's current username
    if (currentUser && currentUser.username.toLowerCase() === username) {
      return NextResponse.json({
        available: true,
        isCurrent: true,
        reason: "This is your current ID",
      });
    }

    const whereClause = currentUser
      ? and(sql`LOWER(${users.username}) = LOWER(${username})`, ne(users.id, currentUser.id))
      : sql`LOWER(${users.username}) = LOWER(${username})`;

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(whereClause)
      .limit(1);

    if (existing) {
      return NextResponse.json({
        available: false,
        reason: "Already claimed by another engineer",
      });
    }

    return NextResponse.json({
      available: true,
      reason: "Available!",
    });
  } catch (error) {
    console.error("[Check Username Error]:", error);
    return NextResponse.json(
      { available: false, reason: "Error verifying availability" },
      { status: 500 }
    );
  }
}
