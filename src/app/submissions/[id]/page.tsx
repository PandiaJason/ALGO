import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  submissions,
  submissionResults,
  challenges,
  leaderboardEntries,
  users,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ResultClient } from "./result-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SubmissionResultPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  // Find submission
  const foundSubmissions = await db
    .select({
      id: submissions.id,
      userId: submissions.userId,
      language: submissions.language,
      level: submissions.level,
      status: submissions.status,
      submittedAt: submissions.submittedAt,
      challengeTitle: challenges.title,
      challengeSlug: challenges.slug,
      challengeId: challenges.id,
    })
    .from(submissions)
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .where(eq(submissions.id, id))
    .limit(1);

  const submission = foundSubmissions[0];
  if (!submission) {
    notFound();
  }

  // Authorize: Students can only view their own submissions unless they are an ADMIN
  const currentUserId = session?.user?.id;
  const userRole = (session?.user as any)?.role;
  if (submission.userId !== currentUserId && userRole !== "ADMIN") {
    // Return unauthorized / not found to protect privacy
    notFound();
  }

  // Find result if available
  const results = await db
    .select()
    .from(submissionResults)
    .where(eq(submissionResults.submissionId, submission.id))
    .limit(1);

  const res = results[0];

  // Leaderboard ranking and competitive context
  let rank: number | null = null;
  let aheadRank: number | null = null;
  let aheadUsername: string | null = null;

  if (res && res.isCorrect && !res.isInvalidated) {
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
        const aheadEntry = await db
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
        aheadUsername = aheadEntry[0]?.username || null;
      }
    }
  }

  // Find previous submission score if any
  const prevSubmissions = await db
    .select({ score: submissionResults.score })
    .from(submissions)
    .innerJoin(
      submissionResults,
      eq(submissions.id, submissionResults.submissionId)
    )
    .where(
      and(
        eq(submissions.userId, submission.userId),
        eq(submissions.challengeId, submission.challengeId),
        eq(submissionResults.isCorrect, true)
      )
    )
    .orderBy(desc(submissions.submittedAt))
    .limit(2);

  const previousScore = prevSubmissions[1]?.score || null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />
      <main className="flex-1">
        <ResultClient
          initialSubmission={{
            id: submission.id,
            language: submission.language,
            level: submission.level,
            status: submission.status as any,
            submittedAt: submission.submittedAt.toISOString(),
            challengeTitle: submission.challengeTitle,
            challengeSlug: submission.challengeSlug,
          }}
          initialResult={
            res
              ? {
                  correctnessPassed: res.correctnessPassed,
                  correctnessTotal: res.correctnessTotal,
                  correctnessScore: String(res.correctnessScore),
                  isCorrect: res.isCorrect,
                  throughputOpsSec: res.throughputOpsSec ? String(res.throughputOpsSec) : null,
                  latencyP50Ms: res.latencyP50Ms ? String(res.latencyP50Ms) : null,
                  latencyP95Ms: res.latencyP95Ms ? String(res.latencyP95Ms) : null,
                  latencyP99Ms: res.latencyP99Ms ? String(res.latencyP99Ms) : null,
                  memoryBytes: res.memoryBytes,
                  baselineThroughput: res.baselineThroughput ? String(res.baselineThroughput) : null,
                  score: String(res.score),
                  improvementPct: String(res.improvementPct),
                  rank,
                  aheadRank,
                  aheadUsername,
                  previousScore: previousScore ? String(previousScore) : null,
                  testOutput: res.testOutput,
                  errorOutput: res.errorOutput,
                }
              : null
          }
        />
      </main>
      <Footer />
    </div>
  );
}
