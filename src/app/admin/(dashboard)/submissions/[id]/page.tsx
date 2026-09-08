import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  submissions,
  submissionFiles,
  submissionResults,
  challenges,
  users,
  challengeVersions,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvalidationClient } from "./invalidation-client";
import { formatThroughput, formatBytes } from "@/lib/utils";
import {
  ArrowLeft,
  User,
  Clock,
  Code,
  CheckCircle2,
  XCircle,
  Cpu,
  Zap,
  HardDrive,
  FileCode,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminSubmissionInspectPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (userEmail !== ADMIN_EMAIL) {
    redirect("/admin/login?error=AccessDenied");
  }

  // Fetch full submission graph
  const [sub] = await db
    .select({
      id: submissions.id,
      language: submissions.language,
      level: submissions.level,
      status: submissions.status,
      submittedAt: submissions.submittedAt,
      startedAt: submissions.startedAt,
      completedAt: submissions.completedAt,
      username: users.username,
      name: users.name,
      email: users.email,
      challengeTitle: challenges.title,
      challengeSlug: challenges.slug,
      versionNumber: challengeVersions.version,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.userId, users.id))
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .innerJoin(challengeVersions, eq(submissions.challengeVersionId, challengeVersions.id))
    .where(eq(submissions.id, id))
    .limit(1);

  if (!sub) {
    notFound();
  }

  const files = await db
    .select()
    .from(submissionFiles)
    .where(eq(submissionFiles.submissionId, id));

  const [result] = await db
    .select()
    .from(submissionResults)
    .where(eq(submissionResults.submissionId, id))
    .limit(1);

  const durationMs =
    sub.completedAt && sub.startedAt
      ? new Date(sub.completedAt).getTime() - new Date(sub.startedAt).getTime()
      : null;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          href="/admin/submissions"
          className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Submissions</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-mono text-slate-700">#{sub.id.slice(0, 8)}</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Inspection: #{sub.id.slice(0, 8)}
            </h1>
            <StatusBadge status={sub.status as any} />
            {result?.isInvalidated ? (
              <Badge variant="destructive" className="gap-1 text-[11px] font-mono">
                <ShieldAlert className="w-3 h-3" />
                <span>INVALIDATED</span>
              </Badge>
            ) : (
              <Badge variant="success" className="gap-1 text-[11px] font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>VERIFIED VALID</span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Engineer:</span>
            <span className="font-semibold text-slate-900">@{sub.username}</span>
            <span className="text-slate-300">|</span>
            <span>{sub.email}</span>
            <span className="text-slate-300">|</span>
            <span>{sub.challengeTitle} (v{sub.versionNumber}.0)</span>
            <span className="text-slate-300">|</span>
            <span className="uppercase font-mono font-semibold text-slate-700">{sub.language} (Level {sub.level})</span>
          </p>
        </div>

        {/* Invalidate / Restore Interactive Action */}
        {result && (
          <InvalidationClient
            submissionId={sub.id}
            initialIsInvalidated={result.isInvalidated}
            invalidationReason={result.invalidationReason}
          />
        )}
      </div>

      {/* Telemetry Grid */}
      {result ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase">Correctness</div>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              {result.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-[#09C899]" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span>
                {result.correctnessPassed} / {result.correctnessTotal}
              </span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase">Throughput</div>
            <div className="text-lg font-bold text-[#099BE9]">
              {result.throughputOpsSec ? formatThroughput(result.throughputOpsSec) : "0 ops/s"}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase">Normalized Score</div>
            <div className="text-lg font-bold text-[#8647E2]">
              {result.score ? `${Number(result.score).toFixed(2)}×` : "—"}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase">P99 Latency</div>
            <div className="text-lg font-bold text-slate-900">
              {result.latencyP99Ms ? `${Number(result.latencyP99Ms).toFixed(3)} ms` : "—"}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase">Memory RAM</div>
            <div className="text-lg font-bold text-slate-900">
              {result.memoryBytes ? formatBytes(result.memoryBytes) : "—"}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase">Exec Duration</div>
            <div className="text-lg font-bold text-slate-900">
              {durationMs ? `${(durationMs / 1000).toFixed(1)}s` : "—"}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs">
          Evaluation results are currently pending or were not generated for this submission.
        </div>
      )}

      {/* Submitted Source Code Viewer */}
      <Card className="border-slate-200 shadow-2xs overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/80 py-3 px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-slate-500" />
            <CardTitle className="text-xs font-mono font-bold text-slate-900">
              {files[0]?.filename || "source_code"}
            </CardTitle>
          </div>
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            {sub.language}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <pre className="p-4 bg-[#0d1117] text-[#e6edf3] font-mono text-xs overflow-x-auto leading-relaxed max-h-[480px]">
            <code>{files[0]?.content || "# No source code file attached"}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Test Matrix & Raw Diagnostics */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-900 font-mono uppercase">
                Test Suite Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64">
                {result.testOutput || "No standard output captured from test execution."}
              </pre>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-900 font-mono uppercase">
                Raw Metrics Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="p-3 bg-slate-50 text-slate-800 rounded font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-200 max-h-64">
                {JSON.stringify(result.rawMetrics, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
