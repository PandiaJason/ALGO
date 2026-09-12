"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Zap,
  Cpu,
  Layers,
  BarChart3,
  TrendingUp,
  Flame,
  Check,
  ExternalLink,
  FileText,
  Bot,
  Activity,
  Briefcase,
} from "lucide-react";
import {
  DiagramSubmissionOneTelemetry,
  DiagramSubmissionFiveTelemetry,
} from "./manifesto-diagrams";

export function HomeManifesto() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/90 space-y-20">
      {/* ============================================================== */}
      {/* 1. THE SHIFT: SOFTWARE ENGINEERING CHANGED                      */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-950 text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#099BE9]" />
            The Proving Ground Thesis
          </span>
          <span className="text-xs font-mono font-bold text-slate-700">
            // EVIDENCE BRIEF • 2026
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
          Software engineering changed. <br className="hidden sm:inline" />
          The way we measure it hasn&apos;t.
        </h2>

        <div className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed space-y-4">
          <p>
            AI can generate syntax in seconds. Developers are already using it at scale:{" "}
            <strong className="text-slate-950 font-bold">82%</strong> report using AI tools in their development process, while separately,{" "}
            <strong className="text-slate-950 font-bold">46%</strong> say they distrust AI-generated output&apos;s accuracy.
          </p>
          <div className="p-4 rounded-xl bg-slate-100 border-l-4 border-slate-900 text-slate-950 text-base sm:text-lg font-bold">
            That creates a new reality: if producing code becomes cheap, measuring code production becomes less useful.
          </div>
        </div>

        {/* 4 Core Competencies Grid */}
        <div className="pt-2 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center justify-between">
            <span>The 4 engineering skills that actually matter:</span>
            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
              // ARCHITECTURE • VERIFICATION • DIAGNOSIS • OPTIMIZATION
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: "1",
                color: "#099BE9",
                q: "Can you design the system?",
                desc: "Plan how data flows, define clean interfaces, and set memory limits before writing code.",
              },
              {
                step: "2",
                color: "#09C899",
                q: "Can you prove it works?",
                desc: "Know for certain whether your implementation survives heavy traffic, sudden crashes, and unexpected failures.",
              },
              {
                step: "3",
                color: "#F78424",
                q: "Can you find what's slow?",
                desc: "Pinpoint real bottlenecks — whether it's locked threads, memory bloat, or slow queries.",
              },
              {
                step: "4",
                color: "#8647E2",
                q: "Can you make it faster?",
                desc: "Rethink data structures and concurrency to handle higher loads with lower latency.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-start space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-extrabold text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </span>
                  <span className="font-bold text-slate-950 text-base sm:text-lg">{item.q}</span>
                </div>
                <p className="text-sm text-slate-600 font-medium pl-10 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. EMPIRICAL DATA: THE EVIDENCE IS ALREADY HERE               */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            Empirical Evidence
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The evidence is already here.
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            From HackerRank&apos;s <strong className="text-slate-950 font-bold">2025 Developer Skills Report</strong> (global survey and platform data spanning over 3M assessments/year):
          </p>
        </div>

        {/* Survey Data Table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-bold uppercase text-[11px]">
                <th className="py-3 px-4 sm:px-6 w-24">Stat</th>
                <th className="py-3 px-4 sm:px-6">Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-extrabold text-2xl text-[#099BE9]">66%</td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">prefer being evaluated on real-world coding tasks</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-extrabold text-2xl text-slate-950">78%</td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">say technical assessments don&apos;t align with real-world tasks</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-extrabold text-2xl text-slate-950">56%</td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">say algorithm-based questions are irrelevant to their day jobs</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-extrabold text-2xl text-[#F78424]">62%</td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">feel they need to overprepare for algorithm-heavy assessments</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* The Measurable Gap Callout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-2">
          <h4 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
            The Measurable Gap
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            This isn&apos;t evidence that LeetCode or HackerRank are useless — they solve real problems and have massive adoption. It&apos;s evidence that <strong className="text-slate-950 font-bold">the industry itself recognizes a measurable gap</strong> between traditional assessment and actual engineering work. ALGO isn&apos;t the one claiming this gap exists — HackerRank&apos;s own research is.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. THE AGENTIC INFLECTION POINT & RE-DEFINITION OF SKILL       */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#F78424] font-bold">
            The Agentic Inflection Point
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Agentic Inflection Point
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            Traditional coding assessment asks: <em className="font-bold text-slate-950 font-serif">&ldquo;Can you produce the solution?&rdquo;</em> But now an AI can often produce a solution outright.
          </p>
        </div>

        {/* Stack Overflow 2025 Stats Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="text-xs font-mono uppercase text-slate-700 font-bold tracking-wider">
            From Stack Overflow&apos;s 2025 Developer &amp; AI Survey (49,000+ respondents):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#FBAE0C]/10 border border-[#FBAE0C]/30 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#F78424]">
                66%
              </div>
              <p className="text-xs text-slate-900 font-medium leading-snug">
                of developers are frustrated by AI solutions that are <strong>&ldquo;almost right&rdquo;</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-950">
                45%
              </div>
              <p className="text-xs text-slate-800 font-medium leading-snug">
                say debugging AI-generated code is <strong>more time-consuming</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-950">
                46% vs 33%
              </div>
              <p className="text-xs text-slate-800 font-medium leading-snug">
                <strong>distrust AI output accuracy</strong> vs. 33% who trust it
              </p>
            </div>
          </div>
        </div>

        {/* Systems Thinking in the Agentic Era (Core Thesis) */}
        <div className="rounded-2xl border-2 border-[#8647E2]/30 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#8647E2]/15 text-[#8647E2] border border-[#8647E2]/30">
              Core Thesis
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              // WHERE JUDGMENT MATTERS
            </span>
          </div>

          <div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Systems Thinking in the Agentic Workflow Era
            </h4>
            <p className="text-base sm:text-lg text-slate-800 font-bold mt-1.5">
              As AI makes software implementation cheaper, systems understanding becomes more valuable.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            An AI agent can increasingly generate functions, write tests, refactor code, and configure infrastructure. As implementation becomes delegatable, the engineer&apos;s responsibility moves upward — from typing individual pieces of code to understanding, directing, verifying, and evolving the system as a whole.
          </p>

          {/* Why Systems Understanding Becomes Scarce */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed space-y-2">
            <div className="font-mono font-bold text-slate-950 uppercase text-xs tracking-wider text-rose-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              The Failure Modes of Delegated Code:
            </div>
            <p>
              An agent can generate syntactically valid code that is still <strong className="text-slate-950">vulnerable to race conditions</strong>, <strong className="text-slate-950">inefficient under concurrency</strong>, <strong className="text-slate-950">fragile under partial failure (SIGKILL)</strong>, or <strong className="text-slate-950">wasteful in memory</strong>. Code generation does not eliminate these problems — it creates them at greater speed.
            </p>
          </div>

          {/* The 10 Invariant Dimensions */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
              The 10 Invariant Dimensions of Systems Thinking:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
              {[
                { tag: "State", sub: "Ownership & lifecycle" },
                { tag: "Boundaries", sub: "Subsystem isolation" },
                { tag: "Protocols", sub: "Wire format & bytes" },
                { tag: "Invariants", sub: "Non-negotiable truths" },
                { tag: "Resources", sub: "CPU, memory, sockets" },
                { tag: "Concurrency", sub: "Simultaneous ops & locks" },
                { tag: "Failure", sub: "Crash & recovery safety" },
                { tag: "Observability", sub: "Empirical telemetry" },
                { tag: "Performance", sub: "Bottleneck diagnosis" },
                { tag: "Trade-offs", sub: "Deliberate compromises" },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900">
                  <div className="font-bold text-slate-950 text-xs">{item.tag}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The New Engineering Question Callout */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 font-mono text-xs space-y-2">
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              The New Engineering Question:
            </div>
            <p className="text-sm font-bold text-slate-950">
              &ldquo;Can you engineer a system when implementation itself can be delegated?&rdquo;
            </p>
            <p className="text-slate-600 text-xs font-sans font-medium">
              AI can produce the implementation. Systems thinking determines whether the implementation deserves to exist.
            </p>
          </div>
        </div>

        {/* The Re-Definition of Skill Table */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
            The Re-Definition of Skill
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 sm:px-6 w-1/2">Old Skill</th>
                  <th className="py-3 px-4 sm:px-6 w-1/2">New Skill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 font-mono line-through">
                    &ldquo;Can you type the algorithm?&rdquo;
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-[#0AA793] font-bold font-mono text-sm sm:text-base">
                    &ldquo;Can you know whether the system actually works?&rdquo;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. METHODOLOGY: THE SYSTEMS VERIFICATION LOOP                  */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            Methodology
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Systems Verification Loop
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            We don&apos;t build another platform where you solve isolated algorithm puzzles. We create an environment where you engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Traditional Algorithmic Loop */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                  Traditional Coding Platforms
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                  SYNTAX TEST
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-700 font-medium">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <span className="text-slate-400">1.</span> Read synthetic problem description
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <span className="text-slate-400">2.</span> Write a function in an isolated file
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <span className="text-slate-400">3.</span> Run against hidden input/output test arrays
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-slate-900 font-bold">
                  <span className="text-slate-400">4.</span> Binary Accepted checkmark → Next Question
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium border-t border-slate-200 pt-3">
              Binary pass/fail. Tests memorization, but ignores concurrency, memory bloat, and crash resilience.
            </p>
          </div>

          {/* The ALGO Proving Ground Loop */}
          <div className="rounded-2xl border-2 border-[#09C899]/50 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0AA793]">
                  The ALGO Proving Ground Loop
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#09C899]/15 text-[#0AA793] border border-[#09C899]/30">
                  EMPIRICAL SYSTEMS
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#099BE9]/5 border border-[#099BE9]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#099BE9]">01.</span> Build the real system from scratch (protocols, storage, state)
                </div>
                <div className="p-2.5 rounded-lg bg-[#09C899]/5 border border-[#09C899]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#0AA793]">02.</span> Run it inside an isolated Linux container sandbox
                </div>
                <div className="p-2.5 rounded-lg bg-[#FBAE0C]/5 border border-[#FBAE0C]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#F78424]">03.</span> Stress test with high concurrency, crashes, and heavy load
                </div>
                <div className="p-2.5 rounded-lg bg-[#8647E2]/5 border border-[#8647E2]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#8647E2]">04.</span> Optimize hot paths and verify speedup on the live leaderboard
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-800 font-semibold border-t border-slate-100 pt-3">
              A real engineering loop: measure performance, find bottlenecks, and prove speedups with telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. CONCRETE PROFILING CASE: INITIAL VS OPTIMIZED               */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            Telemetry &amp; Profiling
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            Your code isn&apos;t the final answer. It&apos;s the baseline.
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            Imagine you are building a Key-Value storage engine from scratch:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Submission #1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">
                  Submission #1
                </span>
                <h4 className="text-sm font-bold text-slate-950">Initial Implementation</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#09C899]/15 text-[#0AA793]">
                Accepted
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Correctness:</span>
                <span className="font-bold text-slate-950">100% (24/24 tests passed)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Throughput:</span>
                <span className="font-bold text-slate-950">18,200 ops/s</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">p99 Latency:</span>
                <span className="font-bold text-slate-950">2.80 ms</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Memory Footprint:</span>
                <span className="font-bold text-slate-950">142 MB</span>
              </div>
            </div>
            {/* Visual Telemetry Breakdown */}
            <DiagramSubmissionOneTelemetry />
            <p className="text-xs text-slate-700 font-medium pt-2 border-t border-slate-100 leading-relaxed">
              It works. Accepted. But the leaderboard shows top implementations exceeding 100,000 ops/s. You investigate mutex bottlenecks and profile lock wait times.
            </p>
          </div>

          {/* Submission #5: Optimized */}
          <div className="rounded-2xl border-2 border-[#099BE9]/40 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#099BE9] uppercase">
                  Submission #5
                </span>
                <h4 className="text-sm font-bold text-slate-950">Striped Mutex + Ring Buffer</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#099BE9]/15 text-[#099BE9]">
                +403% PROVEN
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Correctness:</span>
                <span className="font-bold text-[#0AA793]">100% Crash-Resilient</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Throughput:</span>
                <span className="font-bold text-[#099BE9]">91,700 ops/s (+403%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">p99 Latency:</span>
                <span className="font-bold text-[#0AA793]">0.34 ms (-88%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Memory Footprint:</span>
                <span className="font-bold text-slate-950">41 MB (-71%)</span>
              </div>
            </div>
            {/* Visual Telemetry Breakdown */}
            <DiagramSubmissionFiveTelemetry />
            <p className="text-xs text-slate-800 font-semibold pt-2 border-t border-slate-100 leading-relaxed">
              Now you haven&apos;t just answered a question. You have engineered a high-performance system.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. FIRST-PRINCIPLES POLICY: AI IS ALLOWED                      */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-bold">
            First-Principles Policy
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            First-Principles Policy: AI is allowed
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">
            We don&apos;t try to detect whether you used AI. Use ChatGPT, Claude, Gemini, Copilot, Cursor, Windsurf, custom agents, or your own tools. The future isn&apos;t Human vs. AI — it&apos;s <strong className="text-slate-950 font-bold">Human + AI, judged against system architecture and physical reality.</strong>
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-600">INPUT</div>
              <div className="font-bold text-slate-950 text-xs sm:text-sm">Human + AI</div>
              <div className="text-[10px] text-slate-700 font-medium">Agents, LLMs, Synthesized Code</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#099BE9]">DESIGN</div>
              <div className="font-bold text-slate-950 text-xs sm:text-sm">System Architecture</div>
              <div className="text-[10px] text-slate-700 font-medium">Invariants, Protocols, Buffers</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#F78424]">SUBSTRATE</div>
              <div className="font-bold text-slate-950 text-xs sm:text-sm">Physical Reality</div>
              <div className="text-[10px] text-slate-700 font-medium">Kernel, CPU Cache, I/O Friction</div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-2xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-900">SIGNAL</div>
              <div className="font-bold text-slate-950 text-xs sm:text-sm">Empirical Telemetry</div>
              <div className="text-[10px] text-slate-600 font-medium">p99, ops/s, Crash Durability</div>
            </div>
          </div>
          <p className="text-xs text-slate-700 font-medium text-center mt-4">
            ALGO evaluates the empirical result and the engineering decisions around it.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. THE ECOSYSTEM: WHERE ALGO FITS & CODECRAFTERS COMPARISON    */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#F78424] font-bold">
            The Competitive Landscape
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            Where ALGO Fits
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            What Kaggle did for Machine Learning, ALGO does for Systems &amp; Infrastructure Engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
              Algorithmic Puzzles
            </span>
            <h4 className="text-sm font-bold text-slate-950">LeetCode &amp; HackerRank</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Standardized whiteboarding interviews through automated unit tests on isolated data structures.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
              ML Proving Ground
            </span>
            <h4 className="text-sm font-bold text-slate-950">Kaggle Competitions</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Proved that public empirical leaderboards and hidden holdout test sets drive genuine engineering mastery.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#09C899]/50 bg-white p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-[#0AA793]">
              Systems Proving Ground
            </span>
            <h4 className="text-sm font-bold text-slate-950">ALGO Arena</h4>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Empirical throughput, tail latency, and hardware crash durability evaluated in real Linux kernel sandboxes.
            </p>
          </div>
        </div>

        {/* Where ALGO differs from CodeCrafters */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <h4 className="text-sm font-bold font-mono text-slate-950 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
            Where ALGO differs from CodeCrafters specifically
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            CodeCrafters is the closest existing platform in <em className="font-semibold text-slate-950 font-serif">subject matter</em> — build-your-own-Redis/Kafka is genuinely the right kind of problem. But it&apos;s structured as guided, stage-gated learning: each stage is pass/fail against a spec, finished once the stage is green.
          </p>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            ALGO&apos;s model doesn&apos;t stop at &ldquo;stage passed&rdquo; — it scores the <strong className="text-slate-950 font-bold">result</strong> (ops/sec, p99 latency, memory footprint, crash recovery under SIGKILL) on a live leaderboard, and rewards going back to optimize a passing solution further. CodeCrafters teaches you to build the thing; ALGO measures how well you built it under adversarial conditions.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 8. INDUSTRY VALIDATION: THE SIGNAL FROM BIG TECH (2026 SHIFT) */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            Industry Validation
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Signal From Big Tech Hiring Right Now
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            This isn&apos;t just a developer-sentiment problem — it&apos;s showing up in how the largest employers are actually running interviews in 2026:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2.5">
            <div className="text-3xl font-extrabold font-mono text-[#8647E2]">
              71%
            </div>
            <h4 className="font-bold text-slate-950 text-sm">
              Karat Leader Survey
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              In a Karat survey of 400 engineering leaders across the U.S., India, and China, 71% said AI is making it harder to assess candidates&apos; technical skills using traditional methods.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2.5">
            <div className="text-3xl font-extrabold font-mono text-[#099BE9]">
              58%
            </div>
            <h4 className="font-bold text-slate-950 text-sm">
              FAANG Interviewer Retooling
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              A survey of 67 FAANG and startup interviewers found 58% have already retooled the kinds of algorithmic questions they ask, and roughly a third changed <em>how</em> they ask them, in direct response to AI.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2.5">
            <div className="text-3xl font-extrabold font-mono text-[#0AA793]">
              2026 Shift
            </div>
            <h4 className="font-bold text-slate-950 text-sm">
              System Design In Kind
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Instead of &ldquo;design Twitter&rdquo; or &ldquo;design a URL shortener,&rdquo; 2026 rounds increasingly ask candidates to design a feature store, a model-serving layer, or a real-time inference pipeline, with latency trade-offs and fault tolerance as the actual signal.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
          <strong className="text-slate-950 font-bold">Put together:</strong> the shift ALGO is betting on isn&apos;t hypothetical or platform-side wishful thinking — it&apos;s already visible in how the biggest employers are rewriting their own interview loops.
        </div>
      </div>
    </section>
  );
}

