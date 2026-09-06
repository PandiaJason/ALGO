import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { whitelistUsers, users, auditLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const addEmailSchema = z.object({
  email: z.string().email().max(255),
  notes: z.string().max(500).optional(),
});

const updateWhitelistSchema = z.object({
  email: z.string().email().max(255),
  notes: z.string().max(500).optional().nullable(),
  role: z.enum(["STUDENT", "ADMIN"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Query whitelist entries with registration status and role from users table
    const entries = await db
      .select({
        id: whitelistUsers.id,
        email: whitelistUsers.email,
        notes: whitelistUsers.notes,
        createdAt: whitelistUsers.createdAt,
        registeredUsername: users.username,
        registeredName: users.name,
        registeredRole: users.role,
        registeredAt: users.createdAt,
      })
      .from(whitelistUsers)
      .leftJoin(users, eq(whitelistUsers.email, users.email))
      .orderBy(desc(whitelistUsers.createdAt));

    return NextResponse.json({ entries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = addEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    const targetEmail = parsed.data.email.toLowerCase().trim();
    const notes = parsed.data.notes?.trim() || null;

    // Check if already exists
    const [existing] = await db
      .select()
      .from(whitelistUsers)
      .where(eq(whitelistUsers.email, targetEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "This email is already on the access wishlist" },
        { status: 409 }
      );
    }

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }
    const adminId = adminUser.id;

    const [entry] = await db
      .insert(whitelistUsers)
      .values({
        email: targetEmail,
        notes,
        addedBy: adminId,
      })
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      adminId,
      action: "WHITELIST_EMAIL_ADDED",
      resource: "whitelist_users",
      resourceId: entry.id,
      metadata: { email: targetEmail, notes },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, entry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateWhitelistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
    }

    const targetEmail = parsed.data.email.toLowerCase().trim();
    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }

    const [existing] = await db
      .select()
      .from(whitelistUsers)
      .where(eq(whitelistUsers.email, targetEmail))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Wishlist entry not found" }, { status: 404 });
    }

    // Update notes if provided
    let updatedNotes = existing.notes;
    if (parsed.data.notes !== undefined) {
      updatedNotes = parsed.data.notes ? parsed.data.notes.trim() : null;
      await db
        .update(whitelistUsers)
        .set({ notes: updatedNotes })
        .where(eq(whitelistUsers.email, targetEmail));
    }

    // If role is provided, synchronize with users table
    let updatedRole: string | undefined;
    if (parsed.data.role) {
      if (targetEmail === ADMIN_EMAIL && parsed.data.role !== "ADMIN") {
        return NextResponse.json({ error: "Cannot demote platform owner." }, { status: 400 });
      }

      const [updatedUser] = await db
        .update(users)
        .set({ role: parsed.data.role, updatedAt: new Date() })
        .where(eq(users.email, targetEmail))
        .returning();

      if (updatedUser) {
        updatedRole = updatedUser.role;
      }
    }

    await db.insert(auditLogs).values({
      adminId: adminUser.id,
      action: "WHITELIST_EMAIL_UPDATED",
      resource: "whitelist_users",
      resourceId: existing.id,
      metadata: { email: targetEmail, notes: updatedNotes, role: updatedRole },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      entry: {
        ...existing,
        notes: updatedNotes,
        registeredRole: updatedRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    // Protect platform owner from deletion
    if (email === ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Cannot remove the platform owner from the wishlist" },
        { status: 403 }
      );
    }

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }
    const adminId = adminUser.id;

    await db.delete(whitelistUsers).where(eq(whitelistUsers.email, email));

    // Audit log
    await db.insert(auditLogs).values({
      adminId,
      action: "WHITELIST_EMAIL_REMOVED",
      resource: "whitelist_users",
      resourceId: null,
      metadata: { email },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: `Removed ${email} from wishlist` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
