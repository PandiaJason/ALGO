import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, leaderboardEntries } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChallengesCatalog } from "@/components/challenge/challenges-catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Curriculum — ALGO",
  description:
    "Explore the 10 core engineering challenges. Reconstruct production-grade systems from first principles — databases, proxies, queues, and schedulers.",
};

export default async function ExplorePage() {
  const session = await auth();

  const userSolvedIds: string[] = [];
  const topThroughputMap: Record<string, string> = {
    "kv-store": "101,170 ops/s",
  };

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
    console.warn("Error querying submissions or leaderboard for explore page:", err);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <ChallengesCatalog
          userSolvedIds={userSolvedIds}
          topThroughputMap={topThroughputMap}
        />
      </main>

      <Footer />
    </div>
  );
}
