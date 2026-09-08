import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whitelistUsers } from "@/db/schema";
import { sendWishlistNotificationEmail } from "@/lib/email";
import { z } from "zod";

const wishlistSchema = z.object({
  email: z.string().email("Please provide a valid email address").max(255),
  message: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = wishlistSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const cleanEmail = parsed.data.email.toLowerCase().trim();
    const cleanMessage = parsed.data.message?.trim() || "";

    const noteContent = cleanMessage
      ? `[DM]: ${cleanMessage}`
      : "[Wishlist Request from Landing Page]";

    // Upsert into whitelist_users database table
    await db
      .insert(whitelistUsers)
      .values({
        email: cleanEmail,
        notes: noteContent,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: whitelistUsers.email,
        set: {
          notes: noteContent,
          createdAt: new Date(),
        },
      });

    // Extract client IP if available
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    // Send instant notification to pandiajason@gmail.com
    await sendWishlistNotificationEmail({
      email: cleanEmail,
      message: cleanMessage,
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "You've been added to the early access wishlist! Jason has been notified.",
    });
  } catch (err: any) {
    console.error("[API Wishlist] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process wishlist request" },
      { status: 500 }
    );
  }
}
