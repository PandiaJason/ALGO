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
          <div className="p-4 rounded-xl bg-slate-100 border-l-4 border-slate-900 text-slate-900 text-base sm:text-lg font-bold">
            That creates a new reality: if producing code becomes cheap, measuring code production becomes less useful.
          </div>
        </div>

        {/* 4 Core Competencies Grid */}
        <div className="pt-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
            The 4 engineering skills that actually matter:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
      </section>

      {/* ============================================================== */}
      {/* 2. EMPIRICAL EVIDENCE: THE THREE PILLARS                       */}
      {/* ============================================================== */}
      <section className="space-y-6 border-b border-slate-200/80 pb-14">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#099BE9] font-bold">
            Empirical Evidence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Three Pillars of Empirical Evidence
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            Three converging shifts in how software engineering is evaluated, built, and operated:
          </p>
        </div>

        {/* 3 Pillars Grid */}
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
                HackerRank 2025 Skills Report
                <sup className="ml-1">
                  <a href="#src-3" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[3]</a>
                  <a href="#src-4" className="text-[#099BE9] font-mono text-xs font-bold hover:underline ml-0.5">[4]</a>
                </sup>
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Platform data spanning 3M+ assessments and global developer surveys: <strong className="text-slate-950 font-bold">78%</strong> say traditional assessments don&apos;t align with real work, <strong className="text-slate-950 font-bold">66%</strong> prefer repository-level tasks, and <strong className="text-slate-950 font-bold">77%</strong> bail on assessments when questions don&apos;t match day-to-day engineering.
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
                Stack Overflow AI &amp; Agents Survey
                <sup className="ml-1">
                  <a href="#src-2" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[2]</a>
                  <a href="#src-5" className="text-[#099BE9] font-mono text-xs font-bold hover:underline ml-0.5">[5]</a>
                </sup>
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                49,000+ developers surveyed: <strong className="text-slate-950 font-bold">82%</strong> use AI tools, yet <strong className="text-slate-950 font-bold">66%</strong> report frustration with &ldquo;almost right&rdquo; code, and <strong className="text-slate-950 font-bold">46%</strong> distrust AI output accuracy. Developers consistently resist delegating high-stakes system duties like deployment, monitoring, and architecture.
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

        {/* The Measurable Gap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-2">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
            The Measurable Gap
          </h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            This isn&apos;t evidence that LeetCode or HackerRank are useless — they solved interview whiteboarding at scale. It&apos;s evidence that <strong className="text-slate-950 font-bold">the industry itself recognizes a measurable divergence</strong> between isolated algorithm puzzles and actual engineering work. As code production becomes commoditized by AI, evaluating syntax generation becomes an obsolete proxy for engineering ability.
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SYSTEMS THINKING IN THE AGENTIC WORKFLOW ERA                */}
      {/* ============================================================== */}
      <section className="space-y-8 border-b border-slate-200/80 pb-14">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#8647E2]/15 text-[#8647E2] border border-[#8647E2]/30">
              Core Thesis
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              // ARCHITECTURAL DIRECTION
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-2">
            Systems Thinking in the Agentic Workflow Era
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-bold mt-2 leading-relaxed">
            As AI makes software implementation cheaper, systems understanding becomes more valuable.
          </p>
        </div>

        <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed space-y-4">
          <p>
            The rise of agentic workflows changes more than how software is written. It changes where engineering judgment matters.
          </p>
          <p>
            An AI agent can increasingly generate functions, implement APIs, write tests, refactor code, configure infrastructure, and operate across repositories. As implementation becomes delegatable, the engineer&apos;s responsibility moves upward — from producing individual pieces of code to understanding, directing, verifying, and evolving the system as a whole.
          </p>
          <div className="p-4 rounded-xl bg-slate-100 border-l-4 border-[#8647E2] text-slate-950 font-bold">
            This makes systems thinking the foundational engineering capability of the AI era.
          </div>
        </div>

        {/* From Code Generation to System Direction (Workflow Comparison) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
            From Code Generation to System Direction
          </h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            The difference is fundamental: the engineer is no longer necessarily the person typing every line. The engineer is responsible for ensuring that the system produced by humans and agents actually satisfies its architectural invariants and physical constraints.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 uppercase">
                <span>Traditional Software Workflow</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">LINEAR</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-slate-700 font-medium">
                <div className="p-2 bg-white rounded border border-slate-200">1. Understand the problem</div>
                <div className="p-2 bg-white rounded border border-slate-200">2. Design the solution</div>
                <div className="p-2 bg-white rounded border border-slate-200">3. Write the code</div>
                <div className="p-2 bg-white rounded border border-slate-200">4. Test the code</div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#8647E2]/40 bg-white p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#8647E2] uppercase">
                <span>Agentic Systems Workflow</span>
                <span className="px-1.5 py-0.5 rounded bg-[#8647E2]/15 text-[#8647E2] text-[10px]">GOVERNED LOOP</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-slate-900 font-semibold">
                <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">1. Define objective &amp; establish invariants</div>
                <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">2. Direct agents &amp; inspect system behavior</div>
                <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">3. Verify empirically in container sandboxes</div>
                <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">4. Redesign architecture &amp; optimize hot paths</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Engineer as a System-Level Controller */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
            The Engineer as a System-Level Controller
          </h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            In an agentic workflow, the engineer operates as a control layer between human intent and physical hardware:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 select-none space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">1. INTENT</div>
                <div className="font-bold text-slate-950 text-xs sm:text-sm">Human Intent</div>
                <div className="text-[11px] text-slate-600 font-sans font-medium">Objectives &amp; boundaries</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">2. BLUEPRINT</div>
                <div className="font-bold text-slate-950 text-xs sm:text-sm">Architecture</div>
                <div className="text-[11px] text-slate-600 font-sans font-medium">Invariants &amp; protocols</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">3. DELEGATION</div>
                <div className="font-bold text-slate-950 text-xs sm:text-sm">Agentic Code</div>
                <div className="text-[11px] text-slate-600 font-sans font-medium">AI implementation</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">4. SUBSTRATE</div>
                <div className="font-bold text-slate-950 text-xs sm:text-sm">Physical Reality</div>
                <div className="text-[11px] text-slate-600 font-sans font-medium">Hardware sandbox &amp; I/O</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-700 text-center">
              <span className="font-bold text-slate-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                Closed Control Loop:
              </span>
              <span className="text-slate-600 text-[11px]">
                Telemetry &amp; Evidence ──▶ Engineering Judgment ──▶ Architectural Optimization
              </span>
            </div>
          </div>
        </div>

        {/* The 10 Invariant Dimensions */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
              The 10 Invariant Dimensions of Systems Thinking
            </h3>
            <p className="text-sm text-slate-700 font-medium leading-relaxed mt-1">
              Systems thinking is not drawing abstract whiteboard boxes. It is understanding how software behaves under physical constraints. When agents write code, these 10 dimensions are precisely where unguided implementations break down:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {[
              { title: "State", q: "What exists, where does it live, and who owns its lifecycle?" },
              { title: "Boundaries", q: "Where does one component stop and another begin?" },
              { title: "Protocols", q: "What exact bytes and formats pass between components?" },
              { title: "Invariants", q: "What properties must unconditionally remain true?" },
              { title: "Resources", q: "What happens when CPU, memory, storage, or sockets saturate?" },
              { title: "Concurrency", q: "What happens when thousands of operations occur simultaneously?" },
              { title: "Failure", q: "What happens when a process dies abruptly, writes interrupt, or disks fill?" },
              { title: "Observability", q: "How do we empirically know what the system is actually doing?" },
              { title: "Performance", q: "Where is the bottleneck (lock wait, page faults, CPU cache misses)?" },
              { title: "Trade-offs", q: "What are we sacrificing when we optimize throughput over durability?" },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-950 text-xs">{item.title}</span>
                  <p className="text-slate-600 text-[11px] font-sans font-medium mt-0.5">
                    {item.q}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            An agent can generate syntactically valid code that passes isolated unit tests while still being <strong className="text-slate-950 font-bold">vulnerable to race conditions</strong>, <strong className="text-slate-950 font-bold">inefficient under lock contention</strong>, <strong className="text-slate-950 font-bold">fragile upon unexpected SIGKILL</strong>, or <strong className="text-slate-950 font-bold">wasteful in memory</strong>. Systems thinking is what catches what syntax tests miss.
          </div>
        </div>

        {/* DSA ≠ Systems Thinking */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#099BE9]/15 text-[#099BE9] border border-[#099BE9]/30">
              Core Distinction
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              // COMPUTATIONAL COMPLEXITY VS PHYSICAL EXECUTION
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            DSA ≠ Systems Thinking
          </h3>

          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            <strong className="text-slate-950 font-bold">DSA is not obsolete.</strong> Data structures and algorithms teach computational complexity, asymptotic notation, and abstract data relationships. That remains a necessary foundation of computer science.
          </p>

          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            However, knowing how to balance a red-black tree or traverse a graph does not teach you how software actually runs against physical hardware:
          </p>

          {/* Pipeline comparison */}
          <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              The Systems Execution Horizon:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-950">
              <span>Processes</span>
              <span className="text-slate-400">→</span>
              <span>Memory</span>
              <span className="text-slate-400">→</span>
              <span>Concurrency</span>
              <span className="text-slate-400">→</span>
              <span>Storage</span>
              <span className="text-slate-400">→</span>
              <span>Networking</span>
              <span className="text-slate-400">→</span>
              <span>Protocols</span>
              <span className="text-slate-400">→</span>
              <span>Failure</span>
              <span className="text-slate-400">→</span>
              <span>Observability</span>
              <span className="text-slate-400">→</span>
              <span>Performance</span>
              <span className="text-slate-400">→</span>
              <span className="text-[#0AA793]">System Evolution</span>
            </div>
          </div>

          {/* The Definitive Educational Question */}
          <div className="p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
              The Definitive Question of the AI Era:
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-950">
              &ldquo;Can you engineer a system when implementation itself can be delegated?&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-800 font-medium space-y-2">
              <p>
                We do not need to stop learning to code. We need to stop treating isolated code generation as the terminal goal of software engineering education.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono font-bold">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  Code is still the medium.
                </span>
                <span className="text-[#0AA793] px-2.5 py-1 rounded-md bg-[#09C899]/15 border border-[#09C899]/30">
                  Systems understanding is the capability above it.
                </span>
              </div>
            </div>
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
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Traditional coding platforms
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                  SYNTAX TEST
                </span>
              </div>
              <ol className="space-y-2.5 font-mono text-xs text-slate-800 font-medium mt-4">
                <li className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">1.</span>
                  <span>Read synthetic problem description</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">2.</span>
                  <span>Write a function in an isolated file</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">3.</span>
                  <span>Run against hidden input/output test arrays</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-slate-400 font-bold">4.</span>
                  <span>Binary Accepted checkmark → Next question</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-slate-700 font-medium border-t border-slate-200 pt-3">
              Binary pass/fail. Tests memorization, but ignores concurrency, memory bloat, and crash resilience.
            </p>
          </div>

          {/* ALGO Proving Ground Loop */}
          <div className="rounded-2xl border-2 border-[#09C899]/50 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0AA793]">
                  The ALGO Proving Ground loop
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#09C899]/15 text-[#0AA793] border border-[#09C899]/30">
                  EMPIRICAL SYSTEMS
                </span>
              </div>
              <ol className="space-y-2.5 font-mono text-xs mt-4">
                <li className="p-3 rounded-xl bg-[#099BE9]/5 border border-[#099BE9]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#099BE9]">1.</span>
                  <span>Build the real system from scratch (protocols, storage, state)</span>
                </li>
                <li className="p-3 rounded-xl bg-[#09C899]/5 border border-[#09C899]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#0AA793]">2.</span>
                  <span>Run it inside an isolated Linux container sandbox</span>
                </li>
                <li className="p-3 rounded-xl bg-[#FBAE0C]/5 border border-[#FBAE0C]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#F78424]">3.</span>
                  <span>Stress test with high concurrency, crashes, and heavy load</span>
                </li>
                <li className="p-3 rounded-xl bg-[#8647E2]/5 border border-[#8647E2]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#8647E2]">4.</span>
                  <span>Optimize hot paths and verify speedup on the live leaderboard</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-slate-800 font-semibold border-t border-slate-100 pt-3">
              A real engineering loop: measure performance, find bottlenecks, and prove speedups with telemetry.
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-slate-900">
                Submission #1 — Initial Implementation
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#09C899]/10 text-[#0AA793] font-bold border border-[#09C899]/30">
                ACCEPTED
              </span>
            </div>

            <ul className="space-y-2 font-mono text-xs">
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-semibold">Correctness:</span>
                <span className="font-bold text-[#0AA793]">100% (24/24 tests passed)</span>
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
              It works. Accepted. But ALGO doesn&apos;t stop there — the leaderboard shows someone else at 74K ops/sec.
            </div>
          </div>

          {/* Optimized Engine */}
          <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FBAE0C]" />
                  <span className="font-mono text-xs font-bold text-white">
                    Submission #5 — Optimized Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#099BE9]/20 text-[#099BE9] font-bold border border-[#099BE9]/40">
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
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm text-center">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs font-bold text-slate-950">
              Human + AI
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
            <span className="sm:hidden text-slate-500 font-bold">↓</span>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs font-bold text-slate-950">
              System Architecture
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
            <span className="sm:hidden text-slate-500 font-bold">↓</span>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs font-bold text-slate-950">
              Physical Reality
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
            <span className="sm:hidden text-slate-500 font-bold">↓</span>
            <div className="bg-slate-900 text-white border border-slate-800 rounded-xl px-4 py-3 shadow-sm font-bold">
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#F78424] font-bold">
            Ecosystem Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Competitive Landscape
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-bold uppercase text-[11px]">
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
                  <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
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
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2.5">
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

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2.5">
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

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2.5">
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

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
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

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
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
          <li id="src-8" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[8]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              CodeCrafters (
              <a href="https://codecrafters.io" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                codecrafters.io
              </a>
              ) — &ldquo;Build Your Own Redis, Git &amp; SQLite From Scratch&rdquo;; stage-based challenges used by engineers at Google, OpenAI, and Vercel.
            </span>
          </li>
          <li id="src-9" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[9]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              Karat, &ldquo;Engineering Interview Trends in 2026&rdquo; (
              <a href="https://karat.com/engineering-interview-trends-2026" target="_blank" rel="noopener noreferrer" className="text-[#099BE9] hover:underline font-mono text-xs">
                karat.com/engineering-interview-trends-2026
              </a>
              ) — survey of 400 engineering leaders across the U.S., India, and China.
            </span>
          </li>
          <li id="src-10" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[10]</span>
            <span className="font-sans font-medium text-slate-800 leading-relaxed">
              IEEE-USA InSight, &ldquo;Three Ways AI is Reshaping Traditional Technical Interviews in 2026&rdquo; — survey of 67 FAANG and startup interviewers, citing Karat&apos;s underlying data.
            </span>
          </li>
          <li id="src-11" className="pt-3 flex items-start gap-2.5">
            <span className="font-bold text-slate-400 shrink-0">[11]</span>
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
