"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  Database,
  Network,
  Bot,
  Zap,
  Flame,
  Award,
  BookOpen,
  Route,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { CORE_CHALLENGES, CoreChallenge } from "@/lib/constants/core-challenges";

interface SystemsRoadmapProps {
  userSolvedSlugs: string[];
}

interface RoadmapStage {
  id: string;
  stageNumber: number;
  name: string;
  category: string;
  tagline: string;
  accentColor: "teal" | "purple" | "orange" | "blue";
  systems: {
    slug: string;
    subtopics: string[];
    position: "center" | "left" | "right";
  }[];
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    stageNumber: 1,
    name: "Operating System Primitives & Network I/O",
    category: "FOUNDATIONS",
    tagline: "Process lifecycle, POSIX system calls, non-blocking I/O and protocol framing.",
    accentColor: "teal",
    systems: [
      {
        slug: "shell",
        subtopics: ["fork() & execvp()", "Anonymous Pipes", "SIGINT Trapping", "Zero-Copy Parsing"],
        position: "left",
      },
      {
        slug: "http-server",
        subtopics: ["Radix Trie Routing", "HTTP/1.1 Framing", "Keep-Alive Loop", "epoll Event Loop"],
        position: "right",
      },
    ],
  },
  {
    id: "stage-2",
    stageNumber: 2,
    name: "In-Memory State, Caching & Telemetry",
    category: "DATA STRUCTURES & MEMORY",
    tagline: "Hash collisions, doubly linked lists, TTL eviction, and high-frequency metrics.",
    accentColor: "purple",
    systems: [
      {
        slug: "kv-store",
        subtopics: ["FNV-1a Hash Buckets", "Append-Only WAL", "fsync() Platter", "Log Compaction"],
        position: "center",
      },
      {
        slug: "lru-cache",
        subtopics: ["Doubly Linked List", "O(1) Recency Map", "LFU Frequencies", "Memory Budgets"],
        position: "left",
      },
      {
        slug: "log-engine",
        subtopics: ["Zero-Alloc Ingest", "Status Aggregation", "Cardinality Top-K", "P99 Tail Latency"],
        position: "right",
      },
    ],
  },
  {
    id: "stage-3",
    stageNumber: 3,
    name: "Traffic Control, Routing & Resource Schedulers",
    category: "CONCURRENCY & NETWORKING",
    tagline: "Rate limiting algorithms, weighted packet dispatch, and multi-resource bin packing.",
    accentColor: "orange",
    systems: [
      {
        slug: "rate-limiter",
        subtopics: ["Token Bucket", "Sliding Window Log", "Leaky Bucket", "Multi-Tenant Tiers"],
        position: "center",
      },
      {
        slug: "load-balancer",
        subtopics: ["Weighted Round-Robin", "Least Connections", "Circuit Breakers", "Consistent Hashing"],
        position: "left",
      },
      {
        slug: "task-scheduler",
        subtopics: ["Priority Heaps", "Best-Fit Packing", "Worker Heartbeats", "Dominant Resource (DRF)"],
        position: "right",
      },
    ],
  },
  {
    id: "stage-4",
    stageNumber: 4,
    name: "Storage Engines, Merkle Trees & Streaming Logs",
    category: "DURABILITY & PERSISTENCE",
    tagline: "Slotted page formats, content-addressable Merkle DAGs, and partitioned commit logs.",
    accentColor: "purple",
    systems: [
      {
        slug: "database-index",
        subtopics: ["B-Tree Point Splits", "Leaf-Chain Range Scan", "4KB Slotted Pages", "LRU Buffer Pool"],
        position: "left",
      },
      {
        slug: "git",
        subtopics: ["SHA-1 Content Hash", "Merkle Tree Graph", "Fast Tree Diffing", "Binary Packfiles"],
        position: "right",
      },
      {
        slug: "object-store",
        subtopics: ["Chunk Deduplication", "Bit-Rot Scrubbing", "Multipart Assembly", "O_DIRECT Bypass"],
        position: "left",
      },
      {
        slug: "message-queue",
        subtopics: ["Partition Offsets", "Consumer Groups", "Batch Commits", "Crash Resilience"],
        position: "right",
      },
    ],
  },
  {
    id: "stage-5",
    stageNumber: 5,
    name: "Linux Isolation & Distributed Consensus",
    category: "DISTRIBUTED SYSTEMS",
    tagline: "OS namespaces, Raft quorum replication, gossip failure detectors, and erasure codes.",
    accentColor: "teal",
    systems: [
      {
        slug: "distributed-consensus",
        subtopics: ["Raft Leader Election", "Quorum Log Replication", "Partition Split-Brain", "Log Snapshots"],
        position: "center",
      },
      {
        slug: "container-runtime",
        subtopics: ["PID/IPC Namespaces", "pivot_root Isolation", "Cgroup Memory Limits", "Hot-Pool Prewarm"],
        position: "left",
      },
      {
        slug: "service-discovery",
        subtopics: ["Dynamic Heartbeats", "Embedded RFC DNS", "SWIM Gossip Mesh", "Lock-Free RCU"],
        position: "right",
      },
      {
        slug: "distributed-object-storage",
        subtopics: ["Reed-Solomon GF(2^8)", "Shard Reconstruction", "Hedged Reads", "SIMD Hardware Acceleration"],
        position: "center",
      },
    ],
  },
  {
    id: "stage-6",
    stageNumber: 6,
    name: "AI Systems, Vector Search & LLM Inference",
    category: "AI & NEURAL RUNTIMES",
    tagline: "Inverted text indexes, HNSW proximity graphs, PagedAttention KV caches, and MCP protocols.",
    accentColor: "blue",
    systems: [
      {
        slug: "llm-inference",
        subtopics: ["Token Buffer Decoder", "KV Cache Acceleration", "PagedAttention Blocks", "FlashAttention Tiling"],
        position: "center",
      },
      {
        slug: "vector-database",
        subtopics: ["Exact Cosine kNN", "HNSW Small-World Graph", "Horizontal Sharding", "Scalar Quantization SQ8"],
        position: "left",
      },
      {
        slug: "search-engine",
        subtopics: ["Inverted Postings", "Boolean AND/OR Logic", "Okapi BM25 Scoring", "LSM Segment Compaction"],
        position: "right",
      },
      {
        slug: "mcp-runtime",
        subtopics: ["JSON-RPC 2.0 Framing", "Resource Templates", "Sandboxed Tool Dispatch", "SIMD JSON Parser"],
        position: "center",
      },
    ],
  },
];

