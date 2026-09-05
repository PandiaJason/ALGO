import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LeetCodeTablet } from "@/components/home/leetcode-tablet";
import { LeetCodePlayground } from "@/components/home/leetcode-playground";
import {
  ChevronRight,
  GraduationCap,
  Users,
  Trophy,
  Briefcase,
  Server,
  Play,
  CheckCircle2,
  Code2,
  Heart
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Top Navbar with LeetCode dark style for homepage hero */}
      <Navbar user={session?.user as any} variant="dark" />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* HERO SECTION: LeetCode Charcoal Diagonal Cut Split             */}
        {/* ============================================================== */}
        <section className="relative bg-[#262626] pt-12 pb-28 sm:pb-36 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Isometric Tablet Showcase */}
              <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
                <LeetCodeTablet />
              </div>

              {/* Right Column: Hero Pitch & CTA */}
              <div className="lg:col-span-6 text-center lg:text-left order-1 lg:order-2 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  GO CURIOUS.
                </h1>

                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  ALGO is where the next generation of engineers learn by building real technology, measuring what they create, and pushing it further through an agentic flow state.
                </p>

                <div className="pt-2">
                  <Link
                    href="/challenges/kv-store/workspace"
                    className="inline-flex items-center gap-2 bg-[#00af9b] hover:bg-[#009b89] text-white px-7 py-3 rounded-full text-sm font-semibold shadow-lg shadow-teal-950/30 transition-all hover:translate-x-0.5 active:scale-95"
                  >
                    <span>Explore Challenges</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Diagonal Angle Cut across to White Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-white"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
            }}
          />
        </section>

        {/* ============================================================== */}
        {/* SECTION 1: "Start Exploring" (LeetCode Explore Track)          */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              {/* Left Column: Explore Pitch */}
              <div className="md:col-span-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00af9b]">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <h2 className="text-2xl font-bold text-[#00af9b] tracking-tight">
                  Start Exploring
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Explore is a structured engineering curriculum that helps you master systems from first principles. Reconstruct databases, message queues, and protocols to prepare for world-class infrastructure engineering.
                </p>

                <div className="pt-2">
                  <Link
                    href="/challenges"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Stacked Colorful Cards with Play Button */}
              <div className="md:col-span-6 flex justify-center">
                <div className="relative w-full max-w-sm h-64 flex items-center justify-center">
                  {/* Card 1 (Back, cream) */}
                  <div className="absolute w-52 h-44 rounded-2xl bg-[#FFF6E5] border border-amber-200/60 transform -rotate-6 translate-x-[-28px] shadow-sm" />
                  {/* Card 2 (Middle, soft green) */}
                  <div className="absolute w-52 h-44 rounded-2xl bg-[#E8F8F5] border border-teal-200/60 transform rotate-3 translate-x-[24px] shadow-sm" />
                  {/* Card 3 (Front, light blue) with play button */}
                  <div className="relative w-56 h-48 rounded-2xl bg-[#E6F4FE] border border-blue-200/80 shadow-md p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-blue-700">MODULE 01</span>
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      In-Memory Key-Value Store
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-200/50">
                      <span className="text-[10px] font-mono text-slate-500">10 Missions</span>
                      <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600">
                        <Play className="w-3.5 h-3.5 fill-blue-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: Two-Column Feature Blocks with Hexagonal Clusters    */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 bg-[#fafafa] border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
              {/* Left Column: Questions, Community & Contests */}
              <div className="space-y-4">
                {/* 3 Hexagons Cluster */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    100K
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#00af9b] text-white flex items-center justify-center shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#f7a01d] text-white flex items-center justify-center shadow-xs">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-blue-600 tracking-tight">
                  Questions, Community & Contests
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Over 10 progressive missions for you to practice. Reconstruct key-value stores, write-ahead logs, and lock-free queues, then measure your implementation against empirical bare-metal benchmarks on our global leaderboard.
                </p>

                <div className="pt-1">
                  <Link
                    href="/challenges"
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>View Questions</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Measured Engineering Ability */}
              <div className="space-y-4">
                {/* 2 Hexagons Cluster */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#b58900] text-white flex items-center justify-center shadow-xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-600 text-white flex items-center justify-center shadow-xs">
                    <Server className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#b58900] tracking-tight">
                  Companies & Candidates
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Not only does ALGO prepare candidates for top engineering roles, we also help companies identify real systems talent. Our deterministic containerized benchmarks verify latency, thread safety, and crash recovery under stress.
                </p>

                <div className="pt-1">
                  <Link
                    href="/challenges/kv-store/leaderboard"
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>Leaderboard & Rankings</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: "Developer" / Playground Code Box (Screenshot 3)    */}
        {/* ============================================================== */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            {/* Centered Hexagonal Icon */}
            <div className="inline-flex w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 items-center justify-center text-[#00af9b] mx-auto shadow-2xs">
              <Code2 className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Developer
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              We now support C++20 and Python 3.12. At our core, ALGO is about developers. Our containerized execution sandbox helps you test, benchmark, and optimize real systems online.
            </p>

            {/* Interactive Code Playground & Quick Selectors */}
            <div className="pt-6">
              <LeetCodePlayground />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: Built for Engineers & Tech Logos (Screenshot 4)     */}
        {/* ============================================================== */}
        <section className="py-20 bg-[#fafafa] border-t border-slate-100 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Red Hexagonal Icon */}
            <div className="inline-flex w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 items-center justify-center text-rose-600 mx-auto shadow-2xs">
              <Heart className="w-6 h-6 fill-rose-600 text-rose-600" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight flex items-center justify-center gap-2">
              Made with ❤️ for Systems Engineers
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              At ALGO, our mission is to help you understand real systems and prove your engineering mastery. Reconstruct architectures inspired by the core infrastructure that powers the world.
            </p>

            {/* Grayscale Tech Logos Row */}
            <div className="pt-6 pb-6 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 text-slate-400 font-mono text-sm tracking-wider font-bold">
              <span>REDIS</span>
              <span>SQLITE</span>
              <span>LINUX</span>
              <span>POSTGRESQL</span>
              <span>KAFKA</span>
              <span>RAFT</span>
              <span>DOCKER</span>
              <span>ROCKSDB</span>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-3">
                If you are passionate about tackling real systems challenges, begin your proving ground journey today.
              </p>
              <Link
                href="/challenges/kv-store/workspace"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
              >
                <span>Enter Proving Ground</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
