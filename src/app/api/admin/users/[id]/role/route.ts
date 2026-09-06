import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["STUDENT", "ADMIN"]),
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
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Safety guardrail: Prevent primary admin self-demotion
    if (
      targetUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      parsed.data.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "The primary platform administrator account cannot be demoted from ADMIN." },
        { status: 400 }
      );
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        role: parsed.data.role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    await db.insert(auditLogs).values({
      adminId: adminUser.id,
      action: "USER_ROLE_UPDATED",
      resource: "users",
      resourceId: id,
      metadata: {
        targetUsername: targetUser.username,
        targetEmail: targetUser.email,
        oldRole: targetUser.role,
        newRole: parsed.data.role,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
