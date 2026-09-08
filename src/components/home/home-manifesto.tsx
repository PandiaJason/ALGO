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
} from "lucide-react";

export function HomeManifesto() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/90 space-y-20">
      {/* ============================================================== */}
      {/* 1. THE SHIFT: SOFTWARE ENGINEERING CHANGED                      */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
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
            <strong className="text-slate-950 font-bold">84%</strong> of respondents to Stack Overflow&apos;s Developer Survey use AI tools, while{" "}
            <strong className="text-slate-950 font-bold">46%</strong> distrust AI output accuracy.
          </p>
          <p className="text-slate-950 font-bold">
            That creates a new reality: If producing code becomes cheaper, measuring code production becomes less useful.
          </p>
        </div>

        {/* 4 Core Competencies Grid */}
        <div className="pt-2 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
            What matters in the systems &amp; agentic era:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                color: "#F78424",
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
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-extrabold text-white shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </span>
                  <span className="font-bold text-slate-950 text-sm">{item.q}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-2 pl-8 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE ALGO SYSTEMS LOOP VS TRADITIONAL LEETCODE LOOP          */}
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
                  <span className="text-slate-400">2.</span> Write function in isolated namespace
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <span className="text-slate-400">3.</span> Run against hidden input/output arrays
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-slate-900 font-bold">
                  <span className="text-slate-400">4.</span> Binary Accepted checkmark → Next Question
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium border-t border-slate-200 pt-3">
              Binary pass/fail. Tests memorization; ignores concurrency, I/O bottlenecks, and hardware durability.
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
                  <span className="text-[#099BE9]">01.</span> Build raw protocol, WAL &amp; memory engine from scratch
                </div>
                <div className="p-2.5 rounded-lg bg-[#09C899]/5 border border-[#09C899]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#0AA793]">02.</span> Run inside isolated Linux container sandbox
                </div>
                <div className="p-2.5 rounded-lg bg-[#FBAE0C]/5 border border-[#FBAE0C]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#F78424]">03.</span> Hammer with 100K concurrent ops, SIGKILL &amp; contention
                </div>
                <div className="p-2.5 rounded-lg bg-[#8647E2]/5 border border-[#8647E2]/20 flex items-center gap-2 text-slate-950 font-bold">
                  <span className="text-[#8647E2]">04.</span> Optimize hot paths and verify speedup on global leaderboard
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-800 font-semibold border-t border-slate-100 pt-3">
              Continuous optimization loop: empirical profiling, architectural redesign, and verified speedups.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CONCRETE PROFILING CASE: INITIAL VS OPTIMIZED               */}
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
            <p className="text-xs text-slate-800 font-semibold pt-2 border-t border-slate-100 leading-relaxed">
              Now you haven&apos;t just answered a question. You have engineered a high-performance system.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. THE ECOSYSTEM: WHERE ALGO FITS                              */}
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

        {/* Action Callout */}
        <div className="rounded-2xl bg-slate-950 text-white p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-mono font-bold text-[#09C899] uppercase tracking-wider">
              BUILD. OPTIMIZE. PROVE.
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Ready to benchmark your systems code?
            </h3>
            <p className="text-xs text-neutral-300 font-normal">
              Enter the proving ground and reconstruct real infrastructure from first principles.
            </p>
          </div>

          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>Explore All Problems</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
