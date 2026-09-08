import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Terminal,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Code2,
  Layers,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Server,
  Zap,
  ShieldAlert,
  Database,
  Lock,
  Activity,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "@/lib/constants/challenge-data";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";
import { getChallenge } from "@/lib/challenges";

const CHALLENGE_TARGET_SPECS: Record<
  string,
  {
    targetOutcome: string;
    metrics: Array<{ label: string; value: string; desc: string; color: string }>;
  }
> = {
  "kv-store": {
    targetOutcome:
      "Engineered a production-grade, crash-resilient in-memory key-value storage engine with synchronous WAL durability, millisecond TTL eviction, and 32-shard mutex concurrency.",
    metrics: [
      { label: "THROUGHPUT", value: "> 100,000 ops/s", desc: "Pipeline stream dispatch", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 0.20ms p99", desc: "Sub-millisecond access", color: "text-[#099BE9]" },
      { label: "RESOURCE", value: "256 MB RAM", desc: "Hard cgroup memory cap", color: "text-[#F78424]" },
    ],
  },
  "http-server": {
    targetOutcome:
      "Engineered an RFC 7230 compliant HTTP/1.1 server from raw TCP sockets with non-blocking epoll/kqueue event loops, trie dynamic routing, and keep-alive connection pooling.",
    metrics: [
      { label: "THROUGHPUT", value: "> 50,000 req/s", desc: "Zero-copy file streaming", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 1.0ms p99", desc: "Non-blocking event loop", color: "text-[#099BE9]" },
      { label: "CONCURRENCY", value: "10,000+ Conn.", desc: "C10K persistent pool", color: "text-[#F78424]" },
    ],
  },
  "message-queue": {
    targetOutcome:
      "Engineered an append-only distributed commit log and message broker supporting multi-partition topics, consumer group rebalancing, and zero-copy sendfile delivery.",
    metrics: [
      { label: "THROUGHPUT", value: "> 100,000 msg/s", desc: "Segmented batch commit", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 2.0ms p99", desc: "Producer commit latency", color: "text-[#099BE9]" },
      { label: "DURABILITY", value: "Zero Loss", desc: "Crash recovery fsync", color: "text-[#F78424]" },
    ],
  },
  "database-index": {
    targetOutcome:
      "Engineered a disk-backed B+Tree storage engine with 4KB slotted page serialization, binary search node branching, range scans via leaf sibling pointers, and LRU buffer pool management.",
    metrics: [
      { label: "THROUGHPUT", value: "> 80,000 ops/s", desc: "Point queries & range scans", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 0.15ms p99", desc: "Slotted page tree traversal", color: "text-[#099BE9]" },
      { label: "PAGE FORMAT", value: "4 KB Pages", desc: "Slotted disk serialization", color: "text-[#F78424]" },
    ],
  },
  "lru-cache": {
    targetOutcome:
      "Engineered high-performance LRU, LFU, and W-TinyLFU cache engines with O(1) pointer relinking, frequency bucket lists, stripe-locked concurrency, and strict byte memory budgets.",
    metrics: [
      { label: "THROUGHPUT", value: "> 250,000 ops/s", desc: "O(1) lookup & eviction", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 0.05ms p99", desc: "Sub-microsecond memory hit", color: "text-[#099BE9]" },
      { label: "HIT RATIO", value: "> 85% Target", desc: "Under 1M access stream", color: "text-[#F78424]" },
    ],
  },
  "log-engine": {
    targetOutcome:
      "Engineered a blazingly fast streaming telemetry and observability engine with zero-copy SIMD line parsing, rolling error rate ring buffers, Count-Min Sketches, and streaming p99 estimation.",
    metrics: [
      { label: "THROUGHPUT", value: "> 500 MB/sec", desc: "SIMD wire-speed ingest", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 50ms query", desc: "Windowed rollups & Top-K", color: "text-[#099BE9]" },
      { label: "MEMORY", value: "Zero Leak", desc: "Bounded RAM on 10GB stream", color: "text-[#F78424]" },
    ],
  },
  "task-scheduler": {
    targetOutcome:
      "Engineered an autonomous cluster task scheduler modeling Kubernetes kube-scheduler with multi-dimensional vector bin-packing, preemption, and Dominant Resource Fairness (DRF).",
    metrics: [
      { label: "THROUGHPUT", value: "> 20,000 jobs/s", desc: "Vector bin-packing", color: "text-[#0AA793]" },
      { label: "DECISION", value: "< 1.0ms p99", desc: "Optimistic conflict check", color: "text-[#099BE9]" },
      { label: "FAIRNESS", value: "0% Miss Rate", desc: "Dominant Resource Fairness", color: "text-[#F78424]" },
    ],
  },
  "rate-limiter": {
    targetOutcome:
      "Engineered a high-throughput API rate limiter and traffic shaper implementing Sliding Window Logs, Token Bucket, and Leaky Bucket with atomic CAS lock-free concurrency.",
    metrics: [
      { label: "THROUGHPUT", value: "> 150,000 req/s", desc: "Atomic CAS state updates", color: "text-[#0AA793]" },
      { label: "DECISION", value: "< 0.05ms", desc: "Token refill evaluation", color: "text-[#099BE9]" },
      { label: "CAPACITY", value: "1,000,000 Users", desc: "Bounded window footprint", color: "text-[#F78424]" },
    ],
  },
  "load-balancer": {
    targetOutcome:
      "Engineered a Layer 7 reverse proxy and load balancer with smooth weighted round-robin, least-connections dynamic routing, passive circuit breaking, and Ketama consistent hashing.",
    metrics: [
      { label: "THROUGHPUT", value: "> 100,000 req/s", desc: "Smooth weighted RR", color: "text-[#0AA793]" },
      { label: "OVERHEAD", value: "< 0.10ms proxy", desc: "Consistent hash ring", color: "text-[#099BE9]" },
      { label: "FAILOVER", value: "< 100ms Trip", desc: "Zero-downtime circuit breaker", color: "text-[#F78424]" },
    ],
  },
  "search-engine": {
    targetOutcome:
      "Engineered a production-grade search engine from first principles supporting inverted index construction, fast boolean query intersections, BM25 probabilistic relevance ranking, positional phrase matching, and immutable segment compaction.",
    metrics: [
      { label: "THROUGHPUT", value: "> 50,000 docs/s", desc: "Inverted index builder", color: "text-[#0AA793]" },
      { label: "QUERY LATENCY", value: "< 5.0ms p99", desc: "BM25 scoring over 1M docs", color: "text-[#099BE9]" },
      { label: "COMPRESSION", value: "80% Compact", desc: "Elias-Fano / Varint postings", color: "text-[#F78424]" },
    ],
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const coreDef = CORE_CHALLENGES.find((c) => c.slug === id || c.number === id);
  const challengeData = getChallenge(id);

  let challenge = {
    id: coreDef?.slug || challengeData?.slug || id || "kv-store",
    slug: coreDef?.slug || challengeData?.slug || id || "kv-store",
    title: challengeData?.title || coreDef?.title || PROJECT_SCOPE.title,
    description: challengeData?.overview || coreDef?.overview || PROJECT_SCOPE.overview,
    difficulty: coreDef?.difficulty || "MEDIUM",
  };

  let version: any = null;
  let spec: any = {};
  let apiSpec: any[] = [];
  let whatYouLearn: string[] = challengeData
    ? challengeData.architecturalLayers.map((l) => `${l.name}: ${l.description}`)
    : [
        "O(1) in-memory pointer resolution & fast stream command dispatching",
        "64-bit MurmurHash3 uniform hashing and dynamic 0.75 load factor rehashing",
        "Append-only Write-Ahead Logging (WAL) and <50ms crash recovery replay",
        "Dual-mode TTL eviction with passive evaluation & active background sweepers",
        "32-shard striped mutex concurrency without race conditions or deadlocks",
        "100K+ ops/sec throughput, online log compaction, and custom slab memory arenas",
      ];

  try {
    const foundChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, id))
      .limit(1);

    if (foundChallenges[0]) {
      challenge = foundChallenges[0];

      const versions = await db
        .select()
        .from(challengeVersions)
        .where(eq(challengeVersions.challengeId, challenge.id))
        .orderBy(desc(challengeVersions.version))
        .limit(1);

      if (versions[0]) {
        version = versions[0];
        spec = (version?.spec as any) || {};
        apiSpec = (spec.apiSpecification as any[]) || [];
        if (spec.whatYouLearn && Array.isArray(spec.whatYouLearn)) {
          whatYouLearn = spec.whatYouLearn;
        }
      }
    }
  } catch (err) {
    console.warn("Database query skipped or unavailable in challenge detail page:", err);
  }

  // Fallback API spec if empty from DB
  if (!apiSpec || apiSpec.length === 0) {
    if (challengeData) {
      apiSpec = Object.values(challengeData.levels).flatMap((l) =>
        l.operations.map((op) => ({
          command: op.cmd,
          returns: "Response",
          description: op.desc,
        }))
      );
    } else {
      apiSpec = [
        { command: "SET <key> <val>", returns: "OK", description: "Store key-value pair in memory. Overwrites existing." },
        { command: "GET <key>", returns: "<val> | NULL", description: "Retrieve value or NULL if absent or expired." },
        { command: "DELETE <key>", returns: "OK | NOT_FOUND", description: "Removes key from store." },
        { command: "EXISTS <key>", returns: "TRUE | FALSE", description: "Determines if key exists and is non-expired." },
        { command: "SAVE", returns: "OK", description: "Persist current memory state snapshot to disk." },
        { command: "RESTORE", returns: "OK", description: "Reconstitute memory state from disk snapshot." },
        { command: "FLUSHALL", returns: "OK", description: "Wipes all keys from memory." },
        { command: "EXPIRE <key> <ms>", returns: "OK | NOT_FOUND", description: "Sets millisecond TTL on key." },
        { command: "TTL <key>", returns: "<ms> | -1 | -2", description: "Returns remaining TTL in ms (-1 permanent, -2 absent)." },
        { command: "PERSIST <key>", returns: "OK | NOT_FOUND", description: "Removes expiration from key." },
        { command: "PING [msg]", returns: "PONG | <msg>", description: "Health check response for concurrent connections." },
        { command: "MGET <k1> <k2>...", returns: "Multiple lines", description: "Batch atomic multi-key read." },
        { command: "MSET <k1> <v1>...", returns: "OK", description: "Batch atomic multi-key write across shards." },
        { command: "COMPACT", returns: "OK", description: "Online WAL compaction / tombstone elimination." },
        { command: "MEMSTATS", returns: "<used_bytes>", description: "Reports accurate heap usage in bytes." },
      ];
    }
  }

  const levelsArray = (Array.isArray(version?.levels) && version.levels.length > 0)
    ? version.levels.map((l: any, idx: number) => ({
        ...l,
        level: l.level || idx + 1,
        title: l.title || `Level ${idx + 1}`,
        shortTitle: l.title ? (l.title.length > 25 ? l.title.slice(0, 25) + "..." : l.title) : `Level ${idx + 1}`,
        difficulty: l.difficulty || "Medium",
        tagline: l.tagline || l.description || "",
      }))
    : challengeData
    ? Object.values(challengeData.levels).sort((a, b) => a.level - b.level)
    : Object.values(LEVEL_DEFINITIONS).sort((a, b) => a.level - b.level);

  const isKv = challenge.slug === "kv-store";
  const scopeSubtitle = challengeData?.subtitle || (isKv
    ? PROJECT_SCOPE.subtitle
    : `Inspired by ${coreDef?.inspiredBy ?? "Production Systems"} • ${coreDef?.whatStudentsBuild ?? "Systems Engineering"}`);
  const scopeOverview = challengeData?.overview || (isKv ? PROJECT_SCOPE.overview : (coreDef?.overview || challenge.description));
  const scopeWhyItMatters = challengeData?.whyItMatters || (isKv
    ? PROJECT_SCOPE.whyItMatters
    : `Signature Question: "${coreDef?.signatureQuestion}". Build real technology from first principles to master ${coreDef?.mainSkill}.`);
  const layers = challengeData?.architecturalLayers || (isKv
    ? PROJECT_SCOPE.architecturalLayers
    : (coreDef?.progressionLevels || []).map((lvl) => ({
        number: lvl.level,
        name: lvl.name,
        focus: lvl.focus,
        description: lvl.focus,
        realWorldTech: coreDef?.inspiredBy || "Production Standard",
      })));
  const targetSpec = CHALLENGE_TARGET_SPECS[challenge.slug] || CHALLENGE_TARGET_SPECS["kv-store"];
  const philosophy = challengeData?.philosophy;
  const architectureDiagram = challengeData?.architectureDiagram;
  const levelRoadmap = challengeData?.levelRoadmap || levelsArray.map((l: any) => ({
    level: l.level,
    whatWeBuild: l.title,
    mainConcept: l.tagline || l.description || "Core Systems Engineering",
    parity: coreDef?.inspiredBy || "Production Standard",
  }));

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navbar user={session?.user as any} variant="dark" />

      {/* Dark Hero Masthead */}
      <section className="relative bg-[#262626] pt-8 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono font-medium mb-4">
            <Link href="/challenges" className="hover:text-white transition-colors">
              Curriculum
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-neutral-400">{coreDef?.domainLabel ?? "SYSTEMS"}</span>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-white font-bold">{challenge.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {coreDef?.number ? `${coreDef.number}. ` : ""}{challenge.title}
                </h1>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono border ${
                  challenge.difficulty === "Easy"
                    ? "text-[#09C899] bg-[#09C899]/15 border-[#09C899]/40"
                    : challenge.difficulty === "Medium"
                    ? "text-[#FBAE0C] bg-[#FBAE0C]/15 border-[#FBAE0C]/40"
                    : "text-[#8647E2] bg-[#8647E2]/15 border-[#8647E2]/40"
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-[#099BE9]/15 text-[#099BE9] border border-[#099BE9]/40">
                  {levelsArray.length} Progressive Levels
                </span>
                {coreDef?.isFlagship && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-[#099BE9]/15 text-[#099BE9] border border-[#099BE9]/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#099BE9]" />
                    FLAGSHIP
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                {scopeSubtitle}
              </p>

              {philosophy && (
                <p className="text-xs font-mono text-[#09C899] italic font-semibold">
                  &ldquo;{philosophy}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-200 border border-white/10 font-semibold">
                  Domain: {coreDef?.domainLabel ?? "SYSTEMS"}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-200 border border-white/10 font-medium">
                  Inspired by <strong className="text-white font-bold">{coreDef?.inspiredBy ?? "Redis"}</strong>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-200 border border-white/10 font-medium">
                  Python, C++, Rust, Go, Java
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#09C899]/15 text-[#09C899] border border-[#09C899]/40 font-bold">
                  Target: {coreDef?.benchmarkMetrics[0] ?? "> 100,000 ops/s"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link href={`/challenges/${challenge.slug}/leaderboard`}>
                <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5 border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer">
                  <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
                  <span>Leaderboard</span>
                </Button>
              </Link>
              <Link href={`/challenges/${challenge.slug}/workspace`}>
                <Button size="sm" className="h-9 px-4 text-xs font-bold gap-1.5 shadow-sm bg-[#09C899] hover:bg-[#0AA793] text-white border-0 cursor-pointer">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Launch Workspace</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      {/* Main 2-Column Content Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Problem Statement & System Contract */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                  System Contract &amp; Overview
                </div>
                <h2 className="text-lg font-bold text-slate-950">
                  What You Are Engineering
                </h2>
                <p className="text-sm text-slate-800 leading-relaxed font-normal mt-2">
                  {scopeOverview}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Zap className="w-4 h-4 text-[#F78424] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-950 font-semibold">Why this matters: </strong>
                  {scopeWhyItMatters}
                </div>
              </div>
            </div>

            {/* 2. System Architecture Blueprint */}
            {architectureDiagram && (
              <div className="rounded-2xl border border-slate-800 bg-[#141416] overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1e] border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                      System Architecture Blueprint // First Principles
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#099BE9]">
                    {challenge.title}
                  </span>
                </div>
                <div className="p-5 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre className="whitespace-pre leading-relaxed text-[#09C899] font-medium">{architectureDiagram}</pre>
                </div>
              </div>
            )}

            {/* 3. Progressive 6-Level Roadmap */}
            {Array.isArray(levelRoadmap) && levelRoadmap.length > 0 && (
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                      Curriculum &amp; Progression
                    </div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Progressive 6-Level Roadmap
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    Level 1 → Level 6
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="grid grid-cols-12 bg-slate-50 p-3 font-mono font-bold text-[11px] text-slate-700 uppercase border-b border-slate-200">
                    <div className="col-span-2">Level</div>
                    <div className="col-span-4">What You Build</div>
                    <div className="col-span-4">Core Systems Concept</div>
                    <div className="col-span-2 text-right">Production Parity</div>
                  </div>
                  {levelRoadmap.map((item: any, idx: number) => {
                    const matchingLayer = layers[idx] || layers.find((l: any) => l.number === item.level);
                    const parity = item.parity || matchingLayer?.realWorldTech?.split(",")[0] || matchingLayer?.realWorldTech || "Production Standard";
                    return (
                      <div
                        key={item.level}
                        className="grid grid-cols-12 p-3.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors items-center text-xs"
                      >
                        <div className="col-span-2 font-mono font-bold text-[#099BE9]">Level {item.level}</div>
                        <div className="col-span-4 font-semibold text-slate-900">{item.whatWeBuild}</div>
                        <div className="col-span-4 text-slate-600 font-mono text-[11px] leading-relaxed">{item.mainConcept}</div>
                        <div className="col-span-2 text-slate-500 font-mono text-[10px] text-right truncate" title={matchingLayer?.realWorldTech}>
                          {parity}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Command Interface Specification Table */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                    Protocol &amp; I/O Contract
                  </div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Command Interface Specification
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Newline-delimited stream protocol over standard input / standard output.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                  Universal POSIX I/O
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-900 font-bold font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-bold">Command</th>
                      <th className="py-2.5 px-3 font-bold">Return Value</th>
                      <th className="py-2.5 px-3 font-bold font-sans">Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {apiSpec.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#099BE9]">{item.command}</td>
                        <td className="py-2.5 px-3 font-bold text-[#0AA793]">{item.returns}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-800 text-xs font-medium">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Engineering Skills Mastered */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                Outcomes
              </div>
              <h2 className="text-lg font-bold text-slate-950">
                Engineering Skills Mastered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 pt-1">
                {whatYouLearn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0AA793] shrink-0" />
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card 1: Workspace Launch & Performance Targets */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Proving Ground Targets
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  Build and benchmark your solution in isolated Linux namespaces.
                </p>
              </div>

              <Link href={`/challenges/${challenge.slug}/workspace`} className="w-full block">
                <Button className="w-full text-xs font-bold h-10 shadow-xs gap-1.5 bg-[#09C899] hover:bg-[#0AA793] text-white border-0 cursor-pointer">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Launch Workspace</span>
                </Button>
              </Link>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Verified Benchmarks
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div className="text-[11px] text-slate-500 font-semibold">{targetSpec.metrics[0].label}</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {targetSpec.metrics[0].value}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      {targetSpec.metrics[0].desc}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#09C899]/10 border border-[#09C899]/30">
                    <div className="text-[11px] text-[#0AA793] font-semibold">{targetSpec.metrics[1].label}</div>
                    <div className="text-base font-bold text-[#0AA793] mt-0.5">
                      {targetSpec.metrics[1].value}
                    </div>
                    <div className="text-[10px] text-[#09C899] mt-0.5 font-medium">
                      {targetSpec.metrics[1].desc}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link href={`/challenges/${challenge.slug}/leaderboard`} className="w-full block">
                  <Button variant="outline" className="w-full text-xs font-semibold h-9 border-slate-200 bg-white hover:bg-slate-50 gap-1.5 cursor-pointer">
                    <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
                    <span>View Challenge Leaderboard</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: Execution Constraints */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                Execution Constraints
              </div>
              <ul className="text-xs font-mono text-slate-700 space-y-2">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Memory Cap:</span>
                  <span className="font-semibold text-slate-900">256 MB (Hard cgroup)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">CPU Quota:</span>
                  <span className="font-semibold text-slate-900">1.0 Core</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Network Access:</span>
                  <span className="font-semibold text-rose-600">Disabled (isolated)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Execution Timeout:</span>
                  <span className="font-semibold text-slate-900">30 seconds</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">WAL Log Path:</span>
                  <span className="font-semibold text-slate-900">./data/wal.log</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span className="text-slate-600 font-medium">Sandbox User:</span>
                  <span className="font-semibold text-slate-900">Non-Root (1000)</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
