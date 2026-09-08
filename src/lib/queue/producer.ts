import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Queue, QueueEvents } from "bullmq";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const globalForQueue = globalThis as unknown as {
  redisClient: Redis | undefined;
  submissionQueue: Queue | undefined;
  quickTestQueue: Queue | undefined;
};

export const redisConnection =
  globalForQueue.redisClient ??
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForQueue.redisClient = redisConnection;
}

export const submissionQueue =
  globalForQueue.submissionQueue ??
  new Queue("submission-eval-queue", {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 200,
      removeOnFail: 500,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForQueue.submissionQueue = submissionQueue;
}

export const quickTestQueue =
  globalForQueue.quickTestQueue ??
  new Queue("quick-test-queue", {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: 100,
      removeOnFail: 100,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForQueue.quickTestQueue = quickTestQueue;
}

export interface SubmissionJobData {
  submissionId: string;
  challengeId: string;
  challengeSlug?: string;
  challengeVersionId: string;
  userId: string;
  language: string;
  level: number;
  files: Array<{
    filename: string;
    content: string;
  }>;
}

export async function enqueueSubmission(data: SubmissionJobData) {
  return await submissionQueue.add("evaluate-submission", data, {
    jobId: data.submissionId,
  });
}

import { SupportedLanguage } from "@/lib/challenges/types";

export interface QuickTestJobData {
  language: SupportedLanguage;
  level: number;
  code: string;
  challengeSlug?: string;
}

export async function enqueueQuickTest(data: QuickTestJobData, timeoutMs = 20000) {
  const job = await quickTestQueue.add("run-quick-test", data);
  const jobId = job.id!;

  const startTime = Date.now();
  const pollIntervalMs = 100;

  while (Date.now() - startTime < timeoutMs) {
    try {
      const currentJob = await quickTestQueue.getJob(jobId);
      if (currentJob) {
        const state = await currentJob.getState();
        if (state === "completed") {
          return currentJob.returnvalue;
        }
        if (state === "failed") {
          throw new Error(currentJob.failedReason || "Test execution failed");
        }
      }
    } catch (err: any) {
      if (err.message && !err.message.includes("Connection") && !err.message.includes("closed")) {
        throw err;
      }
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  throw new Error(`Test execution timed out after ${Math.round(timeoutMs / 1000)}s`);
}

