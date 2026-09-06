import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, auditLogs, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  tagline: z.string().max(255).optional(),
  description: z.string().min(10).optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
    }

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }

    const [updated] = await db
      .update(challenges)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(challenges.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      adminId: adminUser.id,
      action: "CHALLENGE_UPDATED",
      resource: "challenge",
      resourceId: id,
      metadata: parsed.data,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, challenge: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }

    // Soft-archive by default or delete
    const [archived] = await db
      .update(challenges)
      .set({ status: "ARCHIVED", updatedAt: new Date() })
      .where(eq(challenges.id, id))
      .returning();

    if (!archived) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      adminId: adminUser.id,
      action: "CHALLENGE_ARCHIVED",
      resource: "challenge",
      resourceId: id,
      metadata: { slug: archived.slug, title: archived.title },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: `Challenge ${archived.title} archived.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
