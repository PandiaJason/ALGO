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
  Globe,
  BarChart3,
  FileText,
  FileDown,
  Trophy,
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
    <div className="max-w-4xl mx-auto space-y-20 sm:space-y-24 text-slate-800 antialiased selection:bg-[#099BE9]/20 selection:text-[#099BE9] pb-20">
      {/* ============================================================== */}
      {/* 1. MASTHEAD: THE SHIFT                                         */}
      {/* ============================================================== */}
      <section className="space-y-6 pt-4 border-b border-slate-200/80 pb-16">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-slate-900 text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#099BE9]" />
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
            respondents to{" "}
            <a
              href="https://survey.stackoverflow.co/2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#099BE9] hover:text-[#1984E9] underline decoration-[#099BE9]/30 font-medium"
            >
              Stack Overflow&apos;s 2025 Developer Survey
            </a>{" "}
            said they use or plan to use AI tools in development, while{" "}
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-semibold">
            Empirical Data
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            The evidence is already here.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            This isn&apos;t just our opinion. In{" "}
            <a
              href="https://www.hackerrank.com/reports/developer-skills-report-2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#099BE9] hover:text-[#1984E9] underline decoration-[#099BE9]/30 font-medium"
            >
              HackerRank&apos;s 2025 Developer Skills Report
            </a>
            , based on{" "}
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
              source: "HackerRank 2025 Report",
              url: "https://www.hackerrank.com/reports/developer-skills-report-2025",
              pdfUrl: "https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf",
            },
            {
              stat: "78%",
              label: "say technical assessments don't align with real-world tasks.",
              source: "HackerRank 2025 Report",
              url: "https://www.hackerrank.com/reports/developer-skills-report-2025",
              pdfUrl: "https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf",
            },
            {
              stat: "56%",
              label: "say algorithm-based questions are irrelevant to their day jobs.",
              source: "HackerRank 2025 Report",
              url: "https://www.hackerrank.com/reports/developer-skills-report-2025",
              pdfUrl: "https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf",
            },
            {
              stat: "62%",
              label: "feel they need to overprepare for algorithm-heavy assessments.",
              source: "HackerRank 2025 Report",
              url: "https://www.hackerrank.com/reports/developer-skills-report-2025",
              pdfUrl: "https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf",
            },
            {
              stat: "96%",
              label: "believe problem-solving should matter more than memorization.",
              source: "HackerRank 2025 Report",
              url: "https://www.hackerrank.com/reports/developer-skills-report-2025",
              pdfUrl: "https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf",
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
                <span className="truncate max-w-[150px]">{card.source}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[#099BE9] hover:text-[#1984E9] font-sans font-semibold shrink-0"
                  >
                    <span>source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {card.pdfUrl && (
                    <a
                      href={card.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 font-sans"
                      title="Download PDF Report"
                    >
                      [pdf]
                    </a>
                  )}
                </div>
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

        {/* HackerRank Self-Admission Callout with Official Blog Articles */}
        <div className="bg-[#f8fafc] border-l-4 border-[#099BE9] rounded-r-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Even HackerRank Is Documenting This Gap
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono">
              <a
                href="https://www.hackerrank.com/reports/developer-skills-report-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#099BE9] hover:text-[#1984E9] font-medium inline-flex items-center gap-1"
              >
                <span>Report Overview</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
              >
                <FileDown className="w-3 h-3" />
                <span>Full PDF</span>
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            HackerRank itself reports that{" "}
            <strong className="text-slate-900">77% of developers</strong> say most
            assessments don&apos;t align with the skills required for the role,{" "}
            <strong className="text-slate-900">71%</strong> say they grind LeetCode
            to prepare, and <strong className="text-slate-900">62%</strong> say they
            overprepare because they don&apos;t know what will actually be tested.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href="https://www.hackerrank.com/blog/why-do-developers-bail-on-assessments/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between group"
            >
              <span className="text-xs font-medium text-slate-800 group-hover:text-[#099BE9]">
                &ldquo;Why Do Developers Bail on Assessments?&rdquo;
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#099BE9] shrink-0 ml-2" />
            </a>
            <a
              href="https://www.hackerrank.com/blog/is-leetcode-dead/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between group"
            >
              <span className="text-xs font-medium text-slate-800 group-hover:text-[#099BE9]">
                &ldquo;Is LeetCode Dead?&rdquo;
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#099BE9] shrink-0 ml-2" />
            </a>
          </div>

          <p className="text-xs text-slate-600 italic">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#F78424] font-semibold">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Stack Overflow 2025 Developer &amp; AI Survey Findings
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <a
                href="https://survey.stackoverflow.co/2025/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#099BE9] hover:text-[#1984E9] font-medium inline-flex items-center gap-1"
              >
                <span>AI Section</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://survey.stackoverflow.co/2025/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#099BE9] hover:text-[#1984E9] font-medium inline-flex items-center gap-1"
              >
                <span>Developers Section</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#FBAE0C]/10 border border-[#FBAE0C]/30 space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F78424]">
                66%
              </div>
              <p className="text-xs text-slate-800 leading-snug">
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

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-mono border-t border-slate-100">
            <span>Stack Overflow 2025 Annual Developer &amp; AI Survey (49,000+ respondents)</span>
            <a
              href="https://survey.stackoverflow.co/2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#099BE9] hover:text-[#1984E9] font-medium inline-flex items-center gap-1 font-sans"
            >
              <span>survey.stackoverflow.co/2025</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-semibold">
            The Fundamental Re-Definition of Skill
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            That creates a completely different engineering skill:{" "}
            <strong className="text-white font-semibold">Verification.</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] font-mono uppercase text-slate-400">Old Skill</div>
              <div className="text-sm font-semibold text-[#FBAE0C] mt-1">
                &ldquo;Can you type the algorithm?&rdquo;
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] font-mono uppercase text-slate-400">New Skill</div>
              <div className="text-sm font-semibold text-[#09C899] mt-1">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-semibold">
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
                          ? "bg-[#09C899]/10 text-[#0AA793] border-[#09C899]/30"
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
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#099BE9]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9]">
                  The ALGO Loop
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#099BE9]/20 text-[#099BE9] border border-[#099BE9]/40 font-semibold">
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
                    <div className="flex items-center gap-1.5 text-[#09C899] font-bold">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-semibold">
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
                <span className="w-2.5 h-2.5 rounded-full bg-[#09C899] animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-900">
                  Submission #1: Initial Implementation
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#09C899]/10 text-[#0AA793] font-bold border border-[#09C899]/30">
                ACCEPTED
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Correctness:</span>
                <span className="font-semibold text-[#0AA793]">100% (Passed 24/24 tests)</span>
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
                  <Flame className="w-4 h-4 text-[#FBAE0C]" />
                  <span className="font-mono text-xs font-bold text-white">
                    Submission #5: Optimized Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#099BE9]/20 text-[#099BE9] font-bold border border-[#099BE9]/40">
                  +403% PROVEN
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs mt-3">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Correctness:</span>
                  <span className="font-semibold text-[#09C899]">100% Crash-Resilient</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Throughput:</span>
                  <span className="font-bold text-[#09C899] text-sm">
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
            <span className="text-[#099BE9] underline decoration-[#099BE9]/40 underline-offset-4">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-semibold">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-semibold">
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
                <span className="text-[#0AA793] font-bold flex items-center gap-1">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-semibold">
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

        {/* Proving Ground Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#099BE9] font-bold text-sm font-mono">
              <Terminal className="w-4 h-4" />
              <span>1. Reconstruct Real Systems</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Don&apos;t just reverse a linked list. Build the foundation of Redis,
              RocksDB, and Kafka. Write-ahead logs, striped locks, network loops, and memory caches.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#09C899] font-bold text-sm font-mono">
              <Activity className="w-4 h-4" />
              <span>2. Measure Empirical Telemetry</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your score isn&apos;t a test pass/fail checkmark. It&apos;s verified
              throughput (ops/sec), p99 latency distributions, and resident memory size under stress.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#8647E2] font-bold text-sm font-mono">
              <Bot className="w-4 h-4" />
              <span>3. Engineer With AI</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use Claude, Cursor, Copilot, or handwritten C++. You aren&apos;t judged
              on whether you typed the syntax yourself. You are judged on whether your architecture survives.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#FBAE0C] font-bold text-sm font-mono">
              <Trophy className="w-4 h-4" />
              <span>4. Compete on Empirical Leaderboards</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent rankings evaluated in identical Docker cgroups on bare-metal hardware.
              Optimize hot paths to earn your rank on the leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. COMPETITIVE LANDSCAPE: HOW PROVING GROUNDS EVOLVED          */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#F78424] font-semibold">
            The Competitive Landscape
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-1">
            Where ALGO fits in the ecosystem.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Different platforms solved different eras of developer evaluation. Understanding where they succeed reveals the missing layer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* LeetCode / HackerRank */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                ALGORITHMIC PUZZLES
              </span>
              <h3 className="font-bold text-slate-900 text-sm">LeetCode &amp; HackerRank</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized algorithmic interviews and syntax correctness through automated unit tests on isolated questions.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              Focus: Array/Tree algorithms &amp; whiteboard puzzles.
            </div>
          </div>

          {/* Topcoder */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FBAE0C]/10 text-[#F78424] border border-[#FBAE0C]/30 font-semibold">
                CROWD COMPETITIONS
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Topcoder Challenges</h3>
                <a
                  href="https://www.topcoder.com/opportunities/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700"
                  title="Visit Topcoder Opportunities"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pioneered competitive marathon matches and crowdsourced software bounties across global engineering communities.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              Focus: Competitive algorithms &amp; freelance bounties.
            </div>
          </div>

          {/* Kaggle */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#099BE9]/10 text-[#099BE9] border border-[#099BE9]/30 font-semibold">
                ML PROVING GROUND
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Kaggle Competitions</h3>
                <a
                  href="https://www.kaggle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700"
                  title="Visit Kaggle"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proved that public leaderboards, empirical loss scores, and hidden holdout sets drive genuine Machine Learning mastery.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              Focus: Predictive models &amp; empirical benchmarks.
            </div>
          </div>

          {/* ALGO */}
          <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#09C899]/20 text-[#09C899] border border-[#09C899]/40 font-bold">
                SYSTEMS PROVING GROUND
              </span>
              <h3 className="font-bold text-white text-sm">ALGO Proving Ground</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                What Kaggle did for Machine Learning, ALGO does for Systems &amp; Infrastructure. Measuring throughput, p99 latency, and crash recovery.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-[#09C899]">
              Focus: Real systems, bare-metal hardware &amp; AI era.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. THE NEW QUESTION: CONCLUSION                               */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#099BE9]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-semibold">
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
              <span className="text-[#09C899] font-semibold font-mono">
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
            <div className="font-black text-lg tracking-widest text-[#09C899]">
              GO CURIOUS.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. PUT IT INTO PRACTICE: THE 10 CORE CHALLENGES              */}
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
                        ? "bg-[#09C899]/10 text-[#0AA793] border-[#09C899]/30"
                        : c.difficulty === "Medium"
                        ? "bg-[#FBAE0C]/10 text-[#F78424] border-[#FBAE0C]/30"
                        : "bg-[#8647E2]/10 text-[#8647E2] border-[#8647E2]/30"
                    }`}>
                      {c.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2.5 group-hover:text-[#099BE9] transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {c.overview}
                  </p>

                  <div className="bg-slate-50 border-l-2 border-[#099BE9] px-3 py-1.5 rounded-r-lg mt-3">
                    <p className="text-[11px] italic text-slate-700 font-serif">
                      &ldquo;{c.signatureQuestion}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-slate-500">
                    <span>{c.progressionLevels.length} Architectural Levels</span>
                    {topOps && (
                      <span className="text-[#09C899] font-bold ml-2">
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-[#099BE9] text-white transition-all shadow-2xs"
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
      {/* 12. EMPIRICAL RESEARCH & PRIMARY SOURCES ARCHIVE              */}
      {/* ============================================================== */}
      <footer className="border-t border-slate-200 pt-10 space-y-8 text-slate-600">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-semibold">
              Documented Evidence &amp; Citations
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-slate-400">9 Canonical Sources</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Primary Research &amp; Benchmark Sources
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            The core research reports, empirical survey datasets, and platform architectures underpinning why ALGO exists.
          </p>
        </div>

        {/* The 9 Primary Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Pillar 1: Market & Industry Reports (Blue A) */}
          <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="font-mono text-[11px] font-bold uppercase text-[#099BE9] tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
              <span>Skills &amp; Industry Reports</span>
            </div>
            <ul className="space-y-4 font-mono text-[11px]">
              {/* 1. HackerRank 2025 Developer Skills Report */}
              <li className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#099BE9]/10 text-[#099BE9] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <a
                      href="https://www.hackerrank.com/reports/developer-skills-report-2025"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>HackerRank — 2025 Developer Skills Report</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      13,732 respondents across 102 countries. 78% say assessments don&apos;t align with real work; 66% prefer real tasks.
                    </p>
                  </div>
                </div>
              </li>

              {/* 2. HackerRank 2025 Developer Skills Report PDF */}
              <li className="space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#099BE9]/10 text-[#099BE9] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <a
                      href="https://pages.hackerrank.com/hubfs/PDFs/HackerRank%202025%20Developer%20Skills%20Report.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>HackerRank — 2025 Skills Report PDF</span>
                      <FileDown className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      Direct full-length unedited PDF document containing comprehensive methodology, statistics, and findings.
                    </p>
                  </div>
                </div>
              </li>

              {/* 6. Why Do Developers Bail on Assessments? */}
              <li className="space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#099BE9]/10 text-[#099BE9] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    6
                  </span>
                  <div>
                    <a
                      href="https://www.hackerrank.com/blog/why-do-developers-bail-on-assessments/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>HackerRank — Why Do Developers Bail on Assessments?</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      HackerRank blog documenting candidate drop-off and frustration caused by synthetic whiteboard puzzles.
                    </p>
                  </div>
                </div>
              </li>

              {/* 7. Is LeetCode Dead? */}
              <li className="space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#099BE9]/10 text-[#099BE9] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    7
                  </span>
                  <div>
                    <a
                      href="https://www.hackerrank.com/blog/is-leetcode-dead/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>HackerRank — Is LeetCode Dead?</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      Industry analysis on why pure syntax memorization is increasingly obsolete with AI code generation.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Stack Overflow Developer Surveys (Teal L) */}
          <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="font-mono text-[11px] font-bold uppercase text-[#0AA793] tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#09C899]" />
              <span>Stack Overflow 2025 Surveys</span>
            </div>
            <ul className="space-y-4 font-mono text-[11px]">
              {/* 3. Stack Overflow — 2025 Developer Survey */}
              <li className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <a
                      href="https://survey.stackoverflow.co/2025/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>Stack Overflow — 2025 Developer Survey</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      Annual global survey with 49,000+ respondents measuring AI adoption, developer sentiments, and tooling shifts.
                    </p>
                  </div>
                </div>
              </li>

              {/* 4. Stack Overflow — 2025 AI Survey */}
              <li className="space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <a
                      href="https://survey.stackoverflow.co/2025/ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>Stack Overflow — 2025 AI Survey</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      46% distrust AI output accuracy; 66% frustrated by &ldquo;almost-right&rdquo; code; debugging times expanded.
                    </p>
                  </div>
                </div>
              </li>

              {/* 5. Stack Overflow — 2025 Developers Survey */}
              <li className="space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    <a
                      href="https://survey.stackoverflow.co/2025/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>Stack Overflow — 2025 Developers Survey</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      Demographic breakdown, engineer profile segments, professional experience, and technology stacks.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Existing Platforms & Paradigms (Orange O & Purple G) */}
          <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="font-mono text-[11px] font-bold uppercase text-[#F78424] tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#FBAE0C]" />
              <span>Competitor Paradigms</span>
            </div>
            <ul className="space-y-4 font-mono text-[11px]">
              {/* 8. Topcoder — Opportunities */}
              <li className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FBAE0C]/15 text-[#F78424] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    8
                  </span>
                  <div>
                    <a
                      href="https://www.topcoder.com/opportunities/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>Topcoder — Opportunities</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      Pioneer of competitive coding tournaments, client challenges, and algorithmic freelance bounties.
                    </p>
                  </div>
                </div>
              </li>

              {/* 9. Kaggle — Competitions */}
              <li className="space-y-1 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8647E2]/15 text-[#8647E2] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    9
                  </span>
                  <div>
                    <a
                      href="https://www.kaggle.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-[#099BE9] inline-flex items-center gap-1 group leading-tight"
                    >
                      <span>Kaggle — Competitions</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#099BE9] shrink-0" />
                    </a>
                    <p className="font-sans text-slate-500 text-[11px] leading-normal mt-1">
                      The benchmark model for empirical ML competitions. ALGO brings this exact proving ground model to backend systems.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-100">
          <span>ALGO Research • Systems Architecture &amp; Developer Evaluation</span>
          <span>Updated September 2026</span>
        </div>
      </footer>
    </div>
  );
}
