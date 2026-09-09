// src/lib/constants/core-challenges.ts

export type EngineeringDomain =
  | "SYSTEMS"
  | "PERFORMANCE"
  | "DISTRIBUTED_SYSTEMS"
  | "SEARCH_DATA";

export type ChallengeType =
  | "BUILD"
  | "FIX"
  | "BREAK"
  | "OPTIMIZE"
  | "SURVIVE"
  | "INVENT";

export interface CoreChallenge {
  number: string; // e.g. "01"
  slug: string;
  title: string;
  domain: EngineeringDomain;
  domainLabel: string;
  inspiredBy: string;
  whatStudentsBuild: string;
  mainSkill: string;
  signatureQuestion: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  status: "ACTIVE" | "COMING_SOON" | "BETA";
  benchmarkMetrics: string[];
  progressionLevels: Array<{
    level: number;
    name: string;
    focus: string;
  }>;
  overview: string;
}

export const ALGO_PHILOSOPHY = [
  { step: "BUILD", title: "Make It Work", desc: "Construct the protocol, data structures, and raw memory engines from first principles." },
  { step: "RUN", title: "Run It", desc: "Spin up isolated Docker sandboxes. Verify strict functional correctness." },
  { step: "MEASURE", title: "Your First Score", desc: "Capture cold baseline ops/sec, p50/p95/p99 latency, and heap memory footprint." },
  { step: "BREAK", title: "Find the Bottleneck", desc: "Subject code to 10× traffic spikes, lock contention, memory pressure, and SIGKILL." },
  { step: "OPTIMIZE", title: "Beat the Baseline", desc: "Re-architect hot paths with striped mutexes, slab allocators, and zero-copy buffers." },
  { step: "PROVE", title: "+X% Verified Speedup", desc: "Lock in measurable performance leaps on global leaderboards and system benchmarks." },
] as const;

export const CHALLENGE_TYPES: Array<{ type: ChallengeType; label: string; desc: string; color: string }> = [
  { type: "BUILD", label: "Build From Scratch", desc: "Construct real technology from first principles without black-box libraries.", color: "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30" },
  { type: "FIX", label: "Fix The Slow Service", desc: "Here is a working production application that is slow. Profile and diagnose the bottleneck.", color: "text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30" },
  { type: "BREAK", label: "Break Your System", desc: "Subject your implementation to 100× traffic, memory pressure, and hostile workloads.", color: "text-red-700 bg-red-50 border-red-200" },
  { type: "OPTIMIZE", label: "Beat The Baseline", desc: "Everyone starts with the same baseline. Maximize ops/sec and squeeze p99 latency.", color: "text-[#099BE9] bg-[#099BE9]/10 border-[#099BE9]/30" },
  { type: "SURVIVE", label: "Survive Failure", desc: "Survive abrupt host power cuts (SIGKILL), network partitions, and partial disk writes.", color: "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30" },
  { type: "INVENT", label: "Design The Better System", desc: "No single correct implementation. Submit custom architectures and prove them experimentally.", color: "text-[#099BE9] bg-[#099BE9]/10 border-[#099BE9]/30" },
];

export const DOMAINS: Record<EngineeringDomain, { label: string; description: string; count: number }> = {
  SYSTEMS: {
    label: "SYSTEMS",
    description: "Low-level runtimes, memory architectures, storage durability, and network I/O.",
    count: 4,
  },
  PERFORMANCE: {
    label: "PERFORMANCE",
    description: "High-throughput streaming, memory compaction, and sub-millisecond cache latency.",
    count: 2,
  },
  DISTRIBUTED_SYSTEMS: {
    label: "DISTRIBUTED SYSTEMS",
    description: "Multi-node consensus, partition tolerance, load distribution, and fair scheduling.",
    count: 3,
  },
  SEARCH_DATA: {
    label: "SEARCH / DATA",
    description: "Inverted indexes, multi-term scoring, TF-IDF ranking, and fast tokenizers.",
    count: 1,
  },
};

