import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  challenges,
  challengeVersions,
  submissions,
  submissionFiles,
  submissionResults,
  userChallengeProgress,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { enqueueQuickTest } from "@/lib/queue/producer";
import { runQuickTest } from "@/lib/sandbox/runner";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const testSchema = z.object({
  language: z.enum(["python", "cpp", "rust", "go", "java"]),
  level: z.number().int().min(1).max(6).default(1),
  code: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    let challengeSlug = id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      try {
        const found = await db
          .select({ slug: challenges.slug })
          .from(challenges)
          .where(eq(challenges.id, id))
          .limit(1);
        if (found[0]?.slug) {
          challengeSlug = found[0].slug;
        }
      } catch {}
    }

    const body = await req.json();
    const parsed = testSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { language, level, code } = parsed.data;

    // 1. Attempt delegated execution via BullMQ queue (Vercel-compatible)
    let result: any = null;
    let queueError: any = null;

    try {
      result = await enqueueQuickTest({ language, level, code, challengeSlug }, 20000);
    } catch (err: any) {
      console.error("[QuickTest Queue Error]:", err);
      queueError = err;
    }

    // 2. Fallback: only if running locally on dev machine with Docker
    if (!result) {
      if (!process.env.VERCEL) {
        try {
          result = await runQuickTest(language, code, level, challengeSlug);
        } catch (directErr: any) {
          throw new Error(
            queueError?.message ||
              directErr?.message ||
              "Evaluator worker is currently unavailable."
          );
        }
      } else {
        throw new Error(
          queueError?.message ||
            "Evaluator worker is currently busy. Please verify the worker daemon is active."
        );
      }
    }

    // 3. Auto-save in PostgreSQL if ALL testcases for this level passed
    let saved = false;
    let highestLevelUnlocked = level;

    if (result && result.passed === result.total && result.total > 0 && session?.user?.id) {
      try {
        let challengeRecord: any = null;
        if (isUuid) {
          const found = await db
            .select()
            .from(challenges)
            .where(eq(challenges.id, id))
            .limit(1);
          challengeRecord = found[0];
        }
        if (!challengeRecord) {
          const found = await db
            .select()
            .from(challenges)
            .where(eq(challenges.slug, challengeSlug))
            .limit(1);
          challengeRecord = found[0];
        }

        if (challengeRecord) {
          // Resolve challenge version
          const latestVer = await db
            .select({ id: challengeVersions.id })
            .from(challengeVersions)
            .where(eq(challengeVersions.challengeId, challengeRecord.id))
            .orderBy(desc(challengeVersions.version))
            .limit(1);

          let versionId = latestVer[0]?.id;
          if (!versionId) {
            const [newVer] = await db
              .insert(challengeVersions)
              .values({
                challengeId: challengeRecord.id,
                version: 1,
                spec: {},
                levels: [],
                starterTemplates: {},
                testDefinitions: {},
              })
              .returning();
            versionId = newVer?.id;
          }

          if (versionId) {
            // Persist completed submission record
            const filenameMap: Record<string, string> = {
              python: "solution.py",
              cpp: "solution.cpp",
              rust: "solution.rs",
              go: "main.go",
              java: "Solution.java",
            };
            const filename = filenameMap[language] || "solution.txt";

            const [newSub] = await db
              .insert(submissions)
              .values({
                userId: session.user.id,
                challengeId: challengeRecord.id,
                challengeVersionId: versionId,
                language,
                level,
                status: "COMPLETED",
                submittedAt: new Date(),
                completedAt: new Date(),
              })
              .returning();

            if (newSub) {
              await db.insert(submissionFiles).values({
                submissionId: newSub.id,
                filename,
                content: code,
              });

              await db
                .insert(submissionResults)
                .values({
                  submissionId: newSub.id,
                  correctnessPassed: result.passed,
                  correctnessTotal: result.total,
                  correctnessScore: "1.0000",
                  isCorrect: true,
                  testOutput: result.details || "All test cases passed.",
                })
                .onConflictDoNothing();

              // Unlock next level (e.g. if Level 1 passed, Level 2 is unlocked; max 6)
              const nextLevel = Math.min(level + 1, 6);
              const isCompleted = level >= 6;

              const [prog] = await db
                .insert(userChallengeProgress)
                .values({
                  userId: session.user.id,
                  challengeId: challengeRecord.id,
                  highestLevelUnlocked: nextLevel,
                  bestSubmissionId: newSub.id,
                  isCompleted,
                  submissionCount: 1,
                  updatedAt: new Date(),
                })
                .onConflictDoUpdate({
                  target: [userChallengeProgress.userId, userChallengeProgress.challengeId],
                  set: {
                    highestLevelUnlocked: sql`GREATEST(${userChallengeProgress.highestLevelUnlocked}, ${nextLevel})`,
                    bestSubmissionId: newSub.id,
                    isCompleted: sql`${userChallengeProgress.isCompleted} OR ${isCompleted}`,
                    submissionCount: sql`${userChallengeProgress.submissionCount} + 1`,
                    updatedAt: new Date(),
                  },
                })
                .returning();

              saved = true;
              highestLevelUnlocked = prog?.highestLevelUnlocked ?? nextLevel;
            }
          }
        }
      } catch (dbErr) {
        console.error("[Test Auto-Save Database Error]:", dbErr);
      }
    }

    return NextResponse.json({
      passed: result.passed,
      total: result.total,
      details: result.details,
      output: result.output,
      cases: result.cases,
      saved,
      highestLevelUnlocked,
    });
  } catch (err: any) {
    const isTimeout = err.message?.includes("timed out") || err.message?.includes("timeout");
    const userFriendlyError = isTimeout
      ? "Execution timed out. Please check your solution for infinite loops or unhandled standard I/O streams."
      : err.message || "Failed to execute test suite";

    return NextResponse.json({ error: userFriendlyError }, { status: 500 });
  }
}
