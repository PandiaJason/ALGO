import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, leaderboardEntries, challenges, submissionResults } from "@/db/schema";
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
        .select({
          slug: challenges.slug,
          level: submissions.level,
          isCorrect: submissionResults.isCorrect,
        })
        .from(submissions)
        .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
        .leftJoin(
          submissionResults,
          eq(submissions.id, submissionResults.submissionId)
        )
        .where(
          and(
            eq(submissions.userId, session.user.id),
            eq(submissions.status, "COMPLETED")
          )
        );

      const challengeLevelsMap: Record<string, Set<number>> = {};
      userSubs.forEach((s) => {
        const passed =
          s.isCorrect === true ||
          s.isCorrect === null ||
          s.isCorrect === undefined;
        if (s.slug && s.level && passed) {
          if (!challengeLevelsMap[s.slug]) {
            challengeLevelsMap[s.slug] = new Set();
          }
          challengeLevelsMap[s.slug].add(s.level);
        }
      });

      // ONLY if all 6 levels are completed mark as solved!
      Object.entries(challengeLevelsMap).forEach(([slug, levelsSet]) => {
        if (levelsSet.size >= 6) {
          userSolvedIds.push(slug);
        }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Challenges
            </h1>
            <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
              20 challenges designed to help you understand systems engineering and boost your agentic workflow.
            </p>
          </div>
          <a
            href="/roadmap"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#09C899] hover:bg-[#0AA793] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] transition-all self-start md:self-auto shrink-0 cursor-pointer"
          >
            <span>Systems Roadmap ➔</span>
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#f8fafc]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      {/* Main Canvas with Dot-Grid Depth */}
      <main className="flex-1 w-full bg-[#f8fafc]/60 py-8 relative selection:bg-[#099BE9]/20 selection:text-[#099BE9]">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ChallengesTable
            userSolvedIds={userSolvedIds}
            topThroughputMap={topThroughputMap}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
