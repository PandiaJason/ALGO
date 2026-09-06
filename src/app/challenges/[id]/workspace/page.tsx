import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions, submissions, submissionResults, leaderboardEntries, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { WorkspaceClient } from "./workspace-client";
import { getChallenge } from "@/lib/challenges";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  // 1. Resolve authentic challenge definition first
  const coreDef = CORE_CHALLENGES.find((c) => c.slug === id || c.number === id);
  const chData = getChallenge(id);

  let challenge = {
    id: chData?.slug || coreDef?.slug || id || "kv-store",
    slug: chData?.slug || coreDef?.slug || id || "kv-store",
    title: chData?.title || coreDef?.title || "Build a Systems Engine",
    description: chData?.overview || coreDef?.overview || "Engineering proving ground challenge",
    difficulty: coreDef?.difficulty || "Medium",
  };

  let version: any = {
    id: "v1",
    starterTemplates: chData?.starterTemplates || { python: "", cpp: "" },
    levels: chData ? Object.values(chData.levels).sort((a, b) => a.level - b.level) : [],
    spec: chData ? {
      badge: chData.badge,
      title: chData.title,
      overview: chData.overview,
      whyItMatters: chData.whyItMatters,
      finalOutcome: chData.finalOutcome,
      architecturalLayers: chData.architecturalLayers,
    } : null,
  };

  let userSubmissions: any[] = [];
  let topLeaders: any[] = [];

  try {
    const foundChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, challenge.slug))
      .limit(1);

    if (foundChallenges[0]) {
      challenge = {
        id: foundChallenges[0].id,
        slug: foundChallenges[0].slug,
        title: foundChallenges[0].title || challenge.title,
        description: foundChallenges[0].description || challenge.description,
        difficulty: (
          foundChallenges[0].difficulty === "BEGINNER" ? "Easy" :
          foundChallenges[0].difficulty === "INTERMEDIATE" ? "Medium" :
          foundChallenges[0].difficulty === "ADVANCED" ? "Hard" :
          foundChallenges[0].difficulty === "EXPERT" ? "Expert" :
          challenge.difficulty
        ),
      };

      const versions = await db
        .select()
        .from(challengeVersions)
        .where(eq(challengeVersions.challengeId, challenge.id))
        .orderBy(desc(challengeVersions.version))
        .limit(1);

      if (versions[0]) {
        let rawLevels = versions[0].levels;
        if (typeof rawLevels === "string") {
          try { rawLevels = JSON.parse(rawLevels); } catch {}
        }
        let rawTemplates = versions[0].starterTemplates;
        if (typeof rawTemplates === "string") {
          try { rawTemplates = JSON.parse(rawTemplates); } catch {}
        }
        let rawSpec = versions[0].spec;
        if (typeof rawSpec === "string") {
          try { rawSpec = JSON.parse(rawSpec); } catch {}
        }

        version = {
          ...versions[0],
          starterTemplates: (rawTemplates && typeof rawTemplates === "object" && ((rawTemplates as any).python || (rawTemplates as any).cpp))
            ? rawTemplates
            : version.starterTemplates,
          levels: (Array.isArray(rawLevels) && rawLevels.length > 0)
            ? rawLevels
            : version.levels,
          spec: (rawSpec && typeof rawSpec === "object" && ((rawSpec as any).architecturalLayers || (rawSpec as any).overview))
            ? rawSpec
            : version.spec,
        };
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
        spec: version.spec || undefined,
      }}
      user={session?.user as any}
      pastSubmissions={userSubmissions as any}
      topLeaders={topLeaders as any}
    />
  );
}
