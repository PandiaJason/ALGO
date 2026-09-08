import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, leaderboardEntries } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExploreManifesto } from "@/components/explore/explore-manifesto";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Case Study — The Engineering Proving Ground | ALGO",
  description:
    "Software engineering changed. The way we measure it hasn't. An evidence-led case study of technical assessment in the agentic era, backed by empirical data from Stack Overflow, HackerRank, and real systems benchmarks.",
};

export default async function CaseStudyPage() {
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
    console.warn("Error querying submissions or leaderboard for case study page:", err);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} variant="dark" />

      <section className="relative bg-[#262626] pt-10 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            // EVIDENCE BRIEF • 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Case Study: Systems Architecture & Thesis
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
            An evidence-led analysis of technical assessment in the agentic era.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <ExploreManifesto
          userSolvedIds={userSolvedIds}
          topThroughputMap={topThroughputMap}
        />
      </main>

      <Footer />
    </div>
  );
}
