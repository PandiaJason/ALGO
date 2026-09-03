import React from "react";
import Link from "next/link";
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
import { formatThroughput, formatLatency, formatBytes } from "@/lib/utils";
import { Trophy, CheckCircle2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GlobalLeaderboardPage() {
  const session = await auth();

  const entries = await db
    .select({
      id: leaderboardEntries.id,
      score: leaderboardEntries.score,
      throughputOpsSec: leaderboardEntries.throughputOpsSec,
      latencyP99Ms: leaderboardEntries.latencyP99Ms,
      memoryBytes: leaderboardEntries.memoryBytes,
      username: users.username,
      challengeTitle: challenges.title,
      challengeSlug: challenges.slug,
      language: submissions.language,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .innerJoin(challenges, eq(leaderboardEntries.challengeId, challenges.id))
    .innerJoin(submissions, eq(leaderboardEntries.submissionId, submissions.id))
    .innerJoin(
      submissionResults,
      eq(submissions.id, submissionResults.submissionId)
    )
    .where(eq(submissionResults.isInvalidated, false))
    .orderBy(desc(leaderboardEntries.score))
    .limit(50);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-slate-200/80 pb-6 space-y-1">
          <div className="text-xs font-mono font-medium text-[#2d7cf6] uppercase tracking-wider">
            GLOBAL RANKINGS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            <span>Engineering Proving Ground Leaderboard</span>
          </h1>
          <p className="text-xs text-slate-500">
            Top engineering scores verified across all hardware benchmarks.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 rounded-lg p-8 space-y-3">
            <Trophy className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">
              No verified scores on the leaderboard
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Build a system, test correctness, and submit it for official benchmarking.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200/90 rounded-lg overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Engineer</th>
                  <th className="py-3 px-4">Challenge</th>
                  <th className="py-3 px-4">Normalized Score</th>
                  <th className="py-3 px-4">Throughput</th>
                  <th className="py-3 px-4">P99</th>
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
                        #{rank}
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
                      <td className="py-3 px-4 font-sans text-slate-600">
                        <Link
                          href={`/challenges/${entry.challengeSlug}`}
                          className="hover:underline"
                        >
                          {entry.challengeTitle}
                        </Link>
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