export function SystemsRoadmap({ userSolvedSlugs }: SystemsRoadmapProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<CoreChallenge | null>(null);
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Control Bar & Legend (Exact roadmap.sh style) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Legend Card */}
          <div className="bg-white rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] p-4 text-xs font-semibold text-slate-800 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Curriculum Legend
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#09C899] border border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                <span className="text-xs font-bold text-slate-500">Progress: </span>
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
        <div className="space-y-16 max-w-4xl mx-auto relative pt-4">
          {filteredStages.map((stage, stageIdx) => {
            const colorStyles = {
              teal: {
                bg: "bg-[#09C899]",
                headerText: "text-slate-950 font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/30 text-slate-950",
                lineStroke: "#0AA793",
              },
              purple: {
                bg: "bg-[#8647E2]",
                headerText: "text-white font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/20 text-white",
                lineStroke: "#8647E2",
              },
              orange: {
                bg: "bg-[#FBAE0C]",
                headerText: "text-slate-950 font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/30 text-slate-950",
                lineStroke: "#F78424",
              },
              blue: {
                bg: "bg-[#099BE9]",
                headerText: "text-white font-black",
                border: "border-slate-900",
                badgeBg: "bg-white/20 text-white",
                lineStroke: "#099BE9",
              },
            }[stage.accentColor];

            return (
              <div key={stage.id} className="relative space-y-8">
                {/* Connecting Line from Previous Stage */}
                {stageIdx > 0 && (
                  <div className="flex justify-center -mt-8 mb-4">
                    <div className="w-0.5 h-10 border-l-2 border-dashed border-slate-900" />
                  </div>
                )}

                {/* Central Stage Milestone Node (roadmap.sh Primary Node) */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-full max-w-xl rounded-2xl border-2 ${colorStyles.border} ${colorStyles.bg} shadow-[4px_4px_0px_0px_#09090b] p-5 text-center space-y-2 relative`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${colorStyles.badgeBg}`}
                      >
                        STAGE {stage.stageNumber} • {stage.category}
                      </span>
                    </div>

                    <h2 className={`text-xl sm:text-2xl tracking-tight ${colorStyles.headerText}`}>
                      {stage.name}
                    </h2>

                    <p
                      className={`text-xs max-w-md mx-auto leading-relaxed font-medium ${
                        stage.accentColor === "purple" || stage.accentColor === "blue"
                          ? "text-white/90"
                          : "text-slate-900/80"
                      }`}
                    >
                      {stage.tagline}
                    </p>
                  </div>

                  {/* Vertical Trunk Line down to children */}
                  <div className="w-0.5 h-6 bg-slate-900 my-1" />
                </div>

                {/* Systems Flowchart Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {stage.systems.map((item, sysIdx) => {
                    const challenge = challengeMap.get(item.slug);
                    if (!challenge) return null;
                    const isSolved = userSolvedSlugs.includes(item.slug);

                    return (
                      <RoadmapNodeCard
                        key={item.slug}
                        challenge={challenge}
                        subtopics={item.subtopics}
                        isSolved={isSolved}
                        accentColor={stage.accentColor}
                        onSelect={() => setSelectedChallenge(challenge)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE DETAIL MODAL DRAWER */}
      {/* ========================================================================= */}
      {selectedChallenge && (
        <ChallengeDetailDrawer
          challenge={selectedChallenge}
          isSolved={userSolvedSlugs.includes(selectedChallenge.slug)}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}

interface RoadmapNodeCardProps {
  challenge: CoreChallenge;
  subtopics: string[];
  isSolved: boolean;
  accentColor: "teal" | "purple" | "orange" | "blue";
  onSelect: () => void;
}

function RoadmapNodeCard({
  challenge,
  subtopics,
  isSolved,
  accentColor,
  onSelect,
}: RoadmapNodeCardProps) {
  const accentBorder = {
    teal: "hover:border-[#09C899]",
    purple: "hover:border-[#8647E2]",
    orange: "hover:border-[#FBAE0C]",
    blue: "hover:border-[#099BE9]",
  }[accentColor];

  const badgeColor = {
    teal: "bg-[#09C899]/10 text-[#0AA793] border-[#09C899]/30",
    purple: "bg-[#8647E2]/10 text-[#8647E2] border-[#8647E2]/30",
    orange: "bg-[#FBAE0C]/10 text-[#F78424] border-[#FBAE0C]/30",
    blue: "bg-[#099BE9]/10 text-[#099BE9] border-[#099BE9]/30",
  }[accentColor];

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b] hover:shadow-[5px_5px_0px_0px_#09090b] hover:-translate-y-0.5 transition-all p-5 space-y-4 relative ${accentBorder}`}
    >
      {/* Solved Checkmark Icon (roadmap.sh badge) */}
      {isSolved && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#09C899] text-white border border-slate-900 shadow-2xs">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Solved</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md">
          #{challenge.number}
        </span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
          {challenge.inspiredBy}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase">
          {challenge.difficulty}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-[#099BE9] transition-colors">
          {challenge.title}
        </h3>
        <p className="text-xs text-slate-600 mt-1 font-medium line-clamp-2 leading-relaxed">
          {challenge.whatStudentsBuild}
        </p>
      </div>

      {/* Subtopic Pills with clean Roadmap.sh outlines */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
        {subtopics.map((sub, idx) => (
          <span
            key={idx}
            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
          >
            {sub}
          </span>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-1 flex items-center justify-between text-xs font-bold text-slate-900">
        <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-slate-900">
          Inspect Architecture
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
        <span className="font-mono text-[11px] text-slate-400">6 Levels</span>
      </div>
    </div>
  );
}

interface ChallengeDetailDrawerProps {
  challenge: CoreChallenge;
  isSolved: boolean;
  onClose: () => void;
}

function ChallengeDetailDrawer({
  challenge,
  isSolved,
  onClose,
}: ChallengeDetailDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#09090b] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#262626] text-white p-6 border-b-2 border-slate-900 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-mono text-xs font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded">
              #{challenge.number}
            </span>
            <span className="text-xs font-bold text-[#09C899] bg-[#09C899]/15 border border-[#09C899]/30 px-2.5 py-0.5 rounded">
              {challenge.domainLabel}
            </span>
            <span className="text-xs font-semibold text-neutral-300">
              {challenge.inspiredBy}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {challenge.title}
          </h2>
          <p className="text-xs text-neutral-300 mt-1 font-medium">
            {challenge.signatureQuestion}
          </p>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              System Specification
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {challenge.overview}
            </p>
          </div>

          {/* 6 Progression Levels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              6-Stage Progressive Levels
            </h4>
            <div className="space-y-2">
              {challenge.progressionLevels.map((lvl) => (
                <div
                  key={lvl.level}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                >
                  <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded shrink-0">
                    L{lvl.level}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">{lvl.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {lvl.focus}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shrink-0">
                    {lvl.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-between gap-3">
          <Link
            href={`/challenges/${challenge.slug}`}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border-2 border-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#09090b]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Specs
          </Link>

          <Link
            href={`/challenges/${challenge.slug}/workspace`}
            className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all inline-flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#09090b]"
          >
            Launch Code Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
