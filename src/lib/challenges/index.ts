// src/lib/challenges/index.ts
import { ChallengeData } from "./types";
import { kvStoreChallenge } from "./kv-store";
import { httpServerChallenge } from "./http-server";
import { messageQueueChallenge } from "./message-queue";
import { databaseIndexChallenge } from "./database-index";
import { lruCacheChallenge } from "./lru-cache";
import { logEngineChallenge } from "./log-engine";
import { taskSchedulerChallenge } from "./task-scheduler";
import { rateLimiterChallenge } from "./rate-limiter";
import { loadBalancerChallenge } from "./load-balancer";
import { searchEngineChallenge } from "./search-engine";

export * from "./types";

export const CHALLENGES_REGISTRY: Record<string, ChallengeData> = {
  "kv-store": kvStoreChallenge,
  "http-server": httpServerChallenge,
  "message-queue": messageQueueChallenge,
  "database-index": databaseIndexChallenge,
  "lru-cache": lruCacheChallenge,
  "log-engine": logEngineChallenge,
  "task-scheduler": taskSchedulerChallenge,
  "rate-limiter": rateLimiterChallenge,
  "load-balancer": loadBalancerChallenge,
  "search-engine": searchEngineChallenge,
};

export const CHALLENGES_LIST: ChallengeData[] = [
  kvStoreChallenge,
  httpServerChallenge,
  messageQueueChallenge,
  databaseIndexChallenge,
  lruCacheChallenge,
  logEngineChallenge,
  taskSchedulerChallenge,
  rateLimiterChallenge,
  loadBalancerChallenge,
  searchEngineChallenge,
];

export function getChallenge(slugOrId: string): ChallengeData | undefined {
  if (CHALLENGES_REGISTRY[slugOrId]) {
    return CHALLENGES_REGISTRY[slugOrId];
  }
  // Try matching by number ("01", "02", etc.)
  const byNum = CHALLENGES_LIST.find((c) => c.number === slugOrId || c.number === slugOrId.padStart(2, "0"));
  if (byNum) return byNum;

  // Try matching title substring or slug
  const normalized = slugOrId.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  return CHALLENGES_LIST.find((c) => c.slug === normalized || c.slug.includes(normalized) || normalized.includes(c.slug));
}

export function getChallengeLevels(slugOrId: string) {
  const challenge = getChallenge(slugOrId);
  return challenge?.levels || kvStoreChallenge.levels;
}
