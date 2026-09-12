"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
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
  Check,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { CORE_CHALLENGES, CoreChallenge } from "@/lib/constants/core-challenges";

interface SystemsRoadmapProps {
  userSolvedSlugs: string[];
}

type ViewMode = "difficulty" | "domain";

interface TierDefinition {
  id: string;
  name: string;
  badge: string;
  difficulty: "Beginner" | "Medium" | "Hard";
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    accent: string;
    dotBg: string;
    lightBg: string;
  };
  description: string;
  milestoneTitle: string;
  milestoneDesc: string;
  slugs: string[];
}

const ROADMAP_TIERS: TierDefinition[] = [
  {
    id: "tier-1",
    name: "Tier 1: Foundations & Single-Process Systems",
    badge: "Beginner-Friendly",
    difficulty: "Beginner",
    colorTheme: {
      badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      badgeText: "text-emerald-600",
      border: "border-emerald-500/30",
      accent: "#10b981",
      dotBg: "bg-emerald-500",
      lightBg: "from-emerald-500/5 to-transparent",
    },
    description:
      "Start here. Learn operating system primitives, request parsing, in-memory pointer manipulation, and logging without complex distributed dependencies.",
    milestoneTitle: "Milestone 1: Foundations Complete",
    milestoneDesc:
      "You understand POSIX syscalls, process fork/exec, protocol framing, hash tables, and latency percentiles.",
    slugs: ["shell", "http-server", "kv-store", "lru-cache", "log-engine"],
  },
  {
    id: "tier-2",
    name: "Tier 2: Core Infrastructure, Storage & Schedulers",
    badge: "Medium / Intermediate",
    difficulty: "Medium",
    colorTheme: {
      badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      badgeText: "text-amber-600",
      border: "border-amber-500/30",
      accent: "#f59e0b",
      dotBg: "bg-amber-500",
      lightBg: "from-amber-500/5 to-transparent",
    },
    description:
      "Bridge single-process code to production infrastructure. Build real-world traffic control, disk durability, slotted-page indexing, and partition queues.",
    milestoneTitle: "Milestone 2: Infrastructure Mastery",
    milestoneDesc:
      "You can design custom rate limiters, layer-7 load balancers, multi-resource schedulers, and append-only message queues.",
    slugs: [
      "rate-limiter",
      "load-balancer",
      "task-scheduler",
      "database-index",
      "object-store",
      "message-queue",
      "git",
    ],
  },
  {
    id: "tier-3",
    name: "Tier 3: Distributed Consensus & AI Systems",
    badge: "Hard / Advanced",
    difficulty: "Hard",
    colorTheme: {
      badgeBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      badgeText: "text-rose-600",
      border: "border-rose-500/30",
      accent: "#f43f5e",
      dotBg: "bg-rose-500",
      lightBg: "from-rose-500/5 to-transparent",
    },
    description:
      "The pinnacle of modern software engineering. Build fault-tolerant consensus under partitions, high-dimensional vector search, and token inference runtimes.",
    milestoneTitle: "Milestone 3: Principal Systems Architect",
    milestoneDesc:
      "You have built Raft consensus from scratch, decoded Reed-Solomon erasure shards, and constructed an LLM KV cache.",
    slugs: [
      "distributed-consensus",
      "service-discovery",
      "distributed-object-storage",
      "search-engine",
      "vector-database",
      "llm-inference",
      "mcp-runtime",
      "container-runtime",
    ],
  },
];

const DOMAIN_GROUPS = [
  {
    id: "core-systems",
    name: "Core Systems & Operating Runtimes",
    description: "Low-level system calls, memory allocators, virtual namespaces, and B-Tree storage.",
    icon: Terminal,
    slugs: [
      "shell",
      "http-server",
      "git",
      "kv-store",
      "object-store",
      "lru-cache",
      "database-index",
      "container-runtime",
    ],
  },
  {
    id: "distributed-systems",
    name: "Distributed Systems & Streaming Infrastructure",
    description: "Multi-node replication, traffic routers, gossip protocols, and finite-field erasure coding.",
    icon: Network,
    slugs: [
      "message-queue",
      "log-engine",
      "rate-limiter",
      "load-balancer",
      "task-scheduler",
      "distributed-consensus",
      "service-discovery",
      "distributed-object-storage",
    ],
  },
  {
    id: "ai-systems",
    name: "AI Systems, Search & LLM Runtimes",
    description: "Inverted text indexes, HNSW proximity graphs, PagedAttention KV caches, and MCP agents.",
    icon: Bot,
    slugs: ["search-engine", "vector-database", "llm-inference", "mcp-runtime"],
  },
];

