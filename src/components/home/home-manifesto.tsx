"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  FileText,
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
            <Sparkles className="w-3.5 h-3.5 text-[#09C899]" />
            The Proving Ground Thesis
          </span>
          <span className="text-xs font-mono font-bold text-slate-700">
            // EVIDENCE BRIEF • 2026
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Code is becoming cheaper to produce. <br className="hidden sm:inline" />
            Understanding systems is not.
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
            AI can generate syntax in seconds. Developers are already using it at scale:{" "}
            <strong className="text-slate-950 font-bold">82%</strong> report using AI tools in development, while separately,{" "}
            <strong className="text-slate-950 font-bold">46%</strong> distrust the accuracy of AI-generated output.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 text-white shadow-lg border-2 border-[#09C899]/40 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#09C899] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#09C899] font-bold">
              The Central Question
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            &ldquo;When an AI agent can write the code, can you still understand, direct, verify, and optimize the system that code creates?&rdquo;
          </p>
        </div>

        {/* 4 Core Competencies Grid */}
        <div className="pt-2 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center justify-between">
            <span>The 4 capabilities ALGO evaluates:</span>
            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
              // DESIGN • UNDERSTANDING • VERIFICATION • OPTIMIZATION
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                step: "1",
                color: "#099BE9",
                title: "System Design",
                desc: "Decompose a problem into reliable components, plan data flows, and define clean architectural boundaries.",
              },
              {
                step: "2",
                color: "#09C899",
                title: "Systems Understanding",
                desc: "Master the mechanisms beneath the abstractions: memory layout, operating system primitives, and protocols.",
              },
              {
                step: "3",
                color: "#F78424",
                title: "Empirical Verification",
                desc: "Demonstrate that your system survives heavy traffic, sudden crashes, and adversarial conditions.",
              },
              {
                step: "4",
                color: "#8647E2",
                title: "Optimization",
                desc: "Pinpoint real bottlenecks and redesign hot paths to achieve measurable throughput and latency gains.",
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
                  <span className="font-bold text-slate-950 text-base sm:text-lg">{item.title}</span>
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
      {/* 2. EMPIRICAL EVIDENCE: THE 3 CORE PILLARS                      */}
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
            Research benchmarks, global surveys, and platform data across millions of assessments:
          </p>
        </div>

        {/* 3 Core Evidence Sources */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <a
            href="https://openai.com/index/introducing-swe-bench-verified/"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-all shadow-2xs space-y-2 block"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#099BE9]">
              <span>SWE-bench Verified</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Autonomous agents tested on real multi-file GitHub repositories and issues, replacing synthetic algorithm puzzles.
            </p>
          </a>

          <a
            href="https://www.hackerrank.com/reports/developer-skills-report-2025"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-all shadow-2xs space-y-2 block"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0AA793]">
              <span>HackerRank 2025</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              <strong className="text-slate-950 font-bold">78%</strong> say assessments don&apos;t align with real work; <strong className="text-slate-950 font-bold">66%</strong> prefer real-world repository tasks.
            </p>
          </a>

          <a
            href="https://survey.stackoverflow.co/2025/ai"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-all shadow-2xs space-y-2 block"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#F78424]">
              <span>Stack Overflow AI 2025</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              <strong className="text-slate-950 font-bold">82%</strong> use AI tools, but <strong className="text-slate-950 font-bold">66%</strong> report frustration with &ldquo;almost right&rdquo; code and distrust unverified output.
            </p>
          </a>
        </div>

        {/* The Measurable Gap Callout */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-2">
          <h4 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
            The Measurable Gap
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            This isn&apos;t evidence that traditional platforms are useless — they solve whiteboarding practice at scale. It&apos;s evidence that <strong className="text-slate-950 font-bold">the industry recognizes a measurable gap</strong> between algorithmic syntax tests and actual systems engineering.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CORE THESIS: SYSTEMS THINKING IN THE AGENTIC ERA            */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="rounded-2xl border-2 border-[#8647E2]/30 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#8647E2]/15 text-[#8647E2] border border-[#8647E2]/30">
              Core Thesis
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              // WHERE JUDGMENT MATTERS
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Systems Thinking in the Agentic Workflow Era
            </h3>
            <p className="text-base sm:text-lg text-slate-800 font-bold mt-1.5">
              As AI makes software implementation cheaper, systems understanding becomes more valuable.
            </p>
          </div>

          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            An AI agent can increasingly generate functions, write tests, refactor code, and configure infrastructure. As implementation becomes delegatable, the engineer&apos;s responsibility moves upward — from typing individual pieces of code to understanding, directing, verifying, and evolving the system as a whole.
          </p>

          {/* DSA ≠ Systems Thinking Callout */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed space-y-3">
            <div className="font-mono font-bold text-slate-950 uppercase text-xs tracking-wider text-[#099BE9] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
              DSA ≠ Systems Thinking:
            </div>
            <p>
              DSA teaches algorithms, data structures, and computational complexity. That is foundational. But between an algorithm and a production system lies physical execution:
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-900 font-bold flex flex-wrap items-center gap-1.5">
              <span>processes</span>
              <span className="text-slate-400">→</span>
              <span>memory</span>
              <span className="text-slate-400">→</span>
              <span>concurrency</span>
              <span className="text-slate-400">→</span>
              <span>storage</span>
              <span className="text-slate-400">→</span>
              <span>protocols</span>
              <span className="text-slate-400">→</span>
              <span>failure</span>
              <span className="text-slate-400">→</span>
              <span>observability</span>
              <span className="text-slate-400">→</span>
              <span className="text-[#0AA793]">performance</span>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">Code is still the medium.</span>
              <span className="px-2.5 py-1 rounded bg-[#09C899]/15 text-[#0AA793] border border-[#09C899]/30">Systems understanding is the capability above it.</span>
            </div>
          </div>

          {/* The New Engineering Question Callout */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 font-mono text-xs space-y-1.5">
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              The Definitive Question:
            </div>
            <p className="text-sm font-bold text-slate-950">
              &ldquo;Can you engineer a system when implementation itself can be delegated?&rdquo;
            </p>
            <p className="text-slate-600 text-xs font-sans font-medium">
              AI can produce the implementation. Systems thinking determines whether the implementation deserves to exist.
            </p>
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
              It works. Accepted. But the leaderboard shows top implementations exceeding 90,000 ops/s. You investigate mutex bottlenecks and profile lock wait times.
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
      {/* 7. CTA: READ FULL CASE STUDY                                   */}
      {/* ============================================================== */}
      <div className="pt-4 border-t border-slate-200">
        <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border-2 border-[#09C899]/30">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono font-bold text-[#09C899] uppercase tracking-wider">
                DEEP RESEARCH &amp; ANALYSIS
              </span>
              <span className="text-xs font-mono text-slate-400">• 20-System Curriculum</span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Case Study: Systems Engineering in the Agentic Era
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
              Explore the 10 invariant dimensions of systems thinking, the 6-stage engineering progression, the 20-system curriculum, and full empirical data from SWE-bench and developer reports.
            </p>
          </div>

          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md shadow-[#09C899]/25 transition-all shrink-0 active:scale-95"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Read Full Case Study</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
