"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge, SubmissionStatus } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatThroughput, formatLatency, formatBytes } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Clock,
  Cpu,
  Trophy,
  Layers,
  Code,
  AlertTriangle,
} from "lucide-react";

interface Props {
  initialSubmission: {
    id: string;
    language: string;
    level: number;
    status: SubmissionStatus;
    submittedAt: string;
    challengeTitle: string;
    challengeSlug: string;
  };
  initialResult: {
    correctnessPassed: number;
    correctnessTotal: number;
    correctnessScore: string;
    isCorrect: boolean;
    throughputOpsSec: string | null;
    latencyP50Ms: string | null;
    latencyP95Ms: string | null;
    latencyP99Ms: string | null;
    memoryBytes: number | null;
    baselineThroughput: string | null;
    score: string;
    improvementPct: string;
    rank?: number | null;
    aheadRank?: number | null;
    aheadUsername?: string | null;
    aheadScore?: string | null;
    previousScore?: string | null;
    testOutput?: string | null;
    errorOutput?: string | null;
  } | null;
}

export function ResultClient({ initialSubmission, initialResult }: Props) {
  const router = useRouter();
  const [submission, setSubmission] = useState(initialSubmission);
  const [result, setResult] = useState(initialResult);
  const [isPolling, setIsPolling] = useState(
    initialSubmission.status !== "COMPLETED" && initialSubmission.status !== "FAILED"
  );

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/submissions/${submission.id}/status`);
        if (res.ok) {
          const data = await res.json();
          setSubmission((prev) => ({ ...prev, status: data.status }));

          if (data.status === "COMPLETED" || data.status === "FAILED") {
            setIsPolling(false);
            // Fetch full result
            const resultRes = await fetch(`/api/submissions/${submission.id}/result`);
            if (resultRes.ok) {
              const resData = await resultRes.json();
              setResult(resData);
            }
          }
        }
      } catch (err) {
        console.error("Status polling error:", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isPolling, submission.id]);

  const isComplete = submission.status === "COMPLETED" && result?.isCorrect;
  const isFailed = submission.status === "FAILED" || (result && !result.isCorrect);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/challenges" className="hover:text-slate-900">
              Challenges
            </Link>
            <span>/</span>
            <Link
              href={`/challenges/${submission.challengeSlug}`}
              className="hover:text-slate-900"
            >
              {submission.challengeTitle}
            </Link>
            <span>/</span>
            <span className="font-mono text-slate-700">
              #{submission.id.slice(0, 8)}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Submission Evaluation
          </h1>
        </div>

        <StatusBadge status={submission.status} />
      </div>

      {/* IN PROGRESS STATE */}
      {isPolling && (
        <Card className="border-slate-200 p-8 text-center space-y-4 bg-slate-50/50">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-pulse">
            <Cpu className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 capitalize">
              {submission.status.toLowerCase()} Submission...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Running in an isolated sandbox with 1.0 CPU core and 256MB RAM. Evaluating correctness suites and running 100K ops/sec benchmark.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Live evaluation status updates automatically
          </div>
        </Card>
      )}

      {/* COMPLETED STATE (Spec 38) */}
      {isComplete && result && (
        <div className="space-y-8">
          {/* Main Hero Metrics Banner */}
          <div className="p-8 rounded-xl border border-slate-200 bg-white shadow-xs text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>VERIFIED ENGINEERING RESULT</span>
            </div>

            {/* Throughput & Improvement */}
            <div className="space-y-2">
              <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-mono tracking-tight">
                {result.throughputOpsSec ? formatThroughput(result.throughputOpsSec) : "—"}
              </div>
              <div className="text-sm font-semibold text-emerald-600 font-mono">
                {Number(result.improvementPct) >= 0 ? "+" : ""}
                {Number(result.improvementPct).toFixed(1)}% vs baseline ({result.baselineThroughput ? formatThroughput(result.baselineThroughput) : "100K ops/s"})
              </div>
            </div>

            {/* Secondary Metrics Triad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 max-w-xl mx-auto">
              <div className="p-3 bg-slate-50 rounded border border-slate-200/60">
                <div className="text-[11px] font-mono uppercase text-slate-400">CORRECTNESS</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  100% PASS
                </div>
                <div className="text-[10px] text-slate-500">
                  {result.correctnessPassed} / {result.correctnessTotal} Suites
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200/60">
                <div className="text-[11px] font-mono uppercase text-slate-400">P99 LATENCY</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  {result.latencyP99Ms ? formatLatency(result.latencyP99Ms) : "—"}
                </div>
                <div className="text-[10px] text-slate-500">
                  p50: {result.latencyP50Ms ? formatLatency(result.latencyP50Ms) : "—"}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200/60">
                <div className="text-[11px] font-mono uppercase text-slate-400">MEMORY</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  {result.memoryBytes ? formatBytes(result.memoryBytes) : "—"}
                </div>
                <div className="text-[10px] text-slate-500">
                  Peak footprint
                </div>
              </div>
            </div>

            {/* Rank Spotlight & Competitive Loop */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-900">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>
                  {result.rank ? `LEADERBOARD RANK #${result.rank}` : "RECORDED ON LEADERBOARD"}
                </span>
              </div>

              {result.aheadRank && (
                <div className="text-xs text-slate-600 font-medium">
                  Can you beat #{result.aheadRank}
                  {result.aheadUsername ? ` (@${result.aheadUsername})` : ""}?
                </div>
              )}

              <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 pt-1">
                {result.previousScore && (
                  <span>Previous: {Number(result.previousScore).toFixed(2)}×</span>
                )}
                <span>Score: {Number(result.score).toFixed(2)}× baseline</span>
              </div>
            </div>

            {/* Next Step Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/challenges/${submission.challengeSlug}/workspace`}>
                <Button size="lg" variant="primary" className="text-xs font-semibold gap-2 shadow-xs">
                  <span>OPTIMIZE & RESUBMIT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href={`/challenges/${submission.challengeSlug}/leaderboard`}>
                <Button size="lg" variant="outline" className="text-xs font-medium">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FAILED STATE */}
      {isFailed && result && (
        <Card className="border-red-200 bg-red-50/30 p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-700">
            <XCircle className="w-6 h-6 shrink-0 text-red-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Verification Failed
              </h3>
              <p className="text-xs text-slate-600">
                {result.correctnessPassed} of {result.correctnessTotal} correctness tests passed. Benchmarks are not calculated for failing solutions.
              </p>
            </div>
          </div>

          {result.testOutput && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700">Test Harness Output:</div>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] whitespace-pre-wrap max-h-60 overflow-y-auto">
                {result.testOutput}
              </pre>
            </div>
          )}

          {result.errorOutput && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-red-800">Error Details:</div>
              <pre className="p-3 bg-red-100 text-red-900 rounded font-mono text-[11px] whitespace-pre-wrap max-h-40 overflow-y-auto">
                {result.errorOutput}
              </pre>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <Link href={`/challenges/${submission.challengeSlug}/workspace`}>
              <Button size="sm" variant="default" className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Editor & Fix</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
