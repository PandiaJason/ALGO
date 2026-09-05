import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions, submissions, submissionResults, leaderboardEntries, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { WorkspaceClient } from "./workspace-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: Props) {
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
  if (!version) {
    notFound();
  }

  // Fetch real past submissions for this user
  const userSubmissions = session?.user?.id
    ? await db
        .select({
          id: submissions.id,
          status: submissions.status,
          language: submissions.language,
          level: submissions.level,
          submittedAt: submissions.submittedAt,
          throughputOpsSec: submissionResults.throughputOpsSec,
          score: submissionResults.score,
          latencyP99Ms: submissionResults.latencyP99Ms,
          memoryBytes: submissionResults.memoryBytes,
          isCorrect: submissionResults.isCorrect,
        })
        .from(submissions)
        .leftJoin(submissionResults, eq(submissions.id, submissionResults.submissionId))
        .where(
          and(
            eq(submissions.challengeId, challenge.id),
            eq(submissions.userId, session.user.id)
          )
        )
        .orderBy(desc(submissions.submittedAt))
        .limit(10)
    : [];

  // Fetch real top leaderboard entries
  const topLeaders = await db
    .select({
      rank: leaderboardEntries.rank,
      score: leaderboardEntries.score,
      throughputOpsSec: leaderboardEntries.throughputOpsSec,
      username: users.username,
      name: users.name,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .where(eq(leaderboardEntries.challengeId, challenge.id))
    .orderBy(desc(leaderboardEntries.score))
    .limit(10);

  return (
    <WorkspaceClient
      challenge={{
        id: challenge.id,
        slug: challenge.slug,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
      }}
      version={{
        id: version.id,
        starterTemplates: version.starterTemplates as any,
        levels: (version.levels as any[]) || [],
      }}
      user={session?.user as any}
      pastSubmissions={userSubmissions as any}
      topLeaders={topLeaders as any}
    />
  );
}
