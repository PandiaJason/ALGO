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
  isFlagship?: boolean;
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
  { type: "BUILD", label: "Build From Scratch", desc: "Construct real technology from first principles without black-box libraries.", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { type: "FIX", label: "Fix The Slow Service", desc: "Here is a working production application that is slow. Profile and diagnose the bottleneck.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { type: "BREAK", label: "Break Your System", desc: "Subject your implementation to 100× traffic, memory pressure, and hostile workloads.", color: "text-red-700 bg-red-50 border-red-200" },
  { type: "OPTIMIZE", label: "Beat The Baseline", desc: "Everyone starts with the same baseline. Maximize ops/sec and squeeze p99 latency.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { type: "SURVIVE", label: "Survive Failure", desc: "Survive abrupt host power cuts (SIGKILL), network partitions, and partial disk writes.", color: "text-purple-700 bg-purple-50 border-purple-200" },
  { type: "INVENT", label: "Design The Better System", desc: "No single correct implementation. Submit custom architectures and prove them experimentally.", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
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
    title: "Build a Key-Value Engine",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "Redis",
    whatStudentsBuild: "In-memory storage engine",
    mainSkill: "Data structures, hashing, persistence",
    signatureQuestion: "Can you make your storage engine faster?",
    difficulty: "Hard",
    status: "ACTIVE",
    isFlagship: true,
    benchmarkMetrics: [
      "100,000+ ops/sec",
      "p50 / p95 / p99 < 0.20ms",
      "256MB hard memory cap",
      "Crash recovery replay",
      "Improvement % against baseline",
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
      "Construct a high-throughput, crash-resilient key-value storage engine from first principles — the foundational architecture powering Redis, RocksDB, and Bitcask. Build raw protocol dispatching, collision-resistant hash tables, synchronous write-ahead logs (WAL), millisecond TTL eviction, and striped-mutex concurrency.",
  },
  {
    number: "02",
    slug: "http-server",
    title: "Build an HTTP Server",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "Nginx",
    whatStudentsBuild: "HTTP/1.1 server",
    mainSkill: "Networking, I/O, concurrency",
    signatureQuestion: "How many requests can your server handle?",
    difficulty: "Medium",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Requests/sec",
      "p50 / p95 / p99 latency",
      "CPU & memory utilization",
      "10,000+ concurrent connections (C10K)",
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
      "Build a high-performance HTTP/1.1 web server from scratch. Implement non-blocking socket I/O, RFC-compliant HTTP stream parsing, keep-alive connection pooling, static file streaming, and epoll/kqueue concurrency.",
  },
  {
    number: "03",
    slug: "message-queue",
    title: "Build a Message Queue",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "Kafka / RabbitMQ",
    whatStudentsBuild: "Producer/consumer broker",
    mainSkill: "Queues, batching, throughput",
    signatureQuestion: "Can you increase throughput without losing messages?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Messages/sec",
      "Producer & consumer latency",
      "Queue depth under burst",
      "Zero message loss on crash",
    ],
    progressionLevels: [
      { level: 1, name: "In-Memory FIFO Queue", focus: "Basic producer push, consumer pull, and acknowledgment contracts." },
      { level: 2, name: "Topics & Partitions", focus: "Multi-tenant topics, hash-based partition routing, sequential offsets." },
      { level: 3, name: "Consumer Groups & Rebalancing", focus: "Dynamic worker assignment, commit offsets, at-least-once delivery." },
      { level: 4, name: "Segmented Append-Only Log", focus: "On-disk commit logs, binary serialization, fsync batching." },
      { level: 5, name: "High-Throughput Batching", focus: "Producer message batching, zero-copy socket transfers, and ring buffers." },
      { level: 6, name: "Crash Recovery & Compaction", focus: "Replaying uncommitted offsets and log retention policies." },
    ],
    overview:
      "Construct a distributed publish-subscribe message broker modeled after Kafka and RabbitMQ. Master segmented commit logs, partition keys, consumer group rebalancing, and zero-loss crash recovery.",
  },
  {
    number: "04",
    slug: "database-index",
    title: "Build a Database Index",
    domain: "SYSTEMS",
    domainLabel: "SYSTEMS",
    inspiredBy: "PostgreSQL",
    whatStudentsBuild: "B-Tree index",
    mainSkill: "Storage, indexing, disk I/O",
    signatureQuestion: "Why doesn't a database scan every row?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "10M record search time (O(N) vs O(log N))",
      "Lookup latency (p99 < 0.1ms)",
      "Insert throughput",
      "Range query scan efficiency",
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
      "Bridge the gap between raw disks and sub-millisecond queries. Build a production-grade B+ Tree index with 4KB slotted disk pages, buffer pool caching, node splitting, and lock-coupling concurrency.",
  },

  // ==========================================
  // DOMAIN: PERFORMANCE
  // ==========================================
  {
    number: "05",
    slug: "lru-cache",
    title: "Build a Cache",
    domain: "PERFORMANCE",
    domainLabel: "PERFORMANCE",
    inspiredBy: "Redis / Memcached",
    whatStudentsBuild: "LRU/LFU cache",
    mainSkill: "Caching, eviction, memory",
    signatureQuestion: "Can you increase hit rate without increasing memory?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Cache hit rate %",
      "p99 lookup latency",
      "Eviction overhead under pressure",
      "Backend database load reduction",
    ],
    progressionLevels: [
      { level: 1, name: "O(1) Hash Map + Doubly-Linked List", focus: "Strict O(1) GET/PUT with LRU head/tail pointer re-linking." },
      { level: 2, name: "LFU Frequency Tracking", focus: "Least Frequently Used eviction with frequency bucket lists." },
      { level: 3, name: "TTL Expiration Layer", focus: "Lazy time evaluation + min-heap expiration timer queue." },
      { level: 4, name: "Adaptive Replacement Cache (ARC)", focus: "Self-tuning between recency and frequency under changing workloads." },
      { level: 5, name: "Thread-Safe Fine-Grained Locking", focus: "Segmented cache locks preventing global mutex serialization." },
      { level: 6, name: "Memory Budget Hard Enforcement", focus: "Byte-accurate payload tracking and slab allocator recycling." },
    ],
    overview:
      "Build high-speed LRU, LFU, and ARC caching engines. Measure cache hit rates under 1,000,000 requests, minimize eviction thrashing, and enforce strict byte memory budgets.",
  },
  {
    number: "06",
    slug: "log-engine",
    title: "Build a Log Engine",
    domain: "PERFORMANCE",
    domainLabel: "PERFORMANCE",
    inspiredBy: "Observability Systems",
    whatStudentsBuild: "High-throughput log processor",
    mainSkill: "Streaming, parsing, aggregation",
    signatureQuestion: "Can your system process the stream faster than it arrives?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Ingestion throughput (MB/sec and lines/sec)",
      "Zero memory growth across 10GB streams",
      "p95 query latency over time windows",
      "SIMD tokenization speed",
    ],
    progressionLevels: [
      { level: 1, name: "Streaming Log Reader & Regex Parser", focus: "Parse structured log lines (timestamps, verbs, status, latency) from stdin." },
      { level: 2, name: "SIMD / Fast Byte Scanning", focus: "Eliminate string copies with zero-copy string views and delimiter scanning." },
      { level: 3, name: "Time-Windowed Metrics Aggregator", focus: "Rolling 1-minute and 5-minute buckets for error rates and p95 latency." },
      { level: 4, name: "Top-K Frequent Item Estimation", focus: "Space-Saving / Count-Min Sketch algorithms for top endpoints in bounded RAM." },
      { level: 5, name: "Columnar Chunk Compression", focus: "Compress timestamps (delta-of-delta) and numbers (Gorilla compression)." },
      { level: 6, name: "High-Speed Query Dispatcher", focus: "Query multi-gigabyte log datasets in under 50ms." },
    ],
    overview:
      "Build a blazingly fast log stream processor capable of ingesting gigabytes per second. Master streaming tokenization, rolling window aggregations, Count-Min Sketches, and columnar compression.",
  },

  // ==========================================
  // DOMAIN: DISTRIBUTED SYSTEMS
  // ==========================================
  {
    number: "07",
    slug: "task-scheduler",
    title: "Build a Task Scheduler",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "DISTRIBUTED SYSTEMS",
    inspiredBy: "Kubernetes",
    whatStudentsBuild: "Job scheduling system",
    mainSkill: "Scheduling, priorities, concurrency",
    signatureQuestion: "Can you schedule more work with the same resources?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Scheduling latency per job",
      "Cluster CPU & memory utilization %",
      "Deadline miss rate (0% target)",
      "Fair-share fairness index",
    ],
    progressionLevels: [
      { level: 1, name: "FIFO Priority Queue Scheduler", focus: "Match jobs to available machines based on priority and basic resource checks." },
      { level: 2, name: "Multi-Resource Bin Packing", focus: "Best-fit and dominant resource fairness (DRF) across CPU and memory constraints." },
      { level: 3, name: "Affinity & Anti-Affinity Constraints", focus: "Co-locating communicating services and isolating noisy neighbors." },
      { level: 4, name: "Preemption & Graceful Eviction", focus: "Preempt low-priority batch jobs for high-priority latency-sensitive tasks." },
      { level: 5, name: "Concurrent Scheduling Workers", focus: "Optimistic concurrency control with conflict detection and retry loops." },
      { level: 6, name: "Failure Recovery & Rescheduling", focus: "Detect node heartbeats drop and reschedule orphaned tasks automatically." },
    ],
    overview:
      "Recreate the core architectural intelligence behind the Kubernetes scheduler. Optimize multi-dimensional bin packing, enforce Dominant Resource Fairness (DRF), and implement optimistic concurrent scheduling.",
  },
  {
    number: "08",
    slug: "rate-limiter",
    title: "Build a Rate Limiter",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "DISTRIBUTED SYSTEMS",
    inspiredBy: "Cloud APIs",
    whatStudentsBuild: "Distributed rate limiter",
    mainSkill: "Algorithms, time, concurrency",
    signatureQuestion: "Can you enforce the limit without becoming the bottleneck?",
    difficulty: "Medium",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Throughput (> 100,000 checks/sec)",
      "Decision latency (< 0.05ms)",
      "Rejection accuracy under burst",
      "Memory usage across 1,000,000 clients",
    ],
    progressionLevels: [
      { level: 1, name: "Fixed Window Counter", focus: "Basic time window buckets and boundary burst vulnerability demonstration." },
      { level: 2, name: "Sliding Window Log & Counter", focus: "Eliminating boundary burst edge cases with rolling time log estimation." },
      { level: 3, name: "Token Bucket Algorithm", focus: "Continuous token refill at rate R with burst capacity B." },
      { level: 4, name: "Leaky Bucket Traffic Shaper", focus: "Queueing requests for constant smooth outflow rates." },
      { level: 5, name: "High-Concurrency Lockless State", focus: "Atomic compare-and-swap (CAS) operations for zero-lock contention." },
      { level: 6, name: "Distributed Sync & Clock Skew", focus: "Local token caching with batched central sync to withstand clock drift." },
    ],
    overview:
      "Protect downstream services from overwhelming traffic spikes. Implement Token Bucket, Leaky Bucket, and Sliding Window Counter algorithms that scale to millions of clients with sub-50 microsecond decisions.",
  },
  {
    number: "09",
    slug: "load-balancer",
    title: "Build a Load Balancer",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "DISTRIBUTED SYSTEMS",
    inspiredBy: "Nginx / HAProxy",
    whatStudentsBuild: "Request distributor",
    mainSkill: "Networking, balancing, reliability",
    signatureQuestion: "Can your load balancer survive a failing server?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Total routed requests/sec",
      "Traffic distribution balance ratio",
      "Zero 5xx during backend server failures",
      "Failure detection & recovery time (< 100ms)",
    ],
    progressionLevels: [
      { level: 1, name: "Round-Robin Reverse Proxy", focus: "Dispatch incoming HTTP connections sequentially across backend nodes." },
      { level: 2, name: "Weighted Routing & Capacity", focus: "Distribute traffic proportionally according to server CPU/memory specs." },
      { level: 3, name: "Least-Connections Algorithm", focus: "Dynamically track active in-flight requests and route to the least loaded server." },
      { level: 4, name: "Active & Passive Health Checking", focus: "Background heartbeat probes and circuit breaking on consecutive 5xx errors." },
      { level: 5, name: "Consistent Hashing with Virtual Nodes", focus: "Sticky session routing with minimal remapping upon server addition/removal." },
      { level: 6, name: "Zero-Downtime Hot Reloading", focus: "Drain connections gracefully and update backend pools without dropping packets." },
    ],
    overview:
      "Build a battle-tested Layer 7 reverse proxy and load balancer modeled after HAProxy and Nginx. Implement Least Connections, Consistent Hashing, circuit breakers, and sub-100ms failover.",
  },

  // ==========================================
  // DOMAIN: SEARCH / DATA
  // ==========================================
  {
    number: "10",
    slug: "search-engine",
    title: "Build a Search Engine",
    domain: "SEARCH_DATA",
    domainLabel: "SEARCH / DATA",
    inspiredBy: "Elasticsearch",
    whatStudentsBuild: "Inverted-index search engine",
    mainSkill: "Indexing, ranking, text processing",
    signatureQuestion: "Can you search millions of documents quickly?",
    difficulty: "Hard",
    status: "COMING_SOON",
    benchmarkMetrics: [
      "Indexing throughput (docs/sec)",
      "Query latency (p99 < 5ms over 1,000,000 documents)",
      "Memory & posting list compression ratio",
      "Relevance scoring accuracy (BM25 vs TF-IDF)",
    ],
    progressionLevels: [
      { level: 1, name: "Text Tokenizer & Stopwords", focus: "Unicode tokenization, lowercase normalization, stemming, and punctuation stripping." },
      { level: 2, name: "Inverted Index & Posting Lists", focus: "Term-to-Document mapping with sorted integer docID arrays." },
      { level: 3, name: "Boolean Query Processor (AND / OR / NOT)", focus: "High-speed linear posting list intersection and union algorithms." },
      { level: 4, name: "BM25 Relevance Ranking", focus: "Term frequency, inverse document frequency, and document length normalization." },
      { level: 5, name: "Posting List Compression", focus: "Variable Byte / Elias-Fano encoding to shrink index memory footprint by 80%." },
      { level: 6, name: "Phrase & Proximity Search", focus: "Position-aware posting lists for exact multi-word phrase matching." },
    ],
    overview:
      "Construct a full-text search engine from first principles. Master inverted indexing, BM25 statistical relevance ranking, posting list compression, and sub-millisecond Boolean search over massive text corpora.",
  },
];
