import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  users,
  submissions,
  submissionResults,
  challenges,
  leaderboardEntries,
  userChallengeProgress,
} from "@/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatThroughput, formatLatency } from "@/lib/utils";
import {
  User,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Trophy,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const profileUser = foundUsers[0];
  if (!profileUser) {
    notFound();
  }

  // Fetch verified progress across challenges
  const progressList = await db
    .select({
      challengeTitle: challenges.title,
      challengeSlug: challenges.slug,
      isCompleted: userChallengeProgress.isCompleted,
      highestLevelUnlocked: userChallengeProgress.highestLevelUnlocked,
      bestScore: userChallengeProgress.bestScore,
      submissionCount: userChallengeProgress.submissionCount,
    })
    .from(userChallengeProgress)
    .innerJoin(challenges, eq(userChallengeProgress.challengeId, challenges.id))
    .where(eq(userChallengeProgress.userId, profileUser.id));

  // Fetch all submissions history
  const userSubmissions = await db
    .select({
      id: submissions.id,
      language: submissions.language,
      level: submissions.level,
      status: submissions.status,
      submittedAt: submissions.submittedAt,
      challengeTitle: challenges.title,
      challengeSlug: challenges.slug,
      isCorrect: submissionResults.isCorrect,
      score: submissionResults.score,
      throughputOpsSec: submissionResults.throughputOpsSec,
      improvementPct: submissionResults.improvementPct,
    })
    .from(submissions)
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .leftJoin(
      submissionResults,
      eq(submissions.id, submissionResults.submissionId)
    )
    .where(eq(submissions.userId, profileUser.id))
    .orderBy(desc(submissions.submittedAt))
    .limit(20);

  // Best result calculation
  const bestSubmission = userSubmissions.find((s) => s.isCorrect);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200/80 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2d7cf6] via-[#8b5cf6] to-[#f97316] flex items-center justify-center text-white text-2xl font-bold shadow-xs">
              {profileUser.username.slice(0, 1).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  @{profileUser.username}
                </h1>
                <Badge variant={profileUser.role === "ADMIN" ? "purple" : "secondary"}>
                  {profileUser.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{profileUser.name || "Engineer"}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Joined {new Date(profileUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* The 3 Pillars Profile Status (Spec 39) */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            ENGINEERING TRACKS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BUILD STATUS */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="pb-2">
                <div className="text-[11px] font-mono text-[#2d7cf6] font-semibold uppercase">
                  BUILD
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  System Reconstructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {progressList.length > 0 ? (
                  progressList.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-medium">{p.challengeTitle}</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {p.isCompleted ? "Completed" : `Level ${p.highestLevelUnlocked}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">No completed systems yet.</div>
                )}
              </CardContent>
            </Card>

            {/* OPTIMIZE STATUS */}
            <Card className="border-slate-200 shadow-2xs">
              <CardHeader className="pb-2">
                <div className="text-[11px] font-mono text-[#2dbfa8] font-semibold uppercase">
                  OPTIMIZE
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Verified Throughput
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {bestSubmission ? (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold font-mono text-slate-900">
                      {Number(bestSubmission.score).toFixed(2)}×
                    </div>
                    <div className="text-xs text-emerald-600 font-mono font-medium">
                      +{Number(bestSubmission.improvementPct).toFixed(1)}% vs baseline
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    No verified benchmarks yet.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* INNOVATE STATUS */}
            <Card className="border-slate-200 shadow-2xs bg-slate-50/50">
              <CardHeader className="pb-2">
                <div className="text-[11px] font-mono text-[#8b5cf6] font-semibold uppercase">
                  INNOVATE
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Open Research
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-xs text-slate-400">
                  Coming soon in future release.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submission History Table */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Verified Submissions
          </h2>

          {userSubmissions.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
              No submissions recorded yet.
            </div>
          ) : (
            <div className="border border-slate-200/90 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Challenge</th>
                    <th className="py-2.5 px-4">Language</th>
                    <th className="py-2.5 px-4">Level</th>
                    <th className="py-2.5 px-4">Score</th>
                    <th className="py-2.5 px-4">Throughput</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {userSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-sans font-medium text-slate-800">
                        {s.challengeTitle}
                      </td>
                      <td className="py-2.5 px-4 uppercase text-slate-500">
                        {s.language}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        L{s.level}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-[#2d7cf6]">
                        {s.score ? `${Number(s.score).toFixed(2)}×` : "—"}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">
                        {s.throughputOpsSec ? formatThroughput(s.throughputOpsSec) : "—"}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px]">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-sans">
                        <Link
                          href={`/submissions/${s.id}`}
                          className="text-[#2d7cf6] hover:underline font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
