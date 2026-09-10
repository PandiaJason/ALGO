import React from "react";
import Link from "next/link";
import { db } from "@/db";
import {
  users,
  challenges,
  submissions,
  submissionResults,
  benchmarkRuns,
} from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CHALLENGES_LIST } from "@/lib/challenges";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";
import {
  Users,
  Code,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let userCountVal = 0;
  let challengeCountVal = CHALLENGES_LIST.length;
  let submissionCountVal = 0;
  let passedCountVal = 0;
  let failedCountVal = 0;
  let benchmarkCountVal = 0;
  let recentSubmissions: any[] = [];

  try {
    const [uCount] = await db.select({ val: count() }).from(users);
    if (uCount) userCountVal = Number(uCount.val);

    const [cCount] = await db.select({ val: count() }).from(challenges);
    if (cCount && Number(cCount.val) > 0) challengeCountVal = Number(cCount.val);

    const [sCount] = await db.select({ val: count() }).from(submissions);
    if (sCount) submissionCountVal = Number(sCount.val);

    const [pCount] = await db
      .select({ val: count() })
      .from(submissionResults)
      .where(eq(submissionResults.isCorrect, true));
    if (pCount) passedCountVal = Number(pCount.val);

    const [fCount] = await db
      .select({ val: count() })
      .from(submissionResults)
      .where(eq(submissionResults.isCorrect, false));
    if (fCount) failedCountVal = Number(fCount.val);

    const [bCount] = await db.select({ val: count() }).from(benchmarkRuns);
    if (bCount) benchmarkCountVal = Number(bCount.val);

    recentSubmissions = await db
      .select({
        id: submissions.id,
        language: submissions.language,
        level: submissions.level,
        status: submissions.status,
        submittedAt: submissions.submittedAt,
        username: users.username,
        challengeTitle: challenges.title,
      })
      .from(submissions)
      .innerJoin(users, eq(submissions.userId, users.id))
      .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
      .orderBy(desc(submissions.submittedAt))
      .limit(8);
  } catch (err) {
    console.warn("Database telemetry query error in AdminDashboardPage:", err);
  }

  const totalMilestoneLevels = CHALLENGES_LIST.reduce(
    (acc, c) => acc + Object.keys(c.levels || {}).length,
    0
  );

  const passRate =
    submissionCountVal > 0
      ? Math.round((passedCountVal / submissionCountVal) * 100)
      : null;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 font-sans">
      {/* Top Banner / Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
            Control Plane Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time platform telemetry, user submissions, and verified systems curricula.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/admin/whitelist">
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Wishlist</span>
            </Button>
          </Link>
          <Link href="/admin/challenges/new">
            <Button size="sm" className="h-9 px-3.5 text-xs gap-1.5 bg-[#099BE9] hover:bg-[#1984E9] text-white font-semibold shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Challenge</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Key Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Engineers */}
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Engineers</span>
            <Users className="w-4 h-4 text-[#099BE9]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-950 tracking-tight">
            {userCountVal}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">Registered users</span>
        </div>

        {/* Challenges */}
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Curriculum</span>
            <Code className="w-4 h-4 text-[#09C899]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-950 tracking-tight">
            {challengeCountVal}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">{totalMilestoneLevels} milestone levels</span>
        </div>

        {/* Submissions */}
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Submissions</span>
            <Layers className="w-4 h-4 text-[#8647E2]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-950 tracking-tight">
            {submissionCountVal}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">Evaluated runs</span>
        </div>

        {/* Passed */}
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#0AA793]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0AA793] tracking-tight">
            {passRate !== null ? `${passRate}%` : "—"}
          </div>
          <span className="text-[10px] font-mono text-[#0AA793] font-semibold block">
            {submissionCountVal > 0 ? `${passedCountVal} passed` : "No runs yet"}
          </span>
        </div>

        {/* Failed */}
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Errors</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 tracking-tight">
            {failedCountVal}
          </div>
          <span className="text-[10px] font-mono text-rose-500 font-semibold block">
            {failedCountVal === 0 ? "0 failed asserts" : `${failedCountVal} failed asserts`}
          </span>
        </div>

        {/* Benchmarks */}
        <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Benchmarks</span>
            <Cpu className="w-4 h-4 text-[#F78424]" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-950 tracking-tight">
            {benchmarkCountVal}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">Throughput tests</span>
        </div>
      </div>

      {/* 2. Recent Submissions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Recent System Submissions
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Latest code evaluations processed through the Docker worker harness.
            </p>
          </div>
          <Link href="/admin/submissions">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 text-[#099BE9] hover:text-[#1984E9]">
              <span>View All Submissions</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-500 bg-white font-mono">
            No live submissions recorded yet in current database partition.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Run ID</th>
                    <th className="py-2.5 px-4">Engineer</th>
                    <th className="py-2.5 px-4">Challenge</th>
                    <th className="py-2.5 px-4">Level</th>
                    <th className="py-2.5 px-4">Language</th>
                    <th className="py-2.5 px-4">Result</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {recentSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-700">
                        #{s.id.slice(0, 8)}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-semibold text-slate-950">
                        @{s.username}
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-700 font-medium">
                        {s.challengeTitle}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          L{s.level || 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 uppercase text-slate-600 text-[11px]">
                        {s.language}
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusBadge status={s.status as any} />
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px]">
                        {new Date(s.submittedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-sans">
                        <Link
                          href={`/admin/submissions/${s.id}`}
                          className="text-[#099BE9] hover:underline font-bold text-xs"
                        >
                          Trace →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Core Challenges Curriculum Registry */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              Curriculum Registry ({CHALLENGES_LIST.length} Challenges)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified first-principles systems engineering curricula.
            </p>
          </div>
          <Link href="/admin/challenges">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 text-[#099BE9] hover:text-[#1984E9]">
              <span>Manage Challenges</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">No.</th>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Domain</th>
                  <th className="py-2.5 px-4">Inspired By</th>
                  <th className="py-2.5 px-4">Levels</th>
                  <th className="py-2.5 px-4">Benchmark Target</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CHALLENGES_LIST.map((c) => (
                  <tr key={c.slug} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{c.number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/challenges/${c.slug}`}
                          target="_blank"
                          className="font-bold text-slate-950 hover:text-[#099BE9] transition-colors"
                        >
                          {c.title}
                        </Link>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {c.whatStudentsBuild}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                        {c.domain}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 text-xs">
                      {c.inspiredBy}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="text-[#099BE9] font-bold">{Object.keys(c.levels || {}).length}</span> Levels
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-600 font-medium">
                      {CORE_CHALLENGES.find((core) => core.slug === c.slug)?.benchmarkMetrics?.[0] || "Target SLA"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 font-mono">
                      <Link
                        href={`/challenges/${c.slug}`}
                        target="_blank"
                        className="text-xs text-slate-600 hover:text-slate-950 font-semibold"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/challenges/${c.slug}/workspace`}
                        target="_blank"
                        className="text-xs text-[#099BE9] hover:underline font-bold"
                      >
                        Launch
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
