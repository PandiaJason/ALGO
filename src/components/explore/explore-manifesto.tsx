"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Zap,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  TrendingUp,
  Code2,
  ChevronRight,
  Play,
  Flame,
  Bot,
  UserCheck,
  Search,
  Check,
} from "lucide-react";
import { CORE_CHALLENGES, CoreChallenge } from "@/lib/constants/core-challenges";

interface ExploreManifestoProps {
  userSolvedIds?: string[];
  topThroughputMap?: Record<string, string>;
}

export function ExploreManifesto({
  userSolvedIds = [],
  topThroughputMap = {},
}: ExploreManifestoProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "SYSTEMS" | "DISTRIBUTED">("ALL");

  const filteredChallenges = CORE_CHALLENGES.filter((c) => {
    if (activeTab === "SYSTEMS") return c.domain === "SYSTEMS" || c.domain === "PERFORMANCE";
    if (activeTab === "DISTRIBUTED") return c.domain === "DISTRIBUTED_SYSTEMS" || c.domain === "SEARCH_DATA";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-20 sm:space-y-24 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 pb-20">
      {/* ============================================================== */}
      {/* 1. MASTHEAD: THE SHIFT                                         */}
      {/* ============================================================== */}
      <section className="space-y-6 pt-4 border-b border-slate-200/80 pb-16">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-slate-900 text-white">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Curriculum &amp; Thesis
          </span>
          <span className="text-xs font-mono text-slate-400">
            // EVIDENCE BRIEF • 2026
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
          Software engineering changed. <br className="hidden sm:inline" />
          The way we measure it hasn&apos;t.
        </h1>

        <div className="text-base sm:text-lg text-slate-700 leading-relaxed space-y-4 pt-2 font-normal">
          <p>
            AI can generate code faster than ever before.
          </p>
          <p>
            Developers are already using it at scale:{" "}
            <strong className="text-slate-900 font-semibold">84%</strong> of
            respondents to Stack Overflow&apos;s 2025 Developer Survey said they
            use or plan to use AI tools in development, while{" "}
            <strong className="text-slate-900 font-semibold">46%</strong> said
            they distrust AI output more than they trust it.
          </p>
          <p className="text-slate-900 font-medium pt-2">
            That creates a new problem: If producing code becomes cheaper,
            measuring code production becomes less useful.
          </p>
        </div>

        {/* 4 Core Questions Grid */}
        <div className="pt-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
            What matters increasingly in the agentic era:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { q: "Can you direct the work?", desc: "Define invariants, boundary conditions, and architectural protocols." },
              { q: "Can you verify it?", desc: "Know definitively whether the code survives concurrency, load, and crash faults." },
              { q: "Can you find what's wrong?", desc: "Isolate memory leaks, lock contention, and silent data corruption under pressure." },
              { q: "Can you make it better?", desc: "Re-architect hot paths to push hardware limits beyond textbook baselines." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2 text-slate-950 font-semibold text-sm">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-700">
                    {idx + 1}
                  </span>
                  <span>{item.q}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 pl-7 leading-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. THE EVIDENCE IS ALREADY HERE                                */}
      {/* ============================================================== */}
      <section className="space-y-8 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
            Empirical Data
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            The evidence is already here.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            This isn&apos;t just our opinion. In HackerRank&apos;s 2025 Developer
            Skills Report, based on{" "}
            <strong className="text-slate-900">13,732 respondents</strong> across{" "}
            <strong className="text-slate-900">102 countries</strong>, the
            numbers are striking:
          </p>
        </div>

        {/* 5 Evidence Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              stat: "66%",
              label: "prefer being evaluated on real-world coding tasks.",
              source: "HackerRank 2025 Developer Skills Report",
              url: "https://www.hackerrank.com/research/developer-skills/2025",
            },
            {
              stat: "78%",
              label: "say technical assessments don't align with real-world tasks.",
              source: "HackerRank 2025 Developer Skills Report",
              url: "https://www.hackerrank.com/research/developer-skills/2025",
            },
            {
              stat: "56%",
              label: "say algorithm-based questions are irrelevant to their day jobs.",
              source: "HackerRank 2025 Developer Skills Report",
              url: "https://www.hackerrank.com/research/developer-skills/2025",
            },
            {
              stat: "62%",
              label: "feel they need to overprepare for algorithm-heavy assessments.",
              source: "HackerRank 2025 Developer Skills Report",
              url: "https://www.hackerrank.com/research/developer-skills/2025",
            },
            {
              stat: "96%",
              label: "believe problem-solving should matter more than memorization.",
              source: "HackerRank 2025 Developer Skills Report",
              url: "https://www.hackerrank.com/research/developer-skills/2025",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-950 tracking-tight">
                  {card.stat}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 mt-2 leading-snug">
                  {card.label}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="truncate max-w-[190px]">{card.source}</span>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-sans font-semibold ml-2 shrink-0"
                >
                  <span>source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

          {/* Synthesis Note Card */}
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 flex flex-col justify-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-600">
              The Measurable Gap
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              That&apos;s not evidence that LeetCode or HackerRank are useless.
              They solve real problems and have massive adoption. It is evidence
              that the industry itself recognizes a measurable gap between
              traditional assessment and actual engineering work.
            </p>
          </div>
        </div>

        {/* HackerRank Self-Admission Callout */}
        <div className="bg-[#f8fafc] border-l-4 border-cyan-600 rounded-r-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Even HackerRank&apos;s Own Report Confirms This
            </h3>
            <a
              href="https://www.hackerrank.com/research/developer-skills/2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 font-mono"
            >
              <span>HackerRank 2025 Report</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            HackerRank itself reports that{" "}
            <strong className="text-slate-900">77% of developers</strong> say most
            assessments don&apos;t align with the skills required for the role,{" "}
            <strong className="text-slate-900">71%</strong> say they grind LeetCode
            to prepare, and <strong className="text-slate-900">62%</strong> say they
            overprepare because they don&apos;t know what will actually be tested.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 italic">
            &ldquo;So ALGO isn&apos;t inventing a problem. The ecosystem is
            already telling us the problem exists.&rdquo;
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. THEN AI CHANGED THE EQUATION                                */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
            The Agentic Inflection Point
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            Then AI changed the equation.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Traditional coding assessment asks:{" "}
            <em className="font-semibold text-slate-900 font-serif">
              &ldquo;Can you produce the solution?&rdquo;
            </em>{" "}
            But now an AI can often produce a solution.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
            Stack Overflow 2025 Developer Survey Findings
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-900">
                66%
              </div>
              <p className="text-xs text-amber-950 leading-snug">
                of developers are frustrated by AI solutions that are{" "}
                <strong>almost right</strong>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
                45%
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                say debugging AI-generated code is <strong>more time-consuming</strong>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
                46% vs 33%
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                <strong>distrust AI accuracy</strong>, compared with only 33% who trust it.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-100">
            <span>Stack Overflow Annual Developer Survey (AI Section, 49,000+ respondents)</span>
            <a
              href="https://survey.stackoverflow.co/2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 font-sans"
            >
              <span>source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            The Fundamental Re-Definition of Skill
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            That creates a completely different engineering skill:{" "}
            <strong className="text-white font-semibold">Verification.</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] font-mono uppercase text-slate-400">Old Skill</div>
              <div className="text-sm font-semibold text-rose-300 mt-1">
                &ldquo;Can you type the algorithm?&rdquo;
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] font-mono uppercase text-slate-400">New Skill</div>
              <div className="text-sm font-semibold text-emerald-300 mt-1">
                &ldquo;Can you know whether the system actually works?&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. THIS IS WHERE ALGO STARTS: THE TWO LOOPS                    */}
      {/* ============================================================== */}
      <section className="space-y-8 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-teal-700 font-semibold">
            The Architectural Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            This is where ALGO starts.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            We don&apos;t want to build another platform where you solve
            thousands of isolated problems. We want to create an environment where
            you <strong className="text-slate-900 font-semibold">engineer</strong>.
          </p>
        </div>

        {/* Dual Loop Visual Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Traditional Loop */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Traditional Loop
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  SURFACE LEVEL
                </span>
              </div>

              <div className="mt-6 space-y-2 font-mono text-xs text-center max-w-[200px] mx-auto">
                {["QUESTION", "WRITE CODE", "TEST CASES", "ACCEPTED", "NEXT QUESTION"].map(
                  (step, idx, arr) => (
                    <React.Fragment key={idx}>
                      <div className={`p-2.5 rounded-lg border font-semibold ${
                        step === "ACCEPTED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {step}
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="text-slate-300 flex justify-center py-0.5">
                          ↓
                        </div>
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center mt-6 pt-4 border-t border-slate-100">
              Binary pass/fail. Tests memorization, ignores concurrency, I/O, and hardware efficiency.
            </p>
          </div>

          {/* ALGO Loop */}
          <div className="md:col-span-7 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  The ALGO Loop
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-semibold">
                  SYSTEMS VERIFICATION
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                {[
                  { step: "REAL PROBLEM", desc: "Build a raw KV engine, proxy, or log stream from first principles." },
                  { step: "BUILD", desc: "Construct the wire protocol and raw memory arenas." },
                  { step: "RUN", desc: "Spin up isolated Docker container sandboxes." },
                  { step: "MEASURE", desc: "Capture cold baseline ops/sec, latency, and heap memory." },
                  { step: "BREAK", desc: "Subject code to 10× spikes, SIGKILL, and lock contention." },
                  { step: "FIND WHY", desc: "Profile CPU flamegraphs and memory allocations." },
                  { step: "OPTIMIZE", desc: "Striped mutexes, lock-free rings, and zero-copy buffers." },
                  { step: "PROVE", desc: "Verify measurable speedups on empirical leaderboards." },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <span className="text-[10px] text-slate-500">0{idx + 1}.</span>
                      <span>{item.step}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative z-10 text-xs text-slate-400 text-center mt-6 pt-4 border-t border-slate-800">
              Continuous optimization loop: empirical profiling, architectural redesign, and verified speedups.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SYSTEMS CASE STUDY: YOUR CODE ISN'T THE FINAL ANSWER        */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-purple-700 font-semibold">
            Telemetry &amp; Profiling
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            Your code isn&apos;t the final answer.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Imagine you&apos;re building a key-value engine from scratch.
          </p>
        </div>

        {/* Before & After Benchmark Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Submission */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-900">
                  Submission #1: Initial Implementation
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                ACCEPTED
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Correctness:</span>
                <span className="font-semibold text-emerald-600">100% (Passed 24/24 tests)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Throughput:</span>
                <span className="font-semibold text-slate-900">18,200 ops/s</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">P99 Latency:</span>
                <span className="font-semibold text-slate-900">2.8 ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Memory Footprint:</span>
                <span className="font-semibold text-slate-900">142 MB</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
              It works. Accepted. But ALGO doesn&apos;t stop there. You look at the
              leaderboard: 18K ops/sec. Someone else has 74K.
            </div>
          </div>

          {/* After Optimization */}
          <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-white">
                    Submission #5: Optimized Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                  +403% PROVEN
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs mt-3">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Correctness:</span>
                  <span className="font-semibold text-emerald-400">100% Crash-Resilient</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Throughput:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    91,700 ops/s
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">P99 Latency:</span>
                  <span className="font-semibold text-white">0.34 ms (-88%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Memory Footprint:</span>
                  <span className="font-semibold text-white">41 MB (-71%)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3 text-xs text-cyan-200/90 border border-cyan-900/50">
              <strong className="text-white">Why are they faster?</strong> You investigated.
              You profiled mutex locks. You replaced single-threaded maps with 32-shard
              striped mutexes and ring buffers. You ran again.
            </div>
          </div>
        </div>

        <div className="text-center py-2">
          <p className="text-sm sm:text-base font-semibold text-slate-900">
            Now you haven&apos;t just solved a problem. You&apos;ve{" "}
            <span className="text-cyan-600 underline decoration-cyan-400 underline-offset-4">
              engineered something
            </span>
            .
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. AI IS ALLOWED: HUMAN + AI -> SYSTEM -> REALITY             */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold">
            First-Principles Policy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            AI is allowed.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            This is critical to ALGO. We don&apos;t try to detect whether you used AI.
          </p>
        </div>

        {/* Allowed Tool Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            "ChatGPT",
            "Claude",
            "Gemini",
            "GitHub Copilot",
            "Cursor",
            "Windsurf",
            "Custom AI Agents",
            "Your Own Tools",
          ].map((tool, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-medium text-slate-700 shadow-2xs"
            >
              <Bot className="w-3.5 h-3.5 text-slate-400" />
              {tool}
            </span>
          ))}
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Use whatever makes you effective. Because the future isn&apos;t{" "}
          <span className="font-semibold text-slate-900">Human vs AI</span>. It is:
        </p>

        {/* System Execution Pipeline Visual */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm text-center">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs font-bold text-slate-900">
              Human + AI
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className="sm:hidden text-slate-400">↓</span>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs font-bold text-slate-900">
              System Architecture
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className="sm:hidden text-slate-400">↓</span>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs font-bold text-slate-900">
              Physical Reality
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className="sm:hidden text-slate-400">↓</span>
            <div className="bg-slate-900 text-white border border-slate-800 rounded-xl px-4 py-3 shadow-sm font-bold">
              Empirical Measurement
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            ALGO evaluates the empirical result and the engineering decisions around it.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. REALITY BECOMES THE JUDGE                                   */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-rose-700 font-semibold">
            Empirical Evaluation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            Reality becomes the judge.
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              instead: "Did you memorize the algorithm?",
              algo: "Does your system work under real-world conditions?",
              sub: "Correctness is tested across edge cases, malformed wire protocols, and high concurrent load.",
            },
            {
              instead: "Did you write the code yourself?",
              algo: "Can your implementation survive the workload?",
              sub: "We subject your binary to memory leaks, connection starvation, SIGKILL recovery, and 100K ops/sec.",
            },
            {
              instead: "Did you pass the hidden tests?",
              algo: "Can you make it better?",
              sub: "Profiling, identifying bottlenecks, and optimizing hardware performance separates software writers from engineers.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                <span className="text-slate-400 line-through">
                  Instead of: {item.instead}
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  ALGO asks
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                {item.algo}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. WHAT WE'RE TRYING TO BUILD                                  */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
            The Proving Ground
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            What we&apos;re trying to build.
          </h2>
          <div className="text-sm sm:text-base text-slate-600 mt-2 space-y-2 leading-relaxed">
            <p>
              ALGO is an engineering proving ground for the agentic era.
            </p>
            <p className="font-mono text-xs sm:text-sm text-slate-500">
              Not another course platform. Not another LeetCode clone. <br />
              Not an AI coding assistant. Not a certificate factory.
            </p>
          </div>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { word: "BUILD", phrase: "real systems from first principles." },
            { word: "BREAK", phrase: "them under extreme pressure." },
            { word: "MEASURE", phrase: "what actually happens on hardware." },
            { word: "OPTIMIZE", phrase: "the bottlenecks and hot paths." },
            { word: "PROVE", phrase: "the improvement empirically." },
            { word: "INNOVATE", phrase: "what's next in infrastructure." },
          ].map((p, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="text-sm font-mono font-black text-slate-900 tracking-wider">
                {p.word}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {p.phrase}
              </div>
            </div>
          ))}
        </div>

        {/* Modest Stance Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Our stance:</strong> We are trying to
          solve this gap, not claiming to have already solved it. Until developers
          and engineering teams demonstrate that ALGO better predicts and builds real-world
          infrastructure capability, that remains our engineering challenge.
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. THE NEW QUESTION: CONCLUSION                                */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            The Fundamental Shift
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            The new question.
          </h2>

          <div className="space-y-3 pt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              The old question was:{" "}
              <span className="text-slate-400 font-mono">&ldquo;Can you solve this problem?&rdquo;</span>
            </p>
            <p>
              The next question is:{" "}
              <span className="text-white font-semibold font-mono">&ldquo;Can you engineer this system?&rdquo;</span>
            </p>
            <p>
              And in the agentic era:{" "}
              <span className="text-cyan-300 font-semibold font-mono">
                &ldquo;Can you use AI to build it — and still know whether you built it well?&rdquo;
              </span>
            </p>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm pt-2">
            That&apos;s what ALGO is trying to measure.
          </p>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-mono text-sm tracking-wider font-bold text-white">
              BUILD. OPTIMIZE. INNOVATE.
            </div>
            <div className="font-black text-lg tracking-widest text-cyan-400">
              GO CURIOUS.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. PUT IT INTO PRACTICE: THE 10 CORE CHALLENGES               */}
      {/* ============================================================== */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Proving Ground Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
              Start Proving It: The 10 Core Challenges
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Reconstruct production-grade systems from first principles — databases, proxies, queues, and schedulers.
            </p>
          </div>

          {/* Quick Domain Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All (10)
            </button>
            <button
              onClick={() => setActiveTab("SYSTEMS")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "SYSTEMS" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Systems
            </button>
            <button
              onClick={() => setActiveTab("DISTRIBUTED")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "DISTRIBUTED" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Distributed
            </button>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((c) => {
            const isSolved = userSolvedIds.includes(c.slug);
            const topOps = topThroughputMap[c.slug];

            return (
              <div
                key={c.slug}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">#{c.number}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                        Inspired by <strong className="text-slate-900">{c.inspiredBy}</strong>
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      c.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : c.difficulty === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {c.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2.5 group-hover:text-cyan-700 transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {c.overview}
                  </p>

                  <div className="bg-slate-50 border-l-2 border-cyan-500 px-3 py-1.5 rounded-r-lg mt-3">
                    <p className="text-[11px] italic text-slate-700 font-serif">
                      &ldquo;{c.signatureQuestion}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-slate-500">
                    <span>{c.progressionLevels.length} Architectural Levels</span>
                    {topOps && (
                      <span className="text-emerald-600 font-bold ml-2">
                        • {topOps}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/challenges/${c.slug}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Overview
                    </Link>
                    <Link
                      href={`/challenges/${c.slug}/workspace`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs"
                    >
                      <span>Launch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 font-mono"
          >
            <span>View Full Problem Set &amp; Filter Table</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. FORMAL REFERENCES & CITATIONS                              */}
      {/* ============================================================== */}
      <footer className="border-t border-slate-200 pt-8 space-y-3 text-[11px] font-mono text-slate-500">
        <div className="font-semibold text-slate-700 uppercase tracking-wider">
          References &amp; Empirical Sources
        </div>
        <ol className="list-decimal pl-4 space-y-1.5">
          <li>
            <a
              href="https://survey.stackoverflow.co/2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 underline decoration-slate-300"
            >
              Stack Overflow Annual Developer Survey 2025
            </a>{" "}
            — AI Usage, Trust, and Developer Sentiment analysis across 49,000+ respondents.
          </li>
          <li>
            <a
              href="https://www.hackerrank.com/research/developer-skills/2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 underline decoration-slate-300"
            >
              HackerRank Developer Skills Report 2025
            </a>{" "}
            — 13,732 developers and hiring managers across 102 countries on real-world evaluation, overpreparation, and assessment-job skill alignment.
          </li>
        </ol>
      </footer>
    </div>
  );
}
