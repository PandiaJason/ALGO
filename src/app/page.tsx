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
import { HomeWishlist } from "@/components/home/home-wishlist";
import { HomeCaseStudyBanner } from "@/components/home/home-case-study-banner";
import { ChevronRight, Play, Route, Sparkles, Terminal, Zap, CheckCircle2 } from "lucide-react";

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
        {/* 1. HERO SECTION: High-Energy Systems Proving Ground            */}
        {/* ============================================================== */}
        <section className="relative bg-[#1e1e22] pt-10 pb-16 sm:pb-20 overflow-hidden border-b border-neutral-800">
          {/* Subtle Ambient Radial Glows & Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 50% -10%, rgba(9, 200, 153, 0.18) 0%, rgba(9, 155, 233, 0.08) 40%, transparent 70%)`,
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" 
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Magnetic Pitch, Dual CTAs & Quick Launch */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-5">
                {/* Live Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>20 Real-World Systems</span>
                  <span className="text-emerald-500/40">•</span>
                  <span>120 Levels</span>
                  <span className="text-emerald-500/40">•</span>
                  <span>Linux nsjail Sandbox</span>
                </div>

                {/* Main Value Proposition Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                  Stop Grinding LeetCode.{" "}
                  <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    Build Real Systems.
                  </span>
                </h1>

                {/* Subtext */}
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Forget toy puzzle tricks. Reconstruct <strong className="text-white font-semibold">Redis</strong>, <strong className="text-white font-semibold">Git</strong>, <strong className="text-white font-semibold">Docker</strong>, and <strong className="text-white font-semibold">Raft</strong> from scratch — level by level. Benchmark throughput in microsecond sandboxes and prove you can engineer at scale.
                </p>

                {/* Action CTAs */}
                <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <Link
                    href="/challenges/kv-store/workspace"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#09C899] to-[#0AA793] hover:from-[#0AA793] hover:to-[#089684] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#09C899]/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                    <span>Try Redis in 30 Seconds</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/challenges"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <span>Explore 20 Systems</span>
                    <span className="text-[11px] bg-white/20 text-neutral-200 px-2 py-0.5 rounded-full font-mono font-medium">120 Levels</span>
                  </Link>
                </div>

                {/* 1-Click Launch Strip */}
                <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 text-xs text-neutral-400">
                  <span className="font-mono text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">Jump into Live Workspace:</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <Link
                      href="/challenges/kv-store/workspace"
                      className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 hover:border-emerald-500/50 text-neutral-200 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="text-emerald-400 font-bold">⚡</span> Redis
                    </Link>
                    <Link
                      href="/challenges/git/workspace"
                      className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 hover:border-orange-500/50 text-neutral-200 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="text-orange-400 font-bold">🌳</span> Git
                    </Link>
                    <Link
                      href="/challenges/container-runtime/workspace"
                      className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 hover:border-cyan-500/50 text-neutral-200 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="text-cyan-400 font-bold">🛡️</span> Docker
                    </Link>
                    <Link
                      href="/challenges/distributed-consensus/workspace"
                      className="px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 hover:border-purple-500/50 text-neutral-200 hover:text-white transition-all flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="text-purple-400 font-bold">🗳️</span> Raft
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Systems Terminal with Live Simulation */}
              <div className="lg:col-span-6 flex justify-center">
                <HeroTerminal />
              </div>
            </div>

            {/* 4-Metric Scale Bar */}
            <div className="mt-12 pt-6 border-t border-neutral-800/90 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="p-2">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">20</div>
                <div className="text-xs text-neutral-400 font-medium mt-1">Production Systems</div>
              </div>
              <div className="p-2">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">120</div>
                <div className="text-xs text-neutral-400 font-medium mt-1">Hands-On Levels</div>
              </div>
              <div className="p-2">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight">&gt; 100K</div>
                <div className="text-xs text-neutral-400 font-medium mt-1">Ops/s Sandboxed</div>
              </div>
              <div className="p-2">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">0</div>
                <div className="text-xs text-neutral-400 font-medium mt-1">Toy Puzzle Tricks</div>
              </div>
            </div>
          </div>
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

        {/* ============================================================== */}
        {/* 6. JOIN WISHLIST & DIRECT MESSAGE (Queued in Admin Control)    */}
        {/* ============================================================== */}
        <HomeWishlist />

        {/* ============================================================== */}
        {/* 7. FULL RESEARCH BRIEF & CASE STUDY BANNER                     */}
        {/* ============================================================== */}
        <HomeCaseStudyBanner />
      </main>

      <Footer />
    </div>
  );
}
