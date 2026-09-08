"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Cpu, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export function HomePillars() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          The Proving Ground Contract
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-3">
          How Systems Are Measured
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">
          Traditional competitive programming tests algorithm puzzles. ALGO benchmarks real-world infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Blue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#099BE9]/10 border border-[#099BE9]/30 flex items-center justify-center text-[#099BE9]">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            First-Principles Architecture
          </h3>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            Construct raw protocol tokenizers, lock-free ring buffers, WAL crash replay, and B-trees from scratch without external dependencies.
          </p>
        </div>

        {/* Pillar 2: Teal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#09C899]/10 border border-[#09C899]/30 flex items-center justify-center text-[#09C899]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            Bare-Metal Sandboxing
          </h3>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            Every submission executes inside isolated Linux kernel namespaces with strict CPU quotas, memory cgroups v2, and seccomp filters.
          </p>
        </div>

        {/* Pillar 3: Purple */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#8647E2]/10 border border-[#8647E2]/30 flex items-center justify-center text-[#8647E2]">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            Empirical Tail Latency
          </h3>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            We hammer your code with 100,000 concurrent operations to capture true p50, p90, and p99 tail latency under extreme contention.
          </p>
        </div>
      </div>

      {/* Clean Bottom Banner */}
      <div className="mt-12 rounded-2xl bg-slate-900 text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Begin with Challenge 01: Key-Value Engine
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-normal">
            Construct a high-throughput In-Memory Key-Value Storage Engine with WAL replay.
          </p>
        </div>

        <Link
          href="/challenges/kv-store/workspace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md transition-all active:scale-95 shrink-0"
        >
          <span>Enter Arena</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
