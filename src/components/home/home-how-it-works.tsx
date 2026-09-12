"use client";

import React from "react";
import { Terminal, ShieldCheck, Zap } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* 01. Non-Technical Abstract Diagram: Modular System Layers                   */
/* -------------------------------------------------------------------------- */
function AbstractSystemArchDiagram() {
  return (
    <div className="w-full h-36 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3 relative select-none overflow-hidden">
      {/* Subtle ambient grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:16px_16px]" />

      <svg viewBox="0 0 240 100" className="w-full h-full max-w-[220px] relative z-10" fill="none">
        {/* Central connecting vertical spine */}
        <line x1="120" y1="16" x2="120" y2="84" stroke="#099BE9" strokeWidth="2" strokeDasharray="3 3" strokeOpacity="0.4" />

        {/* Bottom Foundation Layer */}
        <g transform="translate(42, 66)">
          <rect width="156" height="20" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="16" cy="10" r="3.5" fill="#64748B" />
          <rect x="28" y="7" width="55" height="6" rx="3" fill="#E2E8F0" />
          <rect x="120" y="7" width="22" height="6" rx="3" fill="#F1F5F9" />
        </g>

        {/* Middle Core Layer (Floating & Highlighted) */}
        <g transform="translate(42, 38)">
          <rect width="156" height="20" rx="6" fill="#FFFFFF" stroke="#099BE9" strokeWidth="2" filter="drop-shadow(0 2px 5px rgba(9,155,233,0.14))" />
          <circle cx="16" cy="10" r="4" fill="#099BE9" />
          <rect x="28" y="7" width="70" height="6" rx="3" fill="#099BE9" fillOpacity="0.25" />
          <circle cx="132" cy="10" r="3" fill="#099BE9" />
          <circle cx="142" cy="10" r="3" fill="#09C899" />
        </g>

        {/* Top Interface Layer */}
        <g transform="translate(42, 10)">
          <rect width="156" height="20" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="16" cy="10" r="3.5" fill="#94A3B8" />
          <rect x="28" y="7" width="45" height="6" rx="3" fill="#E2E8F0" />
          <rect x="105" y="7" width="36" height="6" rx="3" fill="#F1F5F9" />
        </g>

        {/* Floating Side Connector Node */}
        <g transform="translate(204, 38)">
          <circle cx="10" cy="10" r="8" fill="#099BE9" fillOpacity="0.12" />
          <circle cx="10" cy="10" r="3.5" fill="#099BE9" />
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 02. Non-Technical Abstract Diagram: Isolated Protected Sandbox             */
/* -------------------------------------------------------------------------- */
function AbstractSandboxDiagram() {
  return (
    <div className="w-full h-36 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3 relative select-none overflow-hidden">
      {/* Subtle ambient grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:16px_16px]" />

      <svg viewBox="0 0 240 100" className="w-full h-full max-w-[220px] relative z-10" fill="none">
        {/* Outer Protective Perimeter (Dashed Sandbox Boundary) */}
        <rect x="20" y="10" width="200" height="80" rx="12" stroke="#09C899" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.5" />

        {/* Corner Protection Brackets */}
        <path d="M 28 18 L 24 18 A 4 4 0 0 0 20 22 L 20 26" stroke="#0AA793" strokeWidth="2" strokeLinecap="round" />
        <path d="M 212 18 L 216 18 A 4 4 0 0 1 220 22 L 220 26" stroke="#0AA793" strokeWidth="2" strokeLinecap="round" />
        <path d="M 28 82 L 24 82 A 4 4 0 0 1 20 78 L 20 74" stroke="#0AA793" strokeWidth="2" strokeLinecap="round" />
        <path d="M 212 82 L 216 82 A 4 4 0 0 0 220 78 L 220 74" stroke="#0AA793" strokeWidth="2" strokeLinecap="round" />

        {/* Inner Safe Execution Window */}
        <g transform="translate(42, 22)">
          <rect width="156" height="56" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))" />

          {/* Window Traffic Dots */}
          <circle cx="14" cy="12" r="2.5" fill="#EF4444" fillOpacity="0.8" />
          <circle cx="22" cy="12" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
          <circle cx="30" cy="12" r="2.5" fill="#09C899" fillOpacity="0.8" />

          {/* Abstract Skeleton Lines */}
          <rect x="14" y="22" width="60" height="4" rx="2" fill="#0AA793" fillOpacity="0.7" />
          <rect x="14" y="31" width="105" height="4" rx="2" fill="#E2E8F0" />
          <rect x="14" y="40" width="75" height="4" rx="2" fill="#E2E8F0" />

          {/* Protective Shield Badge */}
          <g transform="translate(122, 14)">
            <circle cx="14" cy="14" r="11" fill="#09C899" fillOpacity="0.12" />
            <path d="M 14 8 L 20 11 V 15 C 20 19 14 22 14 22 C 14 22 8 19 8 15 V 11 Z" fill="#09C899" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 03. Non-Technical Abstract Diagram: Soaring Acceleration Curve             */
/* -------------------------------------------------------------------------- */
function AbstractBenchmarkDiagram() {
  return (
    <div className="w-full h-36 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3 relative select-none overflow-hidden">
      {/* Subtle ambient grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:16px_16px]" />

      <svg viewBox="0 0 240 100" className="w-full h-full max-w-[220px] relative z-10" fill="none">
        {/* Ambient metric grid guidelines */}
        <line x1="25" y1="80" x2="215" y2="80" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="25" y1="52" x2="215" y2="52" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="25" y1="24" x2="215" y2="24" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

        {/* Baseline Path */}
        <path d="M 30 78 Q 75 74 105 68" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <circle cx="30" cy="78" r="3" fill="#94A3B8" />

        {/* Ascending Acceleration Curve */}
        <path
          d="M 30 78 Q 110 75, 150 45 T 205 18"
          stroke="url(#benchmark-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Shaded Glow Area Under Curve */}
        <path
          d="M 30 78 Q 110 75, 150 45 T 205 18 V 80 H 30 Z"
          fill="url(#area-gradient)"
        />

        {/* Milestone Progression Dots along the curve */}
        <circle cx="120" cy="66" r="3" fill="#8647E2" />
        <circle cx="165" cy="35" r="3.5" fill="#099BE9" />

        {/* Peak Star / Celebration Milestone */}
        <g transform="translate(205, 18)">
          <circle cx="0" cy="0" r="10" fill="#09C899" fillOpacity="0.2" />
          <circle cx="0" cy="0" r="4.5" fill="#09C899" />
          <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill="#FFFFFF" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="benchmark-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8647E2" />
            <stop offset="50%" stopColor="#099BE9" />
            <stop offset="100%" stopColor="#09C899" />
          </linearGradient>
          <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#09C899" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#09C899" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>
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
      tags: ["Isolated Sandbox", "Zero Frameworks", "Multi-Language"],
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
      tags: ["Bare-Metal Speed", "Crash Durability", "Leaderboard"],
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

      {/* 3 Clean Step Cards with Non-Technical Abstract Art */}
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

                {/* Pure Abstract Visual Art */}
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
