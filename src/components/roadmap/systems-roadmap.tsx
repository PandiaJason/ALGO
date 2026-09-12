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
    <div className="w-full bg-[#f8fafc]/60 py-10 relative selection:bg-[#099BE9]/20 selection:text-[#099BE9]">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Control Bar & Legend */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Legend Card */}
          <div className="bg-white rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] p-4 text-xs font-semibold text-slate-800 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Curriculum Domains
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#09C899] border border-slate-900" />
                <span>Foundations & Runtimes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#8647E2] border border-slate-900" />
                <span>Storage & Indexing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#FBAE0C] border border-slate-900" />
                <span>Traffic & Concurrency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#099BE9] border border-slate-900" />
                <span>AI Systems & LLMs</span>
              </div>
            </div>
          </div>

          {/* Filter Pills & Solved Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="inline-flex rounded-xl p-1 bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b]">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "ALL"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All (20)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("teal")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "teal"
                    ? "bg-[#09C899] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Foundations
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("purple")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "purple"
                    ? "bg-[#8647E2] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Storage
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("orange")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "orange"
                    ? "bg-[#FBAE0C] text-slate-950 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Routing
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("blue")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "blue"
                    ? "bg-[#099BE9] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                AI Systems
              </button>
            </div>

            {/* Solved Counter Pill */}
            <div className="bg-white rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] px-4 py-2 flex items-center gap-3">
              <div>
                <span className="text-xs font-bold text-slate-500">Completed: </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {solvedCount} / {totalChallenges} Solved
                </span>
              </div>
              <div className="w-16 h-2 bg-slate-100 rounded-full border border-slate-300 overflow-hidden">
                <div
                  className="bg-[#09C899] h-full transition-all duration-300"
                  style={{ width: `${Math.max(progressPercent, 5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROADMAP FLOWCHART CANVAS */}
        {/* ========================================================================= */}
        <div className="space-y-12 max-w-4xl mx-auto relative pt-4">
          {filteredStages.map((stage, stageIdx) => {
            const colorStyles = {
              teal: {
                bg: "bg-[#09C899]",
                headerText: "text-slate-950 font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/30 text-slate-950",
              },
              purple: {
                bg: "bg-[#8647E2]",
                headerText: "text-white font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/20 text-white",
              },
              orange: {
                bg: "bg-[#FBAE0C]",
                headerText: "text-slate-950 font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/30 text-slate-950",
              },
              blue: {
                bg: "bg-[#099BE9]",
                headerText: "text-white font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/20 text-white",
              },
            }[stage.accentColor];

            const systemsCount = stage.systems.length;

            return (
              <React.Fragment key={stage.id}>
                {/* Connecting Line from Previous Stage Outer Box */}
                {stageIdx > 0 && (
                  <div className="flex justify-center -my-3 py-1 relative z-0">
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-slate-900" />
                  </div>
                )}

                {/* Outer Stage Container Box */}
                <div className="relative bg-white rounded-3xl border-2 border-slate-900 shadow-[5px_5px_0px_0px_#09090b] p-5 sm:p-7 space-y-6 z-10">
                  {/* Stage Header Banner with Hover Tooltip */}
                  <div
                    className={`group relative w-full rounded-2xl border-2 ${colorStyles.border} ${colorStyles.bg} shadow-[3px_3px_0px_0px_#09090b] px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-default transition-all`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colorStyles.badgeBg} shrink-0`}
                      >
                        STAGE {stage.stageNumber} • {stage.category}
                      </span>
                      <h2 className={`text-base sm:text-lg font-black tracking-tight truncate ${colorStyles.headerText}`}>
                        {stage.name}
                      </h2>
                    </div>

                    {/* Info Trigger & Hover Tooltip for Tagline */}
                    <div className="relative flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <div
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 cursor-help ${colorStyles.badgeBg}`}
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Scope</span>
                      </div>

                      {/* Tooltip shown on hover */}
                      <div className="pointer-events-none absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-slate-950 text-white text-xs p-3.5 shadow-2xl border border-slate-800 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#09C899] uppercase tracking-wider">
                          Stage {stage.stageNumber} Scope
                        </div>
                        <p className="text-neutral-200 leading-relaxed font-medium">
                          {stage.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Nodes Grid (nested inside the stage outer box) */}
                  <div
                    className={`grid gap-4 sm:gap-5 relative ${
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
  const accentBorder = {
    teal: "hover:border-[#09C899]",
    purple: "hover:border-[#8647E2]",
    orange: "hover:border-[#FBAE0C]",
    blue: "hover:border-[#099BE9]",
  }[accentColor];

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] hover:shadow-[5px_5px_0px_0px_#09090b] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#09090b] transition-all ${accentBorder}`}
    >
      {/* Left: Number + Just the Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md shrink-0">
          #{challenge.number}
        </span>
        <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight group-hover:text-[#099BE9] transition-colors truncate">
          {challenge.title}
        </span>
      </div>

      {/* Right: Solved Badge (Only if all 6 levels completed) or Level Progress or Difficulty */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {isSolved ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#09C899] text-white border border-slate-900 shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Solved</span>
          </span>
        ) : completedLevels > 0 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <span>{completedLevels}/6 Levels</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase px-2 py-0.5 rounded border border-slate-200">
            {challenge.difficulty}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
