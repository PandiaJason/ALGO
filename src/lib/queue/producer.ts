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

  // Active polling fallback:
  // BullMQ's waitUntilFinished uses Redis Pub/Sub, which has zero message retention.
  // In serverless / high-speed environments, if the worker executes the job faster than
  // QueueEvents takes to complete its TLS handshake and subscribe, the completion event
  // is missed forever, causing an artificial 25s timeout.
  // Polling getState() directly from the Redis hash guarantees instant resolution in <200ms.
  const pollPromise = new Promise(async (resolve, reject) => {
    const startTime = Date.now();
    const pollIntervalMs = 200;

    // Check immediately (in case worker finished in <50ms)
    try {
      const immediate = await quickTestQueue.getJob(jobId);
      if (immediate) {
        const state = await immediate.getState();
        if (state === "completed") return resolve(immediate.returnvalue);
        if (state === "failed") return reject(new Error(immediate.failedReason || "Test execution failed"));
      }
    } catch {}

    while (Date.now() - startTime < timeoutMs) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      try {
        const currentJob = await quickTestQueue.getJob(jobId);
        if (currentJob) {
          const state = await currentJob.getState();
          if (state === "completed") {
            return resolve(currentJob.returnvalue);
          }
          if (state === "failed") {
            return reject(new Error(currentJob.failedReason || "Test execution failed"));
          }
        }
      } catch {
        // Keep polling on transient Redis network hiccups
      }
    }

    reject(new Error(`Test execution timed out after ${Math.round(timeoutMs / 1000)}s`));
  });

  // Optional QueueEvents listener
  let eventsConn: Redis | null = null;
  let queueEvents: QueueEvents | null = null;
  try {
    eventsConn = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
    });
    queueEvents = new QueueEvents("quick-test-queue", { connection: eventsConn });
  } catch {}

  const eventPromise = queueEvents
    ? job.waitUntilFinished(queueEvents, timeoutMs).catch(() => {
        // Defer to pollPromise if event listener misses or times out
        return new Promise(() => {});
      })
    : new Promise(() => {});

  try {
    const result = await Promise.race([pollPromise, eventPromise]);
    return result;
  } finally {
    if (queueEvents) {
      try {
        await queueEvents.close();
      } catch {}
    }
    if (eventsConn) {
      try {
        await eventsConn.quit();
      } catch {}
    }
  }
}

