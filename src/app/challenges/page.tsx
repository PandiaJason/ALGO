import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, submissions, leaderboardEntries } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Search,
  Zap,
  ArrowRight,
  Database,
  Cpu,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const session = await auth();
  const publishedChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.status, "PUBLISHED"));

  // Check if current user has solved challenges
  const userSolvedSet = new Set<string>();
  if (session?.user?.id) {
    const userSubs = await db
      .select({ challengeId: submissions.challengeId })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, session.user.id),
          eq(submissions.status, "COMPLETED")
        )
      );
    userSubs.forEach((s) => userSolvedSet.add(s.challengeId));
  }

  // Get top score for each challenge
  const leaders = await db
    .select({
      challengeId: leaderboardEntries.challengeId,
      throughputOpsSec: leaderboardEntries.throughputOpsSec,
      score: leaderboardEntries.score,
    })
    .from(leaderboardEntries)
    .orderBy(desc(leaderboardEntries.score));

  const topThroughputMap = new Map<string, string>();
  leaders.forEach((l) => {
    if (!topThroughputMap.has(l.challengeId)) {
      topThroughputMap.set(
        l.challengeId,
        `${Number(l.throughputOpsSec).toLocaleString()} ops/s`
      );
    }
  });

  const categories = [
    { label: "All Topics", active: true },
    { label: "In-Memory Databases", active: false },
    { label: "Storage Engines", active: false },
    { label: "Concurrency & Locks", active: false },
    { label: "Distributed Systems", active: false },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* LeetCode Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Problem Set
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Reconstruct real technology from first principles. Measure throughput and optimize against official baselines.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800 shadow-2xs"
            />
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-200">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                cat.active
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* LeetCode Style Problem Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 hidden md:table-cell">Baseline Speed</th>
                  <th className="py-3 px-4 hidden md:table-cell">Top Speed</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publishedChallenges.map((challenge, idx) => {
                  const isSolved = userSolvedSet.has(challenge.id);
                  const topSpeed = topThroughputMap.get(challenge.id) || "101,170 ops/s";

                  return (
                    <tr
                      key={challenge.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Status Icon */}
                      <td className="py-4 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/challenges/${challenge.slug}`}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm flex items-center gap-2"
                          >
                            <span>{idx + 1}. {challenge.title}</span>
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-mono text-slate-400">Levels 1–3 Active</span>
                            <span>•</span>
                            <span>Python, C++</span>
                          </div>
                        </div>
                      </td>

                      {/* Baseline Speed */}
                      <td className="py-4 px-4 hidden md:table-cell font-mono text-slate-600">
                        100,000 ops/sec
                      </td>

                      {/* Top Speed */}
                      <td className="py-4 px-4 hidden md:table-cell font-mono font-medium text-emerald-600">
                        {topSpeed}
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          {challenge.difficulty}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/challenges/${challenge.slug}/workspace`}>
                          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-2xs inline-flex items-center gap-1.5">
                            <span>Solve Challenge</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
