"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Route,
  Info,
  Trophy,
  Sparkles,
  Zap,
  Terminal,
  Layers,
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
  tier: "Beginner" | "Intermediate" | "Advanced";
  tagline: string;
  accentColor: "teal" | "purple" | "orange" | "blue";
  branchSide: "left" | "right";
  systems: string[]; // Challenge slugs
  keyConcepts: string[];
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    stageNumber: 1,
    name: "Operating System Primitives",
    category: "FOUNDATIONS",
    tier: "Beginner",
    tagline:
      "Process lifecycle, POSIX system calls, non-blocking I/O and protocol framing.",
    accentColor: "teal",
    branchSide: "right",
    systems: ["shell", "http-server"],
    keyConcepts: [
      "fork() & execve()",
      "POSIX File Descriptors",
      "O_NONBLOCK & epoll",
      "HTTP/1.1 Framing",
    ],
  },
  {
    id: "stage-2",
    stageNumber: 2,
    name: "In-Memory State & Caching",
    category: "DATA STRUCTURES & MEMORY",
    tier: "Beginner",
    tagline:
      "Hash collisions, doubly linked lists, TTL eviction, and high-frequency metrics.",
    accentColor: "purple",
    branchSide: "left",
    systems: ["kv-store", "lru-cache", "log-engine"],
    keyConcepts: [
      "Hash Table Buckets",
      "O(1) LRU Eviction",
      "Ring Buffers",
      "Columnar Aggregations",
    ],
  },
  {
    id: "stage-3",
    stageNumber: 3,
    name: "Traffic Control & Routing",
    category: "CONCURRENCY & NETWORKING",
    tier: "Intermediate",
    tagline:
      "Rate limiting algorithms, weighted packet dispatch, and multi-resource bin packing.",
    accentColor: "orange",
    branchSide: "right",
    systems: ["rate-limiter", "load-balancer", "task-scheduler"],
    keyConcepts: [
      "Token Bucket & Leaky Bucket",
      "Smooth Weighted RR",
      "Least-Connection Routing",
      "Dominant Resource Fairness",
    ],
  },
  {
    id: "stage-4",
    stageNumber: 4,
    name: "Storage Engines & Persistence",
    category: "DURABILITY & PERSISTENCE",
    tier: "Intermediate",
    tagline:
      "Slotted page formats, content-addressable Merkle DAGs, and partitioned commit logs.",
    accentColor: "purple",
    branchSide: "left",
    systems: ["database-index", "git", "object-store", "message-queue"],
    keyConcepts: [
      "B+ Tree Slotted Pages",
      "Merkle Tree Hashes",
      "Chunk Deduplication",
      "Zero-Copy Partition Logs",
    ],
  },
  {
    id: "stage-5",
    stageNumber: 5,
    name: "Distributed Consensus & Isolation",
    category: "DISTRIBUTED SYSTEMS",
    tier: "Advanced",
    tagline:
      "OS namespaces, Raft quorum replication, gossip failure detectors, and erasure codes.",
    accentColor: "teal",
    branchSide: "right",
    systems: [
      "distributed-consensus",
      "container-runtime",
      "service-discovery",
      "distributed-object-storage",
    ],
    keyConcepts: [
      "Raft Leader Election",
      "Linux PID/Mount Namespaces",
      "Gossip SWIM Protocol",
      "Reed-Solomon Erasure Coding",
    ],
  },
  {
    id: "stage-6",
    stageNumber: 6,
    name: "AI Systems & Neural Runtimes",
    category: "AI & NEURAL RUNTIMES",
    tier: "Advanced",
    tagline:
      "Inverted text indexes, HNSW proximity graphs, PagedAttention KV caches, and MCP protocols.",
    accentColor: "blue",
    branchSide: "left",
    systems: [
      "search-engine",
      "vector-database",
      "llm-inference",
      "mcp-runtime",
    ],
    keyConcepts: [
      "BM25 Inverted Index",
      "HNSW Proximity Graphs",
      "PagedAttention KV Cache",
      "MCP JSON-RPC Stdio",
    ],
  },
];

