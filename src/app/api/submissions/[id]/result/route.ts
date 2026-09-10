import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  submissions,
  submissionResults,
  leaderboardEntries,
  users,
  challenges,
} from "@/db/schema";
import { eq, and, lt, count, sql } from "drizzle-orm";

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
      .select({
        id: submissions.id,
        userId: submissions.userId,
        challengeId: submissions.challengeId,
        language: submissions.language,
        level: submissions.level,
        status: submissions.status,
        challengeSlug: challenges.slug,
      })
      .from(submissions)
      .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
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

    // F3: Calculate dynamic throughput and memory percentiles from actual submissions
    let throughputPercentile: number | null = null;
    let memoryPercentile: number | null = null;

    if (res.isCorrect && res.throughputOpsSec) {
      try {
        const currentThroughput = parseFloat(String(res.throughputOpsSec));
        const currentMemory = res.memoryBytes || 0;

        // Count total correct submissions and those below current throughput for this challenge
        const [totalResult] = await db
          .select({ cnt: count() })
          .from(submissionResults)
          .innerJoin(submissions, eq(submissionResults.submissionId, submissions.id))
          .where(
            and(
              eq(submissions.challengeId, submission.challengeId),
              eq(submissionResults.isCorrect, true)
            )
          );

        const totalCount = totalResult?.cnt || 0;

        if (totalCount >= 3) {
          // Throughput percentile: how many have LOWER throughput
          const [belowThroughput] = await db
            .select({ cnt: count() })
            .from(submissionResults)
            .innerJoin(submissions, eq(submissionResults.submissionId, submissions.id))
            .where(
              and(
                eq(submissions.challengeId, submission.challengeId),
                eq(submissionResults.isCorrect, true),
                sql`CAST(${submissionResults.throughputOpsSec} AS NUMERIC) < ${currentThroughput}`
              )
            );
          throughputPercentile = Math.round(((belowThroughput?.cnt || 0) / totalCount) * 1000) / 10;

          // Memory percentile: how many use MORE memory (lower is better)
          if (currentMemory > 0) {
            const [aboveMemory] = await db
              .select({ cnt: count() })
              .from(submissionResults)
              .innerJoin(submissions, eq(submissionResults.submissionId, submissions.id))
              .where(
                and(
                  eq(submissions.challengeId, submission.challengeId),
                  eq(submissionResults.isCorrect, true),
                  sql`${submissionResults.memoryBytes} > ${currentMemory}`
                )
              );
            memoryPercentile = Math.round(((aboveMemory?.cnt || 0) / totalCount) * 1000) / 10;
          }
        }
        // If fewer than 3 submissions, leave percentiles as null → UI shows "Establishing Baseline"
      } catch (pctErr) {
        console.warn("Percentile calculation failed:", pctErr);
      }
    }

    // F4: Build test suite results from challenge data
    let testSuiteResults: Array<{ name: string; passed: boolean }> | null = null;
    try {
      const { getChallenge } = await import("@/lib/challenges");
      const challengeData = getChallenge(submission.challengeSlug);
      if (challengeData) {
        const level = (submission as any).level || 1;
        const levelData = challengeData.levels[level];
        if (levelData?.cases && Array.isArray(levelData.cases)) {
          const passed = res.correctnessPassed || 0;
          testSuiteResults = levelData.cases.map((c: any, idx: number) => ({
            name: c.name || `Test Case ${idx + 1}`,
            passed: idx < passed,
          }));
        }
      }
    } catch (tsErr) {
      console.warn("Test suite resolution failed:", tsErr);
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
      throughputPercentile,
      memoryPercentile,
      testSuiteResults,
      rawMetrics: res.rawMetrics,
      testOutput: res.testOutput,
      errorOutput: res.errorOutput,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

