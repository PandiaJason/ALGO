import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, leaderboardEntries, challenges } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChallengesTable } from "@/components/challenge/challenges-table";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const session = await auth();

  const userSolvedIds: string[] = [];
  const topThroughputMap: Record<string, string> = {};

  try {
    if (session?.user?.id) {
      const userSubs = await db
        .select({ slug: challenges.slug })
        .from(submissions)
        .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
        .where(
          and(
            eq(submissions.userId, session.user.id),
            eq(submissions.status, "COMPLETED")
          )
        );
      userSubs.forEach((s) => {
        if (s.slug) userSolvedIds.push(s.slug);
      });
    }

    const leaders = await db
      .select({
        slug: challenges.slug,
        throughputOpsSec: leaderboardEntries.throughputOpsSec,
        score: leaderboardEntries.score,
      })
      .from(leaderboardEntries)
      .innerJoin(challenges, eq(leaderboardEntries.challengeId, challenges.id))
      .orderBy(desc(leaderboardEntries.score));

    leaders.forEach((l) => {
      if (l.slug && !topThroughputMap[l.slug]) {
        topThroughputMap[l.slug] = `${Number(
          l.throughputOpsSec
        ).toLocaleString()} ops/s`;
      }
    });
  } catch (err) {
    console.warn("Error querying submissions or leaderboard:", err);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} variant="dark" />

      <section className="relative bg-[#262626] pt-10 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            // THE 10 PROBLEMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            The Problem Set
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
            10 real engineering problems that force you to understand how modern infrastructure works — from hash collisions and WAL crash recovery to cache eviction and thread contention.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <ChallengesTable
          userSolvedIds={userSolvedIds}
          topThroughputMap={topThroughputMap}
        />
      </main>

      <Footer />
    </div>
  );
}
