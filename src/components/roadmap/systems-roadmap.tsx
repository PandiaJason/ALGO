"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Filter,
  Info,
} from "lucide-react";
import { CORE_CHALLENGES, CoreChallenge } from "@/lib/constants/core-challenges";

interface SystemsRoadmapProps {
  userSolvedSlugs: string[];
  levelProgressMap?: Record<string, number>;
}

interface RoadmapStage {
  id: string;
  stageNumber: number;
  name: string;
  category: string;
  tagline: string;
  accentColor: "teal" | "purple" | "orange" | "blue";
  systems: string[]; // Challenge slugs
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    stageNumber: 1,
    name: "Operating System Primitives & Network I/O",
    category: "FOUNDATIONS",
    tagline: "Process lifecycle, POSIX system calls, non-blocking I/O and protocol framing.",
    accentColor: "teal",
    systems: ["shell", "http-server"],
  },
  {
    id: "stage-2",
    stageNumber: 2,
    name: "In-Memory State, Caching & Telemetry",
    category: "DATA STRUCTURES & MEMORY",
    tagline: "Hash collisions, doubly linked lists, TTL eviction, and high-frequency metrics.",
    accentColor: "purple",
    systems: ["kv-store", "lru-cache", "log-engine"],
  },
  {
    id: "stage-3",
    stageNumber: 3,
    name: "Traffic Control, Routing & Resource Schedulers",
    category: "CONCURRENCY & NETWORKING",
    tagline: "Rate limiting algorithms, weighted packet dispatch, and multi-resource bin packing.",
    accentColor: "orange",
    systems: ["rate-limiter", "load-balancer", "task-scheduler"],
  },
  {
    id: "stage-4",
    stageNumber: 4,
    name: "Storage Engines, Merkle Trees & Streaming Logs",
    category: "DURABILITY & PERSISTENCE",
    tagline: "Slotted page formats, content-addressable Merkle DAGs, and partitioned commit logs.",
    accentColor: "purple",
    systems: ["database-index", "git", "object-store", "message-queue"],
  },
  {
    id: "stage-5",
    stageNumber: 5,
    name: "Linux Isolation & Distributed Consensus",
    category: "DISTRIBUTED SYSTEMS",
    tagline: "OS namespaces, Raft quorum replication, gossip failure detectors, and erasure codes.",
    accentColor: "teal",
    systems: ["distributed-consensus", "container-runtime", "service-discovery", "distributed-object-storage"],
  },
  {
    id: "stage-6",
    stageNumber: 6,
    name: "AI Systems, Vector Search & LLM Inference",
    category: "AI & NEURAL RUNTIMES",
    tagline: "Inverted text indexes, HNSW proximity graphs, PagedAttention KV caches, and MCP protocols.",
    accentColor: "blue",
    systems: ["llm-inference", "vector-database", "search-engine", "mcp-runtime"],
  },
];

