import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions, leaderboardEntries, users } from "@/db/schema";
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
  ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const foundChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, id))
    .limit(1);

  const challenge = foundChallenges[0];
  if (!challenge) {
    notFound();
  }

  const versions = await db
    .select()
    .from(challengeVersions)
    .where(eq(challengeVersions.challengeId, challenge.id))
    .orderBy(desc(challengeVersions.version))
    .limit(1);

  const version = versions[0];
  const spec = (version?.spec as any) || {};
  const apiSpec = (spec.apiSpecification as any[]) || [];
  const whatYouLearn = (spec.whatYouLearn as string[]) || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] font-sans">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* LeetCode Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Link href="/challenges" className="hover:text-slate-900 transition-colors">
                Problems
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-800 font-semibold">{challenge.title}</span>
            </div>

            {/* Problem Title & Number */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                1. {challenge.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold font-mono border text-amber-600 bg-amber-50 border-amber-200">
                {challenge.difficulty}
              </span>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                In-Memory Databases
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                Redis-Inspired
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                Python 3.12, C++20
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link href={`/challenges/${challenge.slug}/leaderboard`}>
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Ranking</span>
              </Button>
            </Link>
            <Link href={`/challenges/${challenge.slug}/workspace`}>
              <Button size="sm" variant="primary" className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>Solve Challenge</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* LeetCode Problem Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Description Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Problem Description
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {challenge.description}
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Engine Responsibilities:
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-mono font-bold">•</span>
                    <span>Implement <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">SET</code>, <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">GET</code>, <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">DEL</code> with O(1) hash resolution.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 font-mono font-bold">•</span>
                    <span>Support active and passive key expiration with millisecond-precision <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">EXPIRE</code> commands.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-mono font-bold">•</span>
                    <span>Write mutations to an append-only Write-Ahead Log (WAL) to survive sudden process restarts.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-mono font-bold">•</span>
                    <span>Ensure high throughput under 100K+ ops/sec stress workloads without memory leaks.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* API Specification (LeetCode Signature Style) */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Command Interface Specification
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  Newline-delimited stdin / stdout
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

            {/* Learning Outcomes */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">
                What You Will Master
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {whatYouLearn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Constraints & Benchmark Targets (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Constraints Card (LeetCode Style) */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Execution Constraints
              </div>
              <ul className="text-xs font-mono text-slate-600 space-y-2">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Memory Cap:</span>
                  <span className="font-semibold text-slate-900">256 MB (Hard Cap)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">CPU Quota:</span>
                  <span className="font-semibold text-slate-900">1.0 Core</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Network Access:</span>
                  <span className="font-semibold text-rose-600">Disabled (none)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Execution Timeout:</span>
                  <span className="font-semibold text-slate-900">30 seconds</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Sandbox User:</span>
                  <span className="font-semibold text-slate-900">Non-Root (1000)</span>
                </li>
              </ul>
            </div>

            {/* Performance Target Card */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Benchmark Targets
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
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/challenges/${challenge.slug}/workspace`} className="w-full block">
                  <Button variant="primary" className="w-full text-xs font-semibold h-9 shadow-xs">
                    Start Coding
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
