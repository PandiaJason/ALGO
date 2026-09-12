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
  Trophy,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
  Cpu,
  Database,
  Server,
  ShieldCheck,
  Sliders,
  Workflow,
  Search,
} from "lucide-react";

export function ExploreManifesto() {
  return (
    <article className="max-w-4xl mx-auto space-y-16 sm:space-y-20 text-slate-800 antialiased selection:bg-[#099BE9]/20 selection:text-[#099BE9] pb-24 font-sans">
      {/* ============================================================== */}
      {/* 1. MASTHEAD: CASE STUDY & CORE THESIS                          */}
      {/* ============================================================== */}
      <section className="space-y-6 pt-2 border-b border-slate-200/80 pb-14">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-slate-950 text-white">
            <FileText className="w-3.5 h-3.5 text-[#099BE9]" />
            Case Study: Systems Engineering in the Agentic Era
          </span>
          <span className="text-xs font-mono font-bold text-slate-700">
            // ALGO SYSTEMS ENGINEERING CHALLENGES • 2026
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            Code is becoming cheaper to produce. <br className="hidden sm:inline" />
            Understanding systems is not.
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 font-semibold max-w-3xl leading-relaxed">
            ALGO is a systems-engineering proving ground built around a simple question:
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 text-white shadow-lg border border-slate-800 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            The Central Question
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
            &ldquo;When an AI agent can write the code, can you still understand, direct, verify, and optimize the system that code creates?&rdquo;
          </p>
        </div>

        {/* 4 Core Competencies Grid */}
        <div className="pt-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
            The 4 capabilities ALGO evaluates:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                step: "1",
                color: "#099BE9",
                title: "System Design",
                desc: "Can you decompose a problem into reliable components and define clean architectural boundaries?",
              },
              {
                step: "2",
                color: "#09C899",
                title: "Systems Understanding",
                desc: "Do you understand the mechanisms beneath the abstractions — memory layout, OS primitives, and protocols?",
              },
              {
                step: "3",
                color: "#F78424",
                title: "Empirical Verification",
                desc: "Can you demonstrate that your system actually behaves as intended under concurrency, crashes, and stress?",
              },
              {
                step: "4",
                color: "#8647E2",
                title: "Optimization",
                desc: "Can you pinpoint physical bottlenecks and produce measurable, verified performance improvements?",
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
                  <span className="font-bold text-slate-950 text-sm">{item.title}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-2 pl-8 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. THE PROBLEM                                                 */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            The Core Problem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Problem
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-semibold mt-2 leading-relaxed">
            Software engineering is changing faster than the way we teach and evaluate it.
          </p>
        </div>

        <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed space-y-4">
          <p>
            AI coding agents can now generate functions, implement APIs, modify repositories, write tests, refactor code, and operate through terminals. Benchmarks such as SWE-bench demonstrate that AI systems can already work on real GitHub repositories rather than isolated programming puzzles.
          </p>
          <p>
            At the same time, developers report widespread use of AI alongside significant concerns about the correctness of generated code.
          </p>
          <div className="p-5 rounded-xl bg-slate-100 border-l-4 border-slate-900 text-slate-950 font-bold space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-600">This creates a new engineering reality:</div>
            <p className="text-base sm:text-lg">
              The scarce skill is increasingly not producing code. It is knowing what the system should do, whether it actually does it, and how it behaves under real constraints.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-slate-400 font-bold">The question is no longer:</span>
              <div className="text-slate-950 font-bold text-sm mt-1">&ldquo;Can you write this algorithm?&rdquo;</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#099BE9]/10 border border-[#099BE9]/30 text-slate-900">
              <span className="text-[#099BE9] font-bold">It becomes:</span>
              <div className="text-slate-950 font-bold text-sm mt-1">&ldquo;Can you engineer the system?&rdquo;</div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Empirical Evidence */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold">
            Empirical evidence supporting the shift:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: SWE-bench */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#099BE9]/10 text-[#099BE9] border border-[#099BE9]/20">
                    Agentic Benchmark
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-950 text-sm">
                  SWE-bench &amp; SWE-bench Verified
                  <sup className="ml-1">
                    <a href="#src-6" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[6]</a>
                    <a href="#src-7" className="text-[#099BE9] font-mono text-xs font-bold hover:underline ml-0.5">[7]</a>
                  </sup>
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Autonomous agents are evaluated on full GitHub repositories, issues, terminal tools, and execution environments — demonstrating that real engineering happens across multi-file architectures rather than isolated algorithm riddles.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] font-mono font-bold">
                <a
                  href="https://openai.com/index/introducing-swe-bench-verified/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#099BE9] hover:underline flex items-center gap-1"
                >
                  <span>OpenAI Verified</span> →
                </a>
                <a
                  href="https://www.swebench.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-950 hover:underline"
                >
                  swebench.com
                </a>
              </div>
            </div>

            {/* Pillar 2: HackerRank 2025 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#09C899]/10 text-[#0AA793] border border-[#09C899]/20">
                    Developer Research
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-950 text-sm">
                  HackerRank Skills Report
                  <sup className="ml-1">
                    <a href="#src-3" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[3]</a>
                    <a href="#src-4" className="text-[#099BE9] font-mono text-xs font-bold hover:underline ml-0.5">[4]</a>
                  </sup>
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Platform data spanning global developer surveys: <strong className="text-slate-950 font-bold">78%</strong> say traditional assessments don&apos;t align with real work, <strong className="text-slate-950 font-bold">66%</strong> prefer repository-level tasks, and <strong className="text-slate-950 font-bold">77%</strong> bail when questions don&apos;t reflect day-to-day engineering.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono font-bold">
                <a
                  href="https://www.hackerrank.com/reports/developer-skills-report-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0AA793] hover:underline flex items-center gap-1"
                >
                  <span>HackerRank 2025 Report</span> →
                </a>
              </div>
            </div>

            {/* Pillar 3: Stack Overflow AI 2025 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FBAE0C]/15 text-[#F78424] border border-[#FBAE0C]/30">
                    Industry Reality
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-950 text-sm">
                  Stack Overflow AI Survey
                  <sup className="ml-1">
                    <a href="#src-2" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[2]</a>
                    <a href="#src-5" className="text-[#099BE9] font-mono text-xs font-bold hover:underline ml-0.5">[5]</a>
                  </sup>
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  49,000+ developers surveyed: <strong className="text-slate-950 font-bold">82%</strong> report using AI tools, yet <strong className="text-slate-950 font-bold">66%</strong> report frustration with &ldquo;almost right&rdquo; code, and <strong className="text-slate-950 font-bold">46%</strong> distrust the accuracy of AI-generated output.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] font-mono font-bold">
                <a
                  href="https://survey.stackoverflow.co/2025/ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F78424] hover:underline flex items-center gap-1"
                >
                  <span>SO AI Survey</span> →
                </a>
                <a
                  href="https://survey.stackoverflow.co/2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-950 hover:underline"
                >
                  Main Survey
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. WHAT IS MISSING?                                            */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-bold">
            The Missing Layer
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            What Is Missing?
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-semibold mt-2 leading-relaxed">
            Computer science education gives us powerful abstractions.
          </p>
        </div>

        <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[#099BE9] font-bold uppercase">Data structures</span>
              <p className="text-slate-700 font-sans mt-1">Teach us how information can be organized.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[#0AA793] font-bold uppercase">Algorithms</span>
              <p className="text-slate-700 font-sans mt-1">Teach us how problems can be solved efficiently.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[#8647E2] font-bold uppercase">Complexity analysis</span>
              <p className="text-slate-700 font-sans mt-1">Teaches us how computation scales asymptotically.</p>
            </div>
          </div>

          <p className="font-semibold text-slate-950">
            These are fundamental. But there is another layer between an algorithm and a production system: <span className="text-slate-950 underline decoration-2 decoration-[#099BE9]">physical execution</span>.
          </p>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold">
              A real system runs against physical reality:
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
              {[
                "processes",
                "memory",
                "CPUs and cache hierarchies",
                "threads",
                "locks",
                "filesystems",
                "disks",
                "network sockets",
                "protocols",
                "failures",
                "resource limits",
                "latency",
                "concurrency",
                "observability",
                "deployment environments",
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-950">
            Understanding these interactions is systems thinking. ALGO is designed around this layer.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. DSA ≠ SYSTEMS ENGINEERING                                   */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#F78424]/15 text-[#F78424] border border-[#F78424]/30">
              Fundamental Boundary
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              // COMPUTATIONAL MODEL VS PHYSICAL RUNTIME
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-2">
            DSA ≠ Systems Engineering
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-2 leading-relaxed">
            This is not an argument against DSA. DSA remains foundational computer science. The distinction is what happens after the algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Traditional Algorithmic Exercise */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-mono font-bold text-slate-700 uppercase">
                <span>Traditional Algorithmic Exercise</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">OUTPUT CHECK</span>
              </div>
              <div className="font-mono text-xs text-slate-800 font-semibold p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5">
                <span>Problem</span>
                <span className="text-slate-400">→</span>
                <span>Algorithm</span>
                <span className="text-slate-400">→</span>
                <span>Code</span>
                <span className="text-slate-400">→</span>
                <span>Tests</span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-950 font-bold">Accepted</span>
              </div>
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase">The primary question:</span>
                <p className="text-sm font-bold text-slate-950 mt-1">
                  &ldquo;Did the program produce the expected output?&rdquo;
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium border-t border-slate-200 pt-3">
              Evaluates functional logic on synthetic inputs, but does not observe memory overhead, latency percentiles, or crash resilience.
            </p>
          </div>

          {/* Systems Engineering */}
          <div className="rounded-2xl border-2 border-[#09C899]/50 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono font-bold text-[#0AA793] uppercase">
                <span>Systems Engineering</span>
                <span className="px-2 py-0.5 rounded bg-[#09C899]/15 text-[#0AA793] text-[10px]">PHYSICAL REALITY</span>
              </div>
              <div className="font-mono text-xs text-slate-900 font-semibold p-3 bg-[#09C899]/5 rounded-xl border border-[#09C899]/20 flex flex-wrap items-center gap-1.5">
                <span>Architecture</span>
                <span className="text-slate-400">→</span>
                <span>Implementation</span>
                <span className="text-slate-400">→</span>
                <span>Failure</span>
                <span className="text-slate-400">→</span>
                <span>Concurrency</span>
                <span className="text-slate-400">→</span>
                <span>Measurement</span>
                <span className="text-slate-400">→</span>
                <span className="text-[#0AA793] font-bold">Optimization</span>
              </div>
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase">The questions become:</span>
                <ul className="text-xs text-slate-800 font-semibold space-y-1 mt-1 font-mono">
                  <li>• Does it survive?</li>
                  <li>• Does it scale?</li>
                  <li>• What happens when something crashes?</li>
                  <li>• Where is the bottleneck?</li>
                  <li>• How much memory does it consume?</li>
                  <li>• What happens when thousands of operations occur simultaneously?</li>
                  <li>• Can the performance improvement actually be measured?</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-slate-950 font-bold border-t border-slate-100 pt-3">
              That is a fundamentally different engineering surface.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. THE AGENTIC INFLECTION POINT                                */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            The Shift
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Agentic Inflection Point
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-2 leading-relaxed">
            AI does not eliminate the need to learn programming. It changes where programming skill creates leverage.
          </p>
        </div>

        <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed space-y-4">
          <p>
            An agent can increasingly handle implementation tasks:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 select-none space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-left">
                <div className="text-[10px] text-[#099BE9] font-bold uppercase tracking-wider">1. HUMAN</div>
                <div className="font-bold text-slate-950 text-sm">Objectives</div>
                <ul className="text-[11px] text-slate-600 font-sans space-y-1">
                  <li>• Defines objectives</li>
                  <li>• Establishes constraints</li>
                  <li>• Chooses architecture</li>
                  <li>• Directs agents</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-left">
                <div className="text-[10px] text-[#8647E2] font-bold uppercase tracking-wider">2. AGENT</div>
                <div className="font-bold text-slate-950 text-sm">Implementation</div>
                <ul className="text-[11px] text-slate-600 font-sans space-y-1">
                  <li>• Writes implementation</li>
                  <li>• Modifies files</li>
                  <li>• Runs commands</li>
                  <li>• Generates tests</li>
                  <li>• Iterates on failures</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-left">
                <div className="text-[10px] text-[#F78424] font-bold uppercase tracking-wider">3. SYSTEM</div>
                <div className="font-bold text-slate-950 text-sm">Physical Reality</div>
                <ul className="text-[11px] text-slate-600 font-sans space-y-1">
                  <li>• Executes on hardware</li>
                  <li>• Encounters concurrency</li>
                  <li>• Encounters failures</li>
                  <li>• Produces telemetry</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 shadow-sm space-y-1.5 text-left">
                <div className="text-[10px] text-[#09C899] font-bold uppercase tracking-wider">4. ENGINEER</div>
                <div className="font-bold text-white text-sm">Verification Loop</div>
                <ul className="text-[11px] text-slate-300 font-sans space-y-1">
                  <li>• Verifies correctness</li>
                  <li>• Profiles bottlenecks</li>
                  <li>• Diagnoses anomalies</li>
                  <li>• Redesigns hot paths</li>
                  <li>• Optimizes system</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-xs space-y-2">
            <div className="text-base sm:text-lg font-bold text-slate-950">
              The engineer increasingly becomes the system-level controller.
            </div>
            <div className="text-sm text-slate-700 font-medium space-y-1">
              <p>The important capability is not: <em className="text-slate-900 font-semibold">&ldquo;I personally typed every line.&rdquo;</em></p>
              <p>It is: <strong className="text-slate-950 font-bold">&ldquo;I understand what was built well enough to determine whether it is correct, safe, scalable, and efficient.&rdquo;</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. THE SYSTEMS ENGINEERING LOOP & 6-STAGE METHODOLOGY          */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-bold">
            Execution Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Systems Engineering Loop
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-2 leading-relaxed">
            ALGO turns that idea into a practical learning and evaluation loop.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs font-mono">
          {[
            {
              step: "1",
              name: "BUILD",
              tag: "Functional Baseline",
              desc: "Build the primitive from scratch. Understand its interface, protocol, state, and core mechanism.",
            },
            {
              step: "2",
              name: "UNDERSTAND",
              tag: "Under the API",
              desc: "Move beneath the API. Understand data structures, memory layout, OS primitives, and the execution model.",
            },
            {
              step: "3",
              name: "HARDEN",
              tag: "Fault Tolerance",
              desc: "Break the implementation. Introduce malformed input, corrupted state, process termination, and partial writes.",
            },
            {
              step: "4",
              name: "SCALE",
              tag: "Concurrency & Load",
              desc: "Increase the workload. Introduce concurrency, multiple workers, larger datasets, and resource pressure.",
            },
            {
              step: "5",
              name: "MEASURE",
              tag: "Stop Guessing",
              desc: "Stop guessing. Measure throughput, p50/p95/p99 latency, memory footprint, CPU utilization, and I/O.",
            },
            {
              step: "6",
              name: "OPTIMIZE",
              tag: "Architectural Redesign",
              desc: "Change the architecture. Identify the bottleneck, redesign the hot path, and prove the new architecture is faster.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-950 text-sm">
                  {item.step}. {item.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>
              <p className="text-slate-700 font-sans text-xs leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The ALGO Six-Stage Methodology Table */}
        <div className="space-y-3 pt-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold">
            The ALGO Six-Stage Progression Matrix:
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 sm:px-6 w-1/4">Stage</th>
                  <th className="py-3 px-4 sm:px-6 w-1/3">Question</th>
                  <th className="py-3 px-4 sm:px-6">What You Learn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800 font-mono text-xs">
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#099BE9]">L1 — BUILD</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-900 italic">Can you make it work?</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-sans">Interfaces, protocols, basic implementation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#099BE9]">L2 — CORE</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-900 italic">Do you understand the mechanism?</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-sans">Data structures, memory layout, algorithms</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#0AA793]">L3 — HARDEN</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-900 italic">Does it remain correct under failure?</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-sans">Recovery, invariants, edge cases</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#F78424]">L4 — SCALE</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-900 italic">Does it survive growth and concurrency?</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-sans">Parallelism, resource management, backpressure</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#8647E2]">L5 — MEASURE</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-900 italic">Can you explain its behavior?</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-sans">Profiling, telemetry, latency, throughput</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-950">L6 — OPTIMIZE</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-900 italic">Can you make it measurably better?</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 font-sans">Architecture, cache behavior, batching, zero-copy, lock reduction</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 pt-1">
            The goal is not simply to reach Accepted. The goal is to understand why the system behaves the way it does.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. THE 10 DIMENSIONS OF SYSTEMS THINKING                       */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            Architectural Invariants
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The 10 Dimensions of Systems Thinking
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            ALGO treats systems understanding as a collection of concrete engineering questions:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {[
            {
              num: "01",
              title: "State",
              q: "What exists? Where does it live? Who owns it? What is its lifecycle?",
            },
            {
              num: "02",
              title: "Boundaries",
              q: "Where does one component stop and another begin? What assumptions cross that boundary?",
            },
            {
              num: "03",
              title: "Protocols",
              q: "What exact bytes, messages, files, or APIs pass between components?",
            },
            {
              num: "04",
              title: "Invariants",
              q: "What must always remain true across every state transition?",
            },
            {
              num: "05",
              title: "Resources",
              q: "What happens when CPU, memory, disk, network, or file descriptors are exhausted?",
            },
            {
              num: "06",
              title: "Concurrency",
              q: "What happens when thousands of operations occur simultaneously?",
            },
            {
              num: "07",
              title: "Failure",
              q: "What happens when a process dies? After SIGKILL? After a partial write? When a node disappears?",
            },
            {
              num: "08",
              title: "Observability",
              q: "How do we know what the system is actually doing under real load?",
            },
            {
              num: "09",
              title: "Performance",
              q: "Where is time being spent? Lock contention? Cache misses? Memory allocations? Page faults? Disk I/O? Network I/O?",
            },
            {
              num: "10",
              title: "Trade-offs",
              q: "What are we giving up to gain something else? Throughput vs durability. Latency vs consistency. Memory vs CPU. Simplicity vs performance.",
            },
          ].map((dim) => (
            <div
              key={dim.num}
              className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-colors"
            >
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                {dim.num}
              </span>
              <div>
                <span className="font-bold text-slate-950 text-xs sm:text-sm">{dim.title}</span>
                <p className="text-slate-600 text-xs font-sans font-medium mt-1 leading-relaxed">
                  {dim.q}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FROM ALGORITHMS TO SYSTEMS                                  */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            The Abstraction Step
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            From Algorithms to Systems
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-semibold mt-2 leading-relaxed">
            Consider the difference:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-500 font-bold uppercase text-[10px]">A DSA problem asks:</span>
            <div className="text-slate-950 font-bold text-sm">
              &ldquo;Implement an LRU cache.&rdquo;
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Hash map + doubly linked list. Solved when the getter and setter pass unit tests.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#8647E2]/10 border border-[#8647E2]/30 space-y-2">
            <span className="text-[#8647E2] font-bold uppercase text-[10px]">A systems challenge asks:</span>
            <div className="text-slate-950 font-bold text-sm">
              &ldquo;Build a concurrent cache that respects a hard memory boundary...&rdquo;
            </div>
            <p className="text-slate-800 font-sans text-xs">
              Survives high thread contention, measures hit ratio and tail latency, and improves throughput through architectural changes.
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
          The underlying data structure still matters. But it is no longer the whole problem. The same progression appears throughout ALGO:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {[
            { algo: "Hash table", sys: "Cache architecture (Memcached, Redis)" },
            { algo: "Tree", sys: "Database index (B+ Tree, PostgreSQL, SQLite)" },
            { algo: "Graph", sys: "Consensus & Service discovery (Raft, Consul)" },
            { algo: "Queue", sys: "Message broker & Task scheduler (Kafka, Kubernetes)" },
            { algo: "Search algorithm", sys: "Search engine (Inverted index, BM25)" },
            { algo: "Nearest-neighbor algorithm", sys: "Vector database (HNSW, FAISS)" },
            { algo: "Attention mechanism", sys: "LLM inference engine (KV cache, PagedAttention)" },
            { algo: "JSON-RPC", sys: "Agent tool runtime (Model Context Protocol)" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-slate-600 font-bold">{item.algo}</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-950 font-bold text-right">{item.sys}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border-l-4 border-slate-900 text-slate-950 font-bold text-sm sm:text-base">
          The algorithm is the foundation. The system is the engineering problem.
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. THE 20-SYSTEM CURRICULUM & WHY BUILD THESE SYSTEMS          */}
      {/* ============================================================== */}
      <section className="space-y-8 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            The Master Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The 20-System Curriculum
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            ALGO moves progressively from operating-system primitives to distributed infrastructure and AI infrastructure:
          </p>
        </div>

        {/* 3 Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#099BE9] tracking-wider">
              01 — Core Systems (01–08)
            </div>
            <ol className="text-xs font-mono text-slate-800 space-y-1.5 list-decimal list-inside">
              <li>Unix Shell</li>
              <li>High-Concurrency HTTP Server</li>
              <li>Git Version Control Engine</li>
              <li>Key-Value Storage Engine</li>
              <li>Object Storage Engine</li>
              <li>High-Throughput In-Memory Cache</li>
              <li>B+ Tree Database Index</li>
              <li>Container Runtime / Sandbox</li>
            </ol>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#0AA793] tracking-wider">
              02 — Distributed Systems (09–16)
            </div>
            <ol className="text-xs font-mono text-slate-800 space-y-1.5 list-decimal list-inside" start={9}>
              <li>Distributed Commit Log &amp; Queue</li>
              <li>Columnar Log Analytics Engine</li>
              <li>Distributed Rate Limiter</li>
              <li>Reverse Proxy &amp; Load Balancer</li>
              <li>Distributed Task Scheduler</li>
              <li>Distributed Consensus / Raft</li>
              <li>Service Discovery &amp; DNS Registry</li>
              <li>Distributed Object Storage / EC</li>
            </ol>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#8647E2] tracking-wider">
              03 — AI Systems (17–20)
            </div>
            <ol className="text-xs font-mono text-slate-800 space-y-1.5 list-decimal list-inside" start={17}>
              <li>Full-Text Search Engine</li>
              <li>Vector Database / HNSW</li>
              <li>LLM Inference Engine / KV Cache</li>
              <li>MCP Runtime / Tool Execution</li>
            </ol>
          </div>
        </div>

        {/* Curriculum Trajectory */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Curriculum Trajectory:
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-950">
            <span>Operating Systems</span>
            <span className="text-slate-400">→</span>
            <span>Storage</span>
            <span className="text-slate-400">→</span>
            <span>Networking</span>
            <span className="text-slate-400">→</span>
            <span>Databases</span>
            <span className="text-slate-400">→</span>
            <span>Distributed Systems</span>
            <span className="text-slate-400">→</span>
            <span>AI Infrastructure</span>
            <span className="text-slate-400">→</span>
            <span className="text-[#8647E2]">Agent Infrastructure</span>
          </div>
        </div>

        {/* Why Build These Systems? */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xl font-bold text-slate-950">
            Why Build These Systems?
          </h3>
          <p className="text-base font-semibold text-slate-900 leading-relaxed">
            Because using a system and understanding a system are different skills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              • You can use <strong className="text-slate-950 font-bold">Git</strong> without knowing how its object database represents history.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              • You can use <strong className="text-slate-950 font-bold">Redis</strong> without understanding WALs and crash recovery.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              • You can use a <strong className="text-slate-950 font-bold">database</strong> without understanding pages, buffer pools, and B+ trees.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              • You can run <strong className="text-slate-950 font-bold">Docker</strong> without understanding namespaces, cgroups, and filesystem isolation.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              • You can use <strong className="text-slate-950 font-bold">Kafka</strong> without understanding commit logs and consumer offsets.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              • You can call an <strong className="text-slate-950 font-bold">LLM</strong> without understanding KV caching and continuous batching.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 sm:col-span-2">
              • You can use an <strong className="text-slate-950 font-bold">AI agent</strong> without understanding how tools are discovered, dispatched, isolated, and executed.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-xs space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold">
              ALGO asks the learner to cross that boundary:
            </div>
            <p className="text-lg font-extrabold text-slate-950">
              Don&apos;t just use the abstraction. Reconstruct the abstraction.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. THE PROVING GROUND & TELEMETRY CASE STUDY                  */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            Empirical Telemetry
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Proving Ground
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-2 leading-relaxed">
            Building the system is only the beginning. ALGO treats performance and reliability as empirical properties. A submission can be functionally correct and still be a poor system.
          </p>
        </div>

        {/* Submission A vs Submission B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Submission A */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-slate-900">
                Submission A — Initial Baseline
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#09C899]/10 text-[#0AA793] font-bold border border-[#09C899]/30">
                ACCEPTED
              </span>
            </div>

            <ul className="space-y-2 font-mono text-xs">
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-semibold">Correctness:</span>
                <span className="font-bold text-[#0AA793]">100% (24/24 tests)</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-semibold">Throughput:</span>
                <span className="font-bold text-slate-950">18,200 ops/s</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-semibold">P99 latency:</span>
                <span className="font-bold text-slate-950">2.8 ms</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-slate-600 font-semibold">Memory footprint:</span>
                <span className="font-bold text-slate-950">142 MB</span>
              </li>
            </ul>

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-800 font-medium leading-relaxed">
              It works. Accepted. But another architecture achieves 5x the throughput on the same hardware.
            </div>
          </div>

          {/* Submission B */}
          <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FBAE0C]" />
                  <span className="font-mono text-xs font-bold text-white">
                    Submission B — Optimized Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#099BE9]/20 text-[#099BE9] font-bold border border-[#099BE9]/40">
                  +403%
                </span>
              </div>

              <ul className="space-y-2 font-mono text-xs mt-3">
                <li className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300 font-medium">Correctness:</span>
                  <span className="font-semibold text-[#09C899]">100% crash-resilient</span>
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
              The gap came from profiling mutex contention and replacing coarse locks with 32 striped mutexes and lock-free ring buffers.
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-sm font-bold text-slate-950">
            The interesting question is no longer: &ldquo;Which code passed?&rdquo; It is: &ldquo;Why is B better?&rdquo;
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
            <span>Was it lock contention?</span>
            <span>Memory allocation?</span>
            <span>Cache locality?</span>
            <span>I/O?</span>
            <span>Data structure choice?</span>
            <span>Batching?</span>
            <span>Concurrency architecture?</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            That investigation is the engineering skill ALGO is designed to develop.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. AI IS ALLOWED & THE AGENTIC WORKFLOW                       */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#0AA793] font-bold">
            Evaluation Policy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            AI Is Allowed
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            ALGO does not attempt to determine whether a submission was written by a human or an AI. That is the wrong boundary.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-500">
            Use any tool you choose:
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono font-semibold">
            {[
              "ChatGPT",
              "Claude",
              "Gemini",
              "Copilot",
              "Cursor",
              "Windsurf",
              "coding agents",
              "custom agents",
              "your own tools",
            ].map((tool, idx) => (
              <span key={idx} className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                {tool}
              </span>
            ))}
          </div>
          <div className="pt-2 text-sm text-slate-900 font-bold">
            The question is not: <span className="text-slate-500">Human or AI?</span> The question is: <span className="text-[#0AA793]">Can you direct and verify the resulting system?</span>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            AI can help produce the implementation. ALGO evaluates what happens when that implementation meets architecture, hardware, concurrency, failure, resource constraints, and empirical measurement.
          </p>
        </div>

        {/* The Agentic Workflow Comparison */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-950">
            The Agentic Workflow
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            This produces a different engineering workflow:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-slate-600">Before AI</div>
              <div className="font-mono text-xs text-slate-800 space-y-1 font-medium">
                <div>Human → Understand problem</div>
                <div>→ Design</div>
                <div>→ Write code</div>
                <div>→ Test</div>
                <div>→ Deploy</div>
              </div>
            </div>

            <div className="p-5 rounded-xl border-2 border-[#8647E2]/40 bg-white shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-[#8647E2]">With Agents</div>
              <div className="font-mono text-xs text-slate-900 space-y-1 font-semibold">
                <div>Human → Define objective &amp; invariants</div>
                <div>→ Define constraints</div>
                <div>→ Direct agent</div>
                <div>→ Inspect implementation</div>
                <div>→ Execute &amp; Measure</div>
                <div>→ Diagnose &amp; Redesign</div>
                <div>→ Direct agent again</div>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-900 pt-1">
            This is not the end of programming. It is programming at a higher level of abstraction.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 12. THE CENTRAL QUESTION & ALGO'S POSITION                     */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            Architectural Stance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Central Question &amp; ALGO&apos;s Position
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            The emergence of coding agents forces a question for engineering education:
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-100 border-l-4 border-slate-900 text-slate-950 font-bold space-y-2">
          <p className="text-base sm:text-lg">
            &ldquo;If implementation can increasingly be delegated, what should engineers become exceptionally good at?&rdquo;
          </p>
          <p className="text-sm font-semibold text-slate-800">
            ALGO&apos;s answer is: <span className="text-slate-950 font-extrabold">Systems thinking.</span>
          </p>
          <p className="text-xs font-mono text-slate-600 font-medium">
            Not abstract architecture diagrams alone. Not memorizing interview patterns. Not simply generating code. But understanding the complete chain:
          </p>
          <div className="pt-1 font-mono text-xs text-slate-950 flex flex-wrap gap-1.5 font-extrabold">
            <span>Intent</span> → <span>Architecture</span> → <span>Protocol</span> → <span>State</span> → <span>Implementation</span> → <span>Execution</span> → <span>Failure</span> → <span>Measurement</span> → <span className="text-[#0AA793]">Optimization</span>
          </div>
        </div>

        {/* ALGO's Position in the Ecosystem */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-950">
            ALGO&apos;s Position in the Ecosystem
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            ALGO is not trying to replace DSA. It is not trying to replace LeetCode or HackerRank. And it is not simply another &ldquo;build Redis from scratch&rdquo; tutorial.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 sm:px-6 w-1/3">Platform Category</th>
                  <th className="py-3 px-4 sm:px-6">Primary Evaluation Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800 text-xs">
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">Algorithmic Assessment (LeetCode, HackerRank)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700">Can a candidate solve a defined computational problem?</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">Guided Systems Building (CodeCrafters)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-700">Teaches how real technologies work through structured stages.</td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td className="py-3.5 px-4 sm:px-6 font-extrabold text-slate-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
                    ALGO Proving Ground
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-950">
                    What happens when the system is subjected to measurable physical constraints? Making performance observable.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* From Pass/Fail to Proof */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-950">
            From Pass/Fail to Proof
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            Traditional assessment often ends at: <code className="font-mono font-bold text-[#0AA793]">Accepted ✓</code>. ALGO asks what happens next:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs flex flex-wrap items-center justify-between gap-2">
            <span>Accepted</span>
            <span className="text-slate-500">→</span>
            <span>Stress it</span>
            <span className="text-slate-500">→</span>
            <span>Break it</span>
            <span className="text-slate-500">→</span>
            <span>Measure it</span>
            <span className="text-slate-500">→</span>
            <span>Profile it</span>
            <span className="text-slate-500">→</span>
            <span>Optimize it</span>
            <span className="text-slate-500">→</span>
            <span className="text-[#099BE9] font-bold">Benchmark it again</span>
          </div>
          <p className="text-xs text-slate-600 font-semibold">
            The result is not merely a submission. It is an engineering experiment.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 13. WHAT THIS STANDS FOR & STATUS/VERIFICATION                 */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8647E2] font-bold">
            Perspective
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            What This Stands For
          </h2>
        </div>

        <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed space-y-4">
          <p>
            Software engineering is not becoming less important because AI can write code. The abstraction level is moving upward.
          </p>
          <p>
            The engineer of the future may write less code manually while being responsible for more system-level decisions.
          </p>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-sm">
            <p className="text-slate-700 font-medium">
              The ability to say: <em className="text-slate-950 font-semibold">&ldquo;This implementation looks correct&rdquo;</em> is useful.
            </p>
            <p className="text-slate-950 font-bold">
              The ability to say: <span className="text-[#099BE9]">&ldquo;I know why it is correct, I know where it will fail, I can measure the failure, and I know how to redesign it&rdquo;</span> is much more powerful.
            </p>
          </div>
          <p className="font-semibold text-slate-900">
            That is the capability ALGO is trying to develop.
          </p>
        </div>

        {/* Status & Verification */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold">
            Status &amp; Verification
          </div>
          <h3 className="text-xl font-bold text-slate-950">
            Where This Stands
          </h3>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            <p>
              ALGO is an early platform. The thesis is supported by the broader movement toward repository-level agentic benchmarks, increasing adoption of AI-assisted development, and growing recognition that traditional technical assessments are under pressure in an AI-driven engineering environment.
            </p>
            <p>
              However, the existence of this gap does not by itself prove that ALGO closes it. That must be demonstrated empirically.
            </p>
            <p className="font-bold text-slate-950">
              The strongest evidence will come from the platform itself: real users, real implementations, reproducible benchmarks, failure tests, performance measurements, optimization histories, and leaderboard data. As that evidence accumulates, this case study should evolve with it.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 14. FINAL THESIS                                               */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white shadow-xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#099BE9]/20 text-[#099BE9] border border-[#099BE9]/40">
              Final Thesis
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              AI is making code generation cheaper.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              Therefore, engineering education should place greater emphasis on the capability that remains difficult to delegate: <strong className="text-white">understanding and controlling systems</strong>.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2 text-sm sm:text-base font-mono">
            <div className="text-slate-400">ALGO is a proving ground for developing and measuring that capability.</div>
            <div className="text-white font-bold text-base sm:text-lg">Don&apos;t just learn to write the code. Learn what the system is doing.</div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono font-bold text-[#09C899]">
              Build it. Break it. Measure it. Optimize it.
            </div>
            <span className="text-xs font-mono text-slate-400 italic">Go curious.</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 15. DOCUMENTED SOURCES (FOOTNOTES)                             */}
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
              Stack Overflow 2025 Annual Developer Survey (
              <a href="https://survey.stackoverflow.co/2025/" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                survey.stackoverflow.co/2025
              </a>
              ) &amp; AI Section (
              <a href="https://survey.stackoverflow.co/2025/ai" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                survey.stackoverflow.co/2025/ai
              </a>
              ) — 49,000+ respondents; frustration with &ldquo;almost right&rdquo; solutions, time spent debugging, and distrust of AI output accuracy.
            </span>
          </li>
          <li id="src-6" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[6]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              SWE-bench — Evaluating Language Models on Real-World Software Engineering Issues (
              <a href="https://www.swebench.com/" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                swebench.com
              </a>
              ) — Benchmark evaluating autonomous AI agents on full GitHub repository issue resolution.
            </span>
          </li>
          <li id="src-7" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[7]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              OpenAI, &ldquo;Introducing SWE-bench Verified&rdquo; (
              <a href="https://openai.com/index/introducing-swe-bench-verified/" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                openai.com/index/introducing-swe-bench-verified
              </a>
              ) — Human-validated benchmark subset evaluating frontier models on multi-file repo engineering.
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
