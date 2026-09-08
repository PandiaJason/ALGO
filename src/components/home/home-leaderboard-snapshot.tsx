"use client";

import React from "react";
import Link from "next/link";
import { Trophy, CheckCircle2, ArrowRight, Terminal } from "lucide-react";

export interface RealLeaderboardEntry {
  id: string;
  score: string | number;
  throughputOpsSec: string | number;
  latencyP99Ms: string | number | null;
  username: string;
  challengeTitle: string;
  challengeSlug: string;
  language: string;
}

interface HomeLeaderboardSnapshotProps {
  entries: RealLeaderboardEntry[];
}

export function HomeLeaderboardSnapshot({ entries = [] }: HomeLeaderboardSnapshotProps) {
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
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-600 font-mono text-xs">
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="font-medium text-slate-700">
                      No verified submissions recorded yet. Be the first engineer to benchmark on the global leaderboard!
                    </p>
                    <Link
                      href="/challenges/kv-store/workspace"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] transition-all"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Submit First Benchmark</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => {
                const rank = index + 1;
                let rankBadge = null;
                if (rank === 1) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FBAE0C]/15 border border-[#FBAE0C]/40 text-[#F78424] font-bold text-xs shadow-2xs">
                      🥇 1
                    </span>
                  );
                } else if (rank === 2) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                      🥈 2
                    </span>
                  );
                } else if (rank === 3) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#8647E2]/15 border border-[#8647E2]/30 text-[#8647E2] font-bold text-xs shadow-2xs">
                      🥉 3
                    </span>
                  );
                } else {
                  rankBadge = (
                    <span className="font-mono font-bold text-slate-700 text-xs">
                      #{rank}
                    </span>
                  );
                }

                const throughputDisplay = `${Number(entry.throughputOpsSec).toLocaleString()} ops/s`;
                const latencyDisplay = entry.latencyP99Ms ? `${Number(entry.latencyP99Ms).toFixed(2)}ms` : "—";

                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">{rankBadge}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#099BE9] to-[#09C899] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {entry.username.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/u/${entry.username}`}
                            className="font-bold text-slate-950 hover:text-[#099BE9] transition-colors"
                          >
                            @{entry.username}
                          </Link>
                          <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">
                            {entry.language}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-slate-800 font-semibold text-xs">
                      <Link
                        href={`/challenges/${entry.challengeSlug}`}
                        className="hover:text-[#099BE9] transition-colors"
                      >
                        {entry.challengeTitle}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950 text-xs">
                      {throughputDisplay}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 text-xs hidden sm:table-cell">
                      {latencyDisplay}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0AA793] bg-[#09C899]/10 px-2.5 py-0.5 rounded-full border border-[#09C899]/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" />
                        <span>Accepted</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
