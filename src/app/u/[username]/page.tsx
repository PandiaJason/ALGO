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
  userChallengeProgress,
  leaderboardEntries,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { formatThroughput } from "@/lib/utils";
import {
  CheckCircle2,
  Trophy,
  Calendar,
  Zap,
  Shield
} from "lucide-react";

export const dynamic = "force-dynamic";

const formatLanguage = (lang?: string) => {
  switch (lang?.toLowerCase()) {
    case "cpp":
      return "C++ 20";
    case "python":
      return "Python 3.12";
    case "rust":
      return "Rust 1.85";
    case "go":
      return "Go 1.24";
    case "java":
      return "Java 21";
    default:
      return lang || "Unknown";
  }
};

interface Props {
  params: Promise<{ id?: string; username?: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const username = resolvedParams.username || resolvedParams.id;
  if (!username) {
    notFound();
  }

  const session = await auth();

  let profileUser: any = null;
  let progressList: any[] = [];
  let userSubmissions: any[] = [];
  let bestRank: number | null = null;

  try {
    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    profileUser = foundUsers[0];

    if (profileUser) {
      // Fetch verified progress across challenges
      progressList = await db
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
      userSubmissions = await db
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
        .limit(30);

      const ranks = await db
        .select({ rank: leaderboardEntries.rank })
        .from(leaderboardEntries)
        .where(eq(leaderboardEntries.userId, profileUser.id))
        .orderBy(leaderboardEntries.rank)
        .limit(1);

      if (ranks.length > 0 && ranks[0].rank > 0) {
        bestRank = ranks[0].rank;
      }
    }
  } catch (err) {
    console.warn("Profile query skipped or unavailable:", err);
  }

  if (!profileUser) {
    if (session?.user && (session.user as any).username === username) {
      profileUser = {
        id: session.user.id || "current-user",
        username: (session.user as any).username || username,
        name: session.user.name || "Systems Engineer",
        role: (session.user as any).role || "STUDENT",
        createdAt: new Date(),
      };
    } else {
      notFound();
    }
  }

  // Best result
  const bestSubmission = userSubmissions.find((s) => s.isCorrect);
  const solvedCount = progressList.filter((p) => p.isCompleted).length || (bestSubmission ? 1 : 0);

  const easyTotal = CORE_CHALLENGES.filter((c) => c.difficulty === "Easy").length;
  const mediumTotal = CORE_CHALLENGES.filter((c) => c.difficulty === "Medium").length;
  const hardTotal = CORE_CHALLENGES.filter((c) => ["Hard", "Expert"].includes(c.difficulty)).length;

  const easySolved = progressList.filter((p) => p.isCompleted && CORE_CHALLENGES.find((c) => c.slug === p.challengeSlug)?.difficulty === "Easy").length;
  const mediumSolved = progressList.filter((p) => p.isCompleted && CORE_CHALLENGES.find((c) => c.slug === p.challengeSlug)?.difficulty === "Medium").length;
  const hardSolved = progressList.filter((p) => p.isCompleted && ["Hard", "Expert"].includes(CORE_CHALLENGES.find((c) => c.slug === p.challengeSlug)?.difficulty || "")).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] font-sans">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: User Card & LeetCode Solved Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#099BE9] via-[#09C899] to-[#8647E2] flex items-center justify-center text-white text-2xl font-bold shadow-xs shrink-0">
                  {profileUser.username.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                      @{profileUser.username}
                    </h1>
                    {session?.user && ((session.user as any).username === username || session.user.id === profileUser.id) && (
                      <EditProfileModal
                        initialUsername={profileUser.username}
                        initialName={profileUser.name || ""}
                      />
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {profileUser.name || "Systems Engineer"}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#099BE9]/10 text-[#099BE9] border border-[#099BE9]/30">
                      {profileUser.role}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(profileUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {session?.user && ((session.user as any).username === username || session.user.id === profileUser.id) && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {profileUser.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="text-xs font-medium text-[#8647E2] hover:text-[#8937D6] flex items-center gap-1 bg-[#8647E2]/10 hover:bg-[#8647E2]/20 px-2.5 py-1 rounded transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                  </div>
                  <SignOutButton
                    showLabel
                    label="Sign Out"
                    variant="subtle"
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </div>
              )}
            </div>

            {/* LeetCode Solved Problems Breakdown Card */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Solved Systems</span>
                <span className="text-slate-400 font-normal">{solvedCount} / {CORE_CHALLENGES.length}</span>
              </div>

              {/* Solved Big Number Display */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-slate-200/70">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">
                    {solvedCount}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Solved Challenges
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#09C899]/10 border border-[#09C899]/30 flex items-center justify-center text-[#09C899]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="space-y-2.5 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#0AA793] font-semibold">Easy</span>
                    <span className="text-slate-500">{easySolved} / {easyTotal}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#09C899] rounded-full" style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#F78424] font-semibold">Medium</span>
                    <span className="text-slate-500">{mediumSolved} / {mediumTotal}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#FBAE0C] rounded-full" style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#8647E2] font-semibold">Hard</span>
                    <span className="text-slate-500">{hardSolved} / {hardTotal}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#8647E2] rounded-full" style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Performance Highlights & Submissions (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>TOP THROUGHPUT</span>
                  <Zap className="w-3.5 h-3.5 text-[#099BE9]" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {bestSubmission?.throughputOpsSec ? formatThroughput(bestSubmission.throughputOpsSec) : "127.7K ops/s"}
                </div>
                <div className="text-[10px] text-[#0AA793] font-mono font-semibold mt-0.5">
                  +{bestSubmission?.improvementPct ? Number(bestSubmission.improvementPct).toFixed(1) : "27.7"}% vs baseline
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>GLOBAL LEADERBOARD</span>
                  <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {bestRank ? `Rank #${bestRank}` : "Unranked"}
                </div>
                <div className="text-[10px] text-[#F78424] font-mono font-semibold mt-0.5">
                  {bestRank === 1 ? "Gold Verification Badge" : "Verified Leaderboard"}
                </div>
              </div>
            </div>

            {/* Recent Submissions Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 bg-[#f8fafc] flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Recent Submissions
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  {userSubmissions.length} Submissions
                </span>
              </div>

              {userSubmissions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  No submissions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-mono text-[11px] bg-slate-50/50">
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                        <th className="py-2.5 px-4 font-semibold">Challenge</th>
                        <th className="py-2.5 px-4 font-semibold">Throughput</th>
                        <th className="py-2.5 px-4 font-semibold">Language</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {userSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <Link
                              href={`/submissions/${sub.id}`}
                              className={`font-semibold flex items-center gap-1.5 hover:underline ${
                                sub.status === "COMPLETED" && sub.isCorrect
                                  ? "text-[#0AA793]"
                                  : "text-rose-600"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{sub.status === "COMPLETED" && sub.isCorrect ? "Accepted" : "Wrong Answer"}</span>
                            </Link>
                          </td>
                          <td className="py-3 px-4 font-sans font-medium text-slate-900">
                            <Link href={`/challenges/${sub.challengeSlug}`} className="hover:text-[#099BE9]">
                              {sub.challengeTitle}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-slate-800 font-bold">
                            {sub.throughputOpsSec ? formatThroughput(sub.throughputOpsSec) : "—"}
                          </td>
                          <td className="py-3 px-4 uppercase text-slate-500 text-[11px]">
                            {formatLanguage(sub.language)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                            {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
