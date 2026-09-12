# ALGO Systems Engineering Challenges

> Complete inventory of the 20 foundational systems engineering challenges on the ALGO platform.
> Reconstruct production-grade primitives from scratch, profile bottlenecks, and optimize against verified baselines.

---

## The 6-Stage Engineering Methodology

Every challenge in ALGO follows a strict 6-stage progression from initial prototype to production optimization:

| Stage | Name | Guiding Question | Focus |
| :---: | :--- | :--- | :--- |
| **L1** | **BUILD** | *Can you make it work?* | Functional baseline, protocol/CLI parser, core state initialization |
| **L2** | **CORE** | *Do you understand the core mechanism?* | Canonical data structures, memory layout, fundamental algorithm |
| **L3** | **HARDEN** | *Does it remain correct under edge cases?* | Fault tolerance, corrupted state, edge conditions, crash recovery |
| **L4** | **SCALE** | *Does it handle concurrency & growth?* | Resource management, concurrency control, sharding, backpressure |
| **L5** | **MEASURE** | *Can you identify bottlenecks?* | Metrics instrumentation, latency percentiles (p50/p99), profiling |
| **L6** | **OPTIMIZE** | *Can you make it measurably better?* | Cache line alignment, SIMD, lock-free structures, zero-copy I/O |

---

## Master Challenge Directory

