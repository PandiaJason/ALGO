import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions, submissions, submissionResults, leaderboardEntries, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { WorkspaceClient } from "./workspace-client";

import { DEFAULT_STARTER_TEMPLATES } from "@/lib/constants/templates";
import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "@/lib/constants/challenge-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  let challenge = {
    id: "kv-store",
    slug: id || "kv-store",
    title: PROJECT_SCOPE.title,
    description: PROJECT_SCOPE.overview,
    difficulty: "Medium",
  };

  let version: any = {
    id: "v1",
    starterTemplates: DEFAULT_STARTER_TEMPLATES,
    levels: Object.values(LEVEL_DEFINITIONS).map((l) => ({
      level: l.level,
      title: l.title,
      description: l.tagline,
    })),
  };

  let userSubmissions: any[] = [];
  let topLeaders: any[] = [];

  try {
    const foundChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, id))
      .limit(1);

    if (foundChallenges[0]) {
      challenge = {
        id: foundChallenges[0].id,
        slug: foundChallenges[0].slug,
        title: foundChallenges[0].title,
        description: foundChallenges[0].description,
        difficulty: foundChallenges[0].difficulty,
      };

      const versions = await db
        .select()
        .from(challengeVersions)
        .where(eq(challengeVersions.challengeId, challenge.id))
        .orderBy(desc(challengeVersions.version))
        .limit(1);

      if (versions[0]) {
        version = versions[0];
      }

      if (session?.user?.id) {
        userSubmissions = await db
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
          .limit(10);
      }

      topLeaders = await db
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
    }
  } catch (err) {
    console.warn("Database query skipped or failed, using resilient fallback data:", err);
  }

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
