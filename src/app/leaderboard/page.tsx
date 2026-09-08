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
import { eq, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Trophy, ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function GlobalLeaderboardPage() {
  const session = await auth();

  let entries: any[] = [];
  try {
    entries = await db
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
      .limit(100);
  } catch (err) {
    console.warn("Global leaderboard query skipped or unavailable:", err);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} variant="dark" />

      <section className="relative bg-[#262626] pt-10 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            GLOBAL RANKINGS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#FBAE0C]" />
            <span>Global Ranking</span>
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
            Empirical throughput and latency verified under real workloads in isolated Linux containers.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Link href="/challenges/kv-store/workspace">
              <Button size="sm" variant="primary" className="h-8 gap-1.5 text-xs font-semibold px-3 shadow-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>Submit Implementation</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Interactive Ranking Table with Medals & KPIs */}
        <LeaderboardTable
          entries={entries}
          currentUsername={(session?.user as any)?.username}
        />
      </main>

      <Footer />
    </div>
  );
}
