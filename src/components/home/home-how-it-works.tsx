"use client";

import React from "react";
import { Terminal, ShieldCheck, Zap } from "lucide-react";

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

      {/* 3 Clean Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 group"
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

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-950 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Tags / Pills */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
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
