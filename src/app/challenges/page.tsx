import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, leaderboardEntries } from "@/db/schema";
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
        .select({ challengeId: submissions.challengeId })
        .from(submissions)
        .where(
          and(
            eq(submissions.userId, session.user.id),
            eq(submissions.status, "COMPLETED")
          )
        );
      userSubs.forEach((s) => userSolvedIds.push(s.challengeId));
    }

    const leaders = await db
      .select({
        challengeId: leaderboardEntries.challengeId,
        throughputOpsSec: leaderboardEntries.throughputOpsSec,
        score: leaderboardEntries.score,
      })
      .from(leaderboardEntries)
      .orderBy(desc(leaderboardEntries.score));

    leaders.forEach((l) => {
      if (!topThroughputMap[l.challengeId]) {
        topThroughputMap[l.challengeId] = `${Number(
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Systems Engineering Problemset
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
            Build production-grade systems from first principles in C++, Rust, Go, Python, or Java.
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
