import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Terminal,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Code2,
  Layers,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Server,
  Zap,
  ShieldAlert,
  Database,
  Lock,
  Activity,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "@/lib/constants/challenge-data";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";
import { getChallenge } from "@/lib/challenges";
import { UNIVERSAL_STAGES } from "@/lib/challenges/types";

const CHALLENGE_TARGET_SPECS: Record<
  string,
  {
    targetOutcome: string;
    metrics: Array<{ label: string; value: string; desc: string; color: string }>;
  }
> = {
  // 01. Unix Shell
  shell: {
    targetOutcome:
      "Engineered an interactive Unix command interpreter with process address space isolation, fork/exec lifecycle management, signal traps, and multi-stage file descriptor pipelines.",
    metrics: [
      { label: "PROCESS SPAWN", value: "< 1.5ms", desc: "Fork & exec overhead", color: "text-[#0AA793]" },
      { label: "PIPELINE I/O", value: "> 500 MB/s", desc: "Piped stdout/stdin stream", color: "text-[#099BE9]" },
      { label: "ORPHAN REAP", value: "0 Zombies", desc: "Clean non-blocking waitpid", color: "text-[#F78424]" },
    ],
  },
  // 02. High-Concurrency HTTP Server
  "http-server": {
    targetOutcome:
      "Engineered an RFC 7230 compliant HTTP/1.1 server from raw TCP sockets with non-blocking epoll/kqueue event loops, trie dynamic routing, and keep-alive connection pooling.",
    metrics: [
      { label: "THROUGHPUT", value: "> 50,000 req/s", desc: "Zero-copy file streaming", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 1.0ms p99", desc: "Non-blocking event loop", color: "text-[#099BE9]" },
      { label: "CONCURRENCY", value: "10,000+ Conn.", desc: "C10K persistent pool", color: "text-[#F78424]" },
    ],
  },
  // 03. Git Version Control Engine
  git: {
    targetOutcome:
      "Engineered a content-addressed version control database and Directed Acyclic Graph (DAG) with SHA-1 blob/tree serialization, commit lineage traversal, and packfile delta compression.",
    metrics: [
      { label: "COMMIT SPEED", value: "< 2.0ms", desc: "SHA-1 DAG object write", color: "text-[#0AA793]" },
      { label: "TREE DIFF", value: "< 25ms", desc: "50,000 file tree diffing", color: "text-[#099BE9]" },
      { label: "COMPRESSION", value: "> 60% Ratio", desc: "Packfile delta compression", color: "text-[#F78424]" },
    ],
  },
  // 04. Key-Value Storage Engine
  "kv-store": {
    targetOutcome:
      "Engineered a production-grade, crash-resilient in-memory key-value storage engine with synchronous WAL durability, millisecond TTL eviction, and 32-shard mutex concurrency.",
    metrics: [
      { label: "THROUGHPUT", value: "> 100,000 ops/s", desc: "Pipeline stream dispatch", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 0.20ms p99", desc: "Sub-millisecond access", color: "text-[#099BE9]" },
      { label: "RESOURCE", value: "256 MB RAM", desc: "Hard cgroup memory cap", color: "text-[#F78424]" },
    ],
  },
  // 05. Object Storage Engine
  "object-store": {
    targetOutcome:
      "Engineered an industrial content-addressed blob storage engine with Rabin content-defined chunking (CDC), block deduplication, multipart parallel uploads, and background bit-rot scrubbing.",
    metrics: [
      { label: "READ SPEED", value: "> 800 MB/s", desc: "Content-addressed blob streaming", color: "text-[#0AA793]" },
      { label: "DEDUPLICATION", value: "> 45% Ratio", desc: "Content-defined chunking (CDC)", color: "text-[#099BE9]" },
      { label: "INTEGRITY", value: "Zero Bit-Rot", desc: "CRC64/BLAKE3 background scrub", color: "text-[#F78424]" },
    ],
  },
  // 06. High-Throughput In-Memory Cache
  "lru-cache": {
    targetOutcome:
      "Engineered high-performance LRU, LFU, and W-TinyLFU cache engines with O(1) pointer relinking, frequency bucket lists, stripe-locked concurrency, and strict byte memory budgets.",
    metrics: [
      { label: "THROUGHPUT", value: "> 250,000 ops/s", desc: "O(1) lookup & eviction", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 0.05ms p99", desc: "Sub-microsecond memory hit", color: "text-[#099BE9]" },
      { label: "HIT RATIO", value: "> 85% Target", desc: "Under 1M access stream", color: "text-[#F78424]" },
    ],
  },
  // 07. B+ Tree Database Index Engine
  "database-index": {
    targetOutcome:
      "Engineered a disk-backed B+Tree storage engine with 4KB slotted page serialization, binary search node branching, range scans via leaf sibling pointers, and LRU buffer pool management.",
    metrics: [
      { label: "THROUGHPUT", value: "> 80,000 ops/s", desc: "Point queries & range scans", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 0.15ms p99", desc: "Slotted page tree traversal", color: "text-[#099BE9]" },
      { label: "PAGE FORMAT", value: "4 KB Pages", desc: "Slotted disk serialization", color: "text-[#F78424]" },
    ],
  },
  // 08. Container Runtime / Sandbox
  "container-runtime": {
    targetOutcome:
      "Engineered an isolated Linux container execution engine using namespaces (CLONE_NEWPID/NEWNS), secure rootfs pivot_root, cgroups v2 resource boundaries, and sub-15ms cold boot.",
    metrics: [
      { label: "COLD BOOT", value: "< 15ms", desc: "Namespace & pivot_root init", color: "text-[#0AA793]" },
      { label: "MEMORY LIMIT", value: "256 MB Hard", desc: "Strict cgroups v2 quota", color: "text-[#099BE9]" },
      { label: "ISOLATION", value: "100% Containment", desc: "Zero host rootfs jailbreak", color: "text-[#F78424]" },
    ],
  },
  // 09. Distributed Commit Log & Message Queue
  "message-queue": {
    targetOutcome:
      "Engineered an append-only distributed commit log and message broker supporting multi-partition topics, consumer group rebalancing, and zero-copy sendfile delivery.",
    metrics: [
      { label: "THROUGHPUT", value: "> 100,000 msg/s", desc: "Segmented batch commit", color: "text-[#0AA793]" },
      { label: "LATENCY", value: "< 2.0ms p99", desc: "Producer commit latency", color: "text-[#099BE9]" },
      { label: "DURABILITY", value: "Zero Loss", desc: "Crash recovery fsync", color: "text-[#F78424]" },
    ],
  },
  // 10. Columnar Log Analytics Engine
  "log-engine": {
    targetOutcome:
      "Engineered a blazingly fast streaming telemetry and observability engine with zero-copy SIMD line parsing, columnar chunk storage, dictionary encoding, and vectorized filter evaluation.",
    metrics: [
      { label: "SCAN SPEED", value: "> 10M rows/s", desc: "SIMD wire-speed ingest", color: "text-[#0AA793]" },
      { label: "QUERY LATENCY", value: "< 15ms query", desc: "Windowed rollups & Top-K", color: "text-[#099BE9]" },
      { label: "COMPRESSION", value: "> 70% Ratio", desc: "Dictionary & run-length encoding", color: "text-[#F78424]" },
    ],
  },
  // 11. Distributed Rate Limiter
  "rate-limiter": {
    targetOutcome:
      "Engineered a high-throughput API rate limiter and traffic shaper implementing Sliding Window Logs, Token Bucket, and Leaky Bucket with atomic CAS lock-free concurrency.",
    metrics: [
      { label: "THROUGHPUT", value: "> 150,000 req/s", desc: "Atomic CAS state updates", color: "text-[#0AA793]" },
      { label: "DECISION", value: "< 0.02ms", desc: "Sub-20µs token evaluation", color: "text-[#099BE9]" },
      { label: "SYNC DRIFT", value: "< 2%", desc: "Distributed cluster sync", color: "text-[#F78424]" },
    ],
  },
  // 12. Reverse Proxy & Load Balancer
  "load-balancer": {
    targetOutcome:
      "Engineered a Layer 7 reverse proxy and load balancer with smooth weighted round-robin, least-connections dynamic routing, passive circuit breaking, and Ketama consistent hashing.",
    metrics: [
      { label: "THROUGHPUT", value: "> 100,000 req/s", desc: "Smooth weighted RR", color: "text-[#0AA793]" },
      { label: "OVERHEAD", value: "< 0.10ms proxy", desc: "Consistent hash ring", color: "text-[#099BE9]" },
      { label: "FAILOVER", value: "< 100ms Trip", desc: "Zero-downtime circuit breaker", color: "text-[#F78424]" },
    ],
  },
  // 13. Distributed Task Scheduler
  "task-scheduler": {
    targetOutcome:
      "Engineered an autonomous cluster task scheduler modeling Kubernetes kube-scheduler with multi-dimensional vector bin-packing, work-stealing thread pools, and Dominant Resource Fairness (DRF).",
    metrics: [
      { label: "THROUGHPUT", value: "> 20,000 jobs/s", desc: "Vector bin-packing", color: "text-[#0AA793]" },
      { label: "DECISION", value: "< 1.0ms p99", desc: "Work-stealing task dispatch", color: "text-[#099BE9]" },
      { label: "RELIABILITY", value: "Zero Duplicates", desc: "Lease heartbeat recovery", color: "text-[#F78424]" },
    ],
  },
  // 14. Distributed Consensus Engine (Raft)
  "distributed-consensus": {
    targetOutcome:
      "Engineered a fault-tolerant replicated state machine implementing the Raft distributed consensus protocol with randomized leader elections, log replication quorums, and partition healing.",
    metrics: [
      { label: "LEADER FAILOVER", value: "< 150ms", desc: "Raft election convergence", color: "text-[#0AA793]" },
      { label: "COMMIT LATENCY", value: "< 5.0ms p99", desc: "Quorum majority log commit", color: "text-[#099BE9]" },
      { label: "CONSISTENCY", value: "Zero Divergence", desc: "Linearizable state machine", color: "text-[#F78424]" },
    ],
  },
  // 15. Service Discovery & DNS Registry
  "service-discovery": {
    targetOutcome:
      "Engineered a dynamic service discovery engine with RFC 1035 UDP DNS resolution, SWIM gossip protocol failure detection, and sub-millisecond route lookup.",
    metrics: [
      { label: "DNS RESOLUTION", value: "< 0.5ms p99", desc: "RFC 1035 UDP query parsing", color: "text-[#0AA793]" },
      { label: "FAILURE DETECT", value: "< 2.0s", desc: "SWIM gossip node ping", color: "text-[#099BE9]" },
      { label: "STALENESS", value: "0 Stale IPs", desc: "Rolling deploy instant prune", color: "text-[#F78424]" },
    ],
  },
  // 16. Distributed Object Storage with Erasure Coding
  "distributed-object-storage": {
    targetOutcome:
      "Engineered a multi-node distributed object storage cluster with Reed-Solomon (4+2) erasure coding over Galois Field GF(2^8), automated self-healing, and parallel shard streaming.",
    metrics: [
      { label: "CLUSTER WRITE", value: "> 600 MB/s", desc: "Parallel multi-node streaming", color: "text-[#0AA793]" },
      { label: "FAULT TOLERANCE", value: "4-Node Loss", desc: "Reed-Solomon (4+2) zero loss", color: "text-[#099BE9]" },
      { label: "REBUILD SPEED", value: "> 200 MB/s", desc: "Cauchy matrix self-healing", color: "text-[#F78424]" },
    ],
  },
  // 17. Full-Text Search Engine
  "search-engine": {
    targetOutcome:
      "Engineered a production-grade full-text search engine supporting inverted index construction, BM25 statistical relevance ranking, positional phrase matching, and delta bit-packing postings.",
    metrics: [
      { label: "INDEX SPEED", value: "> 50,000 docs/s", desc: "Inverted index builder", color: "text-[#0AA793]" },
      { label: "QUERY LATENCY", value: "< 3.0ms p99", desc: "BM25 scoring over 100K docs", color: "text-[#099BE9]" },
      { label: "COMPRESSION", value: "> 60% Compact", desc: "Delta bit-packing postings", color: "text-[#F78424]" },
    ],
  },
  // 18. Vector Database (HNSW Index)
  "vector-database": {
    targetOutcome:
      "Engineered a high-dimensional vector database using Hierarchical Navigable Small World (HNSW) graphs, SIMD cosine/Euclidean distance calculations, and scalar quantization.",
    metrics: [
      { label: "THROUGHPUT", value: "> 5,000 QPS", desc: "Approximate Nearest Neighbors", color: "text-[#0AA793]" },
      { label: "QUERY LATENCY", value: "< 0.20ms p99", desc: "SIMD Cosine distance calculation", color: "text-[#099BE9]" },
      { label: "ACCURACY", value: "> 95% Recall@10", desc: "HNSW multi-layer graph search", color: "text-[#F78424]" },
    ],
  },
  // 19. LLM Inference Engine & KV Cache
  "llm-inference": {
    targetOutcome:
      "Engineered an autoregressive LLM inference engine with PagedAttention virtual memory block allocation, continuous batching, and FlashAttention tiled kernel execution.",
    metrics: [
      { label: "FIRST TOKEN (TTFT)", value: "< 20ms", desc: "Prompt prefill forward pass", color: "text-[#0AA793]" },
      { label: "TOKEN SPEED (ITL)", value: "< 5ms", desc: "Autoregressive decoder pass", color: "text-[#099BE9]" },
      { label: "MEMORY SAVING", value: "> 80% Saved", desc: "PagedAttention zero fragmentation", color: "text-[#F78424]" },
    ],
  },
  // 20. Model Context Protocol (MCP) Runtime
  "mcp-runtime": {
    targetOutcome:
      "Engineered a production-grade Model Context Protocol (MCP) runtime with newline-delimited JSON-RPC 2.0 stdio framing, dynamic tool registration, schema validation, and sandboxed subprocess execution.",
    metrics: [
      { label: "DISPATCH OVERHEAD", value: "< 0.8ms", desc: "JSON-RPC 2.0 stdio pipeline", color: "text-[#0AA793]" },
      { label: "TIMEOUT GUARD", value: "50ms Deadline", desc: "Subprocess watchdog isolation", color: "text-[#099BE9]" },
      { label: "SAFETY", value: "100% Schema", desc: "Ajv parameter contract validation", color: "text-[#F78424]" },
    ],
  },
};

function getDynamicTargetSpec(slug: string, coreDef?: any) {
  if (CHALLENGE_TARGET_SPECS[slug]) {
    return CHALLENGE_TARGET_SPECS[slug];
  }
  const benchmarkMetrics = coreDef?.benchmarkMetrics || [];
  const metrics = benchmarkMetrics.map((bm: string, idx: number) => {
    const parts = bm.split(":");
    if (parts.length >= 2) {
      const label = parts[0].trim().toUpperCase();
      const valAndDesc = parts.slice(1).join(":").trim();
      return {
        label,
        value: valAndDesc,
        desc: idx === 0 ? "Throughput verified target" : idx === 1 ? "Latency target threshold" : "Constraint threshold",
        color: idx === 1 ? "text-[#0AA793]" : "text-[#099BE9]",
      };
    }
    return {
      label: `TARGET ${idx + 1}`,
      value: bm,
      desc: "Empirical verification baseline",
      color: "text-[#0AA793]",
    };
  });

  return {
    targetOutcome: coreDef?.whatStudentsBuild || "Production systems engineering challenge",
    metrics: metrics.length >= 2 ? metrics : [
      { label: "TARGET", value: "Verified Standard", desc: "Empirical baseline execution", color: "text-[#0AA793]" },
      { label: "STABILITY", value: "Zero Crashes", desc: "Isolated container sandbox", color: "text-[#099BE9]" },
    ],
  };
}

function getShortParity(rawParity: string): string {
  if (!rawParity) return "Production Standard";
  if (/dict\.c/i.test(rawParity)) return "Redis dict.c";
  if (/rehashing/i.test(rawParity) || /collision/i.test(rawParity)) return "Redis Rehashing";
  if (/wal/i.test(rawParity) || /write-ahead/i.test(rawParity)) return "PostgreSQL WAL";
  if (/ttl|expire/i.test(rawParity)) return "Redis Active Expire";
  if (/concurrenthashmap|mutex|thread/i.test(rawParity)) return "Java Striped Mutex";
  if (/compaction|arena|lsm/i.test(rawParity)) return "RocksDB Compaction";
  if (/resp/i.test(rawParity)) return "Redis RESP";
  if (/event loop|epoll|kqueue|c10k/i.test(rawParity)) return "Nginx epoll Loop";
  if (/chunked|http parser/i.test(rawParity)) return "Node.js llhttp";
  if (/raft|consensus/i.test(rawParity)) return "Raft Consensus";
  if (/b-tree|btree/i.test(rawParity)) return "B-Tree Page Engine";

  const clean = rawParity
    .replace(/^The\s+(core\s+)?/i, "")
    .replace(/^architecture of\s+/i, "")
    .replace(/^persistence architecture of\s+/i, "")
    .replace(/^custom\s+/i, "")
    .split(",")[0]
    .split(" powered by")[0]
    .split(" powering")[0]
    .trim();
  return clean.length > 22 ? clean.slice(0, 20) + "…" : clean;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const coreDef = CORE_CHALLENGES.find((c) => c.slug === id || c.number === id);
  const challengeData = getChallenge(id);

  if (!coreDef && !challengeData) {
    notFound();
  }

  let challenge = {
    id: coreDef?.slug || challengeData?.slug || id || "kv-store",
    slug: coreDef?.slug || challengeData?.slug || id || "kv-store",
    title: challengeData?.title || coreDef?.title || PROJECT_SCOPE.title,
    description: challengeData?.overview || coreDef?.overview || PROJECT_SCOPE.overview,
    difficulty: coreDef?.difficulty || "MEDIUM",
  };

  let version: any = null;
  let spec: any = {};
  let apiSpec: any[] = [];
  let whatYouLearn: string[] = challengeData
    ? challengeData.architecturalLayers.map((l) => `${l.name}: ${l.description}`)
    : [
        "O(1) in-memory pointer resolution & fast stream command dispatching",
        "64-bit MurmurHash3 uniform hashing and dynamic 0.75 load factor rehashing",
        "Append-only Write-Ahead Logging (WAL) and <50ms crash recovery replay",
        "Dual-mode TTL eviction with passive evaluation & active background sweepers",
        "32-shard striped mutex concurrency without race conditions or deadlocks",
        "100K+ ops/sec throughput, online log compaction, and custom slab memory arenas",
      ];

  try {
    const foundChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, id))
      .limit(1);

    if (foundChallenges[0]) {
      challenge = foundChallenges[0];

      const versions = await db
        .select()
        .from(challengeVersions)
        .where(eq(challengeVersions.challengeId, challenge.id))
        .orderBy(desc(challengeVersions.version))
        .limit(1);

      if (versions[0]) {
        version = versions[0];
        spec = (version?.spec as any) || {};
        apiSpec = (spec.apiSpecification as any[]) || [];
        if (spec.whatYouLearn && Array.isArray(spec.whatYouLearn)) {
          whatYouLearn = spec.whatYouLearn;
        }
      }
    }
  } catch (err) {
    console.warn("Database query skipped or unavailable in challenge detail page:", err);
  }

  // Fallback API spec if empty from DB
  if (!apiSpec || apiSpec.length === 0) {
    if (challengeData) {
      apiSpec = Object.values(challengeData.levels).flatMap((l) =>
        l.operations.map((op) => {
          let returns = "OK";
          const match = op.desc.match(/Returns\s+([^.]+)/i);
          if (match && match[1]) {
            returns = match[1].trim();
          }
          return {
            command: op.cmd,
            returns,
            description: op.desc,
          };
        })
      );
    } else {
      apiSpec = [
        { command: "SET <key> <val>", returns: "OK", description: "Store key-value pair in memory. Overwrites existing." },
        { command: "GET <key>", returns: "<val> | NULL", description: "Retrieve value or NULL if absent or expired." },
        { command: "DELETE <key>", returns: "OK | NOT_FOUND", description: "Removes key from store." },
        { command: "EXISTS <key>", returns: "TRUE | FALSE", description: "Determines if key exists and is non-expired." },
        { command: "SAVE", returns: "OK", description: "Persist current memory state snapshot to disk." },
        { command: "RESTORE", returns: "OK", description: "Reconstitute memory state from disk snapshot." },
        { command: "FLUSHALL", returns: "OK", description: "Wipes all keys from memory." },
        { command: "EXPIRE <key> <ms>", returns: "OK | NOT_FOUND", description: "Sets millisecond TTL on key." },
        { command: "TTL <key>", returns: "<ms> | -1 | -2", description: "Returns remaining TTL in ms (-1 permanent, -2 absent)." },
        { command: "PERSIST <key>", returns: "OK | NOT_FOUND", description: "Removes expiration from key." },
        { command: "PING [msg]", returns: "PONG | <msg>", description: "Health check response for concurrent connections." },
        { command: "MGET <k1> <k2>...", returns: "Multiple lines", description: "Batch atomic multi-key read." },
        { command: "MSET <k1> <v1>...", returns: "OK", description: "Batch atomic multi-key write across shards." },
        { command: "COMPACT", returns: "OK", description: "Online WAL compaction / tombstone elimination." },
        { command: "MEMSTATS", returns: "<used_bytes>", description: "Reports accurate heap usage in bytes." },
      ];
    }
  }

  const isKv = (challenge.slug || id) === "kv-store";
  const chLevelMap: Record<number, any> = challengeData?.levels || (isKv ? LEVEL_DEFINITIONS : {});

  const levelsArray = (Array.isArray(version?.levels) && version.levels.length > 0)
    ? version.levels.map((l: any, idx: number) => {
        const lvlNum = l.level || idx + 1;
        const codeLevel = chLevelMap[lvlNum] || (challengeData?.levels ? Object.values(challengeData.levels)[idx] : undefined);
        return {
          ...codeLevel,
          ...l,
          level: lvlNum,
          title: l.title || codeLevel?.title || `Level ${lvlNum}`,
          shortTitle: l.shortTitle || (l.title ? (l.title.length > 25 ? l.title.slice(0, 25) + "..." : l.title) : (codeLevel?.shortTitle || `Level ${lvlNum}`)),
          difficulty: l.difficulty || codeLevel?.difficulty || "Medium",
          tagline: l.tagline || codeLevel?.tagline || l.description || "",
          whatAreYouBuilding: l.whatAreYouBuilding || codeLevel?.whatAreYouBuilding || undefined,
          howItWorks: l.howItWorks || codeLevel?.howItWorks || undefined,
          technicalTerms: l.technicalTerms || codeLevel?.technicalTerms || undefined,
          description: l.description || codeLevel?.description || undefined,
          implementationGuide: l.implementationGuide || codeLevel?.implementationGuide || undefined,
          diagram: l.diagram || codeLevel?.diagram || undefined,
          importantChallenge: l.importantChallenge || codeLevel?.importantChallenge || undefined,
          endGoalDemonstration: l.endGoalDemonstration || codeLevel?.endGoalDemonstration || undefined,
          nextLevelTeaser: l.nextLevelTeaser || codeLevel?.nextLevelTeaser || undefined,
          learningLoop: l.learningLoop || codeLevel?.learningLoop || undefined,
          operations: (Array.isArray(l.operations) && l.operations.length > 0) ? l.operations : (codeLevel?.operations || []),
          durabilityRules: (Array.isArray(l.durabilityRules) && l.durabilityRules.length > 0) ? l.durabilityRules : (codeLevel?.durabilityRules || []),
          examples: (Array.isArray(l.examples) && l.examples.length > 0) ? l.examples : (codeLevel?.examples || []),
          constraints: (Array.isArray(l.constraints) && l.constraints.length > 0) ? l.constraints : (codeLevel?.constraints || []),
        };
      })
    : challengeData
    ? Object.values(challengeData.levels).sort((a, b) => a.level - b.level)
    : Object.values(LEVEL_DEFINITIONS).sort((a, b) => a.level - b.level);
  const scopeSubtitle = challengeData?.subtitle || (isKv
    ? PROJECT_SCOPE.subtitle
    : `Inspired by ${coreDef?.inspiredBy ?? "Production Systems"} • ${coreDef?.whatStudentsBuild ?? "Systems Engineering"}`);
  const scopeOverview = challengeData?.overview || (isKv ? PROJECT_SCOPE.overview : (coreDef?.overview || challenge.description));
  const scopeWhyItMatters = challengeData?.whyItMatters || (isKv
    ? PROJECT_SCOPE.whyItMatters
    : `Signature Question: "${coreDef?.signatureQuestion}". Build real technology from first principles to master ${coreDef?.mainSkill}.`);
  const layers = challengeData?.architecturalLayers || (isKv
    ? PROJECT_SCOPE.architecturalLayers
    : (coreDef?.progressionLevels || []).map((lvl) => ({
        number: lvl.level,
        name: lvl.name,
        focus: lvl.focus,
        description: lvl.focus,
        realWorldTech: coreDef?.inspiredBy || "Production Standard",
      })));
  const targetSpec = CHALLENGE_TARGET_SPECS[challenge.slug] || getDynamicTargetSpec(challenge.slug, coreDef);
  const philosophy = challengeData?.philosophy;
  const architectureDiagram = challengeData?.architectureDiagram;
  const levelRoadmap = challengeData?.levelRoadmap || levelsArray.map((l: any) => ({
    level: l.level,
    whatWeBuild: l.title,
    mainConcept: l.tagline || l.description || "Core Systems Engineering",
    parity: coreDef?.inspiredBy || "Production Standard",
  }));

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navbar user={session?.user as any} variant="dark" />

      {/* Dark Hero Masthead */}
      <section className="relative bg-[#262626] pt-8 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono font-medium mb-4">
            <Link href="/challenges" className="hover:text-white transition-colors">
              Challenges
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-neutral-400">{coreDef?.domainLabel ?? "SYSTEMS"}</span>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-white font-bold">{challenge.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {coreDef?.number ? `${coreDef.number}. ` : ""}{challenge.title}
                </h1>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono border ${
                  challenge.difficulty === "Easy"
                    ? "text-[#09C899] bg-[#09C899]/15 border-[#09C899]/40"
                    : challenge.difficulty === "Medium"
                    ? "text-[#FBAE0C] bg-[#FBAE0C]/15 border-[#FBAE0C]/40"
                    : "text-[#8647E2] bg-[#8647E2]/15 border-[#8647E2]/40"
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-[#099BE9]/15 text-[#099BE9] border border-[#099BE9]/40">
                  {levelsArray.length} Progressive Levels
                </span>
              </div>

              <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                {scopeSubtitle}
              </p>

              {philosophy && (
                <p className="text-xs font-mono text-[#09C899] italic font-semibold">
                  &ldquo;{philosophy}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-200 border border-white/10 font-semibold">
                  Domain: {coreDef?.domainLabel ?? "SYSTEMS"}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-200 border border-white/10 font-medium">
                  Inspired by <strong className="text-white font-bold">{coreDef?.inspiredBy ?? "Redis"}</strong>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-200 border border-white/10 font-medium">
                  Python, C++, Rust, Go, Java
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#09C899]/15 text-[#09C899] border border-[#09C899]/40 font-bold">
                  Target: {coreDef?.benchmarkMetrics[0] ?? "> 100,000 ops/s"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link href={`/challenges/${challenge.slug}/leaderboard`}>
                <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5 border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer">
                  <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
                  <span>Leaderboard</span>
                </Button>
              </Link>
              <Link href={`/challenges/${challenge.slug}/workspace`}>
                <Button size="sm" className="h-9 px-4 text-xs font-bold gap-1.5 shadow-sm bg-[#09C899] hover:bg-[#0AA793] text-white border-0 cursor-pointer">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Launch Workspace</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      {/* Main 2-Column Content Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Problem Statement & System Contract */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                  System Contract &amp; Overview
                </div>
                <h2 className="text-lg font-bold text-slate-950">
                  What You Are Engineering
                </h2>
                <p className="text-sm text-slate-800 leading-relaxed font-normal mt-2">
                  {scopeOverview}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Zap className="w-4 h-4 text-[#F78424] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-950 font-semibold">Why this matters: </strong>
                  {scopeWhyItMatters}
                </div>
              </div>
            </div>

            {/* 2. LeetCode-Style Table of Contents */}
            {Array.isArray(levelsArray) && levelsArray.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                {/* Table of Contents Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#099BE9]" />
                      <span>Table of Contents</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">6 Progressive Levels</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Systems Engineering Progression
                    </h2>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Progressive architectural milestones from raw memory pointers to a crash-durable, 100K+ ops/sec engine.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-2xs">
                      POSIX Stream Contract
                    </span>
                  </div>
                </div>

                {/* Table of Contents List */}
                <div className="divide-y divide-slate-100">
                  {levelsArray.map((lvl: any, idx: number) => {
                    const matchingLayer = layers[idx] || layers.find((l: any) => l.number === lvl.level);
                    const rawParity = lvl.learningLoop?.productionParity || matchingLayer?.realWorldTech || "Production Standard";
                    const shortParity = getShortParity(rawParity);
                    const bottleneck = lvl.learningLoop?.bottleneck || lvl.importantChallenge?.description;
                    const ops = Array.isArray(lvl.operations) ? lvl.operations : [];

                    return (
                      <details
                        key={lvl.level}
                        className="group transition-colors"
                      >
                        <summary className="p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden hover:bg-slate-50/80 transition-colors">
                          {/* Left: Number Badge + Title + Subtitle */}
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            {/* Chapter Number Badge */}
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#099BE9]/10 group-open:bg-[#099BE9] text-slate-700 group-hover:text-[#099BE9] group-open:text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-slate-200/80 group-open:border-[#099BE9] transition-all">
                              {String(lvl.level).padStart(2, "0")}
                            </div>

                            <div className="min-w-0 flex-1 space-y-0.5">
                              {/* Title, Stage & Difficulty on 1 clean un-wrapped row */}
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-bold text-slate-950 text-sm truncate group-hover:text-[#099BE9] transition-colors">
                                  {lvl.title}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 bg-[#099BE9]/10 text-[#099BE9] border border-[#099BE9]/30">
                                  {lvl.stage || UNIVERSAL_STAGES[lvl.level]?.stage || "STAGE"}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border ${
                                  lvl.difficulty === "Easy"
                                    ? "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30"
                                    : lvl.difficulty === "Medium"
                                    ? "text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30"
                                    : "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30"
                                }`}>
                                  {lvl.difficulty}
                                </span>
                              </div>

                              {/* 1-line crisp objective with universal core question */}
                              <p className="text-xs text-slate-500 font-normal truncate">
                                {UNIVERSAL_STAGES[lvl.level] && (
                                  <span className="font-semibold text-slate-700">
                                    {UNIVERSAL_STAGES[lvl.level].question} —{" "}
                                  </span>
                                )}
                                {(lvl.tagline || lvl.description || "").replace(/^(Can you|Do you|Does it)[^?]*\?\s*/i, "")}
                              </p>
                            </div>
                          </div>

                          {/* Right: Short Parity Tag + Command Count + Expand Trigger */}
                          <div className="flex items-center gap-3 shrink-0">
                            {/* Clean Short Parity Pill */}
                            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-600 bg-slate-100/90 border border-slate-200/80 font-medium">
                              ≈ {shortParity}
                            </span>

                            {/* Data Flow Diagram Indicator */}
                            {lvl.diagram && (
                              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-[#099BE9] bg-[#099BE9]/10 border border-[#099BE9]/30 font-bold">
                                <Terminal className="w-3 h-3 text-[#099BE9]" />
                                <span>Data Flow</span>
                              </span>
                            )}

                            {/* Command Count */}
                            {ops.length > 0 && (
                              <span className="hidden md:inline-flex items-center text-[11px] font-mono text-slate-500 font-medium bg-slate-100/70 px-2 py-0.5 rounded border border-slate-200/60">
                                {ops.length} ops
                              </span>
                            )}

                            {/* Expand Indicator with smooth rotation */}
                            <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-700 transition-colors pl-1">
                              <span className="hidden lg:inline text-[11px] font-mono text-slate-500 font-semibold group-hover:text-slate-950">
                                Details
                              </span>
                              <div className="w-5 h-5 flex items-center justify-center transition-transform duration-200 group-open:rotate-90">
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        </summary>

                        {/* Expanded Chapter Details Drawer */}
                        <div className="px-6 pb-6 pt-3 space-y-4 bg-slate-50/60 border-t border-slate-100 animate-in fade-in-50 duration-150">
                          {/* Full Objective */}
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Stage Objective
                            </span>
                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {lvl.tagline || lvl.description}
                            </p>
                          </div>

                          {/* 1. What Are You Building */}
                          {lvl.whatAreYouBuilding && (
                            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#099BE9] block">
                                What You Are Building
                              </span>
                              <p className="text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                {lvl.whatAreYouBuilding}
                              </p>
                            </div>
                          )}

                          {/* 1.5. How It Works */}
                          {lvl.howItWorks && (
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-200/80 text-xs space-y-1.5 shadow-2xs">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                                How It Works
                              </span>
                              <div className="text-slate-800 leading-relaxed whitespace-pre-line font-mono text-[11px]">
                                {lvl.howItWorks}
                              </div>
                            </div>
                          )}

                          {/* 2. Technical Terms Made Simple */}
                          {Array.isArray(lvl.technicalTerms) && lvl.technicalTerms.length > 0 && (
                            <div className="p-4 rounded-xl bg-slate-950 text-white text-xs space-y-2 shadow-sm border border-slate-800">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                                Technical terms made simple
                              </span>
                              <div className="divide-y divide-slate-800/80 pt-1">
                                {lvl.technicalTerms.map((t: any, tIdx: number) => (
                                  <div key={tIdx} className="py-1.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline gap-1 text-[11px]">
                                    <code className="font-mono font-bold text-amber-300 shrink-0">{t.term}</code>
                                    <span className="text-slate-500 hidden sm:inline">—</span>
                                    <span className="text-slate-300 font-normal">{t.definition}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Level Deep Dive / Mechanism */}
                          {lvl.description && (
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#099BE9] block">
                                Core Mechanism &amp; Architecture
                              </span>
                              <p className="text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                {lvl.description}
                              </p>
                            </div>
                          )}

                          {/* Step-by-Step Implementation Guide */}
                          {Array.isArray(lvl.implementationGuide) && lvl.implementationGuide.length > 0 && (
                            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2 shadow-2xs">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-900 block">
                                Step-by-Step Implementation Guide
                              </span>
                              <ol className="space-y-1.5 list-none text-slate-800">
                                {lvl.implementationGuide.map((step: string, sIdx: number) => (
                                  <li key={sIdx} className="flex items-start gap-2">
                                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-mono font-bold shrink-0 mt-0.5">
                                      {sIdx + 1}
                                    </span>
                                    <span className="leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Key Systems Bottleneck */}
                          {bottleneck && (
                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-300/60 text-xs flex items-start gap-2.5">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="text-slate-800 leading-relaxed">
                                <strong className="text-amber-950 font-semibold font-mono text-[11px] uppercase tracking-wide">The Engineering Hurdle: </strong>
                                <span>{bottleneck}</span>
                              </div>
                            </div>
                          )}

                          {/* Full Operations List */}
                          {ops.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                                Commands Introduced at Level {lvl.level}:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {ops.map((op: any, opIdx: number) => (
                                  <div
                                    key={opIdx}
                                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-start gap-2 shadow-2xs"
                                  >
                                    <code className="px-1.5 py-0.5 rounded bg-[#099BE9]/10 text-[#099BE9] font-mono text-[11px] font-bold border border-[#099BE9]/20 shrink-0">
                                      {op.cmd}
                                    </code>
                                    <span className="text-slate-600 text-[11px] leading-tight font-medium">
                                      {op.desc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Data Flow Diagram for this level */}
                          {lvl.diagram && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-mono font-bold uppercase text-slate-600 flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-[#099BE9]" />
                                <span>Data Flow Architecture (Level {lvl.level}):</span>
                              </span>
                              <div className="rounded-xl border border-slate-800 bg-[#141416] p-4 font-mono text-[11px] text-[#09C899] overflow-x-auto shadow-sm">
                                <pre className="whitespace-pre leading-relaxed font-medium">{lvl.diagram}</pre>
                              </div>
                            </div>
                          )}

                          {/* Launch Button in Drawer */}
                          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/70">
                            <div className="text-xs font-mono text-slate-600">
                              <span className="text-slate-400">Production Reference: </span>
                              <strong className="text-slate-800 font-semibold">{rawParity}</strong>
                            </div>
                            <Link href={`/challenges/${challenge.slug}/workspace?level=${lvl.level}`} className="shrink-0">
                              <Button size="sm" className="h-8 px-4 text-xs font-bold gap-1.5 bg-[#09C899] hover:bg-[#0AA793] text-white cursor-pointer shadow-xs border-0">
                                <Terminal className="w-3 h-3" />
                                <span>Open Level {lvl.level} in Workspace →</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. System Architecture */}
            {architectureDiagram && (
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                      System Topology
                    </div>
                    <h2 className="text-lg font-bold text-slate-950">
                      System Architecture
                    </h2>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Component hierarchy and stream data flow for {challenge.title}.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    First Principles
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#141416] p-4 sm:p-5 font-mono text-[11px] sm:text-xs text-[#09C899] overflow-x-auto shadow-sm">
                  <pre className="whitespace-pre leading-relaxed font-medium">{architectureDiagram}</pre>
                </div>
              </div>
            )}

            {/* 4. Command Interface Specification Table */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                    Protocol &amp; I/O Contract
                  </div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Command Interface Specification
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Newline-delimited stream protocol over standard input / standard output.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                  Universal POSIX I/O
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-900 font-bold font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3 font-bold">Command</th>
                      <th className="py-2.5 px-3 font-bold">Return Value</th>
                      <th className="py-2.5 px-3 font-bold font-sans">Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {apiSpec.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#099BE9]">{item.command}</td>
                        <td className="py-2.5 px-3 font-bold text-[#0AA793]">{item.returns}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-800 text-xs font-medium">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Engineering Skills Mastered */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#099BE9] mb-1">
                Outcomes
              </div>
              <h2 className="text-lg font-bold text-slate-950">
                Engineering Skills Mastered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 pt-1">
                {whatYouLearn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0AA793] shrink-0" />
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20 self-start">
            
            {/* Card 1: Workspace Launch & Performance Targets */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Proving Ground Targets
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  Build and benchmark your solution in isolated Linux namespaces.
                </p>
              </div>

              <Link href={`/challenges/${challenge.slug}/workspace`} className="w-full block">
                <Button className="w-full text-xs font-bold h-10 shadow-xs gap-1.5 bg-[#09C899] hover:bg-[#0AA793] text-white border-0 cursor-pointer">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Launch Workspace</span>
                </Button>
              </Link>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Verified Benchmarks
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {targetSpec.metrics.slice(0, 3).map((metric, idx) => (
                    <div
                      key={metric.label}
                      className={`p-2.5 rounded-lg border ${
                        idx === 1
                          ? "bg-[#09C899]/10 border-[#09C899]/30"
                          : idx === 2
                          ? "bg-[#099BE9]/10 border-[#099BE9]/30"
                          : "bg-slate-50 border-slate-200/70"
                      }`}
                    >
                      <div
                        className={`text-[11px] font-semibold ${
                          idx === 1
                            ? "text-[#0AA793]"
                            : idx === 2
                            ? "text-[#099BE9]"
                            : "text-slate-500"
                        }`}
                      >
                        {metric.label}
                      </div>
                      <div
                        className={`text-base font-bold mt-0.5 ${
                          idx === 1
                            ? "text-[#0AA793]"
                            : idx === 2
                            ? "text-[#099BE9]"
                            : "text-slate-900"
                        }`}
                      >
                        {metric.value}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 font-medium ${
                          idx === 1
                            ? "text-[#09C899]"
                            : idx === 2
                            ? "text-slate-600"
                            : "text-slate-500"
                        }`}
                      >
                        {metric.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <Link href={`/challenges/${challenge.slug}/leaderboard`} className="w-full block">
                  <Button variant="outline" className="w-full text-xs font-semibold h-9 border-slate-200 bg-white hover:bg-slate-50 gap-1.5 cursor-pointer">
                    <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
                    <span>View Challenge Leaderboard</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: Execution Constraints */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                Execution Constraints
              </div>
              <ul className="text-xs font-mono text-slate-700 space-y-2">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Memory Cap:</span>
                  <span className="font-semibold text-slate-900">256 MB (Hard cgroup)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">CPU Quota:</span>
                  <span className="font-semibold text-slate-900">1.0 Core</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Network Access:</span>
                  <span className="font-semibold text-rose-600">Disabled (isolated)</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Execution Timeout:</span>
                  <span className="font-semibold text-slate-900">30 seconds</span>
                </li>
                {(challenge.slug === "kv-store" || challenge.slug === "message-queue") && (
                  <li className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">WAL Log Path:</span>
                    <span className="font-semibold text-slate-900">./data/wal.log</span>
                  </li>
                )}
                <li className="flex items-center justify-between py-1">
                  <span className="text-slate-600 font-medium">Sandbox User:</span>
                  <span className="font-semibold text-slate-900">Non-Root (1000)</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
