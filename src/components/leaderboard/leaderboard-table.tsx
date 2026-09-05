"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Trophy,
  CheckCircle2,
  Zap,
  Activity,
  Cpu,
  ArrowUpDown,
  Filter,
  Medal,
  Terminal,
  ExternalLink
} from "lucide-react";
import { formatThroughput, formatLatency, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface LeaderboardItem {
  id: string;
  score: string | number;
  throughputOpsSec: string | number;
  latencyP99Ms: string | number | null;
  memoryBytes: string | number | null;
  username: string;
  challengeTitle: string;
  challengeSlug: string;
  language: string;
}

interface Props {
  entries: LeaderboardItem[];
  currentUsername?: string | null;
}

export function LeaderboardTable({ entries, currentUsername }: Props) {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"score" | "throughput" | "latency">("score");

  const filteredEntries = useMemo(() => {
    return entries
      .filter((item) => {
        const matchesSearch =
          item.username.toLowerCase().includes(search.toLowerCase()) ||
          item.challengeTitle.toLowerCase().includes(search.toLowerCase());
        const matchesLang =
          selectedLanguage === "ALL" ||
          item.language.toLowerCase() === selectedLanguage.toLowerCase();
        return matchesSearch && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === "throughput") {
          return Number(b.throughputOpsSec) - Number(a.throughputOpsSec);
        }
        if (sortBy === "latency") {
          const latA = a.latencyP99Ms ? Number(a.latencyP99Ms) : 9999;
          const latB = b.latencyP99Ms ? Number(b.latencyP99Ms) : 9999;
          return latA - latB;
        }
        return Number(b.score) - Number(a.score);
      });
  }, [entries, search, selectedLanguage, sortBy]);

  // Top stats
  const topThroughput = entries.length > 0
    ? Math.max(...entries.map((e) => Number(e.throughputOpsSec) || 0))
    : 0;

  const bestLatency = entries.length > 0
    ? Math.min(...entries.filter((e) => e.latencyP99Ms).map((e) => Number(e.latencyP99Ms) || 999))
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Cards (LeetCode Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
            <span>VERIFIED ENGINEERS</span>
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-sans">
            {entries.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            100% Correctness Gate
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
            <span>PEAK THROUGHPUT</span>
            <Zap className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {topThroughput ? formatThroughput(topThroughput) : "—"}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            1.01x vs baseline
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
            <span>LOWEST p99 LATENCY</span>
            <Activity className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {bestLatency > 0 && bestLatency < 999 ? formatLatency(bestLatency) : "25µs"}
          </div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">
            Deterministic cgroup
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
            <span>BENCHMARK ENGINE</span>
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2 font-mono">
            algo-runner:latest
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            256MB RAM / 1 CPU cap
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (LeetCode Style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by engineer or challenge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800 shadow-2xs"
          />
        </div>

        {/* Language & Sorting Controls */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Language filters */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-mono">
            <button
              onClick={() => setSelectedLanguage("ALL")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedLanguage === "ALL"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedLanguage("python")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedLanguage === "python"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setSelectedLanguage("cpp")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedLanguage === "cpp"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              C++
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option value="score">Sort: Normalized Score</option>
              <option value="throughput">Sort: Throughput</option>
              <option value="latency">Sort: p99 Latency</option>
            </select>
          </div>
        </div>
      </div>

      {/* LeetCode Contest Ranking Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-[#f8fafc] text-slate-600 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 w-20 text-center font-semibold">Rank</th>
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold hidden md:table-cell">Challenge</th>
              <th className="py-3 px-4 font-semibold text-right">Score</th>
              <th className="py-3 px-4 font-semibold text-right">Throughput</th>
              <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">p99 Latency</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-mono text-xs">
                  No matching entries found.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser =
                  currentUsername &&
                  entry.username.toLowerCase() === currentUsername.toLowerCase();

                // Medal styling matching LeetCode contest rankings
                let rankBadge = null;
                if (rank === 1) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 border border-amber-300 text-amber-600 font-bold text-xs shadow-2xs">
                      🥇 1
                    </span>
                  );
                } else if (rank === 2) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-600 font-bold text-xs shadow-2xs">
                      🥈 2
                    </span>
                  );
                } else if (rank === 3) {
                  rankBadge = (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100/60 border border-amber-400/60 text-amber-700 font-bold text-xs shadow-2xs">
                      🥉 3
                    </span>
                  );
                } else {
                  rankBadge = (
                    <span className="font-mono font-semibold text-slate-500 text-xs">
                      #{rank}
                    </span>
                  );
                }

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-50/80 transition-colors group ${
                      isCurrentUser ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      {rankBadge}
                    </td>

                    {/* User Avatar + Username + Language */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {entry.username.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/profile/${entry.username}`}
                              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                            >
                              @{entry.username}
                            </Link>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase">
                            {entry.language === "cpp" ? "C++20" : "Python 3.12"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Challenge Link */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 text-xs font-medium">
                      <Link
                        href={`/challenges/${entry.challengeSlug}`}
                        className="hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        <span>{entry.challengeTitle}</span>
                      </Link>
                    </td>

                    {/* Normalized Score */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-600 text-xs">
                      {Number(entry.score).toFixed(2)}×
                    </td>

                    {/* Throughput */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-xs">
                      {formatThroughput(entry.throughputOpsSec)}
                    </td>

                    {/* p99 Latency */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-xs hidden sm:table-cell">
                      {entry.latencyP99Ms ? formatLatency(entry.latencyP99Ms) : "—"}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Accepted</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* LeetCode Table Footer & Pagination Controls */}
        <div className="px-4 py-3 border-t border-slate-200 bg-[#f8fafc] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredEntries.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{entries.length}</span> verified engineers
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed text-xs"
            >
              Prev
            </button>
            <span className="px-3 py-1 rounded bg-slate-900 text-white font-semibold text-xs">
              1
            </span>
            <button
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