export function SystemsRoadmap({ userSolvedSlugs, levelProgressMap = {} }: SystemsRoadmapProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "teal" | "purple" | "orange" | "blue">("ALL");

  const challengeMap = React.useMemo(() => {
    const map = new Map<string, CoreChallenge>();
    CORE_CHALLENGES.forEach((c) => map.set(c.slug, c));
    return map;
  }, []);

  const totalChallenges = CORE_CHALLENGES.length;
  const solvedCount = userSolvedSlugs.length;
  const progressPercent = Math.round((solvedCount / totalChallenges) * 100);

  const filteredStages = ROADMAP_STAGES.filter((stage) => {
    if (activeFilter === "ALL") return true;
    return stage.accentColor === activeFilter;
  });

  return (
    <div className="w-full bg-slate-50/50 py-10 relative selection:bg-[#099BE9]/20 selection:text-[#099BE9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar & Legend */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Legend Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 text-xs font-semibold text-slate-700 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Curriculum Domains
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#09C899]" />
                <span>Foundations & Runtimes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8647E2]" />
                <span>Storage & Indexing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FBAE0C]" />
                <span>Traffic & Concurrency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#099BE9]" />
                <span>AI Systems & LLMs</span>
              </div>
            </div>
          </div>

          {/* Filter Pills & Solved Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-xs text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "ALL"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All (20)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("teal")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "teal"
                    ? "bg-[#09C899] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Foundations
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("purple")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "purple"
                    ? "bg-[#8647E2] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Storage
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("orange")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "orange"
                    ? "bg-[#FBAE0C] text-slate-950 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Routing
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("blue")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "blue"
                    ? "bg-[#099BE9] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                AI Systems
              </button>
            </div>

            {/* Solved Counter Pill */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs px-4 py-2 flex items-center gap-3">
              <div>
                <span className="text-xs font-bold text-slate-400">Completed: </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {solvedCount} / {totalChallenges} Solved
                </span>
              </div>
              <div className="w-16 h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                <div
                  className="bg-[#09C899] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(progressPercent, 5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROADMAP CANVAS */}
        {/* ========================================================================= */}
        <div className="space-y-8 max-w-4xl mx-auto relative pt-2">
          {filteredStages.map((stage, stageIdx) => {
            const colorStyles = {
              teal: {
                bannerBg: "bg-gradient-to-r from-emerald-50 to-teal-50/60 border-emerald-200/80",
                badgeBg: "bg-[#09C899] text-white",
                pillBg: "bg-white text-emerald-800 border-emerald-200",
                scopeAccent: "text-[#0AA793]",
              },
              purple: {
                bannerBg: "bg-gradient-to-r from-purple-50 to-indigo-50/60 border-purple-200/80",
                badgeBg: "bg-[#8647E2] text-white",
                pillBg: "bg-white text-purple-800 border-purple-200",
                scopeAccent: "text-[#8647E2]",
              },
              orange: {
                bannerBg: "bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-200/80",
                badgeBg: "bg-[#FBAE0C] text-slate-950",
                pillBg: "bg-white text-amber-900 border-amber-200",
                scopeAccent: "text-[#F78424]",
              },
              blue: {
                bannerBg: "bg-gradient-to-r from-sky-50 to-blue-50/60 border-sky-200/80",
                badgeBg: "bg-[#099BE9] text-white",
                pillBg: "bg-white text-sky-800 border-sky-200",
                scopeAccent: "text-[#099BE9]",
              },
            }[stage.accentColor];

            const systemsCount = stage.systems.length;

            return (
              <React.Fragment key={stage.id}>
                {/* Connecting Line between Outer Stage Boxes */}
                {stageIdx > 0 && (
                  <div className="flex justify-center -my-2 py-1 relative z-0">
                    <div className="w-0.5 h-6 border-l border-dashed border-slate-300" />
                  </div>
                )}

                {/* Outer Stage Container Box */}
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4 z-10">
                  {/* Stage Header Banner with Hover Tooltip */}
                  <div
                    className={`group relative w-full rounded-xl border ${colorStyles.bannerBg} px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-default transition-all`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${colorStyles.badgeBg} shrink-0 shadow-2xs`}
                      >
                        STAGE {stage.stageNumber} • {stage.category}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                        {stage.name}
                      </h2>
                    </div>

                    {/* Scope Badge with Hover Tooltip for Tagline */}
                    <div className="relative flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <div
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 cursor-help border shadow-2xs ${colorStyles.pillBg}`}
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Scope</span>
                      </div>

                      {/* Tooltip shown on hover */}
                      <div className="pointer-events-none absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 text-white text-xs p-3.5 shadow-xl border border-slate-700/60 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 space-y-1">
                        <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${colorStyles.scopeAccent}`}>
                          Stage {stage.stageNumber} Scope
                        </div>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          {stage.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Nodes Grid (nested inside stage outer box) */}
                  <div
                    className={`grid gap-3 sm:gap-4 relative ${
                      systemsCount === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : systemsCount === 3
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {stage.systems.map((slug) => {
                      const challenge = challengeMap.get(slug);
                      if (!challenge) return null;
                      const isSolved = userSolvedSlugs.includes(slug);
                      const completedLevels = levelProgressMap[slug] || 0;

                      return (
                        <RoadmapNode
                          key={slug}
                          challenge={challenge}
                          isSolved={isSolved}
                          completedLevels={completedLevels}
                          accentColor={stage.accentColor}
                        />
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface RoadmapNodeProps {
  challenge: CoreChallenge;
  isSolved: boolean;
  completedLevels: number;
  accentColor: "teal" | "purple" | "orange" | "blue";
}

function RoadmapNode({
  challenge,
  isSolved,
  completedLevels,
  accentColor,
}: RoadmapNodeProps) {
  const accentHover = {
    teal: "hover:border-[#09C899] hover:bg-teal-50/20",
    purple: "hover:border-[#8647E2] hover:bg-purple-50/20",
    orange: "hover:border-[#FBAE0C] hover:bg-amber-50/20",
    blue: "hover:border-[#099BE9] hover:bg-sky-50/20",
  }[accentColor];

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className={`group relative flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all ${accentHover}`}
    >
      {/* Left: Number + Just the Name */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
          #{challenge.number}
        </span>
        <span className="text-sm font-bold text-slate-900 group-hover:text-[#099BE9] transition-colors truncate">
          {challenge.title}
        </span>
      </div>

      {/* Right: Solved Badge (Only if all 6 levels completed) or Level Progress or Difficulty */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {isSolved ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#09C899]/15 text-[#0AA793] border border-[#09C899]/30">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Solved</span>
          </span>
        ) : completedLevels > 0 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{completedLevels}/6 Levels</span>
          </span>
        ) : (
          <span
            className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${
              challenge.difficulty === "Easy"
                ? "bg-[#09C899]/10 text-[#0AA793] border-[#09C899]/20"
                : challenge.difficulty === "Medium"
                ? "bg-[#FBAE0C]/15 text-[#F78424] border-[#FBAE0C]/30"
                : "bg-[#8647E2]/10 text-[#8647E2] border-[#8647E2]/20"
            }`}
          >
            {challenge.difficulty}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
