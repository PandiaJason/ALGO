// src/lib/constants/core-challenges.ts

export type EngineeringDomain =
  | "CORE_SYSTEMS"
  | "DISTRIBUTED_SYSTEMS"
  | "AI_SYSTEMS";

export type ChallengeType =
  | "BUILD"
  | "CORE"
  | "HARDEN"
  | "SCALE"
  | "MEASURE"
  | "OPTIMIZE";

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
    stage: "BUILD" | "CORE" | "HARDEN" | "SCALE" | "MEASURE" | "OPTIMIZE";
    name: string;
    question: string;
    focus: string;
  }>;
  overview: string;
}

export const ALGO_PHILOSOPHY = [
  { step: "UNDERSTAND", title: "Understand", desc: "Deconstruct the internal protocol, memory layout, and system boundaries." },
  { step: "BUILD", title: "Build", desc: "Construct working implementations from first principles without black-box libraries." },
  { step: "BREAK", title: "Break", desc: "Subject code to hostile inputs, corrupted payloads, SIGKILL crashes, and load spikes." },
  { step: "SCALE", title: "Scale", desc: "Introduce concurrency, sharding, lock striping, and thread-pool execution." },
  { step: "MEASURE", title: "Measure", desc: "Empirically capture p50/p95/p99 tail latency, IOPS, and memory footprint." },
  { step: "OPTIMIZE", title: "Optimize", desc: "Re-architect hot paths with zero-copy buffers, SIMD instructions, and compaction." },
] as const;

export const CHALLENGE_TYPES: Array<{ type: ChallengeType; label: string; desc: string }> = [
  { type: "BUILD", label: "Build", desc: "Construct working implementations from first principles." },
  { type: "CORE", label: "Core", desc: "Implement internal algorithms, data structures, and mechanics." },
  { type: "HARDEN", label: "Harden", desc: "Handle edge cases, unexpected inputs, and crash recovery." },
  { type: "SCALE", label: "Scale", desc: "Support concurrency, lock striping, and operational load." },
  { type: "MEASURE", label: "Measure", desc: "Capture empirical metrics, latency percentiles, and profile bottlenecks." },
  { type: "OPTIMIZE", label: "Optimize", desc: "Beat baseline performance through zero-copy, SIMD, and compaction." },
];

export const DOMAINS: Record<EngineeringDomain, { label: string; description: string; count: number }> = {
  CORE_SYSTEMS: {
    label: "Core Systems",
    description: "Low-level runtimes, memory architectures, storage durability, and network I/O.",
    count: 8,
  },
  DISTRIBUTED_SYSTEMS: {
    label: "Distributed Systems",
    description: "Multi-node consensus, commit logs, rate limiters, load balancers, and discovery.",
    count: 8,
  },
  AI_SYSTEMS: {
    label: "AI Systems",
    description: "Inverted indexes, vector search (HNSW), LLM inference engines, and MCP agent runtimes.",
    count: 4,
  },
};

