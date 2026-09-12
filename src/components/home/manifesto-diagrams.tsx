"use client";

import React from "react";

/**
 * Clean, Minimal, Abstract Black & White Systems Diagrams
 * Simple conceptual shapes, thin strokes, zero neon/dark clutter, high aesthetic clarity.
 */

// =====================================================================
// 1. ARCHITECTURE DIAGRAM: Boundary, Buffer & Engine
// =====================================================================
export function DiagramArchitecture() {
  return (
    <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-[10px] font-mono">
        <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          Boundary &amp; Buffer Layout
        </span>
        <span className="text-slate-700 font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-200/70 border border-slate-300">
          Invariants
        </span>
      </div>

      <svg
        viewBox="0 0 360 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Step 1: Protocol Header */}
        <rect
          x="10"
          y="16"
          width="85"
          height="32"
          rx="5"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <text x="52" y="32" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Protocol Header
        </text>
        <text x="52" y="42" fill="#64748B" fontSize="7.5" textAnchor="middle">
          Wire Format
        </text>

        {/* Arrow 1 */}
        <path d="M 95 32 L 125 32" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="125,29 131,32 125,35" fill="#0F172A" />

        {/* Step 2: In-Memory Buffer */}
        <rect
          x="133"
          y="16"
          width="95"
          height="32"
          rx="5"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <text x="180" y="32" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Memory Buffer
        </text>
        <text x="180" y="42" fill="#64748B" fontSize="7.5" textAnchor="middle">
          Bounded Queue
        </text>

        {/* Arrow 2 */}
        <path d="M 228 32 L 258 32" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="258,29 264,32 258,35" fill="#0F172A" />

        {/* Step 3: Storage Engine */}
        <rect
          x="266"
          y="16"
          width="84"
          height="32"
          rx="5"
          fill="#0F172A"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <text x="308" y="32" fill="#FFFFFF" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Storage State
        </text>
        <text x="308" y="42" fill="#CBD5E1" fontSize="7.5" textAnchor="middle">
          Page Layout
        </text>

        {/* Invariant Baseline Line */}
        <line x1="10" y1="58" x2="350" y2="58" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
        <text x="180" y="66" fill="#64748B" fontSize="7" textAnchor="middle">
          State Invariant: Zero Corruption Boundary
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 2. EMPIRICAL VERIFICATION DIAGRAM: Sandbox Stress & Recovery
// =====================================================================
export function DiagramEmpiricalVerification() {
  return (
    <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-[10px] font-mono">
        <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          Sandbox Stress &amp; Recovery
        </span>
        <span className="text-slate-700 font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-200/70 border border-slate-300">
          Crash-Safe
        </span>
      </div>

      <svg
        viewBox="0 0 360 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Outer Sandbox Frame */}
        <rect
          x="6"
          y="6"
          width="348"
          height="54"
          rx="6"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1"
          strokeDasharray="4 3"
        />

        {/* Node 1: Running System */}
        <rect
          x="16"
          y="17"
          width="90"
          height="32"
          rx="5"
          fill="#F8FAFC"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <text x="61" y="33" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Active System
        </text>
        <text x="61" y="43" fill="#64748B" fontSize="7.5" textAnchor="middle">
          Heavy Workload
        </text>

        {/* Arrow to Event */}
        <path d="M 106 33 L 132 33" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="132,30 138,33 132,36" fill="#0F172A" />

        {/* Node 2: Adversarial Interruption */}
        <rect
          x="140"
          y="17"
          width="95"
          height="32"
          rx="5"
          fill="#0F172A"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <text x="187" y="32" fill="#FFFFFF" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Fault Injection
        </text>
        <text x="187" y="42" fill="#94A3B8" fontSize="7.5" textAnchor="middle">
          Sudden Interruption
        </text>

        {/* Arrow to Recovery */}
        <path d="M 235 33 L 261 33" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="261,30 267,33 261,36" fill="#0F172A" />

        {/* Node 3: Replay & Integrity */}
        <rect
          x="269"
          y="17"
          width="75"
          height="32"
          rx="5"
          fill="#F8FAFC"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        <text x="306" y="32" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Recovery
        </text>
        <text x="306" y="42" fill="#64748B" fontSize="7.5" textAnchor="middle">
          State Intact
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 3. BOTTLENECK ISOLATION DIAGRAM: Clean Latency Curve
// =====================================================================
export function DiagramBottleneckIsolation() {
  return (
    <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-[10px] font-mono">
        <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          Latency Distribution &amp; Tail
        </span>
        <span className="text-slate-700 font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-200/70 border border-slate-300">
          Tail Profile
        </span>
      </div>

      <svg
        viewBox="0 0 360 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Baseline Axis */}
        <line x1="20" y1="52" x2="340" y2="52" stroke="#CBD5E1" strokeWidth="1" />

        {/* Minimal Latency Curve */}
        <path
          d="M 22 51 C 35 22, 50 14, 65 14 C 85 14, 110 38, 160 46 C 220 50, 270 51, 335 51"
          stroke="#0F172A"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Shaded Tail Area (p90 - p99) */}
        <path
          d="M 160 46 C 220 50, 270 51, 335 51 L 335 52 L 160 52 Z"
          fill="#E2E8F0"
        />

        {/* Markers */}
        <line x1="65" y1="14" x2="65" y2="52" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="65" cy="14" r="2.5" fill="#0F172A" />
        <text x="72" y="22" fill="#0F172A" fontSize="7.5" fontWeight="600">
          Median (Fast Path)
        </text>

        <line x1="240" y1="36" x2="240" y2="52" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="240" cy="50" r="2.5" fill="#0F172A" />

        {/* Bottleneck Label */}
        <rect
          x="200"
          y="14"
          width="130"
          height="18"
          rx="4"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1"
        />
        <text x="265" y="26" fill="#0F172A" fontSize="7.5" fontWeight="700" textAnchor="middle">
          Tail Bottleneck (Stall)
        </text>

        <text x="22" y="62" fill="#94A3B8" fontSize="7">
          Fast Requests
        </text>
        <text x="335" y="62" fill="#94A3B8" fontSize="7" textAnchor="end">
          Tail Latency (p99)
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 4. PERFORMANCE OPTIMIZATION DIAGRAM: Concurrency Scaling
// =====================================================================
export function DiagramPerformanceOptimization() {
  return (
    <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-[10px] font-mono">
        <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          Concurrency Throughput
        </span>
        <span className="text-slate-700 font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-200/70 border border-slate-300">
          Scaling
        </span>
      </div>

      <svg
        viewBox="0 0 360 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Baseline (Serial / Contended) */}
        <text x="12" y="14" fill="#64748B" fontSize="7.5">
          Single Queue (Serialized)
        </text>
        <rect
          x="12"
          y="18"
          width="336"
          height="12"
          rx="3"
          fill="#E2E8F0"
          stroke="#CBD5E1"
          strokeWidth="1"
        />
        <rect x="13" y="19" width="60" height="10" rx="2" fill="#0F172A" />
        <text x="43" y="27" fill="#FFFFFF" fontSize="6.5" textAnchor="middle">
          Single Thread
        </text>

        {/* Transition */}
        <path d="M 180 32 L 180 38" stroke="#94A3B8" strokeWidth="1" />
        <polygon points="178,38 180,41 182,38" fill="#94A3B8" />

        {/* Optimized (Parallel Shards) */}
        <text x="12" y="47" fill="#0F172A" fontSize="7.5" fontWeight="700">
          Partitioned Parallel Channels
        </text>

        <rect x="12" y="52" width="75" height="12" rx="3" fill="#0F172A" />
        <text x="49" y="61" fill="#FFFFFF" fontSize="6.5" textAnchor="middle">
          Channel 1
        </text>

        <rect x="95" y="52" width="75" height="12" rx="3" fill="#0F172A" />
        <text x="132" y="61" fill="#FFFFFF" fontSize="6.5" textAnchor="middle">
          Channel 2
        </text>

        <rect x="178" y="52" width="75" height="12" rx="3" fill="#0F172A" />
        <text x="215" y="61" fill="#FFFFFF" fontSize="6.5" textAnchor="middle">
          Channel 3
        </text>

        <rect x="261" y="52" width="87" height="12" rx="3" fill="#0F172A" />
        <text x="304" y="61" fill="#FFFFFF" fontSize="6.5" fontWeight="700" textAnchor="middle">
          +400% Scaling
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 5. SYSTEMS VERIFICATION LOOP: Clean Monochrome Flow
// =====================================================================
export function DiagramSystemsVerificationLoop() {
  return (
    <div className="w-full bg-slate-50 rounded-2xl p-5 border border-slate-200 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200 text-xs font-mono">
        <span className="text-slate-900 font-bold uppercase tracking-wider">
          The Two Testing Paradigms
        </span>
        <span className="text-slate-500 text-[11px]">
          [Evaluation Runtime Architecture]
        </span>
      </div>

      <svg
        viewBox="0 0 720 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[10px] font-mono"
      >
        {/* Track 1: Traditional Syntax Test */}
        <text x="10" y="18" fill="#64748B" fontSize="9" fontWeight="700">
          TRADITIONAL: OPEN-LOOP SYNTAX TEST
        </text>

        <rect x="10" y="26" width="130" height="28" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <text x="75" y="43" fill="#0F172A" fontSize="8.5" textAnchor="middle">
          Problem Input
        </text>

        <path d="M 140 40 L 175 40" stroke="#94A3B8" strokeWidth="1.2" />
        <polygon points="175,37 180,40 175,43" fill="#94A3B8" />

        <rect x="180" y="26" width="140" height="28" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <text x="250" y="43" fill="#0F172A" fontSize="8.5" textAnchor="middle">
          Function Output
        </text>

        <path d="M 320 40 L 355 40" stroke="#94A3B8" strokeWidth="1.2" />
        <polygon points="355,37 360,40 355,43" fill="#94A3B8" />

        <rect x="360" y="26" width="150" height="28" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <text x="435" y="43" fill="#0F172A" fontSize="8.5" textAnchor="middle">
          Assert Output
        </text>

        <path d="M 510 40 L 545 40" stroke="#94A3B8" strokeWidth="1.2" />
        <polygon points="545,37 550,40 545,43" fill="#94A3B8" />

        <rect x="550" y="26" width="160" height="28" rx="5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.2" />
        <text x="630" y="43" fill="#64748B" fontSize="8.5" fontWeight="600" textAnchor="middle">
          Accepted (End of Test)
        </text>

        {/* Track 2: ALGO Systems Verification Loop */}
        <text x="10" y="80" fill="#0F172A" fontSize="9" fontWeight="700">
          ALGO: CLOSED-LOOP SYSTEMS VERIFICATION
        </text>

        <rect x="10" y="88" width="125" height="34" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        <text x="72" y="103" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          01. System Engine
        </text>
        <text x="72" y="113" fill="#64748B" fontSize="7" textAnchor="middle">
          Built from Scratch
        </text>

        <path d="M 135 105 L 155 105" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="155,102 160,105 155,108" fill="#0F172A" />

        <rect x="160" y="88" width="125" height="34" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        <text x="222" y="103" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          02. Linux Sandbox
        </text>
        <text x="222" y="113" fill="#64748B" fontSize="7" textAnchor="middle">
          Real Container
        </text>

        <path d="M 285 105 L 305 105" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="305,102 310,105 305,108" fill="#0F172A" />

        <rect x="310" y="88" width="125" height="34" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        <text x="372" y="103" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          03. Stress &amp; Crash
        </text>
        <text x="372" y="113" fill="#64748B" fontSize="7" textAnchor="middle">
          100k ops &amp; SIGKILL
        </text>

        <path d="M 435 105 L 455 105" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="455,102 460,105 455,108" fill="#0F172A" />

        <rect x="460" y="88" width="125" height="34" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        <text x="522" y="103" fill="#0F172A" fontSize="8.5" fontWeight="700" textAnchor="middle">
          04. Telemetry
        </text>
        <text x="522" y="113" fill="#64748B" fontSize="7" textAnchor="middle">
          p99, Memory, Throughput
        </text>

        <path d="M 585 105 L 600 105" stroke="#0F172A" strokeWidth="1.2" />
        <polygon points="600,102 605,105 600,108" fill="#0F172A" />

        <rect x="605" y="88" width="105" height="34" rx="5" fill="#0F172A" stroke="#0F172A" strokeWidth="1.2" />
        <text x="657" y="103" fill="#FFFFFF" fontSize="8.5" fontWeight="700" textAnchor="middle">
          Optimization
        </text>
        <text x="657" y="113" fill="#CBD5E1" fontSize="7" textAnchor="middle">
          Verified Baseline
        </text>

        {/* Feedback Loop Arrow */}
        <path
          d="M 657 122 L 657 134 L 72 134 L 72 122"
          stroke="#0F172A"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <polygon points="69,125 72,122 75,125" fill="#0F172A" />
      </svg>
    </div>
  );
}

// =====================================================================
// 6. PROFILING TELEMETRY TIMELINES (Submission #1 vs Submission #5)
// =====================================================================
export function DiagramSubmissionOneTelemetry() {
  return (
    <div className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 font-mono text-[9px] select-none">
      <div className="flex justify-between text-slate-700 mb-1.5 font-semibold">
        <span>EXECUTION TIMELINE</span>
        <span className="text-slate-900 font-bold">78% Lock Wait</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">T0:</span>
          <div className="flex-1 h-2.5 rounded bg-slate-200 overflow-hidden flex">
            <div className="w-[22%] bg-slate-900 h-full" title="Compute" />
            <div className="w-[78%] bg-slate-300 h-full" title="Lock Wait" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">T1:</span>
          <div className="flex-1 h-2.5 rounded bg-slate-200 overflow-hidden flex">
            <div className="w-[78%] bg-slate-300 h-full" title="Lock Wait" />
            <div className="w-[22%] bg-slate-900 h-full" title="Compute" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200 text-[8.5px] text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-slate-900" /> Active Compute (22%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-slate-300" /> Mutex Lock Wait (78%)
        </span>
      </div>
    </div>
  );
}

export function DiagramSubmissionFiveTelemetry() {
  return (
    <div className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 font-mono text-[9px] select-none">
      <div className="flex justify-between text-slate-700 mb-1.5 font-semibold">
        <span>SHARDED EXECUTION TIMELINE</span>
        <span className="text-slate-900 font-bold">0% Lock Wait</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">S0..3:</span>
          <div className="flex-1 h-2.5 rounded bg-slate-200 overflow-hidden flex">
            <div className="w-[99%] bg-slate-900 h-full" title="Active Compute" />
            <div className="w-[1%] bg-slate-300 h-full" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">S4..7:</span>
          <div className="flex-1 h-2.5 rounded bg-slate-200 overflow-hidden flex">
            <div className="w-[99%] bg-slate-900 h-full" title="Active Compute" />
            <div className="w-[1%] bg-slate-300 h-full" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200 text-[8.5px] text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-slate-900" /> Parallel Compute (99%)
        </span>
        <span className="font-bold text-slate-900">+403% THROUGHPUT</span>
      </div>
    </div>
  );
}
