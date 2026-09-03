import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  submissions,
  submissionResults,
  leaderboardEntries,
  users,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const foundSubmissions = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    const submission = foundSubmissions[0];
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    if (submission.userId !== session.user.id && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const results = await db
      .select()
      .from(submissionResults)
      .where(eq(submissionResults.submissionId, submission.id))
      .limit(1);

    const res = results[0];
    if (!res) {
      return NextResponse.json(
        { error: "Result not available yet", status: submission.status },
        { status: 202 }
      );
    }

    // Get rank if available
    let rank: number | null = null;
    let aheadRank: number | null = null;
    let aheadUsername: string | null = null;

    if (res.isCorrect && !res.isInvalidated) {
      const leaderEntry = await db
        .select({ rank: leaderboardEntries.rank })
        .from(leaderboardEntries)
        .where(
          and(
            eq(leaderboardEntries.challengeId, submission.challengeId),
            eq(leaderboardEntries.userId, submission.userId)
          )
        )
        .limit(1);

      if (leaderEntry[0]) {
        rank = leaderEntry[0].rank;
        if (rank > 1) {
          aheadRank = rank - 1;
          const ahead = await db
            .select({ username: users.username })
            .from(leaderboardEntries)
            .innerJoin(users, eq(leaderboardEntries.userId, users.id))
            .where(
              and(
                eq(leaderboardEntries.challengeId, submission.challengeId),
                eq(leaderboardEntries.rank, aheadRank)
              )
            )
            .limit(1);
          aheadUsername = ahead[0]?.username || null;
        }
      }
    }

    return NextResponse.json({
      submissionId: submission.id,
      status: submission.status,
      correctnessPassed: res.correctnessPassed,
      correctnessTotal: res.correctnessTotal,
      correctnessScore: res.correctnessScore,
      isCorrect: res.isCorrect,
      throughputOpsSec: res.throughputOpsSec,
      latencyP50Ms: res.latencyP50Ms,
      latencyP95Ms: res.latencyP95Ms,
      latencyP99Ms: res.latencyP99Ms,
      memoryBytes: res.memoryBytes,
      baselineThroughput: res.baselineThroughput,
      score: res.score,
      improvementPct: res.improvementPct,
      rank,
      aheadRank,
      aheadUsername,
      rawMetrics: res.rawMetrics,
      testOutput: res.testOutput,
      errorOutput: res.errorOutput,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
