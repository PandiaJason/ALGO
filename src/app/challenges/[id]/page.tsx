import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions, leaderboardEntries, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Code,
  Trophy,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  // Find challenge by slug or uuid
  const foundChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, id))
    .limit(1);

  const challenge = foundChallenges[0];
  if (!challenge) {
    notFound();
  }

  // Get current version
  const versions = await db
    .select()
    .from(challengeVersions)
    .where(eq(challengeVersions.challengeId, challenge.id))
    .orderBy(desc(challengeVersions.version))
    .limit(1);

  const version = versions[0];
  const spec = (version?.spec as any) || {};
  const levels = (spec.levels as any[]) || [];
  const apiSpec = (spec.apiSpecification as any[]) || [];
  const whatYouLearn = (spec.whatYouLearn as string[]) || [];

  // Top leaderboard entries
  const topLeaders = await db
    .select({
      id: leaderboardEntries.id,
      score: leaderboardEntries.score,
      throughputOpsSec: leaderboardEntries.throughputOpsSec,
      latencyP99Ms: leaderboardEntries.latencyP99Ms,
      rank: leaderboardEntries.rank,
      username: users.username,
      name: users.name,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .where(eq(leaderboardEntries.challengeId, challenge.id))
    .orderBy(desc(leaderboardEntries.score))
    .limit(5);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Challenge Header */}
        <div className="border-b border-slate-200/80 pb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="blue" className="text-xs font-mono">
                {challenge.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-xs font-mono">
                VERSION {challenge.currentVersionNumber}.0
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/challenges/${challenge.slug}/leaderboard`}>
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Leaderboard</span>
                </Button>
              </Link>
              <Link href={`/challenges/${challenge.slug}/workspace`}>
                <Button variant="primary" size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>OPEN WORKSPACE</span>
                </Button>
              </Link>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            {challenge.title}
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {challenge.tagline}
          </p>
        </div>

        {/* 4 Core Questions Grid (Spec 12) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200/90 shadow-xs">
            <CardHeader className="pb-3">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#2d7cf6] uppercase">
                WHAT IS THIS?
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Foundational Data Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              A key-value store is the atomic primitive behind modern distributed caches, session managers, and NoSQL engines. Systems like Redis, Memcached, and RocksDB serve millions of requests per second by eliminating relational overhead and optimizing physical memory layouts.
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 shadow-xs">
            <CardHeader className="pb-3">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#2dbfa8] uppercase">
                WHY DOES IT MATTER?
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                The Anatomy of High Throughput
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              Writing code is cheap; building software that maintains microsecond latency under 100K ops/sec requires mastering cache lines, collision avoidance, and disk synchronization. This challenge teaches you why low-latency systems succeed or stall.
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 shadow-xs">
            <CardHeader className="pb-3">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#8b5cf6] uppercase">
                WHAT ARE YOU BUILDING?
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                A Progressively Scaled Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 leading-relaxed space-y-1.5">
              <div><strong className="text-slate-800">Level 1:</strong> In-memory dictionary with fundamental CRUD commands.</div>
              <div><strong className="text-slate-800">Level 2:</strong> High-efficiency lookup hash structure with O(1) properties.</div>
              <div><strong className="text-slate-800">Level 3:</strong> Write-ahead log (WAL) persistence surviving process crashes.</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/90 shadow-xs">
            <CardHeader className="pb-3">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#f97316] uppercase">
                WHAT WILL YOU LEARN?
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Engineering Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1.5">
              {whatYouLearn.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* API Specification */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              API Specification
            </h2>
            <p className="text-xs text-slate-500">
              Your store communicates over standard I/O via newline-delimited command strings.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200/90 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/90 text-slate-600 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Command</th>
                  <th className="py-2.5 px-4 font-semibold">Return Value</th>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {apiSpec.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-blue-700">{item.command}</td>
                    <td className="py-2.5 px-4 text-emerald-700">{item.returns}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benchmark & Verification Protocol */}
        <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Cpu className="w-4 h-4 text-[#2d7cf6]" />
            <span>Automated Benchmark Protocol</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-white rounded border border-slate-200/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">EXECUTION ISOLATION</div>
              <div>Dedicated container with 1.0 CPU core, 256MB RAM, and zero network access.</div>
            </div>
            <div className="p-3 bg-white rounded border border-slate-200/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">WORKLOAD SPECTRUM</div>
              <div>100,000 sequential SETs, 100,000 sequential GETs, and 100,000 mixed CRUD ops.</div>
            </div>
            <div className="p-3 bg-white rounded border border-slate-200/80">
              <div className="text-[11px] font-mono text-slate-400 mb-1">CORRECTNESS GATE</div>
              <div>100% test pass rate required before any benchmark score is recorded or ranked.</div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ready to construct your store?
            </h3>
            <p className="text-xs text-slate-500">
              Open the Monaco workspace, choose Python or C++, and submit your code.
            </p>
          </div>
          <Link href={`/challenges/${challenge.slug}/workspace`}>
            <Button size="lg" variant="primary" className="text-xs font-semibold gap-2 shadow-xs">
              <span>ENTER ENGINEERING LAB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
