"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Terminal,
  Activity,
  Flame,
  Bot,
  Check,
  FileText,
  FileDown,
  Trophy,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";

export function ExploreManifesto() {
  return (
    <article className="max-w-4xl mx-auto space-y-16 sm:space-y-20 text-slate-800 antialiased selection:bg-[#099BE9]/20 selection:text-[#099BE9] pb-24 font-sans">
      {/* ============================================================== */}
      {/* 1. MASTHEAD: SOFTWARE ENGINEERING CHANGED                      */}
      {/* ============================================================== */}
      <section className="space-y-6 pt-2 border-b border-slate-200/80 pb-14">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-slate-950 text-white">
            <FileText className="w-3.5 h-3.5 text-[#099BE9]" />
            Thesis &amp; Architectural Brief
          </span>
          <span className="text-xs font-mono font-bold text-slate-700">
            // EVIDENCE BRIEF • 2026
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-slate-950 leading-[1.15]">
          Software engineering changed. <br className="hidden sm:inline" />
          The way we measure it hasn&apos;t.
        </h1>

        <div className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed space-y-4 pt-1">
          <p>
            AI can generate syntax in seconds. Developers are already using it at scale —{" "}
            <strong className="text-slate-950 font-bold">82%</strong> report using AI tools in their development process, while separately,{" "}
            <strong className="text-slate-950 font-bold">46%</strong> say they distrust AI-generated output&apos;s accuracy.
            <sup className="ml-1">
              <a href="#src-1" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[1]</a>
              <a href="#src-2" className="text-[#099BE9] font-mono text-xs font-bold hover:underline ml-0.5">[2]</a>
            </sup>
          </p>
          <div className="p-5 rounded-2xl bg-slate-100 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] text-slate-950 text-base sm:text-lg font-bold">
            That creates a new reality: if producing code becomes cheap, measuring code production becomes less useful.
          </div>
        </div>

        {/* 4 Core Competencies Grid */}
        <div className="pt-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
            What matters in the systems &amp; agentic era:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: "1",
                color: "#099BE9",
                q: "Can you direct the architecture?",
                desc: "Define boundary invariants, byte protocols, and memory budgets before writing a single line.",
              },
              {
                step: "2",
                color: "#09C899",
                q: "Can you verify it empirically?",
                desc: "Know definitively whether the code survives high concurrency, power cuts (SIGKILL), and partial writes.",
              },
              {
                step: "3",
                color: "#FBAE0C",
                q: "Can you isolate the bottleneck?",
                desc: "Diagnose mutex lock contention, cache misses, memory leaks, and tail-latency spikes under pressure.",
              },
              {
                step: "4",
                color: "#8647E2",
                q: "Can you make it faster?",
                desc: "Re-architect hot paths with striped mutexes, lock-free ring buffers, and zero-copy slicing.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#09090b] hover:shadow-[4px_4px_0px_0px_#09090b] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-extrabold text-white shrink-0 border border-slate-900 shadow-[1px_1px_0px_0px_#09090b]"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </span>
                  <span className="font-bold text-slate-950 text-sm">{item.q}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-2.5 pl-10 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. EMPIRICAL DATA: THE EVIDENCE IS ALREADY HERE               */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            Empirical Data
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The evidence is already here.
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            From HackerRank&apos;s <strong className="text-slate-950 font-bold">2025 Developer Skills Report</strong> (global survey + platform data spanning over 3M assessments/year):
            <sup className="ml-1">
              <a href="#src-3" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[3]</a>
            </sup>
          </p>
        </div>

        {/* Survey Table */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_#09090b]">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-mono font-bold uppercase text-[11px]">
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
                <td className="py-3.5 px-4 sm:px-6 font-mono font-extrabold text-2xl text-[#FBAE0C]">62%</td>
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">feel they need to overprepare for algorithm-heavy assessments</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* HackerRank Bail Out Blog Callout */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            <span>Research Citation Note</span>
            <sup className="text-[#099BE9] font-mono text-xs font-bold">[4]</sup>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            Separately, in HackerRank&apos;s blog post <strong className="text-slate-950 font-bold">&ldquo;Why Do Developers Bail on Assessments?&rdquo;</strong>,{" "}
            <strong className="text-slate-950 font-bold">77%</strong> of surveyed developers say most assessments don&apos;t align with the skills required for their role — a related but distinct data point from a different piece of HackerRank research, cited here as its own source rather than folded into the report stat above.
          </p>
        </div>

        {/* The Measurable Gap */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_0px_#09090b] space-y-2">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#099BE9]" />
            The Measurable Gap
          </h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            This isn&apos;t evidence that LeetCode or HackerRank are useless — they solve real problems and have massive adoption. It&apos;s evidence that <strong className="text-slate-950 font-bold">the industry itself recognizes a measurable gap</strong> between traditional assessment and actual engineering work. ALGO isn&apos;t the one claiming this gap exists — HackerRank&apos;s own research is.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. THE AGENTIC INFLECTION POINT                                */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#FBAE0C] font-bold">
            The Agentic Inflection Point
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Agentic Inflection Point
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            Traditional coding assessment asks: <em className="font-bold text-slate-950 font-serif">&ldquo;Can you produce the solution?&rdquo;</em> But now an AI can often produce a solution outright.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_#09090b] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-slate-700 font-bold tracking-wider">
              From Stack Overflow&apos;s 2025 Developer &amp; AI Survey (49,000+ respondents):
              <sup className="ml-1">
                <a href="#src-5" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[5]</a>
              </sup>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#FBAE0C]/10 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#FBAE0C]">
                66%
              </div>
              <p className="text-xs text-slate-900 font-medium leading-snug">
                of developers are frustrated by AI solutions that are <strong>&ldquo;almost right&rdquo;</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-950">
                45%
              </div>
              <p className="text-xs text-slate-800 font-medium leading-snug">
                say debugging AI-generated code is <strong>more time-consuming</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-950">
                46% vs 33%
              </div>
              <p className="text-xs text-slate-800 font-medium leading-snug">
                <strong>distrust AI output accuracy</strong> vs. 33% who trust it
              </p>
            </div>
          </div>
        </div>

        {/* The Re-definition of skill Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
            The Re-Definition of Skill
          </h3>
          <div className="rounded-2xl border-2 border-slate-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_#09090b]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-mono font-bold uppercase text-[11px]">
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
      </section>

      {/* ============================================================== */}
      {/* 4. METHODOLOGY: THE SYSTEMS VERIFICATION LOOP                  */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-bold">
            Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            Methodology: The Systems Verification Loop
          </h2>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Traditional */}
          <div className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-6 shadow-[4px_4px_0px_0px_#09090b] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                  Traditional coding platforms
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-200 border border-slate-900 text-slate-900 shadow-[1px_1px_0px_0px_#09090b]">
                  SYNTAX TEST
                </span>
              </div>
              <ol className="space-y-2.5 font-mono text-xs text-slate-800 font-medium mt-4">
                <li className="p-3 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">1.</span>
                  <span>Read synthetic problem description</span>
                </li>
                <li className="p-3 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">2.</span>
                  <span>Write function in isolated namespace</span>
                </li>
                <li className="p-3 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">3.</span>
                  <span>Run against hidden input/output arrays</span>
                </li>
                <li className="p-3 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-slate-400 font-bold">4.</span>
                  <span>Binary Accepted checkmark → next question</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-slate-700 font-medium border-t-2 border-slate-900 pt-3">
              Binary pass/fail. Tests memorization; ignores concurrency, I/O bottlenecks, and hardware durability.
            </p>
          </div>

          {/* ALGO Proving Ground Loop */}
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_#09090b] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0AA793]">
                  The ALGO Proving Ground loop
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-[#09C899]/15 text-[#0AA793] border border-slate-900 shadow-[1px_1px_0px_0px_#09090b]">
                  EMPIRICAL SYSTEMS
                </span>
              </div>
              <ol className="space-y-2.5 font-mono text-xs mt-4">
                <li className="p-3 rounded-xl bg-[#099BE9]/10 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#099BE9]">1.</span>
                  <span>Build raw protocol, core architecture &amp; engine from scratch</span>
                </li>
                <li className="p-3 rounded-xl bg-[#09C899]/10 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#0AA793]">2.</span>
                  <span>Run inside an isolated Linux container sandbox</span>
                </li>
                <li className="p-3 rounded-xl bg-[#FBAE0C]/10 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#FBAE0C]">3.</span>
                  <span>Hammer with high-concurrency load, SIGKILL, and contention scenarios</span>
                </li>
                <li className="p-3 rounded-xl bg-[#8647E2]/10 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#8647E2]">4.</span>
                  <span>Optimize hot paths and verify speedup on the leaderboard</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-slate-800 font-semibold border-t-2 border-slate-900 pt-3">
              Continuous optimization loop: empirical profiling, architectural redesign, and verified speedups.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-mono italic">
          *(Note: exact concurrency targets and hardware configuration are still being finalized as the platform matures — see &ldquo;Where This Stands&rdquo; below.)*
        </p>
      </section>

      {/* ============================================================== */}
      {/* 5. TELEMETRY & PROFILING: YOUR CODE ISN'T THE FINAL ANSWER    */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            Telemetry &amp; Profiling
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            Telemetry &amp; Profiling: your code isn&apos;t the final answer
          </h2>
        </div>

        {/* Submission Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Submission */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#09090b] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <span className="font-mono text-xs font-bold text-slate-900">
                Submission #1 — Initial Implementation
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#09C899]/15 text-[#0AA793] font-bold border border-[#09C899]/40">
                ACCEPTED
              </span>
            </div>

            <ul className="space-y-2 font-mono text-xs">
              <li className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-semibold">Correctness:</span>
                <span className="font-bold text-[#0AA793]">100% (24/24 tests passed)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-semibold">Throughput:</span>
                <span className="font-bold text-slate-950">18,200 ops/s</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-semibold">P99 latency:</span>
                <span className="font-bold text-slate-950">2.8 ms</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-600 font-semibold">Memory footprint:</span>
                <span className="font-bold text-slate-950">142 MB</span>
              </li>
            </ul>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium leading-relaxed">
              It works. Accepted. But ALGO doesn&apos;t stop there — the leaderboard shows someone else at 74K ops/sec.
            </div>
          </div>

          {/* Optimized Engine */}
          <div className="bg-slate-950 border-2 border-slate-900 text-white rounded-2xl p-5 shadow-[4px_4px_0px_0px_#09090b] space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FBAE0C]" />
                  <span className="font-mono text-xs font-bold text-white">
                    Submission #5 — Optimized Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#099BE9]/20 text-[#099BE9] font-bold border border-[#099BE9]/40">
                  +403%
                </span>
              </div>

              <ul className="space-y-2 font-mono text-xs mt-3">
                <li className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300 font-medium">Correctness:</span>
                  <span className="font-semibold text-[#09C899]">100%, crash-resilient</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300 font-medium">Throughput:</span>
                  <span className="font-bold text-[#09C899] text-sm">
                    91,700 ops/s (+403%)
                  </span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300 font-medium">P99 latency:</span>
                  <span className="font-semibold text-white">0.34 ms (−88%)</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="text-slate-300 font-medium">Memory footprint:</span>
                  <span className="font-semibold text-white">41 MB (−71%)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl p-3 text-xs text-cyan-200 border border-cyan-800/60 font-medium">
              The gap came from profiling mutex locks and replacing single-threaded maps with 32-shard striped mutexes and ring buffers.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FIRST-PRINCIPLES POLICY: AI IS ALLOWED                      */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-bold">
            First-Principles Policy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            First-Principles Policy: AI is allowed
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            We don&apos;t try to detect whether you used AI. Use ChatGPT, Claude, Gemini, Copilot, Cursor, Windsurf, custom agents, or your own tools. The future isn&apos;t Human vs. AI — it&apos;s <strong className="text-slate-950 font-bold">Human + AI, judged against system architecture and physical reality.</strong>
          </p>
        </div>

        {/* System Execution Pipeline Visual */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_#09090b]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm text-center">
            <div className="bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-3 shadow-[2px_2px_0px_0px_#09090b] font-bold text-slate-950">
              Human + AI
            </div>
            <ArrowRight className="w-4 h-4 text-slate-900 hidden sm:block" />
            <span className="sm:hidden text-slate-900 font-bold">↓</span>
            <div className="bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-3 shadow-[2px_2px_0px_0px_#09090b] font-bold text-slate-950">
              System Architecture
            </div>
            <ArrowRight className="w-4 h-4 text-slate-900 hidden sm:block" />
            <span className="sm:hidden text-slate-900 font-bold">↓</span>
            <div className="bg-slate-50 border-2 border-slate-900 rounded-xl px-4 py-3 shadow-[2px_2px_0px_0px_#09090b] font-bold text-slate-950">
              Physical Reality
            </div>
            <ArrowRight className="w-4 h-4 text-slate-900 hidden sm:block" />
            <span className="sm:hidden text-slate-900 font-bold">↓</span>
            <div className="bg-slate-900 text-white border-2 border-slate-900 rounded-xl px-4 py-3 shadow-[2px_2px_0px_0px_#09090b] font-bold">
              Empirical Measurement
            </div>
          </div>
          <p className="text-xs text-slate-700 font-medium text-center mt-4">
            ALGO evaluates the empirical result and the engineering decisions around it.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. THE COMPETITIVE LANDSCAPE                                    */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#FBAE0C] font-bold">
            Ecosystem Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Competitive Landscape
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_#09090b]">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-mono font-bold uppercase text-[11px]">
                <th className="py-3 px-4 sm:px-6 w-1/3">Platform</th>
                <th className="py-3 px-4 sm:px-6">Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">LeetCode &amp; HackerRank</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700">Array/tree algorithms &amp; whiteboard puzzles</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">Topcoder Challenges</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700">Competitive algorithms &amp; freelance bounties</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">Kaggle Competitions</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700">Predictive models &amp; empirical benchmarks</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">
                  <a href="https://codecrafters.io" target="_blank" rel="noopener noreferrer" className="text-slate-950 hover:text-[#099BE9] underline inline-flex items-center gap-1">
                    <span>CodeCrafters</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <sup className="ml-1">
                    <a href="#src-6" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[6]</a>
                  </sup>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700 leading-relaxed">
                  Guided, stage-by-stage rebuilds of real systems (Redis, Kafka, Git, SQLite) — teaches the internals through pass/fail stages, used by engineers at Google, OpenAI, and Vercel
                </td>
              </tr>
              <tr className="bg-slate-50/70">
                <td className="py-3.5 px-4 sm:px-6 font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#099BE9]" />
                  ALGO Proving Ground
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950 text-sm">
                  Real systems, empirical throughput/latency under adversarial load, AI-era assessment
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-800 font-medium leading-relaxed">
          What Kaggle did for Machine Learning, ALGO aims to do for Systems &amp; Infrastructure.
        </p>

        {/* Deep Dive: Where ALGO Differs From CodeCrafters */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_0px_#09090b] space-y-3">
          <h3 className="text-sm font-bold font-mono text-slate-950 uppercase tracking-wider">
            Where ALGO differs from CodeCrafters specifically
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            CodeCrafters is the closest existing platform in <em className="font-semibold text-slate-950 font-serif">subject matter</em> — build-your-own-Redis/Kafka is genuinely the right kind of problem. But it&apos;s structured as guided, stage-gated learning: each stage is pass/fail against a spec, finished once the stage is green.
          </p>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            ALGO&apos;s model doesn&apos;t stop at &ldquo;stage passed&rdquo; — it scores the <strong className="text-slate-950 font-bold">result</strong> (ops/sec, p99 latency, memory footprint, crash recovery under SIGKILL) on a live leaderboard, and rewards going back to optimize a passing solution further. CodeCrafters teaches you to build the thing; ALGO measures how well you built it under adversarial conditions.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. THE SIGNAL FROM BIG TECH HIRING RIGHT NOW                  */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            Industry Validation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Signal From Big Tech Hiring Right Now
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            This isn&apos;t just a developer-sentiment problem — it&apos;s showing up in how the largest employers are actually running interviews in 2026:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#09090b] space-y-2.5">
            <div className="text-3xl font-extrabold font-mono text-[#8647E2]">
              71%
            </div>
            <h3 className="font-bold text-slate-950 text-sm">
              Karat Leader Survey
              <sup className="ml-1">
                <a href="#src-7" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[7]</a>
              </sup>
            </h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              In a Karat survey of 400 engineering leaders across the U.S., India, and China, 71% said AI is making it harder to assess candidates&apos; technical skills using traditional methods.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#09090b] space-y-2.5">
            <div className="text-3xl font-extrabold font-mono text-[#099BE9]">
              58%
            </div>
            <h3 className="font-bold text-slate-950 text-sm">
              FAANG Interviewer Retooling
              <sup className="ml-1">
                <a href="#src-8" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[8]</a>
              </sup>
            </h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              A survey of 67 FAANG and startup interviewers found 58% have already retooled the kinds of algorithmic questions they ask, and roughly a third changed <em>how</em> they ask them, in direct response to AI.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#09090b] space-y-2.5">
            <div className="text-3xl font-extrabold font-mono text-[#0AA793]">
              2026 Shift
            </div>
            <h3 className="font-bold text-slate-950 text-sm">
              System Design In Kind
              <sup className="ml-1">
                <a href="#src-9" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[9]</a>
              </sup>
            </h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Instead of &ldquo;design Twitter&rdquo; or &ldquo;design a URL shortener,&rdquo; 2026 rounds increasingly ask candidates to design a feature store, a model-serving layer, or a real-time inference pipeline, with latency trade-offs and fault tolerance as the actual signal.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] text-slate-900 text-xs sm:text-sm font-medium leading-relaxed">
          <strong className="text-slate-950 font-bold">Put together:</strong> the shift ALGO is betting on isn&apos;t hypothetical or platform-side wishful thinking — it&apos;s already visible in how the biggest employers are rewriting their own interview loops.
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. WHERE THIS STANDS                                           */}
      {/* ============================================================== */}
      <section className="space-y-4 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
            Status &amp; Verification
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            Where This Stands
          </h2>
        </div>

        <div className="p-6 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] space-y-3">
          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            ALGO is early. The evidence above establishes <em className="text-slate-950 font-serif font-bold">that the gap exists</em> and <em className="text-slate-950 font-serif font-bold">why the approach is a reasonable response to it</em> — it does not yet establish that ALGO closes the gap in practice.
          </p>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            That proof will come from real users producing real, verifiable numbers on the platform over time, and this case study will be updated with that data as it accumulates.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. DOCUMENTED SOURCES (FOOTNOTES)                            */}
      {/* ============================================================== */}
      <footer className="space-y-6 pt-2 text-slate-700">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            References &amp; Citations
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-1">
            Documented Sources
          </h3>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm font-mono text-slate-700 divide-y divide-slate-100">
          <li id="src-1" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[1]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              HackerRank, &ldquo;Designing AI-Integrated Coding Assessments That Mirror Real-World Work&rdquo; — 82% of developers report using AI tools in development.
            </span>
          </li>
          <li id="src-2" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[2]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              Stack Overflow 2025 Developer &amp; AI Survey — 46% distrust AI-generated output accuracy vs. 33% who trust it. (
              <a href="https://survey.stackoverflow.co/2025/" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                survey.stackoverflow.co/2025
              </a>
              )
            </span>
          </li>
          <li id="src-3" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[3]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              HackerRank 2025 Developer Skills Report (
              <a href="https://www.hackerrank.com/reports/developer-skills-report-2025" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                hackerrank.com/reports/developer-skills-report-2025
              </a>
              ) — 66%/78%/56%/62% figures, based on global developer survey + platform data.
            </span>
          </li>
          <li id="src-4" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[4]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              HackerRank Blog, &ldquo;Why Do Developers Bail on Assessments?&rdquo; (
              <a href="https://www.hackerrank.com/blog/why-do-developers-bail-on-assessments/" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                hackerrank.com/blog/why-do-developers-bail-on-assessments
              </a>
              ) — 77% figure, cited separately from the main report.
            </span>
          </li>
          <li id="src-5" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[5]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              Stack Overflow 2025 Annual Developer &amp; AI Survey (
              <a href="https://survey.stackoverflow.co/2025/" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                survey.stackoverflow.co/2025
              </a>
              ) — 49,000+ respondents; frustration/debugging/trust figures.
            </span>
          </li>
          <li id="src-6" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[6]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              CodeCrafters (
              <a href="https://codecrafters.io" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                codecrafters.io
              </a>
              ) — &ldquo;Build Your Own Redis, Git &amp; SQLite From Scratch&rdquo;; stage-based challenges used by engineers at Google, OpenAI, and Vercel.
            </span>
          </li>
          <li id="src-7" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[7]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              Karat, &ldquo;Engineering Interview Trends in 2026&rdquo; (
              <a href="https://karat.com/engineering-interview-trends-2026" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                karat.com/engineering-interview-trends-2026
              </a>
              ) — survey of 400 engineering leaders across the U.S., India, and China.
            </span>
          </li>
          <li id="src-8" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[8]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              IEEE-USA InSight, &ldquo;Three Ways AI is Reshaping Traditional Technical Interviews in 2026&rdquo; — survey of 67 FAANG and startup interviewers, citing Karat&apos;s underlying data.
            </span>
          </li>
          <li id="src-9" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[9]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              FinalRound AI, &ldquo;Software Engineering Job Market 2026: Data, Trends and Outlook&rdquo; — on the shift in system design interview content at large employers.
            </span>
          </li>
        </ol>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
          <span>ALGO Research • Systems Architecture &amp; Developer Evaluation</span>
          <span>Updated September 2026</span>
        </div>
      </footer>
    </article>
  );
}
