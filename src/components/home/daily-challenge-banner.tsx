"use client";

import React from "react";
import Link from "next/link";
import { Flame, ArrowRight, Zap, Clock, ShieldCheck, Terminal } from "lucide-react";

export function DailyChallengeBanner() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
      <div className="rounded-3xl border-2 border-slate-900 bg-white p-5 sm:p-7 shadow-[4px_4px_0px_0px_#09090b] hover:shadow-[6px_6px_0px_0px_#09090b] transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Tag + Title + Metrics */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider bg-[#FBAE0C] border border-slate-900 text-slate-950">
                <Flame className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                Daily Systems Challenge
              </span>
              <span className="text-[11px] font-mono text-slate-700 font-bold">
                // ACTIVE PROVING GROUND
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                01. In-Memory Key-Value Store with Write-Ahead Log
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black font-mono bg-[#FBAE0C]/20 border border-[#FBAE0C]/50 text-[#F78424]">
                Medium
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 pt-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0AA793]" />
                <span className="font-bold text-slate-800">Target:</span>
                <span className="font-extrabold text-[#0AA793]">&gt; 100,000 ops/s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#099BE9]" />
                <span className="font-bold text-slate-800">Latency:</span>
                <span className="font-extrabold text-[#099BE9]">&lt; 0.2ms p99</span>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8647E2]" />
                <span className="font-bold text-slate-800">Durability:</span>
                <span className="font-extrabold text-[#8647E2]">fsync WAL Replay</span>
              </div>
            </div>
          </div>

          {/* Right: Direct Arena CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-2 lg:pt-0">
            <Link
              href="/challenges/kv-store"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] transition-all cursor-pointer"
            >
              View Spec
            </Link>
            <Link
              href="/challenges/kv-store/workspace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#09C899] hover:bg-[#0AA793] border-2 border-slate-900 shadow-[2px_2px_0px_0px_#09090b] hover:shadow-[3px_3px_0px_0px_#09090b] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Solve Challenge</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
