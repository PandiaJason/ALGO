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
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  Code,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Real database aggregation queries
  const [userCount] = await db.select({ val: count() }).from(users);
  const [challengeCount] = await db.select({ val: count() }).from(challenges);
  const [submissionCount] = await db.select({ val: count() }).from(submissions);
  const [passedCount] = await db
    .select({ val: count() })
    .from(submissionResults)
    .where(eq(submissionResults.isCorrect, true));
  const [failedCount] = await db
    .select({ val: count() })
    .from(submissionResults)
    .where(eq(submissionResults.isCorrect, false));
  const [benchmarkCount] = await db.select({ val: count() }).from(benchmarkRuns);

  // Recent submissions
  const recentSubmissions = await db
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
    .limit(10);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Control Plane Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time platform telemetry, submission pipelines, and system health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WORKER: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Users" value={userCount.val} />
        <MetricCard label="Challenges" value={challengeCount.val} />
        <MetricCard label="Submissions" value={submissionCount.val} />
        <MetricCard label="Passed" value={passedCount.val} trend="positive" trendValue="100% PASS" />
        <MetricCard label="Failed" value={failedCount.val} trend="negative" trendValue="ERRORS" />
        <MetricCard label="Benchmark Runs" value={benchmarkCount.val} />
      </div>

      {/* Recent Submissions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Recent System Submissions
          </h2>
          <Link href="/admin/submissions">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 bg-white">
            No submissions recorded yet in database.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Submission ID</th>
                  <th className="py-2.5 px-4">Engineer</th>
                  <th className="py-2.5 px-4">Challenge</th>
                  <th className="py-2.5 px-4">Lang</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Time</th>
                  <th className="py-2.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {recentSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-700">
                      #{s.id.slice(0, 8)}
                    </td>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                      @{s.username}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">
                      {s.challengeTitle}
                    </td>
                    <td className="py-2.5 px-4 uppercase text-slate-500">
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
                        className="text-[#2d7cf6] hover:underline font-medium"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
