"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Zap,
  Clock,
  ShieldCheck,
  Terminal,
  Calendar,
} from "lucide-react";
import { getDailyChallenge } from "@/lib/constants/core-challenges";

export function DailyChallengeBanner() {
  const [dailyInfo, setDailyInfo] = useState(() => getDailyChallenge());

  useEffect(() => {
    // Update countdown timer every minute
    const interval = setInterval(() => {
      setDailyInfo(getDailyChallenge());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { challenge, formattedDate, timeRemaining } = dailyInfo;

  const difficultyColor =
    challenge.difficulty === "Easy"
      ? "bg-[#09C899]/15 border-[#09C899]/30 text-[#0AA793]"
      : challenge.difficulty === "Medium"
      ? "bg-[#FBAE0C]/15 border-[#FBAE0C]/30 text-[#F78424]"
      : "bg-[#8647E2]/15 border-[#8647E2]/30 text-[#8647E2]";

  // Benchmark metrics
  const targetMetric = challenge.benchmarkMetrics[0] || "Target: Bare Metal";
  const latencyMetric = challenge.benchmarkMetrics[1] || "p99: Sub-millisecond";
  const durabilityMetric = challenge.benchmarkMetrics[2] || (challenge.inspiredBy ? `Inspired by ${challenge.inspiredBy}` : "Crash-resilient");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8 relative z-20">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Tag + Title + Metrics */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#FBAE0C]/15 border border-[#FBAE0C]/30 text-[#F78424]">
                <Flame className="w-3.5 h-3.5 fill-[#F78424] text-[#F78424]" />
                Daily Systems Challenge
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-medium">
                • Resets in {timeRemaining}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight">
                {challenge.number}. {challenge.title}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${difficultyColor}`}
              >
                {challenge.difficulty}
              </span>
              {challenge.inspiredBy && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-semibold">
                  Inspired by {challenge.inspiredBy}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 pt-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0AA793]" />
                <span className="font-semibold text-slate-800">Target:</span>
                <span className="font-bold text-[#0AA793]">{targetMetric}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#099BE9]" />
                <span className="font-semibold text-slate-800">Spec:</span>
                <span className="font-bold text-[#099BE9]">{latencyMetric}</span>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8647E2]" />
                <span className="font-semibold text-slate-800">Durability:</span>
                <span className="font-bold text-[#8647E2]">{durabilityMetric}</span>
              </div>
            </div>
          </div>

          {/* Right: Direct Arena CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-2 lg:pt-0">
            <Link
              href={`/challenges/${challenge.slug}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              View Spec
            </Link>
            <Link
              href={`/challenges/${challenge.slug}/workspace`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md shadow-[#09C899]/20 transition-all active:scale-95 group"
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