export const CORE_CHALLENGES: CoreChallenge[] = [
  // ==========================================
  // DOMAIN: CORE SYSTEMS (01 - 08)
  // ==========================================
  {
    number: "01",
    slug: "shell",
    title: "Unix Shell",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "Bash, Zsh",
    whatStudentsBuild: "Interactive command interpreter with process control and pipelines",
    mainSkill: "Process management, syscalls, IPC, signals",
    signatureQuestion: "How do processes actually spawn and communicate?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Process spawn overhead: < 1.5ms",
      "Pipeline throughput: > 500 MB/s",
      "Zero orphan or zombie processes",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Interactive REPL & Builtins", question: "Can you make it work?", focus: "Line reading, tokenization, cd/pwd/exit builtins" },
      { level: 2, stage: "CORE", name: "Process Fork & Exec", question: "Do you understand the core mechanism?", focus: "fork(), execvp(), PATH resolution, exit status capture" },
      { level: 3, stage: "HARDEN", name: "Signal Handling & Zombie Reaping", question: "Does it remain correct under edge cases and failures?", focus: "SIGINT, SIGTSTP, waitpid(WNOHANG), non-blocking zombie reaping" },
      { level: 4, stage: "SCALE", name: "Multi-stage Pipelines & Redirection", question: "Does it handle concurrency, workload and growth?", focus: "pipe(), dup2(), file redirection (<, >, >>), multi-stage pipeline coordination" },
      { level: 5, stage: "MEASURE", name: "Syscall & Latency Profiling", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling fork latency, pipe buffer throughput, memory leaks across 10,000 commands" },
      { level: 6, stage: "OPTIMIZE", name: "Zero-Allocation Command Dispatch", question: "Can you make it measurably better?", focus: "Buffer recycling, fast-path builtin table, zero heap allocations on hot path" },
    ],
    overview: "Build an interactive Unix command interpreter from scratch. Master the fundamental operating system abstractions: process address spaces, fork/exec lifecycle, pipe file descriptors, signal traps, and zombie process cleanup.",
  },
  {
    number: "02",
    slug: "http-server",
    title: "High-Concurrency HTTP Server",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "Nginx, Envoy",
    whatStudentsBuild: "RFC 7230 compliant non-blocking HTTP/1.1 web server",
    mainSkill: "Networking, socket I/O, event loops",
    signatureQuestion: "How many concurrent requests can your server handle?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Target throughput: > 50,000 req/s",
      "p99 latency: < 1.0ms",
      "C10K connection saturation without drop",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Socket Listener & Static HTTP/1.1", question: "Can you make it work?", focus: "TCP socket binding, raw request parsing, 200 OK and 404 responses" },
      { level: 2, stage: "CORE", name: "Radix Trie Router & Header Subsystem", question: "Do you understand the core mechanism?", focus: "Fast path matching, dynamic :param extraction, case-insensitive headers" },
      { level: 3, stage: "HARDEN", name: "Malformed Framing & Slowloris Defense", question: "Does it remain correct under edge cases and failures?", focus: "Chunked transfer parsing, Content-Length validation, read timeouts against slow clients" },
      { level: 4, stage: "SCALE", name: "Non-Blocking Event Loop (epoll / select)", question: "Does it handle concurrency, workload and growth?", focus: "I/O multiplexing, persistent keep-alive connection pooling, concurrent socket states" },
      { level: 5, stage: "MEASURE", name: "Connection Saturation & Tail Latency", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling socket buffer drains, measuring p50/p95/p99 under 5,000 concurrent streams" },
      { level: 6, stage: "OPTIMIZE", name: "Zero-Copy Sendfile & Pipeline Batching", question: "Can you make it measurably better?", focus: "Kernel bypass sendfile, vectorized writev, zero-allocation header buffer rings" },
    ],
    overview: "Construct a high-performance HTTP/1.1 server from raw POSIX byte streams. Progress from basic synchronous socket handling to an asynchronous event-driven reactor capable of serving 50,000+ requests per second.",
  },
  {
    number: "03",
    slug: "git",
    title: "Git Version Control Engine",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "Git",
    whatStudentsBuild: "Content-addressed object database and Directed Acyclic Graph (DAG)",
    mainSkill: "Content addressing, SHA hashing, graph algorithms",
    signatureQuestion: "How does Git represent history without storing whole duplicate files?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Commit creation: < 2ms",
      "Tree diffing over 50,000 files: < 25ms",
      "Packfile compression ratio: > 60%",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Blob Storage & SHA-1 Hashing", question: "Can you make it work?", focus: "Content-addressed storage, header framing ('blob <size>\\0'), zlib compression" },
      { level: 2, stage: "CORE", name: "Tree Hierarchy & Commit DAG", question: "Do you understand the core mechanism?", focus: "Tree objects with mode/filename/hash tuples, commit objects with parent lineage" },
      { level: 3, stage: "HARDEN", name: "Object Integrity & Corruption Recovery", question: "Does it remain correct under edge cases and failures?", focus: "fsck-style SHA hash verification, dangling pointer detection, cycle detection" },
      { level: 4, stage: "SCALE", name: "Fast Tree Diffing & Branching", question: "Does it handle concurrency, workload and growth?", focus: "Two-pointer tree diffing in O(differences) time, refs/heads resolution, merge base lookup" },
      { level: 5, stage: "MEASURE", name: "Repository Footprint & Graph Traversal", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling loose object disk footprint, measuring ancestor reachability latency on 10,000 commits" },
      { level: 6, stage: "OPTIMIZE", name: "Delta Compression & Packfile Format", question: "Can you make it measurably better?", focus: "Sliding-window delta compression (copy/insert opcodes), binary packfile index generation" },
    ],
    overview: "Build Git from first principles. Implement content-addressed storage, blob and tree serialization, commit DAG traversal, and packfile delta compression.",
  },
  {
    number: "04",
    slug: "kv-store",
    title: "Key-Value Storage Engine",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "Redis, Bitcask, RocksDB",
    whatStudentsBuild: "In-memory storage engine with Write-Ahead Logging (WAL) and compaction",
    mainSkill: "Data structures, memory management, durability, crash recovery",
    signatureQuestion: "Can you make your storage engine survive a sudden power cut?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Standardized target: > 100,000 ops/sec",
      "p99 latency: < 0.20ms",
      "256MB hard memory boundary",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "In-Memory Key-Value Protocol", question: "Can you make it work?", focus: "Core command parsing (SET, GET, DEL, EXISTS), dictionary lookup, error handling" },
      { level: 2, stage: "CORE", name: "Append-Only Log (WAL) & Keydir Index", question: "Do you understand the core mechanism?", focus: "Sequential disk log framing with CRC32 checksums, in-memory Bitcask offset index" },
      { level: 3, stage: "HARDEN", name: "Crash Recovery & Partial Write Recovery", question: "Does it remain correct under edge cases and failures?", focus: "Deterministic recovery after abrupt SIGKILL, corrupted tail record truncation" },
      { level: 4, stage: "SCALE", name: "Concurrent Striped Locks & Multi-threading", question: "Does it handle concurrency, workload and growth?", focus: "Fine-grained striped locking, concurrent reads, write lock serialization" },
      { level: 5, stage: "MEASURE", name: "Throughput Benchmarking & Tail Latency", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling lock contention, measuring read/write ratios, p50/p95/p99 under 100K ops/s" },
      { level: 6, stage: "OPTIMIZE", name: "Log Compaction & Zero-Copy Deserialization", question: "Can you make it measurably better?", focus: "Background log merging/compaction, dead record elimination, direct memory mapped I/O" },
    ],
    overview: "Engineer an in-memory key-value storage engine inspired by Redis and Bitcask. Progress from simple dictionary lookups to append-only write-ahead logging (WAL), crash recovery after SIGKILL, concurrent striped locking, and background log compaction.",
  },
  {
    number: "05",
    slug: "object-store",
    title: "Object Storage Engine",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "AWS S3, MinIO",
    whatStudentsBuild: "Content-addressed blob store with chunk deduplication and integrity scrubbing",
    mainSkill: "Storage systems, chunking, deduplication, bit-rot detection",
    signatureQuestion: "How do cloud storage providers store petabytes without duplicating data?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Read throughput: > 800 MB/s",
      "Deduplication ratio: > 45% on real workloads",
      "Zero silent data corruption (bit rot)",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Content-Addressed Blob Storage", question: "Can you make it work?", focus: "PUT/GET/DELETE object API, two-level directory sharding based on SHA-256 hash" },
      { level: 2, stage: "CORE", name: "Rabin Fingerprinting & Deduplication", question: "Do you understand the core mechanism?", focus: "Content-defined chunking (CDC), rolling hash boundaries, block dedup manifest" },
      { level: 3, stage: "HARDEN", name: "Bit Rot Detection & Background Scrubbing", question: "Does it remain correct under edge cases and failures?", focus: "End-to-end CRC64/BLAKE3 verification, silent corruption scrubbing, quarantine isolation" },
      { level: 4, stage: "SCALE", name: "Concurrent Multipart Uploads", question: "Does it handle concurrency, workload and growth?", focus: "Parallel chunk uploads, part assembly verification, concurrent read stream workers" },
      { level: 5, stage: "MEASURE", name: "IOPS Saturation & Write Amplification", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring chunking CPU overhead vs storage savings, disk write amplification profiling" },
      { level: 6, stage: "OPTIMIZE", name: "Direct I/O & Block Coalescing", question: "Can you make it measurably better?", focus: "O_DIRECT aligned sector writes, small object inlining, zero-copy buffer pooling" },
    ],
    overview: "Build an industrial blob storage engine modeled after AWS S3 and MinIO. Implement content-defined chunking with deduplication, multipart parallel uploads, bit-rot scrubbing, and high-throughput streaming.",
  },
  {
    number: "06",
    slug: "lru-cache",
    title: "High-Throughput In-Memory Cache",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "Memcached, Caffeine, Redis",
    whatStudentsBuild: "O(1) concurrent cache with frequency tracking and eviction",
    mainSkill: "Memory architectures, lock-free concurrency, eviction algorithms",
    signatureQuestion: "Can you sustain 1,000,000 cache lookups per second under high thread contention?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Target throughput: > 500,000 ops/sec",
      "Cache hit ratio: > 85% under zipfian distribution",
      "Bounded memory limit strictly respected",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "O(1) Hash Table + Doubly-Linked List", question: "Can you make it work?", focus: "Fast key lookups with pointer re-wiring for least-recently-used tracking" },
      { level: 2, stage: "CORE", name: "Frequency Tracking (TinyLFU / ARC)", question: "Do you understand the core mechanism?", focus: "Count-Min Sketch frequency estimation, adaptive replacement between recency and frequency" },
      { level: 3, stage: "HARDEN", name: "Eviction Under Hard Memory Limits", question: "Does it remain correct under edge cases and failures?", focus: "Strict byte-level budget enforcement, TTL expiry sweeps, zombie key eviction" },
      { level: 4, stage: "SCALE", name: "Sharded Concurrent Hash Ring", question: "Does it handle concurrency, workload and growth?", focus: "Partitioned locking across power-of-two shards, lock contention minimization" },
      { level: 5, stage: "MEASURE", name: "Hit Ratio & Tail Latency Profiling", question: "Can you identify bottlenecks and prove performance?", focus: "Benchmarking Zipfian request skew, measuring hit ratios and lock wait times" },
      { level: 6, stage: "OPTIMIZE", name: "Lock-Free Ring Buffer & SIMD Sieve", question: "Can you make it measurably better?", focus: "Batched eviction queues, thread-local read buffers, cache-line aligned node packing" },
    ],
    overview: "Construct an ultra-low-latency in-memory cache inspired by Memcached and Caffeine. Master O(1) double-linked list wiring, TinyLFU frequency sketches, sharded locks, and lock-free read buffer batching.",
  },
  {
    number: "07",
    slug: "database-index",
    title: "B+ Tree Database Index Engine",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "PostgreSQL, SQLite, InnoDB",
    whatStudentsBuild: "Disk-backed slotted-page B+ Tree with buffer pool management",
    mainSkill: "Storage engines, disk paging, tree algorithms, buffer pools",
    signatureQuestion: "Why doesn't a database scan every row on disk?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Lookup latency: < 0.05ms on 10M rows",
      "Buffer pool hit ratio: > 95%",
      "Page utilization: > 70% after random deletes",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Slotted Page Format & 4KB Boundaries", question: "Can you make it work?", focus: "Hardware page alignment, slotted offset arrays, variable-length key/payload layout" },
      { level: 2, stage: "CORE", name: "B+ Tree Node Splits & Leaf Linking", question: "Do you understand the core mechanism?", focus: "Internal navigation nodes, leaf node splits with right-sibling pointers for range queries" },
      { level: 3, stage: "HARDEN", name: "Underflow Merges & Redistribution", question: "Does it remain correct under edge cases and failures?", focus: "Node balance invariant preservation, deletion borrowing, sibling page merging" },
      { level: 4, stage: "SCALE", name: "Buffer Pool Manager with LRU/CLOCK", question: "Does it handle concurrency, workload and growth?", focus: "Page frame pinning/unpinning, dirty page flushes, bounded memory caching" },
      { level: 5, stage: "MEASURE", name: "Disk I/O vs Memory Miss Benchmarking", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring disk read amplification, branch prediction misses, and range scan IOPS" },
      { level: 6, stage: "OPTIMIZE", name: "Prefix Key Compression & Latch Crabbing", question: "Can you make it measurably better?", focus: "Truncated key indexing, optimistic concurrent latch crabbing for high write throughput" },
    ],
    overview: "Build the foundational indexing engine that powers every relational database. Design 4KB slotted pages, implement balanced tree splits and leaf linking, engineer a memory buffer pool, and achieve sub-millisecond lookups over millions of keys.",
  },
  {
    number: "08",
    slug: "container-runtime",
    title: "Container Runtime / Sandbox",
    domain: "CORE_SYSTEMS",
    domainLabel: "Core Systems",
    inspiredBy: "Docker, runc, gVisor",
    whatStudentsBuild: "Linux container execution engine using namespaces, cgroups, and rootfs pivot",
    mainSkill: "OS virtualization, Linux kernel primitives, security isolation",
    signatureQuestion: "What actually happens when you run 'docker run'?",
    difficulty: "Expert",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Container startup cold-boot: < 15ms",
      "Memory limit enforcement: strict 0 byte overshoot",
      "100% root filesystem jailbreak containment",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Process Isolation with Linux Namespaces", question: "Can you make it work?", focus: "clone() with CLONE_NEWPID, CLONE_NEWUTS, isolated hostname and PID 1" },
      { level: 2, stage: "CORE", name: "Filesystem Isolation & Pivot Root", question: "Do you understand the core mechanism?", focus: "chroot vs pivot_root, mount namespace (CLONE_NEWNS), read-only rootfs mount" },
      { level: 3, stage: "HARDEN", name: "Cgroups V2 Resource Constraints", question: "Does it remain correct under edge cases and failures?", focus: "Memory max boundaries, CPU quota throttling, pids.max fork-bomb prevention" },
      { level: 4, stage: "SCALE", name: "Multi-Tenant Parallel Sandbox Spawning", question: "Does it handle concurrency, workload and growth?", focus: "Concurrent ephemeral container spawning, unique bridge networking, IP allocation" },
      { level: 5, stage: "MEASURE", name: "Cold-Start Microbenchmarks & Latency", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring mount overhead, namespace creation latency, context switch penalties" },
      { level: 6, stage: "OPTIMIZE", name: "Pre-Forked Pool & Copy-on-Write Roots", question: "Can you make it measurably better?", focus: "Pre-initialized namespace worker pools, CoW overlay snapshotting, sub-5ms boot" },
    ],
    overview: "Construct an isolated container runtime from Linux kernel primitives. Implement process isolation with namespaces, secure rootfs containment with pivot_root, resource guardrails with cgroups v2, and sub-10ms ephemeral sandbox execution.",
  },

  // ==========================================
  // DOMAIN: DISTRIBUTED SYSTEMS (09 - 16)
  // ==========================================
  {
    number: "09",
    slug: "message-queue",
    title: "Distributed Commit Log & Message Queue",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "Apache Kafka, Apache Pulsar",
    whatStudentsBuild: "Segmented commit log with partitioned consumer groups",
    mainSkill: "Streaming data, sequential I/O, offset semantics, consumer groups",
    signatureQuestion: "How do streaming platforms process billions of events a day without falling over?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Ingestion rate: > 100,000 messages/sec",
      "Zero message loss on uncommitted offsets",
      "Consumer rebalance latency: < 50ms",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Append-Only Segment File & Binary Offsets", question: "Can you make it work?", focus: "Sequential 64-bit monotonically increasing offsets, binary frame formatting" },
      { level: 2, stage: "CORE", name: "Topic Partitions & Index Spans", question: "Do you understand the core mechanism?", focus: "Hash-partitioned topics, sparse index file (.index) for O(1) byte offset lookup" },
      { level: 3, stage: "HARDEN", name: "Consumer Offset Tracking & At-Least-Once", question: "Does it remain correct under edge cases and failures?", focus: "Committed offset durability, re-reading from offset on worker crash, idempotency keys" },
      { level: 4, stage: "SCALE", name: "Consumer Group Coordination & Rebalance", question: "Does it handle concurrency, workload and growth?", focus: "Dynamic partition assignment across active consumers, heartbeat failure detection" },
      { level: 5, stage: "MEASURE", name: "End-to-End Consumer Lag & Disk Saturation", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling PageCache dirty ratios, measuring consumer lag under backpressure" },
      { level: 6, stage: "OPTIMIZE", name: "Zero-Copy PageCache Splicing (sendfile)", question: "Can you make it measurably better?", focus: "Direct kernel-space network transfer via sendfile/splice, batch write coalescing" },
    ],
    overview: "Construct an append-only commit log and distributed streaming platform inspired by Kafka. Master binary log segmenting, sparse indexing, partition assignment, and zero-copy PageCache streaming.",
  },
  {
    number: "10",
    slug: "log-engine",
    title: "Columnar Log Analytics Engine",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "ClickHouse, Elastic, DuckDB",
    whatStudentsBuild: "Columnar chunk store with vectorized filter execution",
    mainSkill: "Columnar storage, data compression, vectorized execution",
    signatureQuestion: "How do analytics systems aggregate 100M rows in milliseconds?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Scan speed: > 10,000,000 rows/sec",
      "Compression ratio: > 70% with run-length and dictionary encoding",
      "Query response: < 15ms on aggregation",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Structured Ingestion & Field Tokenizer", question: "Can you make it work?", focus: "Parsing raw log streams (JSON, Common Log), schema extraction, row array storage" },
      { level: 2, stage: "CORE", name: "Columnar Chunk Storage & Dictionary Encoding", question: "Do you understand the core mechanism?", focus: "Transposing row layouts into column arrays, integer dictionary encoding for strings" },
      { level: 3, stage: "HARDEN", name: "Malformed Records & Out-of-Order Timestamps", question: "Does it remain correct under edge cases and failures?", focus: "Quarantine invalid schemas, time-window bucket re-ordering, non-destructive parsing" },
      { level: 4, stage: "SCALE", name: "Parallel Partition Scans & MapReduce Filters", question: "Does it handle concurrency, workload and growth?", focus: "Chunk-level multi-threading, min/max pruning (skip indexes), parallel aggregations" },
      { level: 5, stage: "MEASURE", name: "Memory Bandwidth & Cache Misses", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring memory bus utilization, L1/L2 data cache hit rates during column scans" },
      { level: 6, stage: "OPTIMIZE", name: "Vectorized SIMD Filtering & Bit-Packing", question: "Can you make it measurably better?", focus: "SIMD comparisons over 256-bit vectors, branchless filter selection masks" },
    ],
    overview: "Build a columnar log storage and query engine inspired by ClickHouse and DuckDB. Master column-oriented memory layouts, dictionary compression, min/max sparse indexes, and vectorized filter evaluation.",
  },
  {
    number: "11",
    slug: "rate-limiter",
    title: "Distributed Rate Limiter",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "Stripe API, Cloudflare",
    whatStudentsBuild: "Low-overhead token bucket and sliding window rate limiter",
    mainSkill: "Traffic shaping, atomic operations, distributed synchronization",
    signatureQuestion: "How do cloud APIs enforce 10,000 req/sec limits without introducing latency?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Decision latency: < 0.02ms (sub-20 microseconds)",
      "Zero false-positive drops under burst allowance",
      "Distributed synchronization drift: < 2%",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Token Bucket Algorithm", question: "Can you make it work?", focus: "Capacity, refill rate, atomic balance consumption, rejecting excess tokens" },
      { level: 2, stage: "CORE", name: "Sliding Window Log & Counter", question: "Do you understand the core mechanism?", focus: "Smooth window boundary transitions, sub-second bucket precision, burst dampening" },
      { level: 3, stage: "HARDEN", name: "Clock Skew & Race Condition Defense", question: "Does it remain correct under edge cases and failures?", focus: "Monotonic clock synchronization, CAS atomic updates, handling leap seconds" },
      { level: 4, stage: "SCALE", name: "Distributed Counter Cluster (Redis Protocol)", question: "Does it handle concurrency, workload and growth?", focus: "Multi-node token sharing, local batch allocation to reduce cross-network roundtrips" },
      { level: 5, stage: "MEASURE", name: "False Rejection Rate & Jitter Analysis", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling decision latency percentiles, tracking dropped legitimate traffic under spike" },
      { level: 6, stage: "OPTIMIZE", name: "Lock-Free Ring Buffer & Probabilistic Limiting", question: "Can you make it measurably better?", focus: "Single-atomic-variable packing, lock-free local thread-cached counters" },
    ],
    overview: "Design a high-throughput rate limiter inspired by Stripe and Cloudflare. Implement token bucket mathematics, sliding window aggregations, race-free atomic updates, and distributed synchronization with sub-20µs latency.",
  },
  {
    number: "12",
    slug: "load-balancer",
    title: "Reverse Proxy & Load Balancer",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "HAProxy, Nginx, Envoy",
    whatStudentsBuild: "Layer 4/7 reverse proxy with active health checks and consistent hashing",
    mainSkill: "Networking, load balancing, proxying, failure detection",
    signatureQuestion: "How do cloud proxies distribute 1M connections fairly across backend servers?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Proxy latency added: < 0.15ms",
      "Backend failover detection: < 200ms",
      "Equal request distribution: std-dev < 3%",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Round Robin & Least Connections", question: "Can you make it work?", focus: "Reverse proxy forwarding, socket splicing, balanced round-robin routing" },
      { level: 2, stage: "CORE", name: "Consistent Hashing Ring & Virtual Nodes", question: "Do you understand the core mechanism?", focus: "Ketama hash ring, virtual node distribution, minimal cache churn on node add/remove" },
      { level: 3, stage: "HARDEN", name: "Active Health Checking & Circuit Breaking", question: "Does it remain correct under edge cases and failures?", focus: "Periodic TCP/HTTP probes, consecutive failure ejection, exponential backoff re-entry" },
      { level: 4, stage: "SCALE", name: "Epoll Event Reactor & High Connection Pool", question: "Does it handle concurrency, workload and growth?", focus: "Non-blocking bidirectional forwarding, upstream connection pooling, backpressure handling" },
      { level: 5, stage: "MEASURE", name: "Backend Skew & Connection Latency Profiling", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring p99 latency overhead introduced by proxy, tracking traffic skew across nodes" },
      { level: 6, stage: "OPTIMIZE", name: "Maglev Consistent Hashing & Zero-Copy Forward", question: "Can you make it measurably better?", focus: "Google Maglev lookup table, splice/vmsplice zero-copy socket passthrough" },
    ],
    overview: "Build a Layer 4/7 reverse proxy and load balancer modeled after HAProxy and Envoy. Implement dynamic routing algorithms, Ketama consistent hashing, automated circuit breaker failover, and zero-copy packet forwarding.",
  },
  {
    number: "13",
    slug: "task-scheduler",
    title: "Distributed Task Scheduler",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "Kubernetes, Temporal, Celery",
    whatStudentsBuild: "Distributed job runner with priority queues, cron parsing, and work stealing",
    mainSkill: "Scheduling algorithms, state machines, fault tolerance",
    signatureQuestion: "How do orchestration engines guarantee task execution despite worker crashes?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Task dispatch latency: < 1.0ms",
      "Zero duplicate executions on worker death",
      "Work stealing balance efficiency: > 90%",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Priority Queue & Worker Thread Pool", question: "Can you make it work?", focus: "Binary min-heap priority queue, worker thread synchronization, task execution" },
      { level: 2, stage: "CORE", name: "Delayed Jobs & Distributed Cron Parser", question: "Do you understand the core mechanism?", focus: "Time-wheel / timer-heap delayed execution, 5-field cron expression parsing" },
      { level: 3, stage: "HARDEN", name: "Dead Letter Queue & Exponential Backoff", question: "Does it remain correct under edge cases and failures?", focus: "Worker crash heartbeat monitoring, automatic task lease reclamation, DLQ routing" },
      { level: 4, stage: "SCALE", name: "Chase-Lev Work Stealing Thread Pools", question: "Does it handle concurrency, workload and growth?", focus: "Per-thread double-ended queues (deques), lock-free work stealing from victim threads" },
      { level: 5, stage: "MEASURE", name: "Scheduling Jitter & Worker Utilization", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring task execution drift from scheduled time, tracking CPU idle percentage" },
      { level: 6, stage: "OPTIMIZE", name: "Hierarchical Timing Wheels & Lock-Free Queue", question: "Can you make it measurably better?", focus: "O(1) insertion/deletion hashed timing wheels, lock-free MPMC dispatch queues" },
    ],
    overview: "Construct a fault-tolerant task scheduler inspired by Kubernetes and Temporal. Master priority queues, hierarchical timing wheels for delayed jobs, exponential backoff retries, and work-stealing thread pools.",
  },
  {
    number: "14",
    slug: "distributed-consensus",
    title: "Distributed Consensus Engine (Raft)",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "etcd, Raft, Paxos",
    whatStudentsBuild: "Fault-tolerant replicated state machine using the Raft consensus protocol",
    mainSkill: "Consensus protocols, state replication, distributed state machines, network partitions",
    signatureQuestion: "How do distributed nodes agree on a single history across an unreliable network?",
    difficulty: "Expert",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Leader election recovery: < 150ms after leader crash",
      "Log commit latency: < 5ms across 3-node cluster",
      "Zero split-brain state divergences",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Leader Election & Heartbeat Protocol", question: "Can you make it work?", focus: "Randomized election timeouts, RequestVote RPC, heartbeats, term transitions" },
      { level: 2, stage: "CORE", name: "Log Replication & State Machine Commit", question: "Do you understand the core mechanism?", focus: "AppendEntries RPC, log consistency invariants, quorum majority commit index update" },
      { level: 3, stage: "HARDEN", name: "Network Partitions & Split-Brain Mitigation", question: "Does it remain correct under edge cases and failures?", focus: "Majority quorum validation, uncommitted entry overwrite on rejoined partition" },
      { level: 4, stage: "SCALE", name: "Cluster Membership Changes & Log Compaction", question: "Does it handle concurrency, workload and growth?", focus: "Joint consensus configuration change, snapshotting state machine, log truncation" },
      { level: 5, stage: "MEASURE", name: "Election Convergence & Replication Lag", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring election duration under packet loss, tracking leader commit latency percentiles" },
      { level: 6, stage: "OPTIMIZE", name: "Pipelined Log Replication & Batching", question: "Can you make it measurably better?", focus: "Asynchronous log pipelining, batching client commands, read-index linearizable queries" },
    ],
    overview: "Implement the Raft consensus algorithm that underpins modern cloud infrastructure like etcd and Kubernetes. Master leader elections, quorum replicated state machines, partition healing, and log compaction snapshots.",
  },
  {
    number: "15",
    slug: "service-discovery",
    title: "Service Discovery & DNS Registry",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "Consul, CoreDNS, Eureka",
    whatStudentsBuild: "Dynamic service catalog with DNS server interface and gossip protocol",
    mainSkill: "DNS protocols, gossip protocols (SWIM), service registries, health monitoring",
    signatureQuestion: "How do microservices locate each other instantly as containers scale up and down?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "DNS resolution latency: < 0.5ms",
      "Node failure detection: < 2.0s across 50 nodes",
      "Zero stale IP records returned during rolling deploys",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Service Registry & TTL Heartbeat Monitor", question: "Can you make it work?", focus: "Registration API (service name, IP, port, tags), TTL heartbeat refresh, expired node reaping" },
      { level: 2, stage: "CORE", name: "RFC 1035 UDP DNS Server", question: "Do you understand the core mechanism?", focus: "Raw UDP DNS query parsing, A/SRV record binary response generation, round-robin resolution" },
      { level: 3, stage: "HARDEN", name: "Flapping Node Damping & Split-Horizon DNS", question: "Does it remain correct under edge cases and failures?", focus: "Hysteresis damping for rapidly failing nodes, health check failure thresholds" },
      { level: 4, stage: "SCALE", name: "SWIM Gossip Protocol Node Membership", question: "Does it handle concurrency, workload and growth?", focus: "Decentralized failure detection via random ping/indirect ping, suspicion timers" },
      { level: 5, stage: "MEASURE", name: "Convergence Time & DNS Latency Profiling", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring gossip cluster convergence speed across 50 nodes, DNS query throughput" },
      { level: 6, stage: "OPTIMIZE", name: "Lock-Free Routing Tables & UDP Zero-Copy", question: "Can you make it measurably better?", focus: "Atomic snapshot routing tables for lock-free reads, recvmmsg batch socket processing" },
    ],
    overview: "Build a dynamic service discovery engine and DNS server inspired by HashiCorp Consul and CoreDNS. Implement RFC 1035 binary DNS response framing, SWIM gossip failure detection, and sub-millisecond route resolution.",
  },
  {
    number: "16",
    slug: "distributed-object-storage",
    title: "Distributed Object Storage with Erasure Coding",
    domain: "DISTRIBUTED_SYSTEMS",
    domainLabel: "Distributed Systems",
    inspiredBy: "Ceph, MinIO Distributed",
    whatStudentsBuild: "Multi-node distributed storage cluster with Reed-Solomon erasure coding",
    mainSkill: "Erasure coding, Galois field arithmetic, cluster replication, self-healing",
    signatureQuestion: "How can a storage cluster survive losing 4 disks simultaneously without losing a byte?",
    difficulty: "Expert",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Write throughput across 8 nodes: > 600 MB/s",
      "Survives 4 node simultaneous death with 100% data recovery",
      "Reconstruction speed: > 200 MB/s",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Multi-Node Sharded Placement", question: "Can you make it work?", focus: "Consistent hashing across storage nodes, node chunk placement, metadata indexing" },
      { level: 2, stage: "CORE", name: "Reed-Solomon Erasure Coding (4+2)", question: "Do you understand the core mechanism?", focus: "Galois field GF(2^8) matrix multiplication, splitting data into 4 data + 2 parity shards" },
      { level: 3, stage: "HARDEN", name: "Lost Node Reconstruction & Self-Healing", question: "Does it remain correct under edge cases and failures?", focus: "Detecting missing shards, inverting Cauchy matrix to reconstruct corrupted data in memory" },
      { level: 4, stage: "SCALE", name: "Parallel Multi-Node Chunk Streaming", question: "Does it handle concurrency, workload and growth?", focus: "Asynchronous shard streaming to 8 nodes concurrently, handling slow-node tail latency" },
      { level: 5, stage: "MEASURE", name: "Erasure Math Overhead & Network Egress", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling CPU matrix multiplication time vs network I/O, measuring repair bandwidth" },
      { level: 6, stage: "OPTIMIZE", name: "SIMD Galois Field Arithmetic & Zero-Copy", question: "Can you make it measurably better?", focus: "AVX2/NEON vector instructions for GF(2^8) arithmetic, zero-copy socket splices" },
    ],
    overview: "Engineer a high-durability distributed storage cluster inspired by Ceph and MinIO. Implement Reed-Solomon erasure coding using Galois field arithmetic, automated background self-healing, and parallel shard streaming.",
  },

  // ==========================================
  // DOMAIN: AI SYSTEMS (17 - 20)
  // ==========================================
  {
    number: "17",
    slug: "search-engine",
    title: "Full-Text Search Engine",
    domain: "AI_SYSTEMS",
    domainLabel: "AI Systems",
    inspiredBy: "Lucene, Elasticsearch",
    whatStudentsBuild: "Inverted index with BM25 relevance ranking and positional scoring",
    mainSkill: "Information retrieval, inverted indexes, ranking algorithms",
    signatureQuestion: "How does a search engine find relevant documents in 5 milliseconds over billions of words?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Query latency: < 3.0ms over 100,000 documents",
      "Index build speed: > 50,000 docs/sec",
      "Posting list compression ratio: > 60%",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Inverted Index & Boolean Match", question: "Can you make it work?", focus: "Text tokenization, lowercasing, posting lists (term -> doc_ids), boolean AND/OR queries" },
      { level: 2, stage: "CORE", name: "BM25 Relevance Scoring & Positional Indexing", question: "Do you understand the core mechanism?", focus: "Term Frequency (TF), Inverse Document Frequency (IDF), document length normalization" },
      { level: 3, stage: "HARDEN", name: "Stemming, Stopwords & Unicode Normalization", question: "Does it remain correct under edge cases and failures?", focus: "Porter Stemmer, stopword filtering, punctuation removal, NFC unicode normalization" },
      { level: 4, stage: "SCALE", name: "Concurrent Sharded Index Partitions", question: "Does it handle concurrency, workload and growth?", focus: "Segmented index flushing, parallel shard querying with heap-based top-K merger" },
      { level: 5, stage: "MEASURE", name: "Recall, Precision & Tail Query Latency", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling posting list intersection latency, measuring Mean Reciprocal Rank (MRR)" },
      { level: 6, stage: "OPTIMIZE", name: "Delta Bit-Packing & SIMD Fast-PFOR", question: "Can you make it measurably better?", focus: "Variable-byte integer compression, SIMD-accelerated sorted list intersection" },
    ],
    overview: "Construct a full-text search engine inspired by Apache Lucene. Master inverted index construction, BM25 statistical relevance ranking, phrase queries with positional posting lists, and SIMD posting list compression.",
  },
  {
    number: "18",
    slug: "vector-database",
    title: "Vector Database (HNSW Index)",
    domain: "AI_SYSTEMS",
    domainLabel: "AI Systems",
    inspiredBy: "Milvus, Pinecone, FAISS",
    whatStudentsBuild: "Approximate Nearest Neighbor (ANN) search engine using HNSW graphs",
    mainSkill: "Vector embeddings, high-dimensional geometry, graph search algorithms",
    signatureQuestion: "How do LLMs and search engines find semantic similarities among 1M embedding vectors?",
    difficulty: "Hard",
    status: "ACTIVE",
    benchmarkMetrics: [
      "ANN Recall@10: > 95%",
      "Query throughput: > 5,000 QPS",
      "Cosine distance latency: < 0.2ms per query",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Exact Nearest Neighbors (Brute Force)", question: "Can you make it work?", focus: "High-dimensional vector storage (128-1536 dim), Cosine & Euclidean distance metrics, linear top-K" },
      { level: 2, stage: "CORE", name: "Hierarchical Navigable Small World (HNSW)", question: "Do you understand the core mechanism?", focus: "Multi-layer skip-graph construction, greedy routing on upper layers, beam search on layer 0" },
      { level: 3, stage: "HARDEN", name: "Dynamic Deletions & Disconnected Components", question: "Does it remain correct under edge cases and failures?", focus: "Tombstone markings, graph edge reconnection on node deletion, isolated island recovery" },
      { level: 4, stage: "SCALE", name: "Concurrent Graph Updates & Multi-Index Sharding", question: "Does it handle concurrency, workload and growth?", focus: "Fine-grained node latching during edge insertion, sharded vector partitions, parallel top-K" },
      { level: 5, stage: "MEASURE", name: "Recall vs. QPS Tradeoff Profiling", question: "Can you identify bottlenecks and prove performance?", focus: "Plotting Pareto frontier of Recall@10 against Queries Per Second across efSearch values" },
      { level: 6, stage: "OPTIMIZE", name: "Scalar Quantization & SIMD Dot-Product", question: "Can you make it measurably better?", focus: "Int8 scalar quantization (4x memory reduction), AVX2/AVX-512 vector distance kernels" },
    ],
    overview: "Build the foundational storage and retrieval engine for modern generative AI. Implement Hierarchical Navigable Small World (HNSW) graphs, cosine similarity metrics, scalar quantization, and SIMD hardware acceleration.",
  },
  {
    number: "19",
    slug: "llm-inference",
    title: "LLM Inference Engine & KV Cache",
    domain: "AI_SYSTEMS",
    domainLabel: "AI Systems",
    inspiredBy: "vLLM, Ollama, llama.cpp",
    whatStudentsBuild: "Autoregressive token generator with PagedAttention KV cache and continuous batching",
    mainSkill: "Transformer architectures, KV caching, continuous batching, memory paging",
    signatureQuestion: "Why does LLM generation slow down as conversation history grows, and how do we fix it?",
    difficulty: "Expert",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Time to First Token (TTFT): < 20ms",
      "Inter-Token Latency (ITL): < 5ms",
      "Memory fragmentation reduction: > 80% with PagedAttention",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "Autoregressive Decoder Forward Pass", question: "Can you make it work?", focus: "Token matrix multiplication, softmax temperature sampling, greedy token decoding" },
      { level: 2, stage: "CORE", name: "Key-Value (KV) Cache Manager", question: "Do you understand the core mechanism?", focus: "Eliminating redundant matrix math by caching past key and value projection tensors" },
      { level: 3, stage: "HARDEN", name: "Context Window Overflow & OOM Eviction", question: "Does it remain correct under edge cases and failures?", focus: "Sliding window attention eviction, dynamic context truncation, graceful OOM fallback" },
      { level: 4, stage: "SCALE", name: "PagedAttention & Continuous Batching", question: "Does it handle concurrency, workload and growth?", focus: "Virtual memory paging for KV cache blocks, dynamic request insertion into active batches" },
      { level: 5, stage: "MEASURE", name: "TTFT & Inter-Token Latency (ITL)", question: "Can you identify bottlenecks and prove performance?", focus: "Profiling prefill phase vs decode phase latency, memory bandwidth saturation analysis" },
      { level: 6, stage: "OPTIMIZE", name: "FlashAttention Kernel & Weight Quantization", question: "Can you make it measurably better?", focus: "Tiled softmax online attention without materializing N×N matrix, 4-bit weight unpacker" },
    ],
    overview: "Construct an ultra-fast LLM inference serving engine modeled after vLLM and llama.cpp. Engineer autoregressive decoding, eliminate quadratic attention bottlenecks with PagedAttention KV caches, and support continuous request batching.",
  },
  {
    number: "20",
    slug: "mcp-runtime",
    title: "Model Context Protocol (MCP) Runtime",
    domain: "AI_SYSTEMS",
    domainLabel: "AI Systems",
    inspiredBy: "Anthropic Model Context Protocol, Google Antigravity Sidecars",
    whatStudentsBuild: "Type-safe JSON-RPC 2.0 tool execution runtime with schema validation and isolation",
    mainSkill: "Agent architectures, JSON-RPC, tool sandboxing, protocol dispatch",
    signatureQuestion: "How do autonomous AI agents safely discover and execute system tools in real time?",
    difficulty: "Medium",
    status: "ACTIVE",
    benchmarkMetrics: [
      "Tool dispatch overhead: < 0.8ms",
      "100% schema validation enforcement",
      "Subprocess timeout cancellation: strict 50ms deadline",
    ],
    progressionLevels: [
      { level: 1, stage: "BUILD", name: "JSON-RPC 2.0 Stdio Transport & Tool Discovery", question: "Can you make it work?", focus: "Framing JSON-RPC over stdin/stdout, handling 'tools/list' and 'tools/call' requests" },
      { level: 2, stage: "CORE", name: "Resource Templates & Dynamic Context Providers", question: "Do you understand the core mechanism?", focus: "URI template routing (cpp://, file://), resource read streams, dynamic SCO subscriptions" },
      { level: 3, stage: "HARDEN", name: "Schema Validation & Zombie Subprocess Reaping", question: "Does it remain correct under edge cases and failures?", focus: "JSON Schema parameter enforcement, execution timeouts, SIGKILL on runaway tools" },
      { level: 4, stage: "SCALE", name: "Multi-Agent Parallel Tool Orchestration", question: "Does it handle concurrency, workload and growth?", focus: "Asynchronous task IDs, parallel non-blocking tool execution, request cancellation routing" },
      { level: 5, stage: "MEASURE", name: "Protocol Overhead & Dispatch Profiling", question: "Can you identify bottlenecks and prove performance?", focus: "Measuring JSON serialization serialization tax, dispatch latency percentiles across 10,000 calls" },
      { level: 6, stage: "OPTIMIZE", name: "Zero-Copy JSON Stream Parsing & Fast Dispatch", question: "Can you make it measurably better?", focus: "SIMD-accelerated JSON tokenization, zero-copy buffer passthrough to worker processes" },
    ],
    overview: "Build a production-grade Model Context Protocol (MCP) tool execution runtime that connects LLMs to real-world code execution environments. Implement JSON-RPC 2.0 stdio framing, resource templates, strict schema validation, and sandboxed subprocess execution.",
  },
];

export interface DailyChallengeInfo {
  challenge: CoreChallenge;
  formattedDate: string;
  timeRemaining: string;
  dayIndex: number;
}

export function getDailyChallenge(now: Date = new Date()): DailyChallengeInfo {
  // Epoch: January 1, 2026 UTC
  const epoch = Date.UTC(2026, 0, 1);
  const currentUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const dayIndex = Math.floor((currentUtc - epoch) / (1000 * 60 * 60 * 24));

  // Safe positive modulo indexing across CORE_CHALLENGES
  const index =
    ((dayIndex % CORE_CHALLENGES.length) + CORE_CHALLENGES.length) %
    CORE_CHALLENGES.length;
  const challenge = CORE_CHALLENGES[index];

  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  // Calculate time remaining until next UTC midnight
  const nextMidnightUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  );
  const diffMs = Math.max(0, nextMidnightUtc - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const timeRemaining = `${hours}h ${minutes.toString().padStart(2, "0")}m`;

  return { challenge, formattedDate, timeRemaining, dayIndex };
}

