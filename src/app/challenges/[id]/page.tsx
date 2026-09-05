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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  let challenge = {
    id: "kv-store",
    slug: id || "kv-store",
    title: PROJECT_SCOPE.title,
    description: PROJECT_SCOPE.overview,
    difficulty: "MEDIUM",
  };

  let version: any = null;
  let spec: any = {};
  let apiSpec: any[] = [];
  let whatYouLearn: string[] = [
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

  const levelsArray = Object.values(LEVEL_DEFINITIONS).sort((a, b) => a.level - b.level);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] font-sans">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Link href="/challenges" className="hover:text-slate-900 transition-colors">
                Problems
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-800 font-semibold">{challenge.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                1. {challenge.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold font-mono border text-amber-600 bg-amber-50 border-amber-200">
                {challenge.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                6 Progressive Levels
              </span>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                In-Memory Databases
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                Redis & RocksDB Internal Architecture
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                Python 3.12, C++20
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                Target: &gt;100,000 ops/s
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link href={`/challenges/${challenge.slug}/leaderboard`}>
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Leaderboard</span>
              </Button>
            </Link>
            <Link href={`/challenges/${challenge.slug}/workspace`}>
              <Button size="sm" variant="primary" className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>Launch IDE & Workspace</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROJECT SCOPE & 6-LAYER ARCHITECTURE BLUEPRINT SECTION */}
        {/* ========================================================================= */}
        <section className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/60 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                <Sparkles className="w-3 h-3" />
                {PROJECT_SCOPE.badge}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {PROJECT_SCOPE.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {PROJECT_SCOPE.subtitle}
              </p>
            </div>

            <Link href={`/challenges/${challenge.slug}/workspace`}>
              <Button size="sm" variant="primary" className="h-9 px-4 text-xs font-semibold gap-1.5 shrink-0">
                <span>Start Level 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600 bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
            <div>
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>What You Are Building</span>
              </div>
              <p>{PROJECT_SCOPE.overview}</p>
            </div>
            <div>
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Why This Systems Engineering Loop Matters</span>
              </div>
              <p>{PROJECT_SCOPE.whyItMatters}</p>
            </div>
          </div>

          {/* 6 Architectural Layers Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>The 6 Core Architectural Layers</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Production-Grade System Anatomy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROJECT_SCOPE.architecturalLayers.map((layer) => (
                <div
                  key={layer.number}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Layer {layer.number}
                    </span>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold truncate max-w-[150px]">
                      {layer.realWorldTech.split(",")[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {layer.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-500 font-medium mt-0.5">
                      {layer.focus}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <span>Parity:</span>
                    <span className="text-slate-600 truncate">{layer.realWorldTech}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Outcome Benchmark Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Capstone Target Outcome</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {PROJECT_SCOPE.finalOutcome}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-mono text-center">
              <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <div className="text-[10px] text-slate-400">THROUGHPUT</div>
                <div className="text-sm font-bold text-emerald-400">&gt; 100K ops/s</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <div className="text-[10px] text-slate-400">P99 LATENCY</div>
                <div className="text-sm font-bold text-cyan-400">&lt; 0.20 ms</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
                <div className="text-[10px] text-slate-400">MEMORY CAP</div>
                <div className="text-sm font-bold text-amber-400">256 MB</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PROGRESSIVE ENGINEERING CURRICULUM & LEARNING LOOPS (LEVELS 1 - 6) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Description & Levels Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <span>Progressive Curriculum & The Learning Loop</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Each level isolates a fundamental systems engineering bottleneck. Complete all 6 to master production database internals.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  L1 → L6
                </span>
              </div>

              {/* Each Level with its comprehensive learning loop */}
              <div className="space-y-6">
                {levelsArray.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-4"
                  >
                    {/* Level Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                          {lvl.level}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-slate-900">
                              Level {lvl.level}: {lvl.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                lvl.difficulty === "Easy"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : lvl.difficulty === "Medium"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {lvl.difficulty}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {lvl.tagline}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/challenges/${challenge.slug}/workspace`}
                        className="inline-flex items-center gap-1 text-xs font-mono text-blue-600 hover:text-blue-800 font-bold shrink-0 self-start sm:self-auto"
                      >
                        <span>Enter Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Supported Operations */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Operations:
                      </span>
                      {lvl.operations.map((op, idx) => (
                        <code
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-white text-slate-800 font-mono text-[10px] border border-slate-200/80 font-semibold"
                          title={op.desc}
                        >
                          {op.cmd}
                        </code>
                      ))}
                    </div>

                    {/* The Learning Loop Card for this Level */}
                    <div className="p-3.5 rounded-lg border border-blue-100/80 bg-blue-50/40 space-y-3">
                      {/* Engineering Bottleneck */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>The Engineering Bottleneck</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {lvl.learningLoop.bottleneck}
                        </p>
                      </div>

                      {/* What You Understand & Master */}
                      <div className="space-y-1.5 pt-1 border-t border-blue-100">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800">
                          <Lightbulb className="w-3 h-3 text-amber-600" />
                          <span>What You Understand & Master</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                          {lvl.learningLoop.whatYouUnderstand.map((concept, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{concept}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Production Parity & Outcome Takeaway */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-100 text-[11px]">
                        <div className="flex items-start gap-1.5 bg-white/70 p-2 rounded border border-blue-100/70">
                          <Server className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-800 font-mono block">Real-World Parity:</span>
                            <span className="text-slate-600">{lvl.learningLoop.productionParity}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5 bg-white/70 p-2 rounded border border-blue-100/70">
                          <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-800 font-mono block">Outcome Takeaway:</span>
                            <span className="text-slate-600">{lvl.learningLoop.outcomeSummary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Specification Table */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Command Interface Specification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Newline-delimited stream protocol over standard input / standard output.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Universal POSIX I/O
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#f8fafc] text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Command</th>
                      <th className="py-2.5 px-3 font-semibold">Return Value</th>
                      <th className="py-2.5 px-3 font-semibold font-sans">Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {apiSpec.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 font-bold text-blue-700">{item.command}</td>
                        <td className="py-2 px-3 text-emerald-700">{item.returns}</td>
                        <td className="py-2 px-3 font-sans text-slate-600 text-xs">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* What You Will Master Summary */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">
                Engineering Skills Mastered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {whatYouLearn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Constraints & Benchmark Targets (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Level Navigator */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Progressive Levels Map
              </div>
              <div className="space-y-1.5">
                {levelsArray.map((lvl) => (
                  <Link
                    key={lvl.level}
                    href={`/challenges/${challenge.slug}/workspace`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                        {lvl.level}
                      </span>
                      <span className="font-medium text-slate-800">{lvl.shortTitle}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {lvl.difficulty}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link href={`/challenges/${challenge.slug}/workspace`} className="w-full block">
                  <Button variant="primary" className="w-full text-xs font-semibold h-9 shadow-xs gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Enter Challenge IDE</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Constraints Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Execution Constraints
              </div>
              <ul className="text-xs font-mono text-slate-600 space-y-2">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Memory Cap:</span>
                  <span className="font-semibold text-slate-900">256 MB (Hard cgroup)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">CPU Quota:</span>
                  <span className="font-semibold text-slate-900">1.0 Core</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Network Access:</span>
                  <span className="font-semibold text-rose-600">Disabled (isolated)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Execution Timeout:</span>
                  <span className="font-semibold text-slate-900">30 seconds</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">WAL Log Path:</span>
                  <span className="font-semibold text-slate-800">./data/wal.log</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Sandbox User:</span>
                  <span className="font-semibold text-slate-900">Non-Root (1000)</span>
                </li>
              </ul>
            </div>

            {/* Performance Target Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Production Performance Target
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="text-[11px] text-slate-400">BASELINE SPEED</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    72,296 ops/s
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70">
                  <div className="text-[11px] text-emerald-700">HIGH-PERFORMANCE TARGET</div>
                  <div className="text-base font-bold text-emerald-800 mt-0.5">
                    &gt; 100,000 ops/s
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">
                    Sub-0.20ms p99 latency
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/leaderboard" className="w-full block">
                  <Button variant="outline" className="w-full text-xs font-semibold h-9 border-slate-200 bg-white hover:bg-slate-50 gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Global Leaderboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
