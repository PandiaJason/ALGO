"use client";

import React from "react";

/**
 * Minimal Essential Abstract Diagrams for ALGO Proving Ground Thesis
 * Clean vector strokes, monospace typography, zero emojis, high-density systems visuals.
 */

// =====================================================================
// 1. ARCHITECTURE DIAGRAM: Byte Protocol & Memory Invariant Layout
// =====================================================================
export function DiagramArchitecture() {
  return (
    <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 shadow-inner overflow-hidden select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9] animate-pulse" />
          PROTOCOL SPEC &amp; MEMORY LAYOUT
        </span>
        <span className="text-[#099BE9] font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#099BE9]/10 border border-[#099BE9]/20">
          64-BIT ALIGNED
        </span>
      </div>

      <svg
        viewBox="0 0 380 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Memory Offset Header Line */}
        <text x="4" y="10" fill="#64748B" fontSize="8" fontWeight="600">
          OFFSET:
        </text>
        <text x="52" y="10" fill="#64748B" fontSize="8">
          0x00
        </text>
        <text x="112" y="10" fill="#64748B" fontSize="8">
          0x04
        </text>
        <text x="162" y="10" fill="#64748B" fontSize="8">
          0x06
        </text>
        <text x="212" y="10" fill="#64748B" fontSize="8">
          0x08
        </text>
        <text x="312" y="10" fill="#64748B" fontSize="8">
          0x88
        </text>

        {/* Byte Stream Bar */}
        {/* Magic 4B */}
        <rect
          x="50"
          y="16"
          width="58"
          height="24"
          rx="4"
          fill="#099BE9"
          fillOpacity="0.15"
          stroke="#099BE9"
          strokeWidth="1.2"
        />
        <text x="79" y="31" fill="#E2E8F0" fontSize="8.5" fontWeight="700" textAnchor="middle">
          MAGIC 4B
        </text>

        {/* Opcode 2B */}
        <rect
          x="112"
          y="16"
          width="46"
          height="24"
          rx="4"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <text x="135" y="31" fill="#CBD5E1" fontSize="8.5" fontWeight="600" textAnchor="middle">
          OP 2B
        </text>

        {/* Length 2B */}
        <rect
          x="162"
          y="16"
          width="46"
          height="24"
          rx="4"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <text x="185" y="31" fill="#CBD5E1" fontSize="8.5" fontWeight="600" textAnchor="middle">
          LEN 2B
        </text>

        {/* Payload Slice */}
        <rect
          x="212"
          y="16"
          width="96"
          height="24"
          rx="4"
          fill="#099BE9"
          fillOpacity="0.08"
          stroke="#099BE9"
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />
        <text x="260" y="31" fill="#38BDF8" fontSize="8.5" fontWeight="700" textAnchor="middle">
          PAYLOAD (128B)
        </text>

        {/* CRC32 */}
        <rect
          x="312"
          y="16"
          width="60"
          height="24"
          rx="4"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="1.2"
        />
        <text x="342" y="31" fill="#94A3B8" fontSize="8.5" fontWeight="600" textAnchor="middle">
          CRC32 4B
        </text>

        {/* Flow Connectors */}
        <path
          d="M 79 40 L 79 56 L 150 56"
          stroke="#099BE9"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
        <circle cx="150" cy="56" r="2" fill="#099BE9" />

        <path
          d="M 260 40 L 260 56 L 200 56"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
        <circle cx="200" cy="56" r="2" fill="#38BDF8" />

        {/* Memory Boundary Layer Box */}
        <rect
          x="50"
          y="62"
          width="155"
          height="24"
          rx="4"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="1.2"
        />
        <text x="58" y="77" fill="#94A3B8" fontSize="8">
          RING WAL: <tspan fill="#38BDF8" fontWeight="700">64MB LOCKLESS</tspan>
        </text>

        <rect
          x="215"
          y="62"
          width="157"
          height="24"
          rx="4"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="1.2"
        />
        <text x="223" y="77" fill="#94A3B8" fontSize="8">
          SLOTTED PAGE: <tspan fill="#38BDF8" fontWeight="700">4KB FRAMES</tspan>
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 2. EMPIRICAL VERIFICATION DIAGRAM: Sandbox & SIGKILL Invariant
// =====================================================================
export function DiagramEmpiricalVerification() {
  return (
    <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 shadow-inner overflow-hidden select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-pulse" />
          LINUX SANDBOX &amp; FAULT INJECTION
        </span>
        <span className="text-[#09C899] font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#09C899]/10 border border-[#09C899]/20">
          NSJAIL CGROUP-V2
        </span>
      </div>

      <svg
        viewBox="0 0 380 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Sandbox Boundary (Dashed Container) */}
        <rect
          x="8"
          y="6"
          width="364"
          height="80"
          rx="6"
          fill="#020617"
          stroke="#1E293B"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        {/* Running Worker Node */}
        <rect
          x="20"
          y="20"
          width="96"
          height="32"
          rx="4"
          fill="#064E3B"
          fillOpacity="0.3"
          stroke="#059669"
          strokeWidth="1.2"
        />
        <text x="68" y="34" fill="#6EE7B7" fontSize="8.5" fontWeight="700" textAnchor="middle">
          WORKER PID 2841
        </text>
        <text x="68" y="46" fill="#A7F3D0" fontSize="7.5" textAnchor="middle">
          100k ops/s stream
        </text>

        {/* Process Connector Arrow */}
        <path d="M 116 36 L 146 36" stroke="#475569" strokeWidth="1.5" />
        <polygon points="146,33 152,36 146,39" fill="#475569" />

        {/* Chaos / Fault Injection Node */}
        <rect
          x="154"
          y="20"
          width="100"
          height="32"
          rx="4"
          fill="#450A0A"
          fillOpacity="0.4"
          stroke="#DC2626"
          strokeWidth="1.2"
        />
        <text x="204" y="33" fill="#FCA5A5" fontSize="8" fontWeight="700" textAnchor="middle">
          ⚡ SIGKILL @ t+42ms
        </text>
        <text x="204" y="45" fill="#EF4444" fontSize="7.5" textAnchor="middle">
          Sudden Power Sever
        </text>

        {/* Chaos to Recovery Connector Arrow */}
        <path d="M 254 36 L 278 36" stroke="#09C899" strokeWidth="1.5" />
        <polygon points="278,33 284,36 278,39" fill="#09C899" />

        {/* Verified Recovery Node */}
        <rect
          x="286"
          y="20"
          width="76"
          height="32"
          rx="4"
          fill="#064E3B"
          fillOpacity="0.4"
          stroke="#09C899"
          strokeWidth="1.2"
        />
        <text x="324" y="33" fill="#34D399" fontSize="8" fontWeight="700" textAnchor="middle">
          WAL REPLAY
        </text>
        <text x="324" y="45" fill="#A7F3D0" fontSize="7.5" textAnchor="middle">
          0 Byte Loss
        </text>

        {/* Invariant Status Verification Footer */}
        <path d="M 68 52 L 68 70 L 120 70" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M 324 52 L 324 70 L 260 70" stroke="#09C899" strokeWidth="1" strokeDasharray="2 2" />

        <rect
          x="122"
          y="61"
          width="136"
          height="18"
          rx="3"
          fill="#0F172A"
          stroke="#09C899"
          strokeWidth="1"
        />
        <text x="190" y="73" fill="#34D399" fontSize="8" fontWeight="700" textAnchor="middle">
          ✓ INVARIANT: CRASH-SAFE
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 3. BOTTLENECK ISOLATION DIAGRAM: Tail Latency Curve & Mutex Hotspot
// =====================================================================
export function DiagramBottleneckIsolation() {
  return (
    <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 shadow-inner overflow-hidden select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F78424] animate-pulse" />
          TAIL LATENCY &amp; CONTENTION PROFILE
        </span>
        <span className="text-[#F78424] font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#F78424]/10 border border-[#F78424]/20">
          p99 TAIL HOTSPOT
        </span>
      </div>

      <svg
        viewBox="0 0 380 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        <defs>
          <linearGradient id="latencyGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#09C899" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#F78424" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#EF4444" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Coordinate Grid Lines */}
        <line x1="30" y1="74" x2="360" y2="74" stroke="#334155" strokeWidth="1" />
        <line x1="30" y1="14" x2="30" y2="74" stroke="#334155" strokeWidth="1" />

        {/* Latency Axis Labels */}
        <text x="32" y="85" fill="#64748B" fontSize="7.5">
          0.1ms (p50)
        </text>
        <text x="140" y="85" fill="#64748B" fontSize="7.5">
          0.5ms (p90)
        </text>
        <text x="270" y="85" fill="#F78424" fontSize="7.5" fontWeight="700">
          2.80ms (p99)
        </text>

        {/* Latency Distribution Curve (Smooth Kernel Density) */}
        <path
          d="M 32 73 C 45 30, 60 16, 75 16 C 95 16, 120 48, 160 58 C 210 66, 260 70, 350 73"
          stroke="#F78424"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Area under tail (p90 to p99) */}
        <path
          d="M 160 58 C 210 66, 260 70, 350 73 L 350 74 L 160 74 Z"
          fill="url(#latencyGradient)"
        />

        {/* p50 Marker */}
        <line x1="75" y1="16" x2="75" y2="74" stroke="#09C899" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="75" cy="16" r="2.5" fill="#09C899" />
        <text x="82" y="24" fill="#34D399" fontSize="8" fontWeight="600">
          p50: 0.12ms
        </text>

        {/* p99 Hotspot Indicator */}
        <line x1="270" y1="42" x2="270" y2="74" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="270" cy="71" r="2.5" fill="#EF4444" />

        {/* Hotspot Box */}
        <rect
          x="200"
          y="20"
          width="155"
          height="24"
          rx="4"
          fill="#1C1917"
          stroke="#F78424"
          strokeWidth="1.2"
        />
        <text x="277" y="31" fill="#FDBA74" fontSize="8" fontWeight="700" textAnchor="middle">
          HOTSPOT: pthread_mutex_lock
        </text>
        <text x="277" y="40" fill="#F97316" fontSize="7" textAnchor="middle">
          78.4% CPU time waiting on futex
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 4. PERFORMANCE OPTIMIZATION DIAGRAM: Lock-Free Sharding & Scaling
// =====================================================================
export function DiagramPerformanceOptimization() {
  return (
    <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 shadow-inner overflow-hidden select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2] animate-pulse" />
          LOCK-FREE RING SHARDING
        </span>
        <span className="text-[#A855F7] font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#8647E2]/10 border border-[#8647E2]/20 font-bold">
          +403% SPEEDUP
        </span>
      </div>

      <svg
        viewBox="0 0 380 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[9px] font-mono"
      >
        {/* Baseline (Single Mutex - Blocked) */}
        <text x="12" y="16" fill="#94A3B8" fontSize="8" fontWeight="600">
          BASELINE (GLOBAL MUTEX):
        </text>
        <rect
          x="14"
          y="22"
          width="350"
          height="14"
          rx="3"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1"
        />
        {/* Active slice */}
        <rect x="15" y="23" width="70" height="12" rx="2" fill="#099BE9" fillOpacity="0.4" />
        <text x="50" y="32" fill="#E2E8F0" fontSize="7.5" textAnchor="middle">
          Core 0 (Active)
        </text>
        {/* Contended slices */}
        <rect x="88" y="23" width="274" height="12" rx="2" fill="#450A0A" fillOpacity="0.6" />
        <text x="225" y="32" fill="#FCA5A5" fontSize="7.5" fontWeight="600" textAnchor="middle">
          Cores 1..15 BLOCKED ON LOCK (18,200 ops/s)
        </text>

        {/* Separator / Evolution Line */}
        <path d="M 189 40 L 189 48" stroke="#8647E2" strokeWidth="1.2" strokeDasharray="2 2" />
        <polygon points="187,48 189,52 191,48" fill="#8647E2" />

        {/* Optimized 4-Track Sharded Ring Buffer */}
        <text x="12" y="56" fill="#C084FC" fontSize="8" fontWeight="700">
          RE-ARCHITECTED (16-WAY STRIPED SHARDS):
        </text>

        {/* Track 0 */}
        <rect x="14" y="62" width="78" height="14" rx="3" fill="#3B0764" stroke="#8647E2" strokeWidth="1" />
        <text x="53" y="72" fill="#E9D5FF" fontSize="7.5" fontWeight="600" textAnchor="middle">
          Shard 0 (Zero-Copy)
        </text>

        {/* Track 1 */}
        <rect x="98" y="62" width="78" height="14" rx="3" fill="#3B0764" stroke="#8647E2" strokeWidth="1" />
        <text x="137" y="72" fill="#E9D5FF" fontSize="7.5" fontWeight="600" textAnchor="middle">
          Shard 1 (Lock-Free)
        </text>

        {/* Track 2 */}
        <rect x="182" y="62" width="78" height="14" rx="3" fill="#3B0764" stroke="#8647E2" strokeWidth="1" />
        <text x="221" y="72" fill="#E9D5FF" fontSize="7.5" fontWeight="600" textAnchor="middle">
          Shard 2 (CAS Ring)
        </text>

        {/* Track 3 */}
        <rect x="266" y="62" width="98" height="14" rx="3" fill="#3B0764" stroke="#8647E2" strokeWidth="1" />
        <text x="315" y="72" fill="#A855F7" fontSize="7.5" fontWeight="700" textAnchor="middle">
          91,700 ops/s (+403%)
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 5. SYSTEMS VERIFICATION LOOP: Abstract Closed-Loop Architecture
// =====================================================================
export function DiagramSystemsVerificationLoop() {
  return (
    <div className="w-full bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xl overflow-hidden select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#09C899] animate-pulse" />
          <span className="text-white font-bold tracking-wider">
            SYSTEMS ARCHITECTURE LOOP: STATIC VS. EMPIRICAL
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">
          [Evaluation Runtime Architecture]
        </span>
      </div>

      <svg
        viewBox="0 0 740 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[10px] font-mono"
      >
        {/* ------------------------------------------------------------- */}
        {/* PATH A: TRADITIONAL SYNTAX TEST (OPEN-LOOP / LINEAR)          */}
        {/* ------------------------------------------------------------- */}
        <text x="12" y="24" fill="#94A3B8" fontSize="9.5" fontWeight="700">
          A. TRADITIONAL CODE ASSESSMENT (OPEN-LOOP / ZERO HARDWARE INTERACTION)
        </text>

        {/* Node 1: Synthetic Array */}
        <rect x="14" y="34" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
        <text x="79" y="49" fill="#E2E8F0" fontSize="9" fontWeight="600" textAnchor="middle">
          Synthetic Input
        </text>
        <text x="79" y="60" fill="#64748B" fontSize="8" textAnchor="middle">
          nums = [2, 7, 11, 15]
        </text>

        <path d="M 144 51 L 180 51" stroke="#475569" strokeWidth="1.5" />
        <polygon points="180,48 186,51 180,54" fill="#475569" />

        {/* Node 2: Isolated Function */}
        <rect x="186" y="34" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
        <text x="251" y="49" fill="#E2E8F0" fontSize="9" fontWeight="600" textAnchor="middle">
          Pure Function
        </text>
        <text x="251" y="60" fill="#64748B" fontSize="8" textAnchor="middle">
          twoSum(nums, 9)
        </text>

        <path d="M 316 51 L 352 51" stroke="#475569" strokeWidth="1.5" />
        <polygon points="352,48 358,51 352,54" fill="#475569" />

        {/* Node 3: Assert Equal */}
        <rect x="358" y="34" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
        <text x="423" y="49" fill="#E2E8F0" fontSize="9" fontWeight="600" textAnchor="middle">
          Assert Output
        </text>
        <text x="423" y="60" fill="#64748B" fontSize="8" textAnchor="middle">
          expect([0, 1]) == [0, 1]
        </text>

        <path d="M 488 51 L 524 51" stroke="#475569" strokeWidth="1.5" />
        <polygon points="524,48 530,51 524,54" fill="#475569" />

        {/* Node 4: Static Stop */}
        <rect x="530" y="34" width="196" height="34" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
        <text x="628" y="49" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">
          PASS ✓ (DEAD END)
        </text>
        <text x="628" y="60" fill="#64748B" fontSize="8" textAnchor="middle">
          No hardware telemetry • Stops at syntax
        </text>

        {/* ------------------------------------------------------------- */}
        {/* PATH B: ALGO SYSTEMS PROVING GROUND (CLOSED-LOOP EMPIRICAL)    */}
        {/* ------------------------------------------------------------- */}
        <text x="12" y="104" fill="#09C899" fontSize="9.5" fontWeight="700">
          B. ALGO PROVING GROUND (CLOSED-LOOP / HARDWARE CONCURRENCY &amp; PROFILING)
        </text>

        {/* Node 1: Raw Protocol */}
        <rect x="14" y="114" width="125" height="42" rx="6" fill="#064E3B" fillOpacity="0.25" stroke="#059669" strokeWidth="1.2" />
        <text x="76" y="131" fill="#A7F3D0" fontSize="9" fontWeight="700" textAnchor="middle">
          01. Raw Protocol
        </text>
        <text x="76" y="145" fill="#6EE7B7" fontSize="7.5" textAnchor="middle">
          Engine from Scratch
        </text>

        <path d="M 139 135 L 160 135" stroke="#09C899" strokeWidth="1.5" />
        <polygon points="160,132 166,135 160,138" fill="#09C899" />

        {/* Node 2: Linux Sandbox */}
        <rect x="166" y="114" width="125" height="42" rx="6" fill="#082F49" fillOpacity="0.3" stroke="#0284C7" strokeWidth="1.2" />
        <text x="228" y="131" fill="#BAE6FD" fontSize="9" fontWeight="700" textAnchor="middle">
          02. Linux Sandbox
        </text>
        <text x="228" y="145" fill="#7DD3FC" fontSize="7.5" textAnchor="middle">
          nsjail + cgroups-v2
        </text>

        <path d="M 291 135 L 312 135" stroke="#099BE9" strokeWidth="1.5" />
        <polygon points="312,132 318,135 312,138" fill="#099BE9" />

        {/* Node 3: Stress & SIGKILL */}
        <rect x="318" y="114" width="130" height="42" rx="6" fill="#451A03" fillOpacity="0.35" stroke="#D97706" strokeWidth="1.2" />
        <text x="383" y="131" fill="#FDE68A" fontSize="9" fontWeight="700" textAnchor="middle">
          03. Fuzz &amp; SIGKILL
        </text>
        <text x="383" y="145" fill="#FCD34D" fontSize="7.5" textAnchor="middle">
          100k ops / sudden cut
        </text>

        <path d="M 448 135 L 469 135" stroke="#F78424" strokeWidth="1.5" />
        <polygon points="469,132 475,135 469,138" fill="#F78424" />

        {/* Node 4: Telemetry & Profiling */}
        <rect x="475" y="114" width="135" height="42" rx="6" fill="#3B0764" fillOpacity="0.35" stroke="#9333EA" strokeWidth="1.2" />
        <text x="542" y="131" fill="#F3E8FF" fontSize="9" fontWeight="700" textAnchor="middle">
          04. Profile Latency
        </text>
        <text x="542" y="145" fill="#D8B4FE" fontSize="7.5" textAnchor="middle">
          p99, ops/s, lock waits
        </text>

        {/* Node 5: Feedback / Leaderboard Speedup */}
        <rect x="625" y="114" width="101" height="42" rx="6" fill="#064E3B" fillOpacity="0.4" stroke="#09C899" strokeWidth="1.2" />
        <text x="675" y="131" fill="#6EE7B7" fontSize="9" fontWeight="700" textAnchor="middle">
          +403% SPEEDUP
        </text>
        <text x="675" y="145" fill="#34D399" fontSize="7.5" textAnchor="middle">
          Verified Baseline
        </text>

        {/* Continuous Loop Arrow Returning to Node 1 */}
        <path
          d="M 610 135 L 625 135"
          stroke="#9333EA"
          strokeWidth="1.5"
        />
        <path
          d="M 675 156 L 675 172 L 76 172 L 76 156"
          stroke="#09C899"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <polygon points="73,160 76,156 79,160" fill="#09C899" />
        <text x="375" y="170" fill="#34D399" fontSize="8" fontWeight="600" textAnchor="middle">
          ↺ CONTINUOUS FEEDBACK LOOP: RE-ARCHITECT HOT PATHS &amp; SHARDED BUFFERS
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 6. PROFILING TELEMETRY TIMELINES (Submission #1 vs Submission #5)
// =====================================================================
export function DiagramSubmissionOneTelemetry() {
  return (
    <div className="w-full bg-slate-900 rounded-lg p-2.5 border border-slate-800 font-mono text-[9px] select-none">
      <div className="flex justify-between text-slate-400 mb-1.5 font-semibold">
        <span>THREAD EXECUTION TIMELINE</span>
        <span className="text-[#F78424]">78.4% LOCK STALL</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">T0:</span>
          <div className="flex-1 h-3 rounded bg-slate-800 overflow-hidden flex">
            <div className="w-[22%] bg-[#099BE9] h-full" title="Active Compute" />
            <div className="w-[78%] bg-[#F78424]/80 h-full" title="Contention Lock Wait" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">T1:</span>
          <div className="flex-1 h-3 rounded bg-slate-800 overflow-hidden flex">
            <div className="w-[78%] bg-[#F78424]/80 h-full" title="Contention Lock Wait" />
            <div className="w-[22%] bg-[#099BE9] h-full" title="Active Compute" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[8.5px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#099BE9]" /> Compute (22%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#F78424]" /> Mutex Wait (78%)
        </span>
      </div>
    </div>
  );
}

export function DiagramSubmissionFiveTelemetry() {
  return (
    <div className="w-full bg-slate-900 rounded-lg p-2.5 border border-slate-800 font-mono text-[9px] select-none">
      <div className="flex justify-between text-slate-400 mb-1.5 font-semibold">
        <span>STRIPED SHARD EXECUTION TIMELINE</span>
        <span className="text-[#09C899]">0.02% LOCK WAIT</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">S0..3:</span>
          <div className="flex-1 h-3 rounded bg-slate-800 overflow-hidden flex">
            <div className="w-[98%] bg-[#09C899] h-full" title="Parallel Shard Work" />
            <div className="w-[2%] bg-slate-700 h-full" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-slate-500 text-[8px]">S4..7:</span>
          <div className="flex-1 h-3 rounded bg-slate-800 overflow-hidden flex">
            <div className="w-[99%] bg-[#09C899] h-full" title="Parallel Shard Work" />
            <div className="w-[1%] bg-slate-700 h-full" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[8.5px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#09C899]" /> Lock-Free Compute (99%)
        </span>
        <span className="text-[#09C899] font-bold">+403% THROUGHPUT</span>
      </div>
    </div>
  );
}
