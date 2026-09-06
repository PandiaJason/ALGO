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

export interface QuickTestJobData {
  language: "python" | "cpp";
  level: number;
  code: string;
}

export async function enqueueQuickTest(data: QuickTestJobData, timeoutMs = 25000) {
  const eventsConn = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
  const queueEvents = new QueueEvents("quick-test-queue", { connection: eventsConn });
  try {
    const job = await quickTestQueue.add("run-quick-test", data);
    const result = await job.waitUntilFinished(queueEvents, timeoutMs);
    return result;
  } finally {
    try {
      await queueEvents.close();
      await eventsConn.quit();
    } catch {}
  }
}
