import { Queue } from "bullmq";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const globalForQueue = globalThis as unknown as {
  redisClient: Redis | undefined;
  submissionQueue: Queue | undefined;
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
      attempts: 1,
      removeOnComplete: 100,
      removeOnFail: 200,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForQueue.submissionQueue = submissionQueue;
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
