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

function serializeJsonSafe<T>(val: T): T {
  try {
    return JSON.parse(
      JSON.stringify(val, (_key, value) => {
        if (typeof value === "function") return undefined;
        if (value instanceof Date) return value.toISOString();
        return value;
      })
    );
  } catch {
    return val;
  }
}

export default async function WorkspacePage({ params }: Props) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId || "kv-store");

  let session: any = null;
  try {
    session = await auth();
  } catch (authErr) {
    console.warn("Auth session resolution skipped or failed in WorkspacePage:", authErr);
  }

  // 1. Resolve authentic challenge definition first
  const coreDef = CORE_CHALLENGES.find((c) => c.slug === id || c.number === id);
  const chData = getChallenge(id) || (coreDef ? getChallenge(coreDef.slug) : undefined);

  let challenge = {
    id: chData?.slug || coreDef?.slug || id || "kv-store",
    slug: chData?.slug || coreDef?.slug || id || "kv-store",
    title: chData?.title || coreDef?.title || "Build a Systems Engine",
    description: chData?.overview || coreDef?.overview || "Engineering proving ground challenge",
    difficulty: coreDef?.difficulty || "Medium",
  };

  let version: any = {
    id: "v1",
    starterTemplates: chData?.starterTemplates || { python: "", cpp: "", rust: "", go: "", java: "" },
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
          starterTemplates: (rawTemplates && typeof rawTemplates === "object" && ((rawTemplates as any).python || (rawTemplates as any).cpp || (rawTemplates as any).rust || (rawTemplates as any).go || (rawTemplates as any).java))
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

  const safeLevels = Array.isArray(version.levels)
    ? version.levels.map((l: any, idx: number) => ({
        level: l.level || idx + 1,
        title: l.title || `Level ${idx + 1}`,
        shortTitle: l.shortTitle || l.title || `L${idx + 1}`,
        difficulty: l.difficulty || "Medium",
        tagline: l.tagline || l.description || "",
        diagram: l.diagram || undefined,
        importantChallenge: l.importantChallenge || undefined,
        endGoalDemonstration: l.endGoalDemonstration || undefined,
        nextLevelTeaser: l.nextLevelTeaser || undefined,
        learningLoop: l.learningLoop || undefined,
        operations: Array.isArray(l.operations) ? l.operations : [],
        durabilityRules: Array.isArray(l.durabilityRules) ? l.durabilityRules : [],
        examples: Array.isArray(l.examples) ? l.examples : [],
        constraints: Array.isArray(l.constraints) ? l.constraints : [],
        cases: Array.isArray(l.cases)
          ? l.cases.map((c: any) => ({
              name: c.name || "Case",
              input: c.input || "",
              expected: c.expected || "",
            }))
          : [],
      }))
    : [];

  const safeSubmissions = (userSubmissions || []).map((sub: any) => ({
    ...sub,
    submittedAt: sub.submittedAt ? new Date(sub.submittedAt).toISOString() : new Date().toISOString(),
  }));

  const safeLeaders = (topLeaders || []).map((ldr: any) => ({
    rank: ldr.rank,
    score: ldr.score,
    throughputOpsSec: ldr.throughputOpsSec,
    username: ldr.username,
    name: ldr.name,
  }));

  const safeUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        role: (session.user as any)?.role || "STUDENT",
        username: (session.user as any)?.username || null,
      }
    : null;

  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-white text-slate-500 font-mono text-xs">Loading Workspace...</div>}>
      <WorkspaceClient
        challenge={serializeJsonSafe({
          id: challenge.id,
          slug: challenge.slug,
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
        })}
        version={serializeJsonSafe({
          id: String(version.id || "v1"),
          starterTemplates: version.starterTemplates || {},
          levels: safeLevels,
          spec: version.spec || undefined,
        })}
        user={safeUser}
        pastSubmissions={serializeJsonSafe(safeSubmissions)}
        topLeaders={serializeJsonSafe(safeLeaders)}
      />
    </React.Suspense>
  );
}
