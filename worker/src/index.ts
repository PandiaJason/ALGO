import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { db } from "../../src/db";
import {
  submissions,
  submissionResults,
  leaderboardEntries,
  userChallengeProgress,
  events,
} from "../../src/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { runQuickTest, runBenchmark } from "../../src/lib/sandbox/runner";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

console.log("🚀 ALGO Execution Worker starting...");

export const worker = new Worker(
  "submission-eval-queue",
  async (job: Job) => {
    const { submissionId, challengeId, language, level, files, userId } = job.data;
    console.log(`[Worker] Processing submission ${submissionId} (${language}, Level ${level})`);

    try {
      // 1. Mark as RUNNING
      await db
        .update(submissions)
        .set({ status: "RUNNING", startedAt: new Date() })
        .where(eq(submissions.id, submissionId));

      const code = files[0]?.content || "";

      // 2. Mark as TESTING and execute correctness suite
      await db
        .update(submissions)
        .set({ status: "TESTING" })
        .where(eq(submissions.id, submissionId));

      const testResult = await runQuickTest(language, code, level);
      const isCorrect = testResult.passed === testResult.total;

      console.log(`[Worker] Test pass rate: ${testResult.passed}/${testResult.total}`);

      let benchMetrics = {
        throughputOpsSec: 0,
        latencyP50Ms: 0,
        latencyP95Ms: 0,
        latencyP99Ms: 0,
        memoryBytes: 0,
        cpuTimeMs: 0,
        baselineThroughput: 100000.0,
        improvementPct: 0,
        score: 0,
      };

      if (isCorrect) {
        // 3. Mark as BENCHMARKING and execute high-throughput workload
        await db
          .update(submissions)
          .set({ status: "BENCHMARKING" })
          .where(eq(submissions.id, submissionId));

        console.log(`[Worker] Running benchmark stream for ${submissionId}...`);
        benchMetrics = await runBenchmark(language, code, 30000);
        console.log(
          `[Worker] Benchmark throughput: ${benchMetrics.throughputOpsSec} ops/s (${benchMetrics.score}x baseline)`
        );
      }

      // 4. Record submission_results
      const finalStatus = isCorrect ? "COMPLETED" : "FAILED";

      await db
        .insert(submissionResults)
        .values({
          submissionId,
          correctnessPassed: testResult.passed,
          correctnessTotal: testResult.total,
          correctnessScore: String(testResult.passed / testResult.total),
          isCorrect,
          throughputOpsSec: isCorrect ? String(benchMetrics.throughputOpsSec) : null,
          latencyP50Ms: isCorrect ? String(benchMetrics.latencyP50Ms) : null,
          latencyP95Ms: isCorrect ? String(benchMetrics.latencyP95Ms) : null,
          latencyP99Ms: isCorrect ? String(benchMetrics.latencyP99Ms) : null,
          memoryBytes: isCorrect ? benchMetrics.memoryBytes : null,
          cpuTimeMs: isCorrect ? String(benchMetrics.cpuTimeMs) : null,
          baselineThroughput: String(benchMetrics.baselineThroughput),
          score: String(benchMetrics.score),
          improvementPct: String(benchMetrics.improvementPct),
          testOutput: testResult.details,
          rawMetrics: benchMetrics,
        })
        .onConflictDoNothing();

      // 5. Update submission status to COMPLETED / FAILED
      await db
        .update(submissions)
        .set({ status: finalStatus, completedAt: new Date() })
        .where(eq(submissions.id, submissionId));

      // 6. Update Leaderboard Entry if correct
      if (isCorrect) {
        // Check user's current best score
        const existingEntry = await db
          .select()
          .from(leaderboardEntries)
          .where(
            and(
              eq(leaderboardEntries.challengeId, challengeId),
              eq(leaderboardEntries.userId, userId)
            )
          )
          .limit(1);

        const currentScore = Number(benchMetrics.score);
        const existingScore = existingEntry[0] ? Number(existingEntry[0].score) : -1;

        if (currentScore > existingScore) {
          await db
            .insert(leaderboardEntries)
            .values({
              challengeId,
              userId,
              submissionId,
              score: String(currentScore),
              throughputOpsSec: String(benchMetrics.throughputOpsSec),
              latencyP99Ms: String(benchMetrics.latencyP99Ms),
              memoryBytes: benchMetrics.memoryBytes,
              rank: 1, // Will be recalculated
              isVerified: true,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: [leaderboardEntries.challengeId, leaderboardEntries.userId],
              set: {
                submissionId,
                score: String(currentScore),
                throughputOpsSec: String(benchMetrics.throughputOpsSec),
                latencyP99Ms: String(benchMetrics.latencyP99Ms),
                memoryBytes: benchMetrics.memoryBytes,
                updatedAt: new Date(),
              },
            });

          // Recalculate ranks for this challenge
          const allLeaders = await db
            .select({ id: leaderboardEntries.id })
            .from(leaderboardEntries)
            .where(eq(leaderboardEntries.challengeId, challengeId))
            .orderBy(desc(leaderboardEntries.score));

          for (let i = 0; i < allLeaders.length; i++) {
            await db
              .update(leaderboardEntries)
              .set({ rank: i + 1 })
              .where(eq(leaderboardEntries.id, allLeaders[i].id));
          }
        }

        // Update user challenge progress
        await db
          .insert(userChallengeProgress)
          .values({
            userId,
            challengeId,
            highestLevelUnlocked: Math.min(level + 1, 6),
            bestScore: String(currentScore),
            bestSubmissionId: submissionId,
            isCompleted: level >= 3,
            submissionCount: 1,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [userChallengeProgress.userId, userChallengeProgress.challengeId],
            set: {
              highestLevelUnlocked: Math.max(level + 1, 1),
              bestScore: String(Math.max(currentScore, existingScore)),
              isCompleted: level >= 3,
              updatedAt: new Date(),
            },
          });
      }

      console.log(`[Worker] Evaluation for ${submissionId} finalized as ${finalStatus}.`);
    } catch (err) {
      console.error(`[Worker] Failure processing submission ${submissionId}:`, err);
      await db
        .update(submissions)
        .set({ status: "FAILED", completedAt: new Date() })
        .where(eq(submissions.id, submissionId));
    }
  },
  {
    connection,
    concurrency: 2,
  }
);

worker.on("ready", () => {
  console.log("⚡ Worker connected to Redis and ready for jobs.");
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});
