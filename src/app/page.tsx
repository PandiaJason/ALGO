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
import { HeroTerminal } from "@/components/home/hero-terminal";
import { DailyChallengeBanner } from "@/components/home/daily-challenge-banner";
import { HomeProblemset } from "@/components/home/home-problemset";
import { HomeLeaderboardSnapshot } from "@/components/home/home-leaderboard-snapshot";
import { HomeManifesto } from "@/components/home/home-manifesto";
import { ChevronRight, Play } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  let realLeaderboardEntries: any[] = [];
  try {
    realLeaderboardEntries = await db
      .select({
        id: leaderboardEntries.id,
        score: leaderboardEntries.score,
        throughputOpsSec: leaderboardEntries.throughputOpsSec,
        latencyP99Ms: leaderboardEntries.latencyP99Ms,
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
      .limit(5);
  } catch (err) {
    console.warn("Homepage leaderboard query skipped or unavailable:", err);
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
                  ALGO is where the next generation of engineers learn by building real technology, measuring what they create, and pushing it further through an agentic flow state.
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
                    href="/challenges/kv-store/workspace"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-3 rounded-full text-sm font-semibold transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Key-Value Engine</span>
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
        {/* 3. CORE SYSTEMS PROBLEMSET (Direct, High-Density Table)         */}
        {/* ============================================================== */}
        <HomeProblemset />

        {/* ============================================================== */}
        {/* 4. LIVE GLOBAL LEADERBOARD SNAPSHOT (Real Database Entries)    */}
        {/* ============================================================== */}
        <HomeLeaderboardSnapshot entries={realLeaderboardEntries} />

        {/* ============================================================== */}
        {/* 5. THE PROVING GROUND THESIS & SYSTEMS VERIFICATION LOOP       */}
        {/* ============================================================== */}
        <HomeManifesto />
      </main>

      <Footer />
    </div>
  );
}