| # | Challenge | Domain | Difficulty | Inspired By | Signature Question |
| :-: | :--- | :--- | :-: | :--- | :--- |
| **01** | [Unix Shell](#01-shell) | Core Systems | `Medium` | Bash, Zsh | *How do processes actually spawn and communicate?* |
| **02** | [High-Concurrency HTTP Server](#02-http-server) | Core Systems | `Hard` | Nginx, Envoy | *How many concurrent requests can your server handle?* |
| **03** | [Git Version Control Engine](#03-git) | Core Systems | `Medium` | Git | *How does Git represent history without storing whole duplicate files?* |
| **04** | [Key-Value Storage Engine](#04-kv-store) | Core Systems | `Hard` | Redis, Bitcask, RocksDB | *Can you make your storage engine survive a sudden power cut?* |
| **05** | [Object Storage Engine](#05-object-store) | Core Systems | `Hard` | AWS S3, MinIO | *How do cloud storage providers store petabytes without duplicating data?* |
| **06** | [High-Throughput In-Memory Cache](#06-lru-cache) | Core Systems | `Medium` | Memcached, Caffeine, Redis | *Can you sustain 1,000,000 cache lookups per second under high thread contention?* |
| **07** | [B+ Tree Database Index Engine](#07-database-index) | Core Systems | `Hard` | PostgreSQL, SQLite, InnoDB | *Why doesn't a database scan every row on disk?* |
| **08** | [Container Runtime / Sandbox](#08-container-runtime) | Core Systems | `Expert` | Docker, runc, gVisor | *What actually happens when you run 'docker run'?* |
| **09** | [Distributed Commit Log & Message Queue](#09-message-queue) | Distributed Systems | `Hard` | Apache Kafka, Apache Pulsar | *How do streaming platforms process billions of events a day without falling over?* |
| **10** | [Columnar Log Analytics Engine](#10-log-engine) | Distributed Systems | `Medium` | ClickHouse, Elastic, DuckDB | *How do analytics systems aggregate 100M rows in milliseconds?* |
| **11** | [Distributed Rate Limiter](#11-rate-limiter) | Distributed Systems | `Medium` | Stripe API, Cloudflare | *How do cloud APIs enforce 10,000 req/sec limits without introducing latency?* |
| **12** | [Reverse Proxy & Load Balancer](#12-load-balancer) | Distributed Systems | `Hard` | HAProxy, Nginx, Envoy | *How do cloud proxies distribute 1M connections fairly across backend servers?* |
| **13** | [Distributed Task Scheduler](#13-task-scheduler) | Distributed Systems | `Medium` | Kubernetes, Temporal, Celery | *How do orchestration engines guarantee task execution despite worker crashes?* |
| **14** | [Distributed Consensus Engine (Raft)](#14-distributed-consensus) | Distributed Systems | `Expert` | etcd, Raft, Paxos | *How do distributed nodes agree on a single history across an unreliable network?* |
| **15** | [Service Discovery & DNS Registry](#15-service-discovery) | Distributed Systems | `Hard` | Consul, CoreDNS, Eureka | *How do microservices locate each other instantly as containers scale up and down?* |
| **16** | [Distributed Object Storage with Erasure Coding](#16-distributed-object-storage) | Distributed Systems | `Expert` | Ceph, MinIO Distributed | *How can a storage cluster survive losing 4 disks simultaneously without losing a byte?* |
| **17** | [Full-Text Search Engine](#17-search-engine) | AI Systems | `Medium` | Lucene, Elasticsearch | *How does a search engine find relevant documents in 5 milliseconds over billions of words?* |
| **18** | [Vector Database (HNSW Index)](#18-vector-database) | AI Systems | `Hard` | Milvus, Pinecone, FAISS | *How do LLMs and search engines find semantic similarities among 1M embedding vectors?* |
| **19** | [LLM Inference Engine & KV Cache](#19-llm-inference) | AI Systems | `Expert` | vLLM, Ollama, llama.cpp | *Why does LLM generation slow down as conversation history grows, and how do we fix it?* |
| **20** | [Model Context Protocol (MCP) Runtime](#20-mcp-runtime) | AI Systems | `Medium` | Anthropic Model Context Protocol, Google Antigravity Sidecars | *How do autonomous AI agents safely discover and execute system tools in real time?* |

---

## Domain 1: Core Systems (01 – 08)

OS primitives, storage engines, runtime environments, and low-level memory management.

---

### 01. Unix Shell <a id="01-shell"></a>

- **Slug**: `shell`
- **Domain**: Core Systems
- **Difficulty**: `Medium`
- **Inspired By**: Bash, Zsh
- **Core Skills**: Process management, syscalls, IPC, signals
- **Signature Question**: *How do processes actually spawn and communicate?*

#### Overview

Build an interactive Unix command interpreter from scratch. Master the fundamental operating system abstractions: process address spaces, fork/exec lifecycle, pipe file descriptors, signal traps, and zombie process cleanup.

#### What You Build

Interactive command interpreter with process control and pipelines

#### Target Benchmark Metrics

- Process spawn overhead: < 1.5ms
- Pipeline throughput: > 500 MB/s
- Zero orphan or zombie processes

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Interactive REPL & Builtins** | *Can you make it work?* | Line reading, tokenization, cd/pwd/exit builtins |
| **L2** | `CORE` | **Process Fork & Exec** | *Do you understand the core mechanism?* | fork(), execvp(), PATH resolution, exit status capture |
| **L3** | `HARDEN` | **Signal Handling & Zombie Reaping** | *Does it remain correct under edge cases and failures?* | SIGINT, SIGTSTP, waitpid(WNOHANG), non-blocking zombie reaping |
| **L4** | `SCALE` | **Multi-stage Pipelines & Redirection** | *Does it handle concurrency, workload and growth?* | pipe(), dup2(), file redirection (<, >, >>), multi-stage pipeline coordination |
| **L5** | `MEASURE` | **Syscall & Latency Profiling** | *Can you identify bottlenecks and prove performance?* | Profiling fork latency, pipe buffer throughput, memory leaks across 10,000 commands |
| **L6** | `OPTIMIZE` | **Zero-Allocation Command Dispatch** | *Can you make it measurably better?* | Buffer recycling, fast-path builtin table, zero heap allocations on hot path |

---

### 02. High-Concurrency HTTP Server <a id="02-http-server"></a>

- **Slug**: `http-server`
- **Domain**: Core Systems
- **Difficulty**: `Hard`
- **Inspired By**: Nginx, Envoy
- **Core Skills**: Networking, socket I/O, event loops
- **Signature Question**: *How many concurrent requests can your server handle?*

#### Overview

Construct a high-performance HTTP/1.1 server from raw POSIX byte streams. Progress from basic synchronous socket handling to an asynchronous event-driven reactor capable of serving 50,000+ requests per second.

#### What You Build

RFC 7230 compliant non-blocking HTTP/1.1 web server

#### Target Benchmark Metrics

- Target throughput: > 50,000 req/s
- p99 latency: < 1.0ms
- C10K connection saturation without drop

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Socket Listener & Static HTTP/1.1** | *Can you make it work?* | TCP socket binding, raw request parsing, 200 OK and 404 responses |
| **L2** | `CORE` | **Radix Trie Router & Header Subsystem** | *Do you understand the core mechanism?* | Fast path matching, dynamic :param extraction, case-insensitive headers |
| **L3** | `HARDEN` | **Malformed Framing & Slowloris Defense** | *Does it remain correct under edge cases and failures?* | Chunked transfer parsing, Content-Length validation, read timeouts against slow clients |
| **L4** | `SCALE` | **Non-Blocking Event Loop (epoll / select)** | *Does it handle concurrency, workload and growth?* | I/O multiplexing, persistent keep-alive connection pooling, concurrent socket states |
| **L5** | `MEASURE` | **Connection Saturation & Tail Latency** | *Can you identify bottlenecks and prove performance?* | Profiling socket buffer drains, measuring p50/p95/p99 under 5,000 concurrent streams |
| **L6** | `OPTIMIZE` | **Zero-Copy Sendfile & Pipeline Batching** | *Can you make it measurably better?* | Kernel bypass sendfile, vectorized writev, zero-allocation header buffer rings |

---

### 03. Git Version Control Engine <a id="03-git"></a>

- **Slug**: `git`
- **Domain**: Core Systems
- **Difficulty**: `Medium`
- **Inspired By**: Git
- **Core Skills**: Content addressing, SHA hashing, graph algorithms
- **Signature Question**: *How does Git represent history without storing whole duplicate files?*

#### Overview

Build Git from first principles. Implement content-addressed storage, blob and tree serialization, commit DAG traversal, and packfile delta compression.

#### What You Build

Content-addressed object database and Directed Acyclic Graph (DAG)

#### Target Benchmark Metrics

- Commit creation: < 2ms
- Tree diffing over 50,000 files: < 25ms
- Packfile compression ratio: > 60%

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Blob Storage & SHA-1 Hashing** | *Can you make it work?* | Content-addressed storage, header framing ('blob <size>\0'), zlib compression |
| **L2** | `CORE` | **Tree Hierarchy & Commit DAG** | *Do you understand the core mechanism?* | Tree objects with mode/filename/hash tuples, commit objects with parent lineage |
| **L3** | `HARDEN` | **Object Integrity & Corruption Recovery** | *Does it remain correct under edge cases and failures?* | fsck-style SHA hash verification, dangling pointer detection, cycle detection |
| **L4** | `SCALE` | **Fast Tree Diffing & Branching** | *Does it handle concurrency, workload and growth?* | Two-pointer tree diffing in O(differences) time, refs/heads resolution, merge base lookup |
| **L5** | `MEASURE` | **Repository Footprint & Graph Traversal** | *Can you identify bottlenecks and prove performance?* | Profiling loose object disk footprint, measuring ancestor reachability latency on 10,000 commits |
| **L6** | `OPTIMIZE` | **Delta Compression & Packfile Format** | *Can you make it measurably better?* | Sliding-window delta compression (copy/insert opcodes), binary packfile index generation |

---

### 04. Key-Value Storage Engine <a id="04-kv-store"></a>

- **Slug**: `kv-store`
- **Domain**: Core Systems
- **Difficulty**: `Hard`
- **Inspired By**: Redis, Bitcask, RocksDB
- **Core Skills**: Data structures, memory management, durability, crash recovery
- **Signature Question**: *Can you make your storage engine survive a sudden power cut?*

#### Overview

Engineer an in-memory key-value storage engine inspired by Redis and Bitcask. Progress from simple dictionary lookups to append-only write-ahead logging (WAL), crash recovery after SIGKILL, concurrent striped locking, and background log compaction.

#### What You Build

In-memory storage engine with Write-Ahead Logging (WAL) and compaction

#### Target Benchmark Metrics

- Standardized target: > 100,000 ops/sec
- p99 latency: < 0.20ms
- 256MB hard memory boundary

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **In-Memory Key-Value Protocol** | *Can you make it work?* | Core command parsing (SET, GET, DEL, EXISTS), dictionary lookup, error handling |
| **L2** | `CORE` | **Append-Only Log (WAL) & Keydir Index** | *Do you understand the core mechanism?* | Sequential disk log framing with CRC32 checksums, in-memory Bitcask offset index |
| **L3** | `HARDEN` | **Crash Recovery & Partial Write Recovery** | *Does it remain correct under edge cases and failures?* | Deterministic recovery after abrupt SIGKILL, corrupted tail record truncation |
| **L4** | `SCALE` | **Concurrent Striped Locks & Multi-threading** | *Does it handle concurrency, workload and growth?* | Fine-grained striped locking, concurrent reads, write lock serialization |
| **L5** | `MEASURE` | **Throughput Benchmarking & Tail Latency** | *Can you identify bottlenecks and prove performance?* | Profiling lock contention, measuring read/write ratios, p50/p95/p99 under 100K ops/s |
| **L6** | `OPTIMIZE` | **Log Compaction & Zero-Copy Deserialization** | *Can you make it measurably better?* | Background log merging/compaction, dead record elimination, direct memory mapped I/O |

---

### 05. Object Storage Engine <a id="05-object-store"></a>

- **Slug**: `object-store`
- **Domain**: Core Systems
- **Difficulty**: `Hard`
- **Inspired By**: AWS S3, MinIO
- **Core Skills**: Storage systems, chunking, deduplication, bit-rot detection
- **Signature Question**: *How do cloud storage providers store petabytes without duplicating data?*

#### Overview

Build an industrial blob storage engine modeled after AWS S3 and MinIO. Implement content-defined chunking with deduplication, multipart parallel uploads, bit-rot scrubbing, and high-throughput streaming.

#### What You Build

Content-addressed blob store with chunk deduplication and integrity scrubbing

#### Target Benchmark Metrics

- Read throughput: > 800 MB/s
- Deduplication ratio: > 45% on real workloads
- Zero silent data corruption (bit rot)

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Content-Addressed Blob Storage** | *Can you make it work?* | PUT/GET/DELETE object API, two-level directory sharding based on SHA-256 hash |
| **L2** | `CORE` | **Rabin Fingerprinting & Deduplication** | *Do you understand the core mechanism?* | Content-defined chunking (CDC), rolling hash boundaries, block dedup manifest |
| **L3** | `HARDEN` | **Bit Rot Detection & Background Scrubbing** | *Does it remain correct under edge cases and failures?* | End-to-end CRC64/BLAKE3 verification, silent corruption scrubbing, quarantine isolation |
| **L4** | `SCALE` | **Concurrent Multipart Uploads** | *Does it handle concurrency, workload and growth?* | Parallel chunk uploads, part assembly verification, concurrent read stream workers |
| **L5** | `MEASURE` | **IOPS Saturation & Write Amplification** | *Can you identify bottlenecks and prove performance?* | Measuring chunking CPU overhead vs storage savings, disk write amplification profiling |
| **L6** | `OPTIMIZE` | **Direct I/O & Block Coalescing** | *Can you make it measurably better?* | O_DIRECT aligned sector writes, small object inlining, zero-copy buffer pooling |

---

### 06. High-Throughput In-Memory Cache <a id="06-lru-cache"></a>

- **Slug**: `lru-cache`
- **Domain**: Core Systems
- **Difficulty**: `Medium`
- **Inspired By**: Memcached, Caffeine, Redis
- **Core Skills**: Memory architectures, lock-free concurrency, eviction algorithms
- **Signature Question**: *Can you sustain 1,000,000 cache lookups per second under high thread contention?*

#### Overview

Construct an ultra-low-latency in-memory cache inspired by Memcached and Caffeine. Master O(1) double-linked list wiring, TinyLFU frequency sketches, sharded locks, and lock-free read buffer batching.

#### What You Build

O(1) concurrent cache with frequency tracking and eviction

#### Target Benchmark Metrics

- Target throughput: > 500,000 ops/sec
- Cache hit ratio: > 85% under zipfian distribution
- Bounded memory limit strictly respected

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **O(1) Hash Table + Doubly-Linked List** | *Can you make it work?* | Fast key lookups with pointer re-wiring for least-recently-used tracking |
| **L2** | `CORE` | **Frequency Tracking (TinyLFU / ARC)** | *Do you understand the core mechanism?* | Count-Min Sketch frequency estimation, adaptive replacement between recency and frequency |
| **L3** | `HARDEN` | **Eviction Under Hard Memory Limits** | *Does it remain correct under edge cases and failures?* | Strict byte-level budget enforcement, TTL expiry sweeps, zombie key eviction |
| **L4** | `SCALE` | **Sharded Concurrent Hash Ring** | *Does it handle concurrency, workload and growth?* | Partitioned locking across power-of-two shards, lock contention minimization |
| **L5** | `MEASURE` | **Hit Ratio & Tail Latency Profiling** | *Can you identify bottlenecks and prove performance?* | Benchmarking Zipfian request skew, measuring hit ratios and lock wait times |
| **L6** | `OPTIMIZE` | **Lock-Free Ring Buffer & SIMD Sieve** | *Can you make it measurably better?* | Batched eviction queues, thread-local read buffers, cache-line aligned node packing |

---

### 07. B+ Tree Database Index Engine <a id="07-database-index"></a>

- **Slug**: `database-index`
- **Domain**: Core Systems
- **Difficulty**: `Hard`
- **Inspired By**: PostgreSQL, SQLite, InnoDB
- **Core Skills**: Storage engines, disk paging, tree algorithms, buffer pools
- **Signature Question**: *Why doesn't a database scan every row on disk?*

#### Overview

Build the foundational indexing engine that powers every relational database. Design 4KB slotted pages, implement balanced tree splits and leaf linking, engineer a memory buffer pool, and achieve sub-millisecond lookups over millions of keys.

#### What You Build

Disk-backed slotted-page B+ Tree with buffer pool management

#### Target Benchmark Metrics

- Lookup latency: < 0.05ms on 10M rows
- Buffer pool hit ratio: > 95%
- Page utilization: > 70% after random deletes

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Slotted Page Format & 4KB Boundaries** | *Can you make it work?* | Hardware page alignment, slotted offset arrays, variable-length key/payload layout |
| **L2** | `CORE` | **B+ Tree Node Splits & Leaf Linking** | *Do you understand the core mechanism?* | Internal navigation nodes, leaf node splits with right-sibling pointers for range queries |
| **L3** | `HARDEN` | **Underflow Merges & Redistribution** | *Does it remain correct under edge cases and failures?* | Node balance invariant preservation, deletion borrowing, sibling page merging |
| **L4** | `SCALE` | **Buffer Pool Manager with LRU/CLOCK** | *Does it handle concurrency, workload and growth?* | Page frame pinning/unpinning, dirty page flushes, bounded memory caching |
| **L5** | `MEASURE` | **Disk I/O vs Memory Miss Benchmarking** | *Can you identify bottlenecks and prove performance?* | Measuring disk read amplification, branch prediction misses, and range scan IOPS |
| **L6** | `OPTIMIZE` | **Prefix Key Compression & Latch Crabbing** | *Can you make it measurably better?* | Truncated key indexing, optimistic concurrent latch crabbing for high write throughput |

---

### 08. Container Runtime / Sandbox <a id="08-container-runtime"></a>

- **Slug**: `container-runtime`
- **Domain**: Core Systems
- **Difficulty**: `Expert`
- **Inspired By**: Docker, runc, gVisor
- **Core Skills**: OS virtualization, Linux kernel primitives, security isolation
- **Signature Question**: *What actually happens when you run 'docker run'?*

#### Overview

Construct an isolated container runtime from Linux kernel primitives. Implement process isolation with namespaces, secure rootfs containment with pivot_root, resource guardrails with cgroups v2, and sub-10ms ephemeral sandbox execution.

#### What You Build

Linux container execution engine using namespaces, cgroups, and rootfs pivot

#### Target Benchmark Metrics

- Container startup cold-boot: < 15ms
- Memory limit enforcement: strict 0 byte overshoot
- 100% root filesystem jailbreak containment

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Process Isolation with Linux Namespaces** | *Can you make it work?* | clone() with CLONE_NEWPID, CLONE_NEWUTS, isolated hostname and PID 1 |
| **L2** | `CORE` | **Filesystem Isolation & Pivot Root** | *Do you understand the core mechanism?* | chroot vs pivot_root, mount namespace (CLONE_NEWNS), read-only rootfs mount |
| **L3** | `HARDEN` | **Cgroups V2 Resource Constraints** | *Does it remain correct under edge cases and failures?* | Memory max boundaries, CPU quota throttling, pids.max fork-bomb prevention |
| **L4** | `SCALE` | **Multi-Tenant Parallel Sandbox Spawning** | *Does it handle concurrency, workload and growth?* | Concurrent ephemeral container spawning, unique bridge networking, IP allocation |
| **L5** | `MEASURE` | **Cold-Start Microbenchmarks & Latency** | *Can you identify bottlenecks and prove performance?* | Measuring mount overhead, namespace creation latency, context switch penalties |
| **L6** | `OPTIMIZE` | **Pre-Forked Pool & Copy-on-Write Roots** | *Can you make it measurably better?* | Pre-initialized namespace worker pools, CoW overlay snapshotting, sub-5ms boot |

---

## Domain 2: Distributed Systems (09 – 16)

Consensus, high-throughput streaming, sharding, gossip topologies, and fault tolerance across untrusted networks.

---

### 09. Distributed Commit Log & Message Queue <a id="09-message-queue"></a>

- **Slug**: `message-queue`
- **Domain**: Distributed Systems
- **Difficulty**: `Hard`
- **Inspired By**: Apache Kafka, Apache Pulsar
- **Core Skills**: Streaming data, sequential I/O, offset semantics, consumer groups
- **Signature Question**: *How do streaming platforms process billions of events a day without falling over?*

#### Overview

Construct an append-only commit log and distributed streaming platform inspired by Kafka. Master binary log segmenting, sparse indexing, partition assignment, and zero-copy PageCache streaming.

#### What You Build

Segmented commit log with partitioned consumer groups

#### Target Benchmark Metrics

- Ingestion rate: > 100,000 messages/sec
- Zero message loss on uncommitted offsets
- Consumer rebalance latency: < 50ms

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Append-Only Segment File & Binary Offsets** | *Can you make it work?* | Sequential 64-bit monotonically increasing offsets, binary frame formatting |
| **L2** | `CORE` | **Topic Partitions & Index Spans** | *Do you understand the core mechanism?* | Hash-partitioned topics, sparse index file (.index) for O(1) byte offset lookup |
| **L3** | `HARDEN` | **Consumer Offset Tracking & At-Least-Once** | *Does it remain correct under edge cases and failures?* | Committed offset durability, re-reading from offset on worker crash, idempotency keys |
| **L4** | `SCALE` | **Consumer Group Coordination & Rebalance** | *Does it handle concurrency, workload and growth?* | Dynamic partition assignment across active consumers, heartbeat failure detection |
| **L5** | `MEASURE` | **End-to-End Consumer Lag & Disk Saturation** | *Can you identify bottlenecks and prove performance?* | Profiling PageCache dirty ratios, measuring consumer lag under backpressure |
| **L6** | `OPTIMIZE` | **Zero-Copy PageCache Splicing (sendfile)** | *Can you make it measurably better?* | Direct kernel-space network transfer via sendfile/splice, batch write coalescing |

---

### 10. Columnar Log Analytics Engine <a id="10-log-engine"></a>

- **Slug**: `log-engine`
- **Domain**: Distributed Systems
- **Difficulty**: `Medium`
- **Inspired By**: ClickHouse, Elastic, DuckDB
- **Core Skills**: Columnar storage, data compression, vectorized execution
- **Signature Question**: *How do analytics systems aggregate 100M rows in milliseconds?*

#### Overview

Build a columnar log storage and query engine inspired by ClickHouse and DuckDB. Master column-oriented memory layouts, dictionary compression, min/max sparse indexes, and vectorized filter evaluation.

#### What You Build

Columnar chunk store with vectorized filter execution

#### Target Benchmark Metrics

- Scan speed: > 10,000,000 rows/sec
- Compression ratio: > 70% with run-length and dictionary encoding
- Query response: < 15ms on aggregation

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Structured Ingestion & Field Tokenizer** | *Can you make it work?* | Parsing raw log streams (JSON, Common Log), schema extraction, row array storage |
| **L2** | `CORE` | **Columnar Chunk Storage & Dictionary Encoding** | *Do you understand the core mechanism?* | Transposing row layouts into column arrays, integer dictionary encoding for strings |
| **L3** | `HARDEN` | **Malformed Records & Out-of-Order Timestamps** | *Does it remain correct under edge cases and failures?* | Quarantine invalid schemas, time-window bucket re-ordering, non-destructive parsing |
| **L4** | `SCALE` | **Parallel Partition Scans & MapReduce Filters** | *Does it handle concurrency, workload and growth?* | Chunk-level multi-threading, min/max pruning (skip indexes), parallel aggregations |
| **L5** | `MEASURE` | **Memory Bandwidth & Cache Misses** | *Can you identify bottlenecks and prove performance?* | Measuring memory bus utilization, L1/L2 data cache hit rates during column scans |
| **L6** | `OPTIMIZE` | **Vectorized SIMD Filtering & Bit-Packing** | *Can you make it measurably better?* | SIMD comparisons over 256-bit vectors, branchless filter selection masks |

---

### 11. Distributed Rate Limiter <a id="11-rate-limiter"></a>

- **Slug**: `rate-limiter`
- **Domain**: Distributed Systems
- **Difficulty**: `Medium`
- **Inspired By**: Stripe API, Cloudflare
- **Core Skills**: Traffic shaping, atomic operations, distributed synchronization
- **Signature Question**: *How do cloud APIs enforce 10,000 req/sec limits without introducing latency?*

#### Overview

Design a high-throughput rate limiter inspired by Stripe and Cloudflare. Implement token bucket mathematics, sliding window aggregations, race-free atomic updates, and distributed synchronization with sub-20µs latency.

#### What You Build

Low-overhead token bucket and sliding window rate limiter

#### Target Benchmark Metrics

- Decision latency: < 0.02ms (sub-20 microseconds)
- Zero false-positive drops under burst allowance
- Distributed synchronization drift: < 2%

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Token Bucket Algorithm** | *Can you make it work?* | Capacity, refill rate, atomic balance consumption, rejecting excess tokens |
| **L2** | `CORE` | **Sliding Window Log & Counter** | *Do you understand the core mechanism?* | Smooth window boundary transitions, sub-second bucket precision, burst dampening |
| **L3** | `HARDEN` | **Clock Skew & Race Condition Defense** | *Does it remain correct under edge cases and failures?* | Monotonic clock synchronization, CAS atomic updates, handling leap seconds |
| **L4** | `SCALE` | **Distributed Counter Cluster (Redis Protocol)** | *Does it handle concurrency, workload and growth?* | Multi-node token sharing, local batch allocation to reduce cross-network roundtrips |
| **L5** | `MEASURE` | **False Rejection Rate & Jitter Analysis** | *Can you identify bottlenecks and prove performance?* | Profiling decision latency percentiles, tracking dropped legitimate traffic under spike |
| **L6** | `OPTIMIZE` | **Lock-Free Ring Buffer & Probabilistic Limiting** | *Can you make it measurably better?* | Single-atomic-variable packing, lock-free local thread-cached counters |

---

### 12. Reverse Proxy & Load Balancer <a id="12-load-balancer"></a>

- **Slug**: `load-balancer`
- **Domain**: Distributed Systems
- **Difficulty**: `Hard`
- **Inspired By**: HAProxy, Nginx, Envoy
- **Core Skills**: Networking, load balancing, proxying, failure detection
- **Signature Question**: *How do cloud proxies distribute 1M connections fairly across backend servers?*

#### Overview

Build a Layer 4/7 reverse proxy and load balancer modeled after HAProxy and Envoy. Implement dynamic routing algorithms, Ketama consistent hashing, automated circuit breaker failover, and zero-copy packet forwarding.

#### What You Build

Layer 4/7 reverse proxy with active health checks and consistent hashing

#### Target Benchmark Metrics

- Proxy latency added: < 0.15ms
- Backend failover detection: < 200ms
- Equal request distribution: std-dev < 3%

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Round Robin & Least Connections** | *Can you make it work?* | Reverse proxy forwarding, socket splicing, balanced round-robin routing |
| **L2** | `CORE` | **Consistent Hashing Ring & Virtual Nodes** | *Do you understand the core mechanism?* | Ketama hash ring, virtual node distribution, minimal cache churn on node add/remove |
| **L3** | `HARDEN` | **Active Health Checking & Circuit Breaking** | *Does it remain correct under edge cases and failures?* | Periodic TCP/HTTP probes, consecutive failure ejection, exponential backoff re-entry |
| **L4** | `SCALE` | **Epoll Event Reactor & High Connection Pool** | *Does it handle concurrency, workload and growth?* | Non-blocking bidirectional forwarding, upstream connection pooling, backpressure handling |
| **L5** | `MEASURE` | **Backend Skew & Connection Latency Profiling** | *Can you identify bottlenecks and prove performance?* | Measuring p99 latency overhead introduced by proxy, tracking traffic skew across nodes |
| **L6** | `OPTIMIZE` | **Maglev Consistent Hashing & Zero-Copy Forward** | *Can you make it measurably better?* | Google Maglev lookup table, splice/vmsplice zero-copy socket passthrough |

---

### 13. Distributed Task Scheduler <a id="13-task-scheduler"></a>

- **Slug**: `task-scheduler`
- **Domain**: Distributed Systems
- **Difficulty**: `Medium`
- **Inspired By**: Kubernetes, Temporal, Celery
- **Core Skills**: Scheduling algorithms, state machines, fault tolerance
- **Signature Question**: *How do orchestration engines guarantee task execution despite worker crashes?*

#### Overview

Construct a fault-tolerant task scheduler inspired by Kubernetes and Temporal. Master priority queues, hierarchical timing wheels for delayed jobs, exponential backoff retries, and work-stealing thread pools.

#### What You Build

Distributed job runner with priority queues, cron parsing, and work stealing

#### Target Benchmark Metrics

- Task dispatch latency: < 1.0ms
- Zero duplicate executions on worker death
- Work stealing balance efficiency: > 90%

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Priority Queue & Worker Thread Pool** | *Can you make it work?* | Binary min-heap priority queue, worker thread synchronization, task execution |
| **L2** | `CORE` | **Delayed Jobs & Distributed Cron Parser** | *Do you understand the core mechanism?* | Time-wheel / timer-heap delayed execution, 5-field cron expression parsing |
| **L3** | `HARDEN` | **Dead Letter Queue & Exponential Backoff** | *Does it remain correct under edge cases and failures?* | Worker crash heartbeat monitoring, automatic task lease reclamation, DLQ routing |
| **L4** | `SCALE` | **Chase-Lev Work Stealing Thread Pools** | *Does it handle concurrency, workload and growth?* | Per-thread double-ended queues (deques), lock-free work stealing from victim threads |
| **L5** | `MEASURE` | **Scheduling Jitter & Worker Utilization** | *Can you identify bottlenecks and prove performance?* | Measuring task execution drift from scheduled time, tracking CPU idle percentage |
| **L6** | `OPTIMIZE` | **Hierarchical Timing Wheels & Lock-Free Queue** | *Can you make it measurably better?* | O(1) insertion/deletion hashed timing wheels, lock-free MPMC dispatch queues |

---

### 14. Distributed Consensus Engine (Raft) <a id="14-distributed-consensus"></a>

- **Slug**: `distributed-consensus`
- **Domain**: Distributed Systems
- **Difficulty**: `Expert`
- **Inspired By**: etcd, Raft, Paxos
- **Core Skills**: Consensus protocols, state replication, distributed state machines, network partitions
- **Signature Question**: *How do distributed nodes agree on a single history across an unreliable network?*

#### Overview

Implement the Raft consensus algorithm that underpins modern cloud infrastructure like etcd and Kubernetes. Master leader elections, quorum replicated state machines, partition healing, and log compaction snapshots.

#### What You Build

Fault-tolerant replicated state machine using the Raft consensus protocol

#### Target Benchmark Metrics

- Leader election recovery: < 150ms after leader crash
- Log commit latency: < 5ms across 3-node cluster
- Zero split-brain state divergences

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Leader Election & Heartbeat Protocol** | *Can you make it work?* | Randomized election timeouts, RequestVote RPC, heartbeats, term transitions |
| **L2** | `CORE` | **Log Replication & State Machine Commit** | *Do you understand the core mechanism?* | AppendEntries RPC, log consistency invariants, quorum majority commit index update |
| **L3** | `HARDEN` | **Network Partitions & Split-Brain Mitigation** | *Does it remain correct under edge cases and failures?* | Majority quorum validation, uncommitted entry overwrite on rejoined partition |
| **L4** | `SCALE` | **Cluster Membership Changes & Log Compaction** | *Does it handle concurrency, workload and growth?* | Joint consensus configuration change, snapshotting state machine, log truncation |
| **L5** | `MEASURE` | **Election Convergence & Replication Lag** | *Can you identify bottlenecks and prove performance?* | Measuring election duration under packet loss, tracking leader commit latency percentiles |
| **L6** | `OPTIMIZE` | **Pipelined Log Replication & Batching** | *Can you make it measurably better?* | Asynchronous log pipelining, batching client commands, read-index linearizable queries |

---

### 15. Service Discovery & DNS Registry <a id="15-service-discovery"></a>

- **Slug**: `service-discovery`
- **Domain**: Distributed Systems
- **Difficulty**: `Hard`
- **Inspired By**: Consul, CoreDNS, Eureka
- **Core Skills**: DNS protocols, gossip protocols (SWIM), service registries, health monitoring
- **Signature Question**: *How do microservices locate each other instantly as containers scale up and down?*

#### Overview

Build a dynamic service discovery engine and DNS server inspired by HashiCorp Consul and CoreDNS. Implement RFC 1035 binary DNS response framing, SWIM gossip failure detection, and sub-millisecond route resolution.

#### What You Build

Dynamic service catalog with DNS server interface and gossip protocol

#### Target Benchmark Metrics

- DNS resolution latency: < 0.5ms
- Node failure detection: < 2.0s across 50 nodes
- Zero stale IP records returned during rolling deploys

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Service Registry & TTL Heartbeat Monitor** | *Can you make it work?* | Registration API (service name, IP, port, tags), TTL heartbeat refresh, expired node reaping |
| **L2** | `CORE` | **RFC 1035 UDP DNS Server** | *Do you understand the core mechanism?* | Raw UDP DNS query parsing, A/SRV record binary response generation, round-robin resolution |
| **L3** | `HARDEN` | **Flapping Node Damping & Split-Horizon DNS** | *Does it remain correct under edge cases and failures?* | Hysteresis damping for rapidly failing nodes, health check failure thresholds |
| **L4** | `SCALE` | **SWIM Gossip Protocol Node Membership** | *Does it handle concurrency, workload and growth?* | Decentralized failure detection via random ping/indirect ping, suspicion timers |
| **L5** | `MEASURE` | **Convergence Time & DNS Latency Profiling** | *Can you identify bottlenecks and prove performance?* | Measuring gossip cluster convergence speed across 50 nodes, DNS query throughput |
| **L6** | `OPTIMIZE` | **Lock-Free Routing Tables & UDP Zero-Copy** | *Can you make it measurably better?* | Atomic snapshot routing tables for lock-free reads, recvmmsg batch socket processing |

---

### 16. Distributed Object Storage with Erasure Coding <a id="16-distributed-object-storage"></a>

- **Slug**: `distributed-object-storage`
- **Domain**: Distributed Systems
- **Difficulty**: `Expert`
- **Inspired By**: Ceph, MinIO Distributed
- **Core Skills**: Erasure coding, Galois field arithmetic, cluster replication, self-healing
- **Signature Question**: *How can a storage cluster survive losing 4 disks simultaneously without losing a byte?*

#### Overview

Engineer a high-durability distributed storage cluster inspired by Ceph and MinIO. Implement Reed-Solomon erasure coding using Galois field arithmetic, automated background self-healing, and parallel shard streaming.

#### What You Build

Multi-node distributed storage cluster with Reed-Solomon erasure coding

#### Target Benchmark Metrics

- Write throughput across 8 nodes: > 600 MB/s
- Survives 4 node simultaneous death with 100% data recovery
- Reconstruction speed: > 200 MB/s

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Multi-Node Sharded Placement** | *Can you make it work?* | Consistent hashing across storage nodes, node chunk placement, metadata indexing |
| **L2** | `CORE` | **Reed-Solomon Erasure Coding (4+2)** | *Do you understand the core mechanism?* | Galois field GF(2^8) matrix multiplication, splitting data into 4 data + 2 parity shards |
| **L3** | `HARDEN` | **Lost Node Reconstruction & Self-Healing** | *Does it remain correct under edge cases and failures?* | Detecting missing shards, inverting Cauchy matrix to reconstruct corrupted data in memory |
| **L4** | `SCALE` | **Parallel Multi-Node Chunk Streaming** | *Does it handle concurrency, workload and growth?* | Asynchronous shard streaming to 8 nodes concurrently, handling slow-node tail latency |
| **L5** | `MEASURE` | **Erasure Math Overhead & Network Egress** | *Can you identify bottlenecks and prove performance?* | Profiling CPU matrix multiplication time vs network I/O, measuring repair bandwidth |
| **L6** | `OPTIMIZE` | **SIMD Galois Field Arithmetic & Zero-Copy** | *Can you make it measurably better?* | AVX2/NEON vector instructions for GF(2^8) arithmetic, zero-copy socket splices |

---

## Domain 3: AI Systems (17 – 20)

Inverted text indexes, high-dimensional vector search, LLM inference acceleration, and agent sandboxing.

---

### 17. Full-Text Search Engine <a id="17-search-engine"></a>

- **Slug**: `search-engine`
- **Domain**: AI Systems
- **Difficulty**: `Medium`
- **Inspired By**: Lucene, Elasticsearch
- **Core Skills**: Information retrieval, inverted indexes, ranking algorithms
- **Signature Question**: *How does a search engine find relevant documents in 5 milliseconds over billions of words?*

#### Overview

Construct a full-text search engine inspired by Apache Lucene. Master inverted index construction, BM25 statistical relevance ranking, phrase queries with positional posting lists, and SIMD posting list compression.

#### What You Build

Inverted index with BM25 relevance ranking and positional scoring

#### Target Benchmark Metrics

- Query latency: < 3.0ms over 100,000 documents
- Index build speed: > 50,000 docs/sec
- Posting list compression ratio: > 60%

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Inverted Index & Boolean Match** | *Can you make it work?* | Text tokenization, lowercasing, posting lists (term -> doc_ids), boolean AND/OR queries |
| **L2** | `CORE` | **BM25 Relevance Scoring & Positional Indexing** | *Do you understand the core mechanism?* | Term Frequency (TF), Inverse Document Frequency (IDF), document length normalization |
| **L3** | `HARDEN` | **Stemming, Stopwords & Unicode Normalization** | *Does it remain correct under edge cases and failures?* | Porter Stemmer, stopword filtering, punctuation removal, NFC unicode normalization |
| **L4** | `SCALE` | **Concurrent Sharded Index Partitions** | *Does it handle concurrency, workload and growth?* | Segmented index flushing, parallel shard querying with heap-based top-K merger |
| **L5** | `MEASURE` | **Recall, Precision & Tail Query Latency** | *Can you identify bottlenecks and prove performance?* | Profiling posting list intersection latency, measuring Mean Reciprocal Rank (MRR) |
| **L6** | `OPTIMIZE` | **Delta Bit-Packing & SIMD Fast-PFOR** | *Can you make it measurably better?* | Variable-byte integer compression, SIMD-accelerated sorted list intersection |

---

### 18. Vector Database (HNSW Index) <a id="18-vector-database"></a>

- **Slug**: `vector-database`
- **Domain**: AI Systems
- **Difficulty**: `Hard`
- **Inspired By**: Milvus, Pinecone, FAISS
- **Core Skills**: Vector embeddings, high-dimensional geometry, graph search algorithms
- **Signature Question**: *How do LLMs and search engines find semantic similarities among 1M embedding vectors?*

#### Overview

Build the foundational storage and retrieval engine for modern generative AI. Implement Hierarchical Navigable Small World (HNSW) graphs, cosine similarity metrics, scalar quantization, and SIMD hardware acceleration.

#### What You Build

Approximate Nearest Neighbor (ANN) search engine using HNSW graphs

#### Target Benchmark Metrics

- ANN Recall@10: > 95%
- Query throughput: > 5,000 QPS
- Cosine distance latency: < 0.2ms per query

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Exact Nearest Neighbors (Brute Force)** | *Can you make it work?* | High-dimensional vector storage (128-1536 dim), Cosine & Euclidean distance metrics, linear top-K |
| **L2** | `CORE` | **Hierarchical Navigable Small World (HNSW)** | *Do you understand the core mechanism?* | Multi-layer skip-graph construction, greedy routing on upper layers, beam search on layer 0 |
| **L3** | `HARDEN` | **Dynamic Deletions & Disconnected Components** | *Does it remain correct under edge cases and failures?* | Tombstone markings, graph edge reconnection on node deletion, isolated island recovery |
| **L4** | `SCALE` | **Concurrent Graph Updates & Multi-Index Sharding** | *Does it handle concurrency, workload and growth?* | Fine-grained node latching during edge insertion, sharded vector partitions, parallel top-K |
| **L5** | `MEASURE` | **Recall vs. QPS Tradeoff Profiling** | *Can you identify bottlenecks and prove performance?* | Plotting Pareto frontier of Recall@10 against Queries Per Second across efSearch values |
| **L6** | `OPTIMIZE` | **Scalar Quantization & SIMD Dot-Product** | *Can you make it measurably better?* | Int8 scalar quantization (4x memory reduction), AVX2/AVX-512 vector distance kernels |

---

### 19. LLM Inference Engine & KV Cache <a id="19-llm-inference"></a>

- **Slug**: `llm-inference`
- **Domain**: AI Systems
- **Difficulty**: `Expert`
- **Inspired By**: vLLM, Ollama, llama.cpp
- **Core Skills**: Transformer architectures, KV caching, continuous batching, memory paging
- **Signature Question**: *Why does LLM generation slow down as conversation history grows, and how do we fix it?*

#### Overview

Construct an ultra-fast LLM inference serving engine modeled after vLLM and llama.cpp. Engineer autoregressive decoding, eliminate quadratic attention bottlenecks with PagedAttention KV caches, and support continuous request batching.

#### What You Build

Autoregressive token generator with PagedAttention KV cache and continuous batching

#### Target Benchmark Metrics

- Time to First Token (TTFT): < 20ms
- Inter-Token Latency (ITL): < 5ms
- Memory fragmentation reduction: > 80% with PagedAttention

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **Autoregressive Decoder Forward Pass** | *Can you make it work?* | Token matrix multiplication, softmax temperature sampling, greedy token decoding |
| **L2** | `CORE` | **Key-Value (KV) Cache Manager** | *Do you understand the core mechanism?* | Eliminating redundant matrix math by caching past key and value projection tensors |
| **L3** | `HARDEN` | **Context Window Overflow & OOM Eviction** | *Does it remain correct under edge cases and failures?* | Sliding window attention eviction, dynamic context truncation, graceful OOM fallback |
| **L4** | `SCALE` | **PagedAttention & Continuous Batching** | *Does it handle concurrency, workload and growth?* | Virtual memory paging for KV cache blocks, dynamic request insertion into active batches |
| **L5** | `MEASURE` | **TTFT & Inter-Token Latency (ITL)** | *Can you identify bottlenecks and prove performance?* | Profiling prefill phase vs decode phase latency, memory bandwidth saturation analysis |
| **L6** | `OPTIMIZE` | **FlashAttention Kernel & Weight Quantization** | *Can you make it measurably better?* | Tiled softmax online attention without materializing N×N matrix, 4-bit weight unpacker |

---

### 20. Model Context Protocol (MCP) Runtime <a id="20-mcp-runtime"></a>

- **Slug**: `mcp-runtime`
- **Domain**: AI Systems
- **Difficulty**: `Medium`
- **Inspired By**: Anthropic Model Context Protocol, Google Antigravity Sidecars
- **Core Skills**: Agent architectures, JSON-RPC, tool sandboxing, protocol dispatch
- **Signature Question**: *How do autonomous AI agents safely discover and execute system tools in real time?*

#### Overview

Build a production-grade Model Context Protocol (MCP) tool execution runtime that connects LLMs to real-world code execution environments. Implement JSON-RPC 2.0 stdio framing, resource templates, strict schema validation, and sandboxed subprocess execution.

#### What You Build

Type-safe JSON-RPC 2.0 tool execution runtime with schema validation and isolation

#### Target Benchmark Metrics

- Tool dispatch overhead: < 0.8ms
- 100% schema validation enforcement
- Subprocess timeout cancellation: strict 50ms deadline

#### 6-Level Progression Roadmap

| Level | Stage | Name | Guiding Question | Key Implementation Focus |
| :---: | :---: | :--- | :--- | :--- |
| **L1** | `BUILD` | **JSON-RPC 2.0 Stdio Transport & Tool Discovery** | *Can you make it work?* | Framing JSON-RPC over stdin/stdout, handling 'tools/list' and 'tools/call' requests |
| **L2** | `CORE` | **Resource Templates & Dynamic Context Providers** | *Do you understand the core mechanism?* | URI template routing (cpp://, file://), resource read streams, dynamic SCO subscriptions |
| **L3** | `HARDEN` | **Schema Validation & Zombie Subprocess Reaping** | *Does it remain correct under edge cases and failures?* | JSON Schema parameter enforcement, execution timeouts, SIGKILL on runaway tools |
| **L4** | `SCALE` | **Multi-Agent Parallel Tool Orchestration** | *Does it handle concurrency, workload and growth?* | Asynchronous task IDs, parallel non-blocking tool execution, request cancellation routing |
| **L5** | `MEASURE` | **Protocol Overhead & Dispatch Profiling** | *Can you identify bottlenecks and prove performance?* | Measuring JSON serialization serialization tax, dispatch latency percentiles across 10,000 calls |
| **L6** | `OPTIMIZE` | **Zero-Copy JSON Stream Parsing & Fast Dispatch** | *Can you make it measurably better?* | SIMD-accelerated JSON tokenization, zero-copy buffer passthrough to worker processes |

---

