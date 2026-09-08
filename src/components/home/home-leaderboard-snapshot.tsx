"use client";

import React from "react";
import Link from "next/link";
import { Trophy, CheckCircle2, ArrowRight, Zap, Gauge } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  language: string;
  challenge: string;
  throughput: string;
  p99: string;
}

const SAMPLE_LEADERS: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "systems_core",
    language: "Rust",
    challenge: "Key-Value Storage Engine",
    throughput: "148,220 ops/s",
    p99: "0.08ms",
  },
  {
    rank: 2,
    username: "perf_ninja",
    language: "C++ 20",
    challenge: "Key-Value Storage Engine",
    throughput: "139,400 ops/s",
    p99: "0.09ms",
  },
  {
    rank: 3,
    username: "concurrency_guru",
    language: "Go",
    challenge: "Lock-Free Ring Buffer",
    throughput: "112,800 ops/s",
    p99: "0.11ms",
  },
  {
    rank: 4,
    username: "dev_jason",
    language: "Python 3.12",
    challenge: "Key-Value Storage Engine",
    throughput: "101,170 ops/s",
    p99: "0.12ms",
  },
  {
    rank: 5,
    username: "kernel_dev",
    language: "Java 21",
    challenge: "Write-Ahead Log Engine",
    throughput: "94,600 ops/s",
    p99: "0.15ms",
  },
];

export function HomeLeaderboardSnapshot() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy className="w-4 h-4 text-[#F78424]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
              Live Arena Standings
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
            Global Systems Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            Empirical bare-metal benchmarks verified under strict CPU and memory cgroups.
          </p>
        </div>

        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#099BE9] hover:text-[#1984E9] font-mono shrink-0"
        >
          <span>View Global Rankings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center font-bold">Rank</th>
              <th className="py-3.5 px-4 font-bold">Engineer</th>
              <th className="py-3.5 px-4 font-bold hidden sm:table-cell">Challenge</th>
              <th className="py-3.5 px-4 font-bold text-right">Throughput</th>
              <th className="py-3.5 px-4 font-bold text-right hidden sm:table-cell">p99 Latency</th>
              <th className="py-3.5 px-4 text-center font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SAMPLE_LEADERS.map((entry) => {
              let rankBadge = null;
              if (entry.rank === 1) {
                rankBadge = (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FBAE0C]/15 border border-[#FBAE0C]/40 text-[#F78424] font-bold text-xs shadow-2xs">
                    🥇 1
                  </span>
                );
              } else if (entry.rank === 2) {
                rankBadge = (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                    🥈 2
                  </span>
                );
              } else if (entry.rank === 3) {
                rankBadge = (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#8647E2]/15 border border-[#8647E2]/30 text-[#8647E2] font-bold text-xs shadow-2xs">
                    🥉 3
                  </span>
                );
              } else {
                rankBadge = (
                  <span className="font-mono font-bold text-slate-700 text-xs">
                    #{entry.rank}
                  </span>
                );
              }

              return (
                <tr key={entry.rank} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center">{rankBadge}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#099BE9] to-[#09C899] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {entry.username.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-950">@{entry.username}</div>
                        <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">
                          {entry.language}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-800 font-semibold text-xs">
                    {entry.challenge}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950 text-xs">
                    {entry.throughput}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 text-xs hidden sm:table-cell">
                    {entry.p99}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0AA793] bg-[#09C899]/10 px-2.5 py-0.5 rounded-full border border-[#09C899]/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" />
                      <span>Accepted</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