export function SystemsRoadmap({ userSolvedSlugs }: SystemsRoadmapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("difficulty");

  const challengeMap = React.useMemo(() => {
    const map = new Map<string, CoreChallenge>();
    CORE_CHALLENGES.forEach((c) => map.set(c.slug, c));
    return map;
  }, []);

  const totalChallenges = CORE_CHALLENGES.length;
  const solvedCount = userSolvedSlugs.length;
  const progressPercent = Math.round((solvedCount / totalChallenges) * 100);

  return (
    <div className="w-full">
      {/* Progress & Overview Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
                  <Route className="w-3.5 h-3.5 text-[#09C899]" />
                  Curriculum Roadmap
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Progressive First-Principles Path
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {solvedCount} of {totalChallenges} Systems Mastered
              </h3>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#09C899] to-[#0AA793] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(progressPercent, 4)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{totalChallenges * 6}</p>
                <p className="text-xs text-slate-500 font-medium">Engineering Levels</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">100% Native</p>
                <p className="text-xs text-slate-500 font-medium">Zero Black-Box Libs</p>
              </div>
            </div>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode("difficulty")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === "difficulty"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Route className="w-3.5 h-3.5 text-[#0AA793]" />
                Progressive Tiers (Beginner ➔ Hard)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("domain")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === "domain"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#0AA793]" />
                Domain Tracks (Core, Dist, AI)
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Click any challenge node to open its code workspace or curriculum.
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Tree Render */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {viewMode === "difficulty" ? (
          <div className="space-y-20 relative">
            {/* Center Vertical Connecting Spine */}
            <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-emerald-400 via-amber-400 to-rose-400 opacity-40 z-0" />

            {ROADMAP_TIERS.map((tier) => (
              <div key={tier.id} className="relative z-10 space-y-8">
                {/* Tier Section Header Pill */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-xs bg-white">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${tier.colorTheme.dotBg} animate-pulse`}
                    />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      {tier.badge}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {tier.name}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{tier.description}</p>
                </div>

                {/* Challenge Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {tier.slugs.map((slug) => {
                    const challenge = challengeMap.get(slug);
                    if (!challenge) return null;
                    const isSolved = userSolvedSlugs.includes(slug);

                    return (
                      <RoadmapCard
                        key={slug}
                        challenge={challenge}
                        isSolved={isSolved}
                        tierTheme={tier.colorTheme}
                      />
                    );
                  })}
                </div>

                {/* Milestone Banner */}
                <div className="max-w-xl mx-auto p-4 rounded-xl border border-slate-200 bg-slate-50/80 backdrop-blur-xs text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Award className="w-4 h-4 text-emerald-600" />
                    {tier.milestoneTitle}
                  </div>
                  <p className="text-xs text-slate-500">{tier.milestoneDesc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Domain Track View */
          <div className="space-y-16">
            {DOMAIN_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.id} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#09C899]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        {group.name}
                      </h2>
                      <p className="text-xs text-slate-500">{group.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {group.slugs.map((slug) => {
                      const challenge = challengeMap.get(slug);
                      if (!challenge) return null;
                      const isSolved = userSolvedSlugs.includes(slug);

                      return (
                        <RoadmapCard
                          key={slug}
                          challenge={challenge}
                          isSolved={isSolved}
                          tierTheme={{
                            badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
                            badgeText: "text-slate-700",
                            border: "border-slate-200",
                            accent: "#09C899",
                            dotBg: "bg-[#09C899]",
                            lightBg: "from-slate-50 to-transparent",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface RoadmapCardProps {
  challenge: CoreChallenge;
  isSolved: boolean;
  tierTheme: TierDefinition["colorTheme"];
}

function RoadmapCard({ challenge, isSolved, tierTheme }: RoadmapCardProps) {
  return (
    <div
      className={`group relative rounded-2xl border bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isSolved
          ? "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-emerald-50/10"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      {/* Solved Badge Indicator */}
      {isSolved && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          Solved
        </div>
      )}

      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            #{challenge.number}
          </span>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {challenge.inspiredBy}
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
              challenge.difficulty === "Easy"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : challenge.difficulty === "Medium"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {challenge.difficulty}
          </span>
        </div>

        {/* Title & Concept */}
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#0AA793] transition-colors">
            {challenge.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            {challenge.whatStudentsBuild}
          </p>
        </div>

        {/* 6 Stage Engineering Loop Milestones */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            6 Progression Levels
          </div>
          <div className="grid grid-cols-6 gap-1">
            {challenge.progressionLevels.map((lvl) => (
              <div
                key={lvl.level}
                title={`Level ${lvl.level}: ${lvl.name} (${lvl.focus})`}
                className="group/lvl relative h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-mono text-[10px] font-semibold text-slate-600 transition-colors"
              >
                L{lvl.level}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            href={`/challenges/${challenge.slug}/workspace`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-2xs"
          >
            Launch Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/challenges/${challenge.slug}`}
            className="inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            title="View Level Specifications"
          >
            <BookOpen className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