export function SystemsRoadmap({
  userSolvedSlugs,
  levelProgressMap = {},
}: SystemsRoadmapProps) {
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "Beginner" | "Intermediate" | "Advanced"
  >("ALL");

  const challengeMap = useMemo(() => {
    const map = new Map<string, CoreChallenge>();
    CORE_CHALLENGES.forEach((c) => map.set(c.slug, c));
    return map;
  }, []);

  const totalChallenges = CORE_CHALLENGES.length;
  const solvedCount = userSolvedSlugs.length;
  const progressPercent = Math.round((solvedCount / totalChallenges) * 100);

  const filteredStages = ROADMAP_STAGES.filter((stage) => {
    if (activeFilter === "ALL") return true;
    return stage.tier === activeFilter;
  });

  return (
    <div className="w-full bg-slate-50/60 py-10 relative selection:bg-[#099BE9]/20 selection:text-[#099BE9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ========================================================================= */}
        {/* Top Control Bar & Legend */}
        {/* ========================================================================= */}
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
                <span>Storage & Persistence</span>
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

          {/* Difficulty Tier Filters & Solved Progress */}
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
                onClick={() => setActiveFilter("Beginner")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "Beginner"
                    ? "bg-[#09C899] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Beginner (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Intermediate")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "Intermediate"
                    ? "bg-[#FBAE0C] text-slate-950 font-extrabold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Intermediate (7)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Advanced")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "Advanced"
                    ? "bg-[#099BE9] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Advanced (8)
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
        {/* ROADMAP.SH STYLE CENTRAL SPINE CANVAS */}
        {/* ========================================================================= */}
        <div className="relative pt-4 pb-12">
          {/* Top Dotted Stem from Header */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-10 border-l-2 border-dotted border-[#099BE9]" />
            <div className="px-5 py-2 rounded-2xl bg-white border-2 border-slate-900 shadow-sm text-slate-950 font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
              <Route className="w-4 h-4 text-[#099BE9]" />
              <span>Systems Engineering</span>
            </div>
            <div className="w-0.5 h-8 bg-[#099BE9]" />
          </div>

          {/* Render Stages along the Central Spine */}
          <div className="space-y-0">
            {filteredStages.map((stage, stageIdx) => {
              const isFirst = stageIdx === 0;
              const prevStage = filteredStages[stageIdx - 1];
              const showTierHeader =
                isFirst || (prevStage && prevStage.tier !== stage.tier);

              const colorConfig = {
                teal: {
                  milestoneBg: "bg-[#09C899]/15 border-[#09C899] text-slate-950",
                  badgeBg: "bg-[#09C899] text-white",
                  stemColor: "#09C899",
                  hoverBorder: "hover:border-[#09C899]",
                },
                purple: {
                  milestoneBg: "bg-[#8647E2]/15 border-[#8647E2] text-slate-950",
                  badgeBg: "bg-[#8647E2] text-white",
                  stemColor: "#8647E2",
                  hoverBorder: "hover:border-[#8647E2]",
                },
                orange: {
                  milestoneBg: "bg-[#FBAE0C]/20 border-[#FBAE0C] text-slate-950",
                  badgeBg: "bg-[#FBAE0C] text-slate-950",
                  stemColor: "#FBAE0C",
                  hoverBorder: "hover:border-[#FBAE0C]",
                },
                blue: {
                  milestoneBg: "bg-[#099BE9]/15 border-[#099BE9] text-slate-950",
                  badgeBg: "bg-[#099BE9] text-white",
                  stemColor: "#099BE9",
                  hoverBorder: "hover:border-[#099BE9]",
                },
              }[stage.accentColor];

              return (
                <React.Fragment key={stage.id}>
                  {/* Tier Milestone Divider on the Spine */}
                  {showTierHeader && (
                    <div className="flex flex-col items-center py-4">
                      <div className="px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white border border-slate-300 shadow-xs text-slate-700 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            stage.tier === "Beginner"
                              ? "bg-[#09C899]"
                              : stage.tier === "Intermediate"
                              ? "bg-[#FBAE0C]"
                              : "bg-[#099BE9]"
                          }`}
                        />
                        <span>
                          {stage.tier === "Beginner"
                            ? "TIER 1: BEGINNER FRIENDLY • SYSTEMS FOUNDATIONS"
                            : stage.tier === "Intermediate"
                            ? "TIER 2: INTERMEDIATE • TRAFFIC & DURABILITY"
                            : "TIER 3: ADVANCED & EXPERT • DISTRIBUTED & AI"}
                        </span>
                      </div>
                      <div className="w-0.5 h-6 bg-[#099BE9]" />
                    </div>
                  )}

                  {/* Stage Row (Desktop 3-Column Alternating Layout) */}
                  <div className="hidden md:flex items-center justify-between w-full my-4">
                    {/* LEFT COLUMN */}
                    <div className="w-[38%] flex justify-end">
                      {stage.branchSide === "left" ? (
                        /* Challenges Stack on the Left */
                        <div className="w-full space-y-2.5">
                          {stage.systems.map((slug) => {
                            const challenge = challengeMap.get(slug);
                            if (!challenge) return null;
                            const isSolved = userSolvedSlugs.includes(slug);
                            const completedLevels = levelProgressMap[slug] || 0;
                            return (
                              <RoadmapChallengeCard
                                key={slug}
                                challenge={challenge}
                                isSolved={isSolved}
                                completedLevels={completedLevels}
                                accentColor={stage.accentColor}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        /* Curriculum Scope on the Left */
                        <StageInfoCard
                          stage={stage}
                          colorConfig={colorConfig}
                          align="right"
                        />
                      )}
                    </div>

                    {/* LEFT CONNECTOR (SVG Curves or Dotted Stem) */}
                    <div className="w-[12%] flex items-center justify-center h-full">
                      {stage.branchSide === "left" ? (
                        <StageBranchConnector
                          cardCount={stage.systems.length}
                          direction="left"
                          color="#099BE9"
                        />
                      ) : (
                        <StageInfoConnector color="#cbd5e1" />
                      )}
                    </div>

                    {/* CENTER MILESTONE NODE */}
                    <div className="w-[160px] sm:w-[190px] shrink-0 flex flex-col items-center justify-center relative py-2">
                      <StageMilestoneBox
                        stage={stage}
                        colorConfig={colorConfig}
                      />
                    </div>

                    {/* RIGHT CONNECTOR (SVG Curves or Dotted Stem) */}
                    <div className="w-[12%] flex items-center justify-center h-full">
                      {stage.branchSide === "right" ? (
                        <StageBranchConnector
                          cardCount={stage.systems.length}
                          direction="right"
                          color="#099BE9"
                        />
                      ) : (
                        <StageInfoConnector color="#cbd5e1" />
                      )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-[38%] flex justify-start">
                      {stage.branchSide === "right" ? (
                        /* Challenges Stack on the Right */
                        <div className="w-full space-y-2.5">
                          {stage.systems.map((slug) => {
                            const challenge = challengeMap.get(slug);
                            if (!challenge) return null;
                            const isSolved = userSolvedSlugs.includes(slug);
                            const completedLevels = levelProgressMap[slug] || 0;
                            return (
                              <RoadmapChallengeCard
                                key={slug}
                                challenge={challenge}
                                isSolved={isSolved}
                                completedLevels={completedLevels}
                                accentColor={stage.accentColor}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        /* Curriculum Scope on the Right */
                        <StageInfoCard
                          stage={stage}
                          colorConfig={colorConfig}
                          align="left"
                        />
                      )}
                    </div>
                  </div>

                  {/* Stage Row (Mobile Layout < md) */}
                  <div className="md:hidden relative pl-7 sm:pl-9 py-6 border-l-2 border-[#099BE9] ml-4 sm:ml-6 space-y-4">
                    {/* Node Dot on the Line */}
                    <div
                      className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 border-white shadow-xs ${colorConfig.badgeBg}`}
                    />

                    {/* Mobile Milestone Header */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${colorConfig.badgeBg}`}
                        >
                          STAGE {stage.stageNumber}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {stage.category}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        {stage.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {stage.tagline}
                      </p>
                    </div>

                    {/* Mobile Challenge Cards */}
                    <div className="space-y-2 pt-1">
                      {stage.systems.map((slug) => {
                        const challenge = challengeMap.get(slug);
                        if (!challenge) return null;
                        const isSolved = userSolvedSlugs.includes(slug);
                        const completedLevels = levelProgressMap[slug] || 0;
                        return (
                          <RoadmapChallengeCard
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

                  {/* Vertical Spine Link to Next Stage */}
                  {stageIdx < filteredStages.length - 1 && (
                    <div className="hidden md:flex justify-center">
                      <div className="w-0.5 h-12 bg-[#099BE9]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* Bottom Forking Lines & Graduation Station (like roadmap.sh Docker fork) */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center pt-2">
            {/* Forking lines bowing outward */}
            <div className="w-full flex justify-center py-1">
              <svg viewBox="0 0 120 50" className="w-32 h-12" fill="none">
                <path
                  d="M 60 0 C 60 20, 20 25, 20 50"
                  stroke="#099BE9"
                  strokeWidth="2.5"
                />
                <path
                  d="M 60 0 C 60 20, 100 25, 100 50"
                  stroke="#099BE9"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Systems Architect Final Graduation Station */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-6 max-w-md text-center space-y-3 relative z-10">
              <div className="inline-flex p-3 rounded-full bg-[#FBAE0C]/15 text-[#F78424] border border-[#FBAE0C]/30 mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0AA793]">
                  CAPSTONE GRADUATION
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Systems Architect Mastered
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Engineered all 20 foundational systems from single-process Unix
                  runtimes to distributed consensus and AI neural inference engines.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/challenges"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-sm transition-all"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Start Proving Grounds</span>
                </Link>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <span>View Global Rankings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* SUB-COMPONENTS                                                            */
/* ========================================================================= */

interface StageMilestoneBoxProps {
  stage: RoadmapStage;
  colorConfig: {
    milestoneBg: string;
    badgeBg: string;
    stemColor: string;
    hoverBorder: string;
  };
}

function StageMilestoneBox({ stage, colorConfig }: StageMilestoneBoxProps) {
  return (
    <div className="group relative flex flex-col items-center text-center cursor-default">
      {/* Top stage pill */}
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1.5 shadow-2xs ${colorConfig.badgeBg}`}
      >
        STAGE {stage.stageNumber}
      </span>

      {/* Main Milestone Box (iconic yellow/amber roadmap.sh box) */}
      <div className="w-44 sm:w-52 px-3.5 py-3 rounded-xl bg-[#FBAE0C] border-2 border-slate-900 shadow-sm transition-transform duration-200 group-hover:scale-105">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-900/75">
          {stage.category}
        </div>
        <div className="text-xs sm:text-sm font-extrabold text-slate-950 tracking-tight leading-tight mt-0.5">
          {stage.name}
        </div>
      </div>
    </div>
  );
}

interface StageInfoCardProps {
  stage: RoadmapStage;
  colorConfig: {
    milestoneBg: string;
    badgeBg: string;
    stemColor: string;
    hoverBorder: string;
  };
  align: "left" | "right";
}

function StageInfoCard({ stage, colorConfig, align }: StageInfoCardProps) {
  return (
    <div
      className={`w-full max-w-sm p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${colorConfig.badgeBg}`}
        >
          {stage.tier}
        </span>
        <span className="text-[11px] font-mono font-semibold text-slate-400">
          • {stage.systems.length} Core Systems
        </span>
      </div>

      <p className="text-xs text-slate-700 font-medium leading-relaxed">
        {stage.tagline}
      </p>

      {/* Key Concepts Chips */}
      <div
        className={`flex flex-wrap gap-1.5 pt-1 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {stage.keyConcepts.map((concept, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-medium border border-slate-200/60"
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  );
}

interface StageBranchConnectorProps {
  cardCount: number;
  direction: "left" | "right";
  color?: string;
}

function StageBranchConnector({
  cardCount,
  direction,
  color = "#099BE9",
}: StageBranchConnectorProps) {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full pointer-events-none"
      >
        {Array.from({ length: cardCount }).map((_, i) => {
          const yTarget = ((i + 0.5) / cardCount) * 100;
          const d =
            direction === "right"
              ? `M 0 50 C 45 50, 55 ${yTarget}, 100 ${yTarget}`
              : `M 100 50 C 55 50, 45 ${yTarget}, 0 ${yTarget}`;
          return (
            <path
              key={i}
              d={d}
              stroke={color}
              strokeWidth="2.5"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
          );
        })}
      </svg>
    </div>
  );
}

function StageInfoConnector({ color = "#cbd5e1" }: { color?: string }) {
  return (
    <div className="w-full h-6 flex items-center justify-center">
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="w-full h-2.5 pointer-events-none"
      >
        <line
          x1="0"
          y1="5"
          x2="100"
          y2="5"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

interface RoadmapChallengeCardProps {
  challenge: CoreChallenge;
  isSolved: boolean;
  completedLevels: number;
  accentColor: "teal" | "purple" | "orange" | "blue";
}

function RoadmapChallengeCard({
  challenge,
  isSolved,
  completedLevels,
  accentColor,
}: RoadmapChallengeCardProps) {
  const accentHover = {
    teal: "hover:border-[#09C899] hover:shadow-[#09C899]/15",
    purple: "hover:border-[#8647E2] hover:shadow-[#8647E2]/15",
    orange: "hover:border-[#FBAE0C] hover:shadow-[#FBAE0C]/15",
    blue: "hover:border-[#099BE9] hover:shadow-[#099BE9]/15",
  }[accentColor];

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all ${accentHover} w-full`}
    >
      {/* Left: Number badge + Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
          #{challenge.number}
        </span>
        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#099BE9] transition-colors leading-tight">
          {challenge.title}
        </span>
      </div>

      {/* Right: Solved Badge (Only if all 6 levels completed) or Level Progress or Difficulty */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {isSolved ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#09C899]/15 text-[#0AA793] border border-[#09C899]/30">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Solved</span>
          </span>
        ) : completedLevels > 0 ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{completedLevels}/6</span>
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
