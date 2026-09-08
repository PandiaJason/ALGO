"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";

interface ChallengesTableProps {
  userSolvedIds: string[];
  topThroughputMap: Record<string, string>;
}

export function ChallengesTable({
  userSolvedIds,
  topThroughputMap,
}: ChallengesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Topics");

  const solvedSet = useMemo(() => new Set(userSolvedIds), [userSolvedIds]);

  const categories = [
    { label: "All Topics", count: 10, domain: "ALL" },
    { label: "Systems", count: 4, domain: "SYSTEMS" },
    { label: "Performance", count: 2, domain: "PERFORMANCE" },
    { label: "Distributed Systems", count: 3, domain: "DISTRIBUTED_SYSTEMS" },
    { label: "Search / Data", count: 1, domain: "SEARCH_DATA" },
  ];

  const filteredChallenges = useMemo(() => {
    return CORE_CHALLENGES.filter((c) => {
      const selectedCat = categories.find((cat) => cat.label === activeCategory);
      const matchesCategory =
        !selectedCat ||
        selectedCat.domain === "ALL" ||
        c.domain === selectedCat.domain;

      const matchesSearch =
        searchQuery.trim() === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.inspiredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mainSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.whatStudentsBuild.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#099BE9] text-slate-950 font-medium placeholder:text-slate-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-950 text-white font-bold"
                  : "bg-white text-slate-700 hover:text-slate-950 font-semibold hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* LeetCode Style Problem Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-800 font-bold font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Title</th>
                <th className="py-3 px-4 hidden md:table-cell font-bold">Baseline Speed</th>
                <th className="py-3 px-4 hidden md:table-cell font-bold">Top Speed</th>
                <th className="py-3 px-4 font-bold">Difficulty</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChallenges.map((challenge) => {
                const isSolved = solvedSet.has(challenge.slug);
                const topSpeed = topThroughputMap[challenge.slug] || "—";

                return (
                  <tr
                    key={challenge.slug}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Status Icon */}
                    <td className="py-4 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0AA793] mx-auto" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 mx-auto" />
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/challenges/${challenge.slug}`}
                          className="font-bold text-slate-950 hover:text-[#099BE9] transition-colors text-sm sm:text-base flex items-center gap-2"
                        >
                          <span>{challenge.number}. {challenge.title}</span>
                          {challenge.isFlagship && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-[#099BE9]/15 text-[#099BE9] border border-[#099BE9]/30">
                              FLAGSHIP
                            </span>
                          )}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
                          <span className="font-mono text-slate-800 font-semibold">
                            Inspired by {challenge.inspiredBy}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-700 font-semibold">
                            Levels 1–{challenge.progressionLevels.length} Active
                          </span>
                          <span>•</span>
                          <span className="text-[#099BE9] font-bold">Python, C++, Rust, Go, Java</span>
                        </div>
                      </div>
                    </td>

                    {/* Baseline Speed */}
                    <td className="py-4 px-4 hidden md:table-cell font-mono text-slate-900 font-semibold">
                      {challenge.benchmarkMetrics[0] || "100,000 ops/sec"}
                    </td>

                    {/* Top Speed */}
                    <td className="py-4 px-4 hidden md:table-cell font-mono font-bold text-[#0AA793]">
                      {topSpeed}
                    </td>

                    {/* Difficulty */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                          challenge.difficulty === "Hard"
                            ? "bg-[#8647E2]/15 text-[#8647E2] border-[#8647E2]/30"
                            : challenge.difficulty === "Medium"
                            ? "bg-[#FBAE0C]/15 text-[#F78424] border-[#FBAE0C]/30"
                            : "bg-[#09C899]/15 text-[#0AA793] border-[#09C899]/30"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <Link href={`/challenges/${challenge.slug}/workspace`}>
                        <button className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-950 text-white hover:bg-[#099BE9] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer">
                          <span>Solve Challenge</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
