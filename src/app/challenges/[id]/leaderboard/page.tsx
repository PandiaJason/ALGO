import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  challenges,
  leaderboardEntries,
  users,
  submissions,
  submissionResults,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { LeaderboardTable, LeaderboardItem } from "@/components/leaderboard/leaderboard-table";
import { Trophy, ChevronRight, Terminal, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeLeaderboardPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const foundChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, id))
    .limit(1);

  const challenge = foundChallenges[0];
  if (!challenge) {
    notFound();
  }

  // Get active leaderboard entries (sorted by score descending)
  const entries = await db
    .select({
      id: leaderboardEntries.id,
      score: leaderboardEntries.score,
      throughputOpsSec: leaderboardEntries.throughputOpsSec,
      latencyP99Ms: leaderboardEntries.latencyP99Ms,
      memoryBytes: leaderboardEntries.memoryBytes,
      rank: leaderboardEntries.rank,
      isVerified: leaderboardEntries.isVerified,
      updatedAt: leaderboardEntries.updatedAt,
      username: users.username,
      name: users.name,
      submissionId: leaderboardEntries.submissionId,
      language: submissions.language,
      isInvalidated: submissionResults.isInvalidated,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .innerJoin(submissions, eq(leaderboardEntries.submissionId, submissions.id))
    .innerJoin(
      submissionResults,
      eq(submissions.id, submissionResults.submissionId)
    )
    .where(
      and(
        eq(leaderboardEntries.challengeId, challenge.id),
        eq(submissionResults.isInvalidated, false)
      )
    )
    .orderBy(desc(leaderboardEntries.score));

  const mappedEntries: LeaderboardItem[] = entries.map((e) => ({
    id: e.id,
    score: e.score,
    throughputOpsSec: e.throughputOpsSec,
    latencyP99Ms: e.latencyP99Ms,
    memoryBytes: e.memoryBytes,
    username: e.username,
    challengeTitle: challenge.title,
    challengeSlug: challenge.slug,
    language: e.language,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Link
                href="/challenges"
                className="hover:text-slate-900 transition-colors"
              >
                Problems
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <Link
                href={`/challenges/${challenge.slug}`}
                className="hover:text-slate-900 transition-colors"
              >
                {challenge.title}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 font-semibold font-mono">
                Ranking
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>{challenge.title} • Ranking</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Deterministic verification rankings for {challenge.title}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/challenges/${challenge.slug}/workspace`}>
              <Button size="sm" variant="primary" className="h-8 gap-1.5 text-xs font-semibold px-3 shadow-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>Submit Solution</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* LeetCode Ranking Table */}
        <LeaderboardTable
          entries={mappedEntries}
          currentUsername={(session?.user as any)?.username}
        />
      </main>

      <Footer />
    </div>
  );
}
