"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Search,
  ChevronRight,
} from "lucide-react";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";

interface ChallengesTableProps {
  userSolvedIds?: string[];
  topThroughputMap?: Record<string, string>;
}

export function ChallengesTable({
  userSolvedIds = [],
  topThroughputMap = {},
}: ChallengesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");

  const solvedSet = useMemo(() => new Set(userSolvedIds), [userSolvedIds]);

  const filtered = useMemo(() => {
    return CORE_CHALLENGES.filter((c) => {
      let matchesDomain = true;
      if (domainFilter === "STORAGE") {
        matchesDomain = c.domain === "SYSTEMS" || c.domain === "SEARCH_DATA";
      } else if (domainFilter === "NETWORK") {
        matchesDomain = c.domain === "PERFORMANCE";
      } else if (domainFilter === "DISTRIBUTED") {
        matchesDomain = c.domain === "DISTRIBUTED_SYSTEMS";
      }

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        c.title.toLowerCase().includes(q) ||
        c.inspiredBy.toLowerCase().includes(q) ||
        c.mainSkill.toLowerCase().includes(q) ||
        c.whatStudentsBuild.toLowerCase().includes(q);

      return matchesDomain && matchesSearch;
    });
  }, [searchQuery, domainFilter]);

  return (
    <div className="space-y-6">
      {/* Search & Domain Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, technologies..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#099BE9] text-slate-950 font-medium placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Domain Filter Tabs */}
        <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 text-xs font-mono overflow-x-auto shrink-0">
          <button
            onClick={() => setDomainFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
              domainFilter === "ALL"
                ? "bg-white text-slate-950 shadow-2xs font-bold"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            All (10)
          </button>
          <button
            onClick={() => setDomainFilter("STORAGE")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
              domainFilter === "STORAGE"
                ? "bg-white text-slate-950 shadow-2xs font-bold"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Storage &amp; Memory
          </button>
          <button
            onClick={() => setDomainFilter("NETWORK")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
              domainFilter === "NETWORK"
                ? "bg-white text-slate-950 shadow-2xs font-bold"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Networking
          </button>
          <button
            onClick={() => setDomainFilter("DISTRIBUTED")}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
              domainFilter === "DISTRIBUTED"
                ? "bg-white text-slate-950 shadow-2xs font-bold"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Distributed
          </button>
        </div>
      </div>

      {/* Unified High-Density Problemset Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-800 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-14 text-center font-bold">#</th>
                <th className="py-3.5 px-4 font-bold">Challenge Title</th>
                <th className="py-3.5 px-4 font-bold hidden sm:table-cell">Inspired By</th>
                <th className="py-3.5 px-4 font-bold text-center">Difficulty</th>
                <th className="py-3.5 px-4 font-bold text-right hidden md:table-cell">Benchmark KPI</th>
                <th className="py-3.5 px-4 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const isSolved = solvedSet.has(c.slug);
                const difficultyBadge =
                  c.difficulty === "Easy" ? (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-[#09C899]/15 border border-[#09C899]/30 text-[#0AA793]">
                      Easy
                    </span>
                  ) : c.difficulty === "Medium" ? (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-[#FBAE0C]/15 border border-[#FBAE0C]/30 text-[#F78424]">
                      Medium
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-[#8647E2]/15 border border-[#8647E2]/30 text-[#8647E2]">
                      Hard
                    </span>
                  );

                const benchmarkText = c.benchmarkMetrics[0] || "Target: Bare Metal";

                return (
                  <tr
                    key={c.slug}
                    className="hover:bg-slate-50/90 transition-colors group"
                  >
                    {/* Number / Solved Status */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-600 text-xs">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0AA793] mx-auto" />
                      ) : (
                        c.number
                      )}
                    </td>

                    {/* Title & Subtitle */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href={`/challenges/${c.slug}`}
                          className="font-bold text-slate-950 text-sm hover:text-[#099BE9] transition-colors flex items-center gap-1.5"
                        >
                          <span>{c.title}</span>
                          {c.isFlagship && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-[#099BE9]/15 text-[#099BE9]">
                              FLAGSHIP
                            </span>
                          )}
                        </Link>
                        <span className="text-[11px] text-slate-600 font-medium line-clamp-1">
                          {c.whatStudentsBuild}
                        </span>
                      </div>
                    </td>

                    {/* Inspired By */}
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-mono font-semibold">
                        {c.inspiredBy}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-4 px-4 text-center">
                      {difficultyBadge}
                    </td>

                    {/* Benchmark KPI */}
                    <td className="py-4 px-4 text-right font-mono text-xs hidden md:table-cell">
                      <span className="font-bold text-slate-900">{benchmarkText}</span>
                    </td>

                    {/* Solve Action */}
                    <td className="py-4 px-4 text-center">
                      <Link
                        href={`/challenges/${c.slug}/workspace`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#099BE9] bg-[#099BE9]/10 hover:bg-[#099BE9] hover:text-white transition-all group/btn"
                      >
                        <span>Solve</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-700 font-mono">
          <div>
            Showing <span className="font-bold text-slate-950">{filtered.length}</span> of{" "}
            <span className="font-bold text-slate-950">{CORE_CHALLENGES.length}</span> verified systems challenges
          </div>

          <div className="text-[11px] text-slate-600">
            {solvedSet.size > 0 ? (
              <span><strong className="text-[#0AA793]">{solvedSet.size}</strong> completed</span>
            ) : (
              <span>Python, C++, Rust, Go, Java Supported</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

