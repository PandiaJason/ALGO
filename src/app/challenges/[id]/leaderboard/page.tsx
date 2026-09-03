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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatThroughput, formatLatency, formatBytes } from "@/lib/utils";
import { Trophy, CheckCircle2, ArrowRight, Terminal } from "lucide-react";

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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/challenges/${challenge.slug}`}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                {challenge.title}
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-mono font-medium text-slate-700">
                Leaderboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Official Verification Ranks</span>
            </h1>
            <p className="text-xs text-slate-500">
              Only implementations with 100% test correctness and validated benchmark metrics rank here.
            </p>
          </div>

          <Link href={`/challenges/${challenge.slug}/workspace`}>
            <Button size="sm" variant="primary" className="gap-1.5 text-xs font-semibold shadow-xs">
              <Terminal className="w-3.5 h-3.5" />
              <span>Submit Solution</span>
            </Button>
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 rounded-lg p-8 space-y-3">
            <Trophy className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">
              No verified submissions yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first engineer to construct a correct store and claim #1 on the leaderboard.
            </p>
            <div className="pt-2">
              <Link href={`/challenges/${challenge.slug}/workspace`}>
                <Button size="sm" variant="default" className="text-xs">
                  Open Workspace
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200/90 rounded-lg overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Engineer</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Throughput</th>
                  <th className="py-3 px-4">P99 Latency</th>
                  <th className="py-3 px-4">Memory</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                            3
                          </span>
                        ) : (
                          `#${rank}`
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-900">
                        <Link
                          href={`/profile/${entry.username}`}
                          className="hover:text-[#2d7cf6] transition-colors"
                        >
                          @{entry.username}
                        </Link>
                        <span className="ml-2 text-[10px] font-mono uppercase text-slate-400">
                          {entry.language}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2d7cf6]">
                        {Number(entry.score).toFixed(2)}×
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {formatThroughput(entry.throughputOpsSec)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {entry.latencyP99Ms ? formatLatency(entry.latencyP99Ms) : "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {entry.memoryBytes ? formatBytes(entry.memoryBytes) : "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
