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

        {/* HackerRank Bail Out Blog Callout */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            <span>Research Citation Note</span>
            <sup className="text-[#099BE9] font-mono text-xs font-bold">[4]</sup>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            Separately, in HackerRank&apos;s blog post <strong className="text-slate-950 font-bold">&ldquo;Why Do Developers Bail on Assessments?&rdquo;</strong>,{" "}
            <strong className="text-slate-950 font-bold">77%</strong> of surveyed developers say most assessments don&apos;t align with the skills required for their role — a related but distinct data point from a different piece of HackerRank research, cited here as its own source rather than folded into the report stat above.
          </p>
        </div>

        {/* The Measurable Gap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-2">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#099BE9]" />
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
          <span className="text-xs font-mono uppercase tracking-wider text-[#F78424] font-bold">
            The Agentic Inflection Point
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            The Agentic Inflection Point
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
            Traditional coding assessment asks: <em className="font-bold text-slate-950 font-serif">&ldquo;Can you produce the solution?&rdquo;</em> But now an AI can often produce a solution outright.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-slate-700 font-bold tracking-wider">
              From Stack Overflow&apos;s 2025 Developer &amp; AI Survey (49,000+ respondents):
              <sup className="ml-1">
                <a href="#src-5" className="text-[#099BE9] font-mono text-xs font-bold hover:underline">[5]</a>
              </sup>
            </span>
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

        {/* ============================================================== */}
        {/* SYSTEMS THINKING IN THE AGENTIC WORKFLOW ERA                   */}
        {/* ============================================================== */}
        <div className="space-y-8 pt-4">
          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#8647E2]/15 text-[#8647E2] border border-[#8647E2]/30">
                Core Thesis
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                // ARCHITECTURAL DIRECTION
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 mt-2">
              Systems Thinking in the Agentic Workflow Era
            </h3>
            <p className="text-base sm:text-lg text-slate-800 font-bold mt-2 leading-relaxed">
              As AI makes software implementation cheaper, systems understanding becomes more valuable.
            </p>
          </div>

          <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed space-y-4">
            <p>
              The rise of agentic workflows changes more than how software is written. It changes where engineering judgment matters.
            </p>
            <p>
              An AI agent can increasingly generate functions, implement APIs, write tests, refactor code, configure infrastructure, and even operate across an entire development workflow. As implementation becomes increasingly delegatable, the engineer&apos;s responsibility moves upward — from producing individual pieces of code to understanding, directing, verifying, and evolving the system as a whole.
            </p>
            <div className="p-4 rounded-xl bg-slate-100 border-l-4 border-[#8647E2] text-slate-950 font-bold">
              This makes systems thinking a first-class engineering skill.
            </div>
          </div>

          {/* From Code Generation to System Direction */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
              From Code Generation to System Direction
            </h4>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              The difference is fundamental: the engineer is no longer necessarily the person writing every line. The engineer becomes the person responsible for ensuring that the system produced by humans and agents actually satisfies its intended properties.
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
                  <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">1. Define objective &amp; establish constraints</div>
                  <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">2. Direct agents &amp; inspect system behavior</div>
                  <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">3. Verify empirically &amp; diagnose failures</div>
                  <div className="p-2 bg-[#8647E2]/5 rounded border border-[#8647E2]/20">4. Redesign architecture &amp; optimize hot paths</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Systems Understanding Becomes More Valuable */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
              Why Systems Understanding Becomes More Valuable
            </h4>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              An agent can generate a technically valid implementation while still producing a system that is fundamentally broken in production. Code generation does not eliminate these failure modes — it can make them easier to create at greater speed:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              {[
                { title: "Architecturally Inconsistent", desc: "Violates subsystem boundaries and state invariants" },
                { title: "Vulnerable to Race Conditions", desc: "Subtle atomicity hazards under concurrent execution" },
                { title: "Inefficient Under Concurrency", desc: "Global lock contention and thread synchronization stalls" },
                { title: "Wasteful in Memory", desc: "Unbounded buffer growth, memory leaks, and GC thrash" },
                { title: "Fragile Under Partial Failure", desc: "Data corruption or hanging connections upon SIGKILL" },
                { title: "Difficult to Observe", desc: "Missing telemetry, opaque state machines, and silent errors" },
                { title: "Impossible to Scale Economically", desc: "Quadratic complexity and unmetered resource exhaustion" },
                { title: "Solving the Wrong Problem", desc: "Syntactically green but functionally divergent from reality" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="font-bold text-rose-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans font-medium pl-3">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              Therefore, the scarce capability shifts from <strong className="text-slate-950 font-mono font-bold">&ldquo;Can you write the code?&rdquo;</strong> toward:{" "}
              <strong className="text-slate-950 font-mono font-bold text-[#0AA793]">
                &ldquo;Do you understand the system well enough to direct an agent to build the right thing, recognize when it is wrong, and determine how to make it better?&rdquo;
              </strong>
            </div>
          </div>

          {/* The Engineer as a System-Level Controller */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
              The Engineer as a System-Level Controller
            </h4>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              In an agentic workflow, the engineer increasingly operates as a control layer between intent and physical reality:
            </p>

            <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 font-mono text-xs shadow-inner">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">INTENT</div>
                  <div className="font-bold text-white text-xs">Human Intent</div>
                  <div className="text-[10px] text-slate-500">System goals &amp; boundaries</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[#099BE9] font-bold uppercase">BLUEPRINT</div>
                  <div className="font-bold text-white text-xs">Architecture</div>
                  <div className="text-[10px] text-slate-500">Invariants &amp; protocols</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[#F78424] font-bold uppercase">DELEGATION</div>
                  <div className="font-bold text-white text-xs">Agentic Code</div>
                  <div className="text-[10px] text-slate-500">Accelerated implementation</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[#09C899] font-bold uppercase">SUBSTRATE</div>
                  <div className="font-bold text-white text-xs">Real Environment</div>
                  <div className="text-[10px] text-slate-500">Linux kernel, CPU, I/O</div>
                </div>
              </div>

              <div className="flex items-center justify-center my-3 text-slate-500 font-mono text-xs font-semibold">
                <span>↓ Telemetry &amp; Evidence Feedback Loop ↓</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">METRICS</div>
                  <div className="font-bold text-white text-xs">Telemetry Data</div>
                  <div className="text-[10px] text-slate-500">p99 latency, ops/s, mem</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">CONTROL</div>
                  <div className="font-bold text-white text-xs">Engineering Judgment</div>
                  <div className="text-[10px] text-slate-500">Diagnosing root causes</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">REFACTOR</div>
                  <div className="font-bold text-white text-xs">Correction</div>
                  <div className="text-[10px] text-slate-500">Architectural iteration</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#064E3B]/60 border border-[#09C899]/50 space-y-1">
                  <div className="text-[10px] text-[#34D399] font-bold uppercase">SCALE</div>
                  <div className="font-bold text-white text-xs">Optimization</div>
                  <div className="text-[10px] text-emerald-300">Verified benchmark gain</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-medium text-center mt-3 pt-3 border-t border-slate-800/80">
                The agent accelerates implementation. The engineer provides the mental model, invariants, evaluation criteria, and corrective decisions.
              </p>
            </div>
          </div>

          {/* Systems Thinking Is Not Just System Design */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
              Systems Thinking Is Not Just System Design
            </h4>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              Systems thinking should not be reduced to drawing boxes and arrows in an interview. It means understanding how a system behaves as a collection of interacting components under constraints:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { title: "State", q: "What exists, where does it live, and who owns it?" },
                { title: "Boundaries", q: "Where does one component stop and another begin?" },
                { title: "Protocols", q: "What exact bytes and formats pass between components?" },
                { title: "Invariants", q: "What properties must unconditionally remain true?" },
                { title: "Resources", q: "What happens when CPU, memory, storage, bandwidth, or connections saturate?" },
                { title: "Concurrency", q: "What happens when thousands of operations occur simultaneously?" },
                { title: "Failure", q: "What happens when a process dies, a write is interrupted, or a dependency fails?" },
                { title: "Observability", q: "How do we empirically know what the system is actually doing?" },
                { title: "Performance", q: "Where is the bottleneck, and what telemetry proves it?" },
                { title: "Trade-offs", q: "What are we sacrificing when we optimize one property?" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-2.5">
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

            <p className="text-xs sm:text-sm text-slate-700 font-medium pt-1">
              This is fundamentally different from knowing a programming language or memorizing an algorithm.
            </p>
          </div>

          {/* Agents Increase the Value of Engineering Judgment */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
              Agents Increase the Value of Engineering Judgment
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium leading-relaxed space-y-2">
              <p className="text-slate-950 font-bold font-mono text-xs uppercase tracking-wider text-[#8647E2]">
                The Paradox of the Agentic Era:
              </p>
              <p className="text-base font-bold text-slate-950">
                The better AI becomes at writing software, the more important it becomes to understand software as a system.
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                If an engineer cannot reason about architecture, failure modes, resource constraints, performance, and correctness, giving that engineer a more powerful coding agent does not produce a better system. It simply produces software faster.
              </p>
            </div>

            {/* Pipeline Comparison */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs space-y-3">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Competency Progression:
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
                <div className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 line-through">
                  Problem → Code → Pass
                </div>
                <span className="text-slate-400 font-bold sm:inline hidden">──▶</span>
                <span className="text-slate-400 font-bold sm:hidden">↓</span>
                <div className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[#09C899]/10 border border-[#09C899]/30 text-[#0AA793] font-bold">
                  Specification → Architecture → Delegation → Verification → Diagnosis → Optimization
                </div>
              </div>
            </div>
          </div>

          {/* The New Engineering Question Callout */}
          <div className="rounded-2xl border-2 border-[#099BE9]/40 bg-white p-6 shadow-sm space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#099BE9]">
              The New Engineering Question
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
              The important question of the agentic era is not <span className="font-mono text-slate-600">&ldquo;Can you code without AI?&rdquo;</span> nor is it simply <span className="font-mono text-slate-600">&ldquo;Can you code with AI?&rdquo;</span>
            </h4>
            <p className="text-sm sm:text-base font-bold text-slate-950 bg-[#099BE9]/10 p-3.5 rounded-xl border border-[#099BE9]/20 font-mono">
              &ldquo;Can you engineer a system when implementation itself can be delegated?&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              That requires understanding not only how to produce software, but why the system is structured the way it is, what must remain true, how it can fail, how its behavior can be measured, and how evidence should change the architecture.
            </p>
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-500 font-semibold">AI can produce the implementation.</span>
              <span className="text-[#0AA793] font-bold">Systems thinking determines whether the implementation deserves to exist.</span>
            </div>
          </div>
        </div>

        {/* The Re-definition of skill Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
            The Re-Definition of Skill
          </h3>
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
                  <span>Write function in isolated namespace</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
                  <span className="text-slate-400 font-bold">3.</span>
                  <span>Run against hidden input/output arrays</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-slate-400 font-bold">4.</span>
                  <span>Binary Accepted checkmark → next question</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-slate-700 font-medium border-t border-slate-200 pt-3">
              Binary pass/fail. Tests memorization; ignores concurrency, I/O bottlenecks, and hardware durability.
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
                  <span>Build raw protocol, core architecture &amp; engine from scratch</span>
                </li>
                <li className="p-3 rounded-xl bg-[#09C899]/5 border border-[#09C899]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#0AA793]">2.</span>
                  <span>Run inside an isolated Linux container sandbox</span>
                </li>
                <li className="p-3 rounded-xl bg-[#FBAE0C]/5 border border-[#FBAE0C]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#F78424]">3.</span>
                  <span>Hammer with high-concurrency load, SIGKILL, and contention scenarios</span>
                </li>
                <li className="p-3 rounded-xl bg-[#8647E2]/5 border border-[#8647E2]/20 flex items-center gap-2.5 text-slate-950 font-bold">
                  <span className="text-[#8647E2]">4.</span>
                  <span>Optimize hot paths and verify speedup on the leaderboard</span>
                </li>
              </ol>
            </div>
            <p className="text-xs text-slate-800 font-semibold border-t border-slate-100 pt-3">
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
