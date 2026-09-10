// src/lib/challenges/index.ts
import { ChallengeData } from "./types";
import { shellChallenge } from "./shell";
import { httpServerChallenge } from "./http-server";
import { gitChallenge } from "./git";
import { kvStoreChallenge } from "./kv-store";
import { objectStoreChallenge } from "./object-store";
import { lruCacheChallenge } from "./lru-cache";
import { databaseIndexChallenge } from "./database-index";
import { containerRuntimeChallenge } from "./container-runtime";
import { messageQueueChallenge } from "./message-queue";
import { logEngineChallenge } from "./log-engine";
import { rateLimiterChallenge } from "./rate-limiter";
import { loadBalancerChallenge } from "./load-balancer";
import { taskSchedulerChallenge } from "./task-scheduler";
import { distributedConsensusChallenge } from "./distributed-consensus";
import { serviceDiscoveryChallenge } from "./service-discovery";
import { distributedObjectStorageChallenge } from "./distributed-object-storage";
import { searchEngineChallenge } from "./search-engine";
import { vectorDatabaseChallenge } from "./vector-database";
import { llmInferenceChallenge } from "./llm-inference";
import { mcpRuntimeChallenge } from "./mcp-runtime";

export * from "./types";

export const CHALLENGES_REGISTRY: Record<string, ChallengeData> = {
  // Core Systems (01 - 08)
  "shell": shellChallenge,
  "http-server": httpServerChallenge,
  "git": gitChallenge,
  "kv-store": kvStoreChallenge,
  "object-store": objectStoreChallenge,
  "lru-cache": lruCacheChallenge,
  "database-index": databaseIndexChallenge,
  "container-runtime": containerRuntimeChallenge,

  // Distributed Systems (09 - 16)
  "message-queue": messageQueueChallenge,
  "log-engine": logEngineChallenge,
  "rate-limiter": rateLimiterChallenge,
  "load-balancer": loadBalancerChallenge,
  "task-scheduler": taskSchedulerChallenge,
  "distributed-consensus": distributedConsensusChallenge,
  "service-discovery": serviceDiscoveryChallenge,
  "distributed-object-storage": distributedObjectStorageChallenge,

  // AI Systems (17 - 20)
  "search-engine": searchEngineChallenge,
  "vector-database": vectorDatabaseChallenge,
  "llm-inference": llmInferenceChallenge,
  "mcp-runtime": mcpRuntimeChallenge,
};

export const CHALLENGES_LIST: ChallengeData[] = [
  // Core Systems (01 - 08)
  shellChallenge,
  httpServerChallenge,
  gitChallenge,
  kvStoreChallenge,
  objectStoreChallenge,
  lruCacheChallenge,
  databaseIndexChallenge,
  containerRuntimeChallenge,

  // Distributed Systems (09 - 16)
  messageQueueChallenge,
  logEngineChallenge,
  rateLimiterChallenge,
  loadBalancerChallenge,
  taskSchedulerChallenge,
  distributedConsensusChallenge,
  serviceDiscoveryChallenge,
  distributedObjectStorageChallenge,

  // AI Systems (17 - 20)
  searchEngineChallenge,
  vectorDatabaseChallenge,
  llmInferenceChallenge,
  mcpRuntimeChallenge,
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
