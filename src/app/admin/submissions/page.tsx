import React from "react";
import Link from "next/link";
import { db } from "@/db";
import {
  submissions,
  submissionResults,
  users,
  challenges,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatThroughput } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const allSubmissions = await db
    .select({
      id: submissions.id,
      language: submissions.language,
      level: submissions.level,
      status: submissions.status,
      submittedAt: submissions.submittedAt,
      username: users.username,
      challengeTitle: challenges.title,
      isCorrect: submissionResults.isCorrect,
      score: submissionResults.score,
      throughputOpsSec: submissionResults.throughputOpsSec,
      isInvalidated: submissionResults.isInvalidated,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.userId, users.id))
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .leftJoin(
      submissionResults,
      eq(submissions.id, submissionResults.submissionId)
    )
    .orderBy(desc(submissions.submittedAt))
    .limit(50);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Submission Management
        </h1>
        <p className="text-xs text-slate-500">
          Inspect student code submissions, review automated evaluation traces, and manage verification integrity.
        </p>
      </div>

      {allSubmissions.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 bg-white">
          No submissions recorded yet.
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Submission ID</th>
                <th className="py-3 px-4">Engineer</th>
                <th className="py-3 px-4">Challenge</th>
                <th className="py-3 px-4">Lang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Throughput</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Integrity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {allSubmissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    #{s.id.slice(0, 8)}
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    @{s.username}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {s.challengeTitle}
                  </td>
                  <td className="py-3 px-4 uppercase text-slate-500">
                    {s.language}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={s.status as any} />
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {s.throughputOpsSec ? formatThroughput(s.throughputOpsSec) : "—"}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#2d7cf6]">
                    {s.score ? `${Number(s.score).toFixed(2)}×` : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {s.isInvalidated ? (
                      <Badge variant="destructive" className="text-[10px]">
                        INVALIDATED
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">
                        VALID
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <Link
                      href={`/submissions/${s.id}`}
                      className="text-xs text-[#2d7cf6] hover:underline font-medium"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
