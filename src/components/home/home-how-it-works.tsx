"use client";

import React from "react";
import { Terminal, ShieldCheck, Zap } from "lucide-react";

function AbstractSystemArchDiagram() {
  return (
    <div className="w-full bg-slate-50/90 rounded-xl border border-slate-200/90 p-3 select-none">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-2.5 pb-1.5 border-b border-slate-200/70">
        <span className="font-bold text-slate-800 uppercase tracking-wider">// SYSTEM ARCHITECTURE</span>
        <span className="text-[#099BE9] font-bold">3 INVARIANTS</span>
      </div>

      {/* 3 Interconnected Minimalist Layer Nodes */}
      <div className="grid grid-cols-3 gap-2 items-center text-center">
        <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="text-[9px] font-mono font-bold text-slate-600 uppercase">Input</div>
          <div className="text-[11px] font-bold text-slate-900">Protocol</div>
          <div className="text-[8px] font-mono text-slate-600">RESP / RPC</div>
        </div>

        <div className="p-2 rounded-lg bg-white border-2 border-[#099BE9]/40 shadow-xs space-y-0.5 relative">
          <div className="absolute -top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#099BE9] animate-pulse" />
          <div className="text-[9px] font-mono font-bold text-[#099BE9] uppercase">Core</div>
          <div className="text-[11px] font-bold text-slate-950">Engine</div>
          <div className="text-[8px] font-mono text-slate-600">State / B+</div>
        </div>

        <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-0.5">
          <div className="text-[9px] font-mono font-bold text-slate-600 uppercase">Disk</div>
          <div className="text-[11px] font-bold text-slate-900">Durability</div>
          <div className="text-[8px] font-mono text-slate-600">WAL / Log</div>
        </div>
      </div>

      <div className="mt-2.5 pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[9px] font-mono text-slate-600">
        <span className="flex items-center gap-1 font-semibold text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9]"></span>
          First-Principles Architecture
        </span>
        <span className="font-semibold text-slate-800">Zero Dependencies</span>
      </div>
    </div>
  );
}

function AbstractSandboxDiagram() {
  return (
    <div className="w-full bg-slate-50/90 rounded-xl border border-slate-200/90 p-3 select-none">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-2 pb-1.5 border-b border-slate-200/70">
        <span className="font-bold text-slate-800 uppercase tracking-wider">// LINUX CGROUP SANDBOX</span>
        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0AA793]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-pulse" />
          ISOLATED
        </span>
      </div>

      <div className="space-y-2 font-mono text-[10px]">
        {/* Stream line */}
        <div className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between text-[10px]">
          <span className="text-slate-600">stdin: <strong className="text-slate-900">SET user:1 token</strong></span>
          <span className="text-[#0AA793] font-bold">stdout: OK</span>
        </div>

        {/* CGroup Limits */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] text-slate-600">
            <span>RAM: 42 MB / 64 MB</span>
            <span className="text-slate-800 font-semibold">65% quota</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#09C899] rounded-full" style={{ width: "65%" }} />
          </div>
        </div>
      </div>

      <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[9px] font-mono text-slate-600">
        <span>PID &amp; Mount Namespaces</span>
        <span className="text-slate-800 font-semibold">2s Hard Timeout</span>
      </div>
    </div>
  );
}

function AbstractBenchmarkDiagram() {
  return (
    <div className="w-full bg-slate-50/90 rounded-xl border border-slate-200/90 p-3 select-none">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-2 pb-1.5 border-b border-slate-200/70">
        <span className="font-bold text-slate-800 uppercase tracking-wider">// EMPIRICAL TELEMETRY</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8647E2]/15 text-[#8647E2] border border-[#8647E2]/30">
          +403% SPEEDUP
        </span>
      </div>

      {/* Dual comparison bars */}
      <div className="space-y-2 font-mono">
        <div className="space-y-0.5">
          <div className="flex justify-between text-[9px] text-slate-600">
            <span>Initial (Single Mutex)</span>
            <span className="font-bold text-slate-800">18,200 ops/s</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-400 rounded-full" style={{ width: "20%" }} />
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex justify-between text-[9px] text-slate-600">
            <span>Optimized (Sharded Ring)</span>
            <span className="font-bold text-[#0AA793]">91,700 ops/s</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#09C899] rounded-full" style={{ width: "95%" }} />
          </div>
        </div>
      </div>

      <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[9px] font-mono text-slate-600">
        <span className="text-[#0AA793] font-semibold">p99: 0.34ms (-88%)</span>
        <span className="text-slate-800 font-bold">100% Crash Durability</span>
      </div>
    </div>
  );
}

export function HomeHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Pick a Real System",
      description:
        "Build key-value stores, Raft consensus, vector databases, and container runtimes from first principles.",
      icon: Terminal,
      color: "#099BE9",
      bgLight: "bg-[#099BE9]/10",
      borderColor: "border-[#099BE9]/20",
      diagram: <AbstractSystemArchDiagram />,
      tags: ["Key-Value Store", "Raft Consensus", "Vector DB"],
    },
    {
      num: "02",
      title: "Code in Linux Sandbox",
      description:
        "Write in C++, Python, Go, Rust, or Java. Execute over raw protocols inside isolated Linux cgroups.",
      icon: ShieldCheck,
      color: "#09C899",
      bgLight: "bg-[#09C899]/10",
      borderColor: "border-[#09C899]/20",
      diagram: <AbstractSandboxDiagram />,
      tags: ["Isolated cgroups", "Zero Frameworks", "POSIX I/O"],
    },
    {
      num: "03",
      title: "Benchmark & Prove",
      description:
        "Stress test with high concurrency and sudden crashes. Measure ops/s and p99 latency on bare metal.",
      icon: Zap,
      color: "#8647E2",
      bgLight: "bg-[#8647E2]/10",
      borderColor: "border-[#8647E2]/20",
      diagram: <AbstractBenchmarkDiagram />,
      tags: ["Bare-Metal ops/s", "p99 Latency", "Crash Durability"],
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Section Header - Minimal & Punchy */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          How ALGO Works
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Learn systems by building them.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          No multiple-choice quizzes or synthetic algorithm puzzles. Just real engineering against physical constraints.
        </p>
      </div>

      {/* 3 Clean Step Cards with Abstract Minimal Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm text-white shadow-xs"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.bgLight} border ${step.borderColor}`}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-950 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Abstract Minimal Artstyle Diagram */}
                <div className="pt-1">
                  {step.diagram}
                </div>
              </div>

              {/* Tags / Pills */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
