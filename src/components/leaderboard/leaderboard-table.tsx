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
        const username = item.username || "";
        const title = item.challengeTitle || "";
        const lang = item.language || "";
        const matchesSearch =
          username.toLowerCase().includes(search.toLowerCase()) ||
          title.toLowerCase().includes(search.toLowerCase());
        const matchesLang =
          selectedLanguage === "ALL" ||
          lang.toLowerCase() === selectedLanguage.toLowerCase();
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

  const formatLanguage = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case "cpp":
        return "C++20";
      case "python":
        return "Python 3.12";
      case "rust":
        return "Rust 1.75";
      case "go":
        return "Go 1.22";
      case "java":
        return "Java 21";
      default:
        return lang || "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Cards (LeetCode Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-700 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span>VERIFIED ENGINEERS</span>
            <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1 font-sans">
            {entries.length}
          </div>
          <div className="text-[10px] text-slate-700 font-semibold mt-0.5">
            100% Correctness Gate
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-700 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span>PEAK THROUGHPUT</span>
            <Zap className="w-3.5 h-3.5 text-[#099BE9]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1 font-mono">
            {topThroughput ? formatThroughput(topThroughput) : "—"}
          </div>
          <div className="text-[10px] text-slate-700 font-semibold mt-0.5">
            {topThroughput ? "Top Verified Score" : "Awaiting submissions"}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-700 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span>LOWEST p99 LATENCY</span>
            <Activity className="w-3.5 h-3.5 text-[#0AA793]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1 font-mono">
            {bestLatency > 0 && bestLatency < 999 ? formatLatency(bestLatency) : "—"}
          </div>
          <div className="text-[10px] text-slate-700 font-semibold mt-0.5">
            Deterministic cgroups
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-slate-700 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span>BENCHMARK ENGINE</span>
            <Cpu className="w-3.5 h-3.5 text-[#8647E2]" />
          </div>
          <div className="text-sm font-bold text-slate-950 mt-2 font-mono">
            algo-runner:latest
          </div>
          <div className="text-[10px] text-slate-700 font-semibold mt-0.5">
            256MB RAM / 1 CPU cap
          </div>
        </div>
      </div>

      {/* Control Bar: Search + Filter + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by engineer or challenge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-950 placeholder:text-slate-500 font-medium focus:outline-none focus:border-[#099BE9] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setSelectedLanguage("ALL")}
              className={`px-2 py-1 rounded transition-colors ${
                selectedLanguage === "ALL"
                  ? "bg-white text-slate-950 shadow-2xs font-bold"
                  : "text-slate-700 hover:text-slate-950 font-medium"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedLanguage("python")}
              className={`px-2 py-1 rounded transition-colors ${
                selectedLanguage === "python"
                  ? "bg-white text-slate-950 shadow-2xs font-bold"
                  : "text-slate-700 hover:text-slate-950 font-medium"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setSelectedLanguage("cpp")}
              className={`px-2 py-1 rounded transition-colors ${
                selectedLanguage === "cpp"
                  ? "bg-white text-slate-950 shadow-2xs font-bold"
                  : "text-slate-700 hover:text-slate-950 font-medium"
              }`}
            >
              C++
            </button>
            <button
              onClick={() => setSelectedLanguage("rust")}
              className={`px-2 py-1 rounded transition-colors ${
                selectedLanguage === "rust"
                  ? "bg-white text-slate-950 shadow-2xs font-bold"
                  : "text-slate-700 hover:text-slate-950 font-medium"
              }`}
            >
              Rust
            </button>
            <button
              onClick={() => setSelectedLanguage("go")}
              className={`px-2 py-1 rounded transition-colors ${
                selectedLanguage === "go"
                  ? "bg-white text-slate-950 shadow-2xs font-bold"
                  : "text-slate-700 hover:text-slate-950 font-medium"
              }`}
            >
              Go
            </button>
            <button
              onClick={() => setSelectedLanguage("java")}
              className={`px-2 py-1 rounded transition-colors ${
                selectedLanguage === "java"
                  ? "bg-white text-slate-950 shadow-2xs font-bold"
                  : "text-slate-700 hover:text-slate-950 font-medium"
              }`}
            >
              Java
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 text-xs text-slate-700 font-mono">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 font-semibold focus:outline-none focus:border-[#099BE9] shadow-2xs"
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
            <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-20 text-center font-bold">Rank</th>
              <th className="py-3 px-4 font-bold">User</th>
              <th className="py-3 px-4 font-bold hidden md:table-cell">Challenge</th>
              <th className="py-3 px-4 font-bold text-right">Score</th>
              <th className="py-3 px-4 font-bold text-right">Throughput</th>
              <th className="py-3 px-4 font-bold text-right hidden sm:table-cell">p99 Latency</th>
              <th className="py-3 px-4 text-center font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-700 font-mono text-xs">
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="font-bold text-slate-950 text-sm">
                      {search || selectedLanguage !== "ALL"
                        ? "No matching entries found for current filter"
                        : "No verified submissions recorded yet"}
                    </p>
                    <p className="text-slate-700 text-xs font-medium leading-relaxed">
                      Run a challenge test suite in the arena to earn the first verified position on the global leaderboard.
                    </p>
                    <Link
                      href="/challenges/kv-store/workspace"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] transition-all"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Submit Implementation</span>
                    </Link>
                  </div>
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
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FBAE0C]/10 border border-[#FBAE0C]/40 text-[#F78424] font-bold text-xs shadow-2xs">
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
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#8647E2]/10 border border-[#8647E2]/30 text-[#8647E2] font-bold text-xs shadow-2xs">
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

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-50/80 transition-colors group ${
                      isCurrentUser ? "bg-[#099BE9]/5" : ""
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      {rankBadge}
                    </td>

                    {/* User Avatar + Username + Language */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#099BE9] to-[#09C899] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {(entry.username || "?").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/u/${entry.username}`}
                              className="font-bold text-slate-950 hover:text-[#099BE9] transition-colors"
                            >
                              @{entry.username}
                            </Link>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#099BE9]/15 text-[#099BE9] font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">
                            {formatLanguage(entry.language)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Challenge Link */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-800 text-xs font-semibold">
                      <Link
                        href={`/challenges/${entry.challengeSlug}`}
                        className="hover:text-[#099BE9] transition-colors flex items-center gap-1"
                      >
                        <span>{entry.challengeTitle}</span>
                      </Link>
                    </td>

                    {/* Normalized Score */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#099BE9] text-xs">
                      {Number(entry.score).toFixed(2)}×
                    </td>

                    {/* Throughput */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950 text-xs">
                      {formatThroughput(entry.throughputOpsSec)}
                    </td>

                    {/* p99 Latency */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 text-xs hidden sm:table-cell">
                      {entry.latencyP99Ms ? formatLatency(entry.latencyP99Ms) : "—"}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0AA793] bg-[#09C899]/10 px-2 py-0.5 rounded-full border border-[#09C899]/30">
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

        {/* LeetCode Table Footer & Pagination Controls */}
        <div className="px-4 py-3 border-t border-slate-200 bg-[#f8fafc] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 font-mono">
          <div>
            Showing <span className="font-bold text-slate-950">{filteredEntries.length}</span> of{" "}
            <span className="font-bold text-slate-950">{entries.length}</span> verified engineers
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-500 cursor-not-allowed text-xs font-medium"
            >
              Prev
            </button>
            <span className="px-3 py-1 rounded bg-slate-950 text-white font-bold text-xs">
              1
            </span>
            <button
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-500 cursor-not-allowed text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
