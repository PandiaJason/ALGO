"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CORE_CHALLENGES,
  ALGO_PHILOSOPHY,
  CHALLENGE_TYPES,
  DOMAINS,
  EngineeringDomain,
  CoreChallenge,
  ChallengeType,
} from "@/lib/constants/core-challenges";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Circle,
  Zap,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Server,
  Activity,
  GitBranch,
  ShieldAlert,
  Flame,
  Wrench,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface ChallengesCatalogProps {
  userSolvedIds: string[];
  topThroughputMap: Record<string, string>;
}

export function ChallengesCatalog({
  userSolvedIds,
  topThroughputMap,
}: ChallengesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);

  const solvedSet = useMemo(() => new Set(userSolvedIds), [userSolvedIds]);

  // Filter challenges based on search and domain
  const filteredChallenges = useMemo(() => {
    return CORE_CHALLENGES.filter((c) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.inspiredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mainSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.signatureQuestion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain =
        selectedDomain === "ALL" || c.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  // Group filtered challenges by domain
  const groupedByDomain = useMemo(() => {
    const map = new Map<EngineeringDomain, CoreChallenge[]>();
    const order: EngineeringDomain[] = [
      "SYSTEMS",
      "PERFORMANCE",
      "DISTRIBUTED_SYSTEMS",
      "SEARCH_DATA",
    ];

    order.forEach((d) => map.set(d, []));

    filteredChallenges.forEach((c) => {
      const list = map.get(c.domain) || [];
      list.push(c);
      map.set(c.domain, list);
    });

    return order
      .map((domain) => ({
        domain,
        info: DOMAINS[domain],
        challenges: map.get(domain) || [],
      }))
      .filter((group) => group.challenges.length > 0);
  }, [filteredChallenges]);

  const domainIcons: Record<EngineeringDomain, React.ReactNode> = {
    SYSTEMS: <Cpu className="w-4 h-4 text-cyan-600" />,
    PERFORMANCE: <Zap className="w-4 h-4 text-amber-600" />,
    DISTRIBUTED_SYSTEMS: <Layers className="w-4 h-4 text-purple-600" />,
    SEARCH_DATA: <Database className="w-4 h-4 text-emerald-600" />,
  };

  return (
    <div className="space-y-12">
      {/* ============================================================== */}
      {/* HEADER SECTION                                                */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-900 text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>10 CORE ENGINEERING CHALLENGES</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The ALGO Engineering Curriculum
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Don&apos;t solve isolated coding puzzles. Reconstruct production-grade systems from first principles — databases, proxies, queues, and schedulers — then measure and push hardware limits.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by system, skill, or benchmark..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-800 shadow-2xs transition-all"
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ALGO PHILOSOPHY STEPPER BANNER                                 */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold">
                The ALGO Learning Loop
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                How World-Class Engineers Master Infrastructure
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400">
              BUILD → RUN → MEASURE → BREAK → OPTIMIZE → PROVE
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ALGO_PHILOSOPHY.map((item, index) => (
              <div
                key={item.step}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur-xs flex flex-col justify-between hover:border-slate-600 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1.5 py-0.5 rounded bg-slate-700/50">
                      {item.step}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white group-hover:text-cyan-200 transition-colors">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Challenge Types Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1">
              Challenge Archetypes:
            </span>
            {CHALLENGE_TYPES.map((t) => (
              <span
                key={t.type}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-default"
                title={t.desc}
              >
                <span className="font-bold text-cyan-400">{t.type}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{t.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DOMAIN FILTER TABS                                             */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setSelectedDomain("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            selectedDomain === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Domains ({CORE_CHALLENGES.length})
        </button>

        {(["SYSTEMS", "PERFORMANCE", "DISTRIBUTED_SYSTEMS", "SEARCH_DATA"] as EngineeringDomain[]).map(
          (dom) => {
            const info = DOMAINS[dom];
            const isActive = selectedDomain === dom;
            return (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {domainIcons[dom]}
                <span>{info.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? "bg-slate-800 text-cyan-300"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {info.count}
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* ============================================================== */}
      {/* CHALLENGES GROUPED BY DOMAIN                                   */}
      {/* ============================================================== */}
      <div className="space-y-12">
        {groupedByDomain.map(({ domain, info, challenges }) => (
          <section key={domain} className="space-y-4">
            {/* Domain Group Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  {domainIcons[domain]}
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <span>{info.label}</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({challenges.length} {challenges.length === 1 ? "Challenge" : "Challenges"})
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{info.description}</p>
                </div>
              </div>
            </div>

            {/* Domain Challenge Cards */}
            <div className="grid grid-cols-1 gap-4">
              {challenges.map((c) => {
                const isSolved = solvedSet.has(c.slug) || solvedSet.has(c.number);
                const isKvStore = c.slug === "kv-store";
                const isCache = c.slug === "lru-cache";
                const isExecutable = isKvStore || isCache;
                const topSpeed = topThroughputMap[c.slug] || "101,170 ops/s";

                return (
                  <div
                    key={c.slug}
                    className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md ${
                      c.isFlagship
                        ? "border-cyan-300/80 ring-2 ring-cyan-500/10 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Metadata & Descriptions */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            #{c.number}
                          </span>

                          {c.isFlagship && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-300">
                              <Sparkles className="w-3 h-3 text-cyan-600" />
                              FLAGSHIP ENGINE
                            </span>
                          )}

                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                            Inspired by <strong className="text-slate-900">{c.inspiredBy}</strong>
                          </span>

                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                            {c.whatStudentsBuild}
                          </span>

                          <span
                            className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                              c.difficulty === "Hard"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {c.difficulty}
                          </span>

                          {isSolved && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              SOLVED
                            </span>
                          )}
                        </div>

                        {/* Title & Signature Question */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-cyan-700 transition-colors">
                              {c.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {c.overview}
                          </p>
                        </div>

                        {/* Signature Question Callout */}
                        <div className="bg-slate-50 border-l-2 border-cyan-500 px-3 py-1.5 rounded-r-lg">
                          <p className="text-xs italic text-slate-700 font-serif">
                            &ldquo;{c.signatureQuestion}&rdquo;
                          </p>
                        </div>

                        {/* Core Engineering Skill & Progression Preview */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Skills:</span>
                            <span className="font-mono text-slate-600">{c.mainSkill}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Progression:</span>
                            <span className="text-slate-600">
                              {c.progressionLevels.length} Architectural Levels (L1–L{c.progressionLevels.length})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Benchmarks & Action Buttons */}
                      <div className="lg:w-72 shrink-0 flex flex-col justify-between gap-4 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
                        {/* Target Benchmark Box */}
                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 flex items-center justify-between">
                            <span>Target Metrics</span>
                            {isExecutable && (
                              <span className="text-emerald-600 font-bold">LIVE BENCHMARK</span>
                            )}
                          </div>
                          <div className="text-xs font-mono font-semibold text-slate-900">
                            {c.benchmarkMetrics[0]}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {c.benchmarkMetrics[1]}
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2">
                          {isExecutable ? (
                            <>
                              <Link
                                href={`/challenges/${c.slug}`}
                                className="flex-1 text-center px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Overview
                              </Link>
                              <Link
                                href={`/challenges/${c.slug}/workspace`}
                                className="flex-1"
                              >
                                <button className={`w-full px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                                  c.isFlagship
                                    ? "bg-slate-900 hover:bg-cyan-600 text-white"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                                }`}>
                                  <span>Launch Engine</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </Link>
                            </>
                          ) : (
                            <Link
                              href={`/challenges/${c.slug}`}
                              className="w-full text-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span>Explore Architecture</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {groupedByDomain.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No matching challenges found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with another keyword like &quot;Redis&quot;, &quot;Nginx&quot;, &quot;Kafka&quot;, or switch domain filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("ALL");
              }}
              className="text-xs font-semibold text-cyan-600 hover:underline pt-2 inline-block cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
