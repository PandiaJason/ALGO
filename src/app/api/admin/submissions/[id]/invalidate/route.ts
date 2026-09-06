import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  submissions,
  submissionResults,
  leaderboardEntries,
  auditLogs,
  users,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";

export async function POST(
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
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "Administrative action";

    // 1. Get submission and current result
    const [sub] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
    if (!sub) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const [currentResult] = await db
      .select()
      .from(submissionResults)
      .where(eq(submissionResults.submissionId, id))
      .limit(1);

    if (!currentResult) {
      return NextResponse.json({ error: "Submission has no evaluation results" }, { status: 400 });
    }

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }
    const adminId = adminUser.id;

    const newInvalidatedState = !currentResult.isInvalidated;

    // 2. Update submission result invalidation state
    await db
      .update(submissionResults)
      .set({
        isInvalidated: newInvalidatedState,
        invalidatedBy: newInvalidatedState ? adminId : null,
        invalidatedAt: newInvalidatedState ? new Date() : null,
        invalidationReason: newInvalidatedState ? reason : null,
      })
      .where(eq(submissionResults.submissionId, id));

    // 3. Update leaderboard entries
    if (newInvalidatedState) {
      // Remove from leaderboard
      await db
        .delete(leaderboardEntries)
        .where(eq(leaderboardEntries.submissionId, id));
    } else if (currentResult.isCorrect && currentResult.throughputOpsSec) {
      // Restore to leaderboard
      await db
        .insert(leaderboardEntries)
        .values({
          challengeId: sub.challengeId,
          userId: sub.userId,
          submissionId: id,
          score: currentResult.score || "0",
          throughputOpsSec: currentResult.throughputOpsSec,
          latencyP99Ms: currentResult.latencyP99Ms || "0",
          memoryBytes: currentResult.memoryBytes || 0,
          rank: 1,
          isVerified: true,
        })
        .onConflictDoNothing();
    }

    // 4. Log immutable audit entry
    await db.insert(auditLogs).values({
      adminId,
      action: newInvalidatedState ? "SUBMISSION_INVALIDATED" : "SUBMISSION_RESTORED",
      resource: "submission",
      resourceId: id,
      metadata: { reason, previousState: currentResult.isInvalidated },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      isInvalidated: newInvalidatedState,
      message: newInvalidatedState
        ? "Submission invalidated and removed from leaderboard."
        : "Submission validity restored.",
    });
  } catch (err: any) {
    console.error("[Invalidate Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