export const CORE_CHALLENGES: CoreChallenge[] = [
  // ==========================================
  // DOMAIN: SYSTEMS
  // ==========================================
  {
    number: "01",
    slug: "kv-store",
    title: "Key-Value Storage Engine",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "Redis (references: RocksDB, Bitcask)",
    whatStudentsBuild: "In-memory storage engine with WAL persistence",
    mainSkill: "Data structures, hashing, persistence",
    signatureQuestion: "Can you make your storage engine faster?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Standardized target: > 100,000 ops/sec",
      "Standardized target: p99 < 0.20ms",
      "256MB hard memory boundary",
      "Crash recovery replay verification",
      "Experimental improvement % over baseline",
    ],
    progressionLevels: [
      { level: 1, name: "Protocol & I/O Dispatcher", focus: "Make it work: O(1) in-memory SET/GET/DELETE/EXISTS protocol parser." },
      { level: 2, name: "Collision-Resistant Hash Table", focus: "Make lookup fast: 64-bit MurmurHash3, dynamic 0.75 rehashing, separate chaining." },
      { level: 3, name: "Write-Ahead Log & Persistence", focus: "Make it persistent: Append-only WAL, synchronous fsync, and crash recovery replay." },
      { level: 4, name: "Dual-Mode TTL Eviction", focus: "Add TTL: Millisecond-precision passive lazy eviction and active sweep cycle." },
      { level: 5, name: "Striped-Mutex Concurrency", focus: "Handle concurrency: 32-shard mutexes and deadlock-free multi-key batching." },
      { level: 6, name: "Memory Arena & Compaction", focus: "Break it & Optimize: Slab pools, 64-byte cache lines, and online WAL compaction." },
    ],
    overview:
      "Construct a high-throughput, crash-resilient key-value storage engine from first principles — inspired by the in-memory architecture of Redis and durability mechanisms of RocksDB and Bitcask. Build raw protocol dispatching, collision-resistant hash tables, synchronous write-ahead logs (WAL), millisecond TTL eviction, and striped-mutex concurrency.",
  },
  {
    number: "02",
    slug: "http-server",
    title: "High-Concurrency HTTP Server",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "Nginx, Envoy",
    whatStudentsBuild: "Non-blocking HTTP/1.1 web server",
    mainSkill: "Networking, I/O, concurrency",
    signatureQuestion: "How many concurrent requests can your server handle?",
    difficulty: "Medium",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Standardized target: > 50,000 req/sec",
      "Standardized target: p99 < 1.0ms",
      "CPU & memory utilization under burst",
      "C10K concurrent persistent connections",
    ],
    progressionLevels: [
      { level: 1, name: "HTTP Protocol Parsing", focus: "Raw socket reads, request line parsing, headers, body extraction." },
      { level: 2, name: "Dynamic Routing Engine", focus: "Path parameters, exact matching, wildcard trie route dispatcher." },
      { level: 3, name: "Static File Streaming", focus: "MIME types, range requests, zero-copy sendfile syscalls." },
      { level: 4, name: "Keep-Alive & Connection Reuse", focus: "Persistent TCP sessions, timeout sweeps, pipelining." },
      { level: 5, name: "Concurrent Non-blocking I/O", focus: "Event loops, epoll/kqueue selectors, non-blocking sockets." },
      { level: 6, name: "Connection Pooling & Backpressure", focus: "Worker threads, connection limits, and load shedding." },
    ],
    overview:
      "Build a high-performance HTTP/1.1 web server from scratch. Implement non-blocking socket I/O, RFC-compliant HTTP stream parsing, keep-alive connection pooling, dynamic trie routing, and epoll/kqueue event demultiplexing.",
  },
  {
    number: "03",
    slug: "message-queue",
    title: "Commit Log & Message Queue",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "Kafka, Redpanda",
    whatStudentsBuild: "Commit log & message broker",
    mainSkill: "Queues, batching, throughput",
    signatureQuestion: "Can you increase throughput without losing messages?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Standardized target: > 100,000 msgs/sec",
      "Producer & consumer latency curves",
      "Queue depth stability under burst",
      "Zero message loss under sudden SIGKILL",
    ],
    progressionLevels: [
      { level: 1, name: "In-Memory FIFO Queue", focus: "Queue semantics: Basic producer push, consumer pull, and acknowledgment contracts." },
      { level: 2, name: "Sequential 64-Bit Offsets", focus: "Commit log semantics: Monotonic offsets, immutable log history, non-destructive replay." },
      { level: 3, name: "Topic Partitioning & Sharding", focus: "Horizontal sharding: Multi-tenant topics, hash-based partition routing, per-key ordering." },
      { level: 4, name: "Consumer Group Coordination", focus: "Distributed consumption: Dynamic worker assignment, commit offsets, at-least-once delivery." },
      { level: 5, name: "High-Throughput Batching Engine", focus: "Performance: Producer message batching, zero-copy socket transfers, and ring buffers." },
      { level: 6, name: "Segmented Log Crash Recovery", focus: "Durability: On-disk segment file rotation, sparse index binary search, and crash replay." },
    ],
    overview:
      "Construct a high-throughput commit log and message broker. Follow the pedagogical progression from an in-memory queue to an immutable commit log, sequential 64-bit offsets, partition hashing, consumer group cursor coordination, and crash-durable segmented disk recovery.",
  },
  {
    number: "04",
    slug: "database-index",
    title: "B+ Tree Database Index Engine",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "PostgreSQL, SQLite, InnoDB",
    whatStudentsBuild: "Slotted-page B+ Tree indexing engine",
    mainSkill: "Storage, indexing, disk I/O",
    signatureQuestion: "Why doesn't a database scan every row?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "10M record search time (O(N) vs O(log N))",
      "Standardized target: p99 < 0.05ms",
      "Insert throughput & node split efficiency",
      "Sequential range query scan speed",
    ],
    progressionLevels: [
      { level: 1, name: "Linear Scan Baseline", focus: "Full table scan across 10M records — measuring raw O(N) cost." },
      { level: 2, name: "In-Memory B-Tree Node Structure", focus: "Node splitting, balance invariants, binary search within nodes." },
      { level: 3, name: "Disk Page Layout & Slotted Pages", focus: "4KB hardware disk blocks, page headers, slotted item offsets." },
      { level: 4, name: "B+ Tree Leaf Chaining", focus: "Doubly-linked leaves for high-speed range scans (BETWEEN min AND max)." },
      { level: 5, name: "Buffer Pool Manager", focus: "Clock / LRU buffer pool cache, dirty page tracking, and disk flushes." },
      { level: 6, name: "Concurrent Index Reads & Latches", focus: "Crabbing / lock coupling protocols for safe multi-threaded traversal." },
    ],
    overview:
      "Bridge the gap between raw disk blocks and sub-millisecond queries. Build a production-grade B+ Tree index with 4KB slotted disk pages, buffer pool caching, node splitting, and latch-coupling concurrency.",
  },

  // ==========================================
  // DOMAIN: PERFORMANCE
  // ==========================================
  {
    number: "05",
    slug: "lru-cache",
    title: "Concurrent Cache & Eviction Engine",
    domain: "PERFORMANCE",
    domainLabel: "PERFORMANCE",
    inspiredBy: "Redis, Memcached, Guava",
    whatStudentsBuild: "Workload-adaptive concurrent cache",
    mainSkill: "Caching, eviction, memory",
    signatureQuestion: "Can you increase hit rate without increasing memory?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Standardized target: > 1,000,000 req/sec",
      "Standardized target: p99 < 0.01ms",
      "Eviction overhead under heavy pressure",
      "Hit-rate improvement under changing workloads",
    ],
    progressionLevels: [
      { level: 1, name: "Fixed Capacity LRU Cache", focus: "Strict O(1) GET/PUT with doubly-linked list head/tail pointer re-linking." },
      { level: 2, name: "Access Recency Profiling", focus: "Read-path pointer splicing, recency tracking, and cache hit/miss instrumentation." },
      { level: 3, name: "LFU Frequency Tracking", focus: "Least Frequently Used eviction with O(1) frequency bucket list management." },
      { level: 4, name: "Millisecond TTL Expiration", focus: "Passive on-read validation + active monotonic timer min-heap sweep." },
      { level: 5, name: "Byte-Accurate Memory Budget", focus: "Physical byte tracking (keys, values, struct overhead) and slab recycling." },
      { level: 6, name: "Adaptive Replacement Cache (ARC)", focus: "Self-tuning policy dynamically balancing recency and frequency signals." },
    ],
    overview:
      "Engineer a high-throughput concurrent cache supporting workload-adaptive eviction policies. Master O(1) pointer splicing (LRU), frequency tiering (LFU), millisecond TTL expiration, byte-accurate memory budgeting, and Adaptive Replacement Cache (ARC) tuning.",
  },
  {
    number: "06",
    slug: "log-engine",
    title: "Streaming Log Analytics Engine",
    domain: "PERFORMANCE",
    domainLabel: "PERFORMANCE",
    inspiredBy: "ClickHouse, Loki, Vector",
    whatStudentsBuild: "Streaming log processor & analytics engine",
    mainSkill: "Streaming, parsing, aggregation",
    signatureQuestion: "Can your system process the stream faster than it arrives?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Standardized target: > 200,000 lines/sec",
      "Zero heap allocation during continuous stream",
      "p95 query latency over rolling time windows",
      "SIMD-accelerated delimiter scanning speed",
    ],
    progressionLevels: [
      { level: 1, name: "Streaming Log Line Tokenizer", focus: "Parse structured log lines from stdin via single-pass byte scanning." },
      { level: 2, name: "Status Family Histograms", focus: "Direct array-indexed counters (2xx, 3xx, 4xx, 5xx) with O(1) bucketing." },
      { level: 3, name: "Rolling Window Error Aggregator", focus: "Circular ring buffer time buckets for 1-minute and 5-minute error rates." },
      { level: 4, name: "Top-K Frequent Endpoint Sketch", focus: "Count-Min Sketch / HeavyKeeper for heavy hitter discovery in bounded RAM." },
      { level: 5, name: "Percentile Latency Estimator", focus: "T-Digest / HdrHistogram streaming approximation of p50, p95, and p99." },
      { level: 6, name: "High-Throughput SIMD Pipeline", focus: "Vectorized byte scanning, lockless batch flushing, > 200,000 lines/sec." },
    ],
    overview:
      "Build a high-throughput streaming log analytics engine. Master single-pass zero-copy tokenization, rolling window error aggregations, Count-Min Sketches for top endpoints, quantile estimation (T-Digest), and SIMD-accelerated line scanning.",
  },

  // ==========================================
  // DOMAIN: DISTRIBUTED SYSTEMS
  // ==========================================
  {
    number: "07",
    slug: "task-scheduler",
    title: "Multi-Resource Task Scheduler",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "DISTRIBUTED SYSTEMS",
    inspiredBy: "Kubernetes (kube-scheduler), Mesos",
    whatStudentsBuild: "Multi-resource cluster task scheduler",
    mainSkill: "Scheduling, priorities, concurrency",
    signatureQuestion: "Can you schedule more work with the same resources?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Scheduling decision latency per job (< 1ms)",
      "Cluster CPU & memory packing efficiency",
      "Deadline miss rate (0% target)",
      "Multi-tenant fairness index under saturation",
    ],
    progressionLevels: [
      { level: 1, name: "Node Registry & FIFO Filter", focus: "Multi-resource capacity checks (CPU + RAM) and first-fit node placement." },
      { level: 2, name: "Priority Ready Queue", focus: "Task priority classes (Critical, High, Batch) with starvation prevention." },
      { level: 3, name: "Multi-Resource Bin Packing", focus: "Best-fit vector heuristics minimizing stranded CPU and RAM fragments." },
      { level: 4, name: "Task Lifecycle & Dynamic Deallocation", focus: "State transitions (PENDING -> RUNNING -> COMPLETED) and atomic capacity freeing." },
      { level: 5, name: "Node Failure & Dynamic Rescheduling", focus: "Heartbeat timeouts, automatic workload eviction, priority requeueing." },
      { level: 6, name: "Dominant Resource Fairness (DRF)", focus: "Berkeley DRF multi-tenant max-min fairness across heterogeneous clusters." },
    ],
    overview:
      "Recreate the core scheduling intelligence behind modern cluster orchestrators. Optimize multi-dimensional bin packing across CPU and RAM, enforce Dominant Resource Fairness (DRF), manage task lifecycles, and handle worker node failure recovery.",
  },
  {
    number: "08",
    slug: "rate-limiter",
    title: "Concurrent Rate Limiter & Traffic Shaper",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "DISTRIBUTED SYSTEMS",
    inspiredBy: "Envoy, Cloudflare-style gateways",
    whatStudentsBuild: "Concurrent rate limiter & traffic shaper",
    mainSkill: "Algorithms, time, concurrency",
    signatureQuestion: "Can you enforce the limit without becoming the bottleneck?",
    difficulty: "Medium",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Standardized target: > 100,000 checks/sec",
      "Decision latency: p99 < 0.05ms",
      "Accurate rejection under sudden 10x bursts",
      "Bounded memory footprint across 1,000,000 clients",
    ],
    progressionLevels: [
      { level: 1, name: "Fixed Window Counter", focus: "Epoch-based time bucketing and demonstration of 2x boundary burst edge cases." },
      { level: 2, name: "Sliding Window Log", focus: "Timestamp deques, continuous sliding eviction, eliminating boundary spikes." },
      { level: 3, name: "Continuous-Refill Token Bucket", focus: "Lazy token refill on arrival, sustained rate enforcement with burst headroom." },
      { level: 4, name: "Leaky Bucket Traffic Shaper", focus: "FIFO queue buffering, constant outbound discharge frequency for downstream protection." },
      { level: 5, name: "High-Concurrency Lockless State", focus: "Atomic compare-and-swap (CAS) operations for zero-mutex contention." },
      { level: 6, name: "Distributed Sync Extension", focus: "Local token caching with batched central sync to withstand network latency & clock drift." },
    ],
    overview:
      "Protect downstream services from sudden traffic spikes. Implement Fixed Window, Sliding Window Log, continuous-refill Token Bucket, and Leaky Bucket traffic shapers with lockless atomic CAS state.",
  },
  {
    number: "09",
    slug: "load-balancer",
    title: "Dynamic Layer-7 Load Balancer",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "DISTRIBUTED SYSTEMS",
    inspiredBy: "HAProxy, Nginx, Envoy",
    whatStudentsBuild: "Layer-7 reverse proxy & dynamic load balancer",
    mainSkill: "Networking, balancing, reliability",
    signatureQuestion: "Can your load balancer survive a failing server?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Standardized target: > 50,000 routed req/sec",
      "Failover correctness under controlled backend failures",
      "Failure detection & reroute time (< 100ms)",
      "Consistent ring minimal remapping ratio",
    ],
    progressionLevels: [
      { level: 1, name: "Round-Robin Reverse Proxy", focus: "Cyclic rotation, pointer wraparound modulo arithmetic, empty pool protection." },
      { level: 2, name: "Smooth Weighted Round-Robin", focus: "Nginx current_weight interleaved algorithm, capacity-proportional dispersal." },
      { level: 3, name: "Least-Connections Routing", focus: "In-flight active connection counters, real-time load shedding." },
      { level: 4, name: "Active & Passive Health Checking", focus: "Heartbeat probes, consecutive failure trip counter, dead-node circuit breaking." },
      { level: 5, name: "Consistent Hashing Ring", focus: "Ketama 32-bit virtual node ring, session affinity, minimal key remapping." },
      { level: 6, name: "Zero-Downtime Connection Draining", focus: "Graceful backend deregistration, inflight transaction draining without dropped requests." },
    ],
    overview:
      "Build a battle-tested Layer 7 reverse proxy and load balancer. Implement smooth weighted round-robin, least-connections dynamic routing, circuit breaking with active/passive health checks, consistent hashing, and zero-downtime connection draining.",
  },

  // ==========================================
  // DOMAIN: SEARCH / DATA
  // ==========================================
  {
    number: "10",
    slug: "search-engine",
    title: "Inverted-Index Search Engine",
    domain: "SEARCH_DATA",
    domainLabel: "SEARCH / DATA",
    inspiredBy: "Lucene, Elasticsearch, Meilisearch",
    whatStudentsBuild: "Inverted-index full-text search engine",
    mainSkill: "Indexing, ranking, text processing",
    signatureQuestion: "Can you search millions of documents quickly?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Standardized indexing throughput (docs/sec)",
      "Query latency: p99 < 5ms over 1,000,000 documents",
      "Posting list compression ratio (> 75% savings)",
      "Relevance scoring accuracy (Okapi BM25)",
    ],
    progressionLevels: [
      { level: 1, name: "Text Tokenizer & Stopwords", focus: "Unicode tokenization, lowercase normalization, stemming, and punctuation stripping." },
      { level: 2, name: "Inverted Index & Posting Lists", focus: "Term-to-Document mapping with sorted integer docID arrays." },
      { level: 3, name: "Boolean Query Evaluator", focus: "High-speed linear two-pointer posting list intersection (AND), union (OR), NOT." },
      { level: 4, name: "Okapi BM25 Ranking Engine", focus: "Statistical term frequency saturation (k1) and document length normalization (b)." },
      { level: 5, name: "Positional Postings & Phrase Search", focus: "Word offset indexing, sliding-window exact phrase and proximity queries." },
      { level: 6, name: "Posting List Compression & Compaction", focus: "Variable Byte encoding, memory footprint reduction, immutable segment merging." },
    ],
    overview:
      "Construct a full-text search engine from first principles. Master text tokenization, inverted indexing with sorted posting lists, two-pointer linear Boolean query evaluation, Okapi BM25 statistical relevance ranking, and posting list compression.",
  },
];
