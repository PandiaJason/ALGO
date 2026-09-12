import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, leaderboardEntries, challenges, submissionResults } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroTerminal } from "@/components/home/hero-terminal";
import { DailyChallengeBanner } from "@/components/home/daily-challenge-banner";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { ChallengesTable } from "@/components/challenge/challenges-table";
import { HomeWishlist } from "@/components/home/home-wishlist";
import { HomeCaseStudyBanner } from "@/components/home/home-case-study-banner";
import { ChevronRight, Play, Route } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-[#099BE9]/20 selection:text-[#099BE9] font-sans">
      {/* Top Navbar with dark variant for hero continuity */}
      <Navbar user={session?.user as any} variant="dark" />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* 1. HERO SECTION: Charcoal Dark Surface with Pure White Typography */}
        {/* ============================================================== */}
        <section className="relative bg-[#262626] pt-12 pb-24 sm:pb-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Hero Pitch & CTA */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  GO CURIOUS.
                </h1>

                <p className="text-sm sm:text-base text-neutral-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Learn how databases, caches, and distributed protocols work by building them from scratch. Write real code in an isolated Linux sandbox and benchmark your performance level by level.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <Link
                    href="/challenges"
                    className="inline-flex items-center gap-2 bg-[#09C899] hover:bg-[#0AA793] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-[#09C899]/25 transition-all hover:translate-x-0.5 active:scale-95"
                  >
                    <span>Explore Challenges</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-3 rounded-full text-sm font-semibold transition-all active:scale-95"
                  >
                    <Route className="w-4 h-4 text-emerald-400" />
                    <span>Systems Roadmap</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Systems Terminal */}
              <div className="lg:col-span-6 flex justify-center">
                <HeroTerminal />
              </div>
            </div>
          </div>

          {/* Diagonal Angle Cut to Pure White Surface */}
          <div
            className="absolute bottom-0 left-0 right-0 h-14 sm:h-20 bg-white"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
            }}
          />
        </section>

        {/* ============================================================== */}
        {/* 2. DAILY SYSTEMS CHALLENGE BANNER                              */}
        {/* ============================================================== */}
        <DailyChallengeBanner />

        {/* ============================================================== */}
        {/* 3. HOW IT WORKS (3 MINIMAL CARDS - BRILLIANT STYLE)            */}
        {/* ============================================================== */}
        <HomeHowItWorks />

        {/* ============================================================== */}
        {/* 4. SYSTEMS CHALLENGES (EXACT CONTENT FROM CHALLENGES PAGE)     */}
        {/* ============================================================== */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                Challenges
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1.5 max-w-2xl">
                20 challenges designed to help you understand systems engineering and boost your agentic workflow.
              </p>
            </div>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all self-start md:self-auto shrink-0 shadow-2xs font-mono"
            >
              <span>Systems Roadmap ➔</span>
            </Link>
          </div>

          <ChallengesTable
            userSolvedIds={userSolvedIds}
            topThroughputMap={topThroughputMap}
          />
        </section>

        {/* ============================================================== */}
        {/* 6. JOIN WISHLIST & DIRECT MESSAGE (Queued in Admin Control)    */}
        {/* ============================================================== */}
        <HomeWishlist />

        {/* ============================================================== */}
        {/* 7. CASE STUDY BANNER (LAST CARD ON HOMEPAGE)                   */}
        {/* ============================================================== */}
        <HomeCaseStudyBanner />
      </main>

      <Footer />
    </div>
  );
}
