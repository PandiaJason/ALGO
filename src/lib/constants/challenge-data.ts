// src/lib/constants/challenge-data.ts

export interface ArchitecturalLayer {
  number: number;
  name: string;
  focus: string;
  description: string;
  realWorldTech: string;
}

export interface LevelLearningLoop {
  bottleneck: string;
  whatYouUnderstand: string[];
  productionParity: string;
  outcomeSummary: string;
}

export interface LevelDefinition {
  level: number;
  shortTitle: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tagline: string;
  learningLoop: LevelLearningLoop;
  operations: Array<{ cmd: string; desc: string }>;
  durabilityRules?: string[];
  examples: Array<{ title: string; input: string; output: string }>;
  constraints: string[];
  cases: Array<{ name: string; input: string; expected: string }>;
}

export const PROJECT_SCOPE = {
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  title: "Building a Production-Grade Key-Value Storage Engine",
  subtitle: "From bare-metal in-memory dictionaries to a multi-threaded, crash-durable, 100K+ ops/sec engine.",
  overview:
    "In this engineering challenge, you construct a high-throughput, crash-resilient key-value storage engine from first principles — the exact foundational architecture powering systems like Redis, RocksDB, and Bitcask. Rather than relying on black-box libraries, you build the raw protocol parser, collision-resistant hash table, synchronous write-ahead log (WAL), atomic snapshotting engine, dual-mode TTL eviction sweeper, striped-mutex concurrency coordinator, and zero-copy memory arenas.",
  whyItMatters:
    "Every modern cloud service depends on high-performance caching and low-latency storage. By building this engine layer by layer, you cross the chasm from writing high-level application code to understanding operating system syscalls, CPU cache lines, disk durability guarantees, and multi-core thread safety.",
  finalOutcome:
    "Upon completing all 6 levels, you have built a complete, production-grade storage engine capable of sustaining 100,000+ ops/sec under concurrent multi-threaded load with sub-0.20ms p99 latency, surviving abrupt process crashes (SIGKILL) with zero data loss, and running deterministically inside a hard 256MB memory boundary.",
  architecturalLayers: [
    {
      number: 1,
      name: "Protocol & I/O Dispatcher",
      focus: "O(1) Heap Resolution & Command Protocol",
      description: "Streams raw command tokens via stdin/stdout, parsing verbs (SET, GET, DELETE, EXISTS) with zero allocation overhead.",
      realWorldTech: "Redis RESP protocol parser, Memcached text protocol",
    },
    {
      number: 2,
      name: "Collision-Resistant Hash Table",
      focus: "64-Bit Hashing & Dynamic Rehashing",
      description: "Uniform 64-bit MurmurHash3 distribution with separate chaining / open addressing and progressive 0.75 load-factor rehashing.",
      realWorldTech: "Redis dict.c, Java ConcurrentHashMap, Python dict",
    },
    {
      number: 3,
      name: "Write-Ahead Log & Persistence",
      focus: "Append-Only Logging & Crash Recovery",
      description: "Guarantees crash-safety with append-only WAL, synchronous fsync disk buffer flushes, and <50ms replay boot reconstitution.",
      realWorldTech: "PostgreSQL WAL, SQLite write-ahead journal, Redis AOF + RDB",
    },
    {
      number: 4,
      name: "Dual-Mode TTL Eviction Engine",
      focus: "Passive + Active Expiration Sweeping",
      description: "Enforces memory bounds through passive lazy checks on read and active background probabilistic sampling with monotonic clocks.",
      realWorldTech: "Redis activeExpireCycle, Memcached slab expiration",
    },
    {
      number: 5,
      name: "Striped-Mutex Concurrency",
      focus: "32-Shard Mutexes & Deadlock Freedom",
      description: "Partitions the keyspace across 32 independent shards, enabling concurrent multi-threaded read/write parallelism with deadlock-free batch ordering.",
      realWorldTech: "Dragonfly, KeyDB, Go sync.RWMutex sharding",
    },
    {
      number: 6,
      name: "Memory Arena & Compaction",
      focus: "100K+ Ops/Sec, Slab Pools, & Online Compaction",
      description: "Eliminates heap fragmentation via pre-allocated slab pools, packs data structures into 64-byte CPU cache lines, and rewrites WAL online.",
      realWorldTech: "RocksDB SSTable compaction, Redis jemalloc tuning",
    },
  ],
};

export const LEVEL_DEFINITIONS: Record<number, LevelDefinition> = {
  1: {
    level: 1,
    shortTitle: "In-Memory Store",
    title: "Basic In-Memory Store",
    difficulty: "Easy",
    tagline:
      "Implement fundamental SET, GET, DELETE, and EXISTS operations with direct O(1) in-memory hash resolution.",
    learningLoop: {
      bottleneck:
        "How do modern systems map arbitrary human-readable strings to physical memory addresses in sub-microsecond time without memory leaks or unhandled exception crashes?",
      whatYouUnderstand: [
        "In-Memory Pointer Resolution: How key-value pairs reside directly in process heap memory with amortized O(1) time complexity.",
        "Stream Command Protocol: How engines parse raw stdin/stdout tokens into operational verbs (SET, GET, DELETE, EXISTS) and arbitrary UTF-8 string payloads.",
        "Idempotency & Return Contracts: How production systems handle missing keys deterministically (NULL vs NOT_FOUND vs FALSE) without throwing unhandled exceptions.",
        "Process Memory Footprint: The foundational baseline of heap allocation before introducing disk persistence or concurrent threading.",
      ],
      productionParity:
        "The core in-memory hash dictionary design used in Redis's primary keyspace (dict.c) and Memcached.",
      outcomeSummary:
        "You master command dispatching, arbitrary string payloads, heap memory allocation, and idempotent lookup contracts.",
    },
    operations: [
      { cmd: "SET key value", desc: "Stores key-value pair in memory. Overwrites existing value if present. Returns OK." },
      { cmd: "GET key", desc: "Retrieves value associated with key. Returns the string value or NULL if missing." },
      { cmd: "DELETE key", desc: "Deletes key from memory. Returns OK if deleted, or NOT_FOUND if missing." },
      { cmd: "EXISTS key", desc: "Checks key existence in store. Returns TRUE if present, or FALSE if missing." },
    ],
    durabilityRules: [
      "In-Memory Resolution: Store all keys and values in heap memory with average O(1) time complexity.",
      "Arbitrary Strings: Keys and values are arbitrary UTF-8 strings. Values may contain spaces or symbols.",
      "Idempotent Behavior: Missing keys must consistently return NULL for GET and NOT_FOUND for DELETE.",
    ],
    examples: [
      {
        title: "Example 1: SET & GET",
        input: "SET alpha 42\nGET alpha",
        output: "OK\n42",
      },
      {
        title: "Example 2: Missing Key",
        input: "GET non_existent_key",
        output: "NULL",
      },
      {
        title: "Example 3: Overwrite & DELETE",
        input: "SET score 10\nSET score 20\nGET score\nDELETE score\nGET score",
        output: "OK\nOK\n20\nOK\nNULL",
      },
    ],
    constraints: [
      "Time Complexity: O(1) average lookup and insertion.",
      "Memory Sandbox: 256MB RAM hard limit inside Docker container.",
      "String Encoding: Valid UTF-8 string encoding across all inputs.",
      "Execution Sandbox: Isolated non-root Docker runner with zero network access.",
    ],
    cases: [
      { name: "Case 1: Basic SET & GET", input: "SET alpha 42\nGET alpha", expected: "OK\n42" },
      { name: "Case 2: Missing Key", input: "GET non_existent_key", expected: "NULL" },
      { name: "Case 3: EXISTS Check", input: "SET beta 100\nEXISTS beta\nEXISTS gamma", expected: "OK\nTRUE\nFALSE" },
      { name: "Case 4: Overwrite Key", input: "SET score 10\nSET score 20\nGET score", expected: "OK\nOK\n20" },
      { name: "Case 5: DELETE & Re-query", input: "SET delta 999\nDELETE delta\nGET delta", expected: "OK\nOK\nNULL" },
    ],
  },
  2: {
    level: 2,
    shortTitle: "Hash Table & Collision",
    title: "Efficient Lookup & Collision Resolution",
    difficulty: "Medium",
    tagline:
      "Build a custom internal hash table with 64-bit hashing, collision chaining / open addressing, and dynamic load factor threshold rehashing.",
    learningLoop: {
      bottleneck:
        "Why do naive hash tables degrade from O(1) to catastrophic O(N) when bucket collisions occur or under Hash DoS attacks?",
      whatYouUnderstand: [
        "Uniform 64-Bit Hashing: How non-cryptographic hash functions (MurmurHash3 / FNV-1a) disperse arbitrary keys uniformly across 2^64 address slots.",
        "Collision Resolution Dynamics: When to use separate chaining (linked list / bucket vectors) vs open addressing (linear probing) for CPU L1/L2 cache locality.",
        "Dynamic Load Factor & Table Expansion: Why a 0.75 load factor threshold balances memory overhead against search cost, and how progressive rehashing avoids latency spikes.",
        "Tombstones & Probe Continuity: Why deleting an entry in an open-addressing table breaks subsequent probe searches unless marked with tombstones.",
      ],
      productionParity:
        "The custom collision resolution and progressive rehashing algorithms powering Redis dicts, Java's ConcurrentHashMap, and Python's internal dictionary.",
      outcomeSummary:
        "You master how real databases prevent hash collisions, expand capacity dynamically without latency spikes, and maintain strict O(1) lookup guarantees.",
    },
    operations: [
      { cmd: "SET key value", desc: "Hashes key, computes bucket index, resolves collisions, and resizes if load factor > 0.75. Returns OK." },
      { cmd: "GET key", desc: "Probes collision chain / bucket to retrieve value. Returns value or NULL." },
      { cmd: "DELETE key", desc: "Removes entry and marks tombstone or unlinks node. Returns OK or NOT_FOUND." },
      { cmd: "EXISTS key", desc: "Probes bucket to verify existence. Returns TRUE or FALSE." },
      { cmd: "STATS", desc: "Returns internal hash table metrics: BUCKETS: <n> ELEMENTS: <m> LOAD: <load_factor>." },
    ],
    durabilityRules: [
      "Deterministic Hashing: Implement uniform 64-bit hashing (MurmurHash3 / FNV-1a) across all bucket slots.",
      "Collision Resolution: Implement separate chaining (linked list / bucket vector) or open addressing (linear probing).",
      "Dynamic Rehashing: When (elements / buckets) > 0.75, double bucket capacity and rehash all active entries.",
      "Tombstone Management: On deletion in open addressing, mark slot as tombstone to preserve search probe continuity.",
    ],
    examples: [
      {
        title: "Example 1: Collision Resolution",
        input: "SET k1 val1\nSET k2 val2\nGET k1\nGET k2",
        output: "OK\nOK\nval1\nval2",
      },
      {
        title: "Example 2: Table Expansion & STATS",
        input: "SET user:1 jason\nSET user:2 alex\nSET user:3 sam\nSTATS",
        output: "OK\nOK\nOK\nBUCKETS: 8 ELEMENTS: 3 LOAD: 0.38",
      },
    ],
    constraints: [
      "Maximum Load Factor: 0.75 threshold before dynamic rehashing.",
      "Initial Buckets: Start with at least 8 or 16 buckets.",
      "Amortized Complexity: O(1) insert, lookup, and delete.",
      "Memory Allocation: Zero memory leaks during rehashing or node deletion.",
    ],
    cases: [
      { name: "Case 1: Sequential Inserts", input: "SET a 1\nSET b 2\nGET a\nGET b", expected: "OK\nOK\n1\n2" },
      { name: "Case 2: Overwrite in Same Bucket", input: "SET key 10\nSET key 20\nGET key", expected: "OK\nOK\n20" },
      { name: "Case 3: DELETE with Probe Continuity", input: "SET x 1\nSET y 2\nDELETE x\nGET y", expected: "OK\nOK\nOK\n2" },
      { name: "Case 4: STATS Verification", input: "SET k1 1\nSTATS", expected: "OK\nBUCKETS: 8 ELEMENTS: 1 LOAD: 0.13" },
      { name: "Case 5: Non-existent Probing", input: "SET a 1\nGET z", expected: "OK\nNULL" },
    ],
  },
  3: {
    level: 3,
    shortTitle: "Persistence & WAL",
    title: "Durable Persistence & Write-Ahead Log (WAL)",
    difficulty: "Medium",
    tagline:
      "Implement append-only write-ahead logging (WAL) and crash recovery replay. Ensure zero data loss across simulated process restarts.",
    learningLoop: {
      bottleneck:
        "If host power is abruptly cut or the process receives SIGKILL, RAM is instantly wiped. How do databases guarantee zero data loss without slowing down writes?",
      whatYouUnderstand: [
        "The Write-Ahead Logging (WAL) Principle: The cardinal rule of database systems — never alter in-memory state until the mutation is safely committed to non-volatile disk.",
        "Sequential vs Random I/O Economics: Why append-only logging (WAL) is orders of magnitude faster than random disk page modifications.",
        "OS Page Cache vs Hardware Flushing: Why standard file writes sit in volatile OS buffers, and why synchronous fsync/fdatasync flushes are mandatory for true durability.",
        "Crash Recovery & Replay Engine: How the storage engine parses the WAL on startup, tolerates partial/corrupt trailing lines, and reconstitutes exact state in under 50ms.",
        "Atomic Snapshotting (SAVE / RESTORE): Creating atomic point-in-time state dumps to bound WAL recovery time upon restarts.",
      ],
      productionParity:
        "The persistence architecture of PostgreSQL WAL, SQLite write-ahead journal, and Redis AOF (Append-Only File) + RDB snapshots.",
      outcomeSummary:
        "You understand how databases survive catastrophic crashes, why sequential logging enables high write throughput, and how crash recovery reconstitution works.",
    },
    operations: [
      { cmd: "SET / GET / DELETE / EXISTS", desc: "All Level 1 & 2 operations. Every mutation is synchronously flushed to wal.log before returning OK." },
      { cmd: "SAVE", desc: "Forces an immediate synchronous snapshot dump of in-memory keys to disk (dump.rdb). Returns OK." },
      { cmd: "RESTORE", desc: "Restores dataset from disk snapshot. Returns OK or NOT_FOUND if snapshot missing." },
      { cmd: "FLUSHALL", desc: "Clears all in-memory keys and truncates wal.log to 0 bytes. Returns OK." },
    ],
    durabilityRules: [
      "Write-Ahead Logging: Every mutating command (SET, DELETE, FLUSHALL) must append to ./data/wal.log before in-memory state is altered.",
      "Crash Recovery Replay: On engine boot (__init__), open wal.log and replay mutations chronologically to restore full state.",
      "Snapshot Serialization: SAVE creates an atomic point-in-time snapshot dump using temporary file rename.",
      "Tolerant Log Parser: Gracefully ignore truncated or corrupt trailing log lines without crashing or aborting initialization.",
    ],
    examples: [
      {
        title: "Example 1: Crash Recovery from WAL",
        input: "SET user:1 jason\nSET user:2 alex\n# Simulate engine restart\nGET user:1\nGET user:2",
        output: "OK\nOK\njason\nalex",
      },
      {
        title: "Example 2: Snapshot & Restore",
        input: "SET key1 value1\nSAVE\nFLUSHALL\nGET key1\nRESTORE\nGET key1",
        output: "OK\nOK\nOK\nNULL\nOK\nvalue1",
      },
    ],
    constraints: [
      "WAL Log File: ./data/wal.log.",
      "Sync Guarantee: Flush file buffers (fdatasync/flush) on each mutation.",
      "Crash Safety: Must survive SIGKILL and recover exact state.",
      "Replay Overhead: Must complete recovery under 50ms for 10,000 log entries.",
    ],
    cases: [
      { name: "Case 1: WAL Mutation Persistence", input: "SET user:1 jason\nGET user:1", expected: "OK\njason" },
      { name: "Case 2: SAVE Snapshot", input: "SET snapshot_key saved_data\nSAVE\nGET snapshot_key", expected: "OK\nOK\nsaved_data" },
      { name: "Case 3: FLUSHALL Reset", input: "SET tmp 123\nFLUSHALL\nGET tmp", expected: "OK\nOK\nNULL" },
      { name: "Case 4: Overwrite Durability", input: "SET count 1\nSET count 2\nGET count", expected: "OK\nOK\n2" },
      { name: "Case 5: DELETE Persistence", input: "SET active 1\nDELETE active\nGET active", expected: "OK\nOK\nNULL" },
    ],
  },
  4: {
    level: 4,
    shortTitle: "TTL & Expiration",
    title: "TTL & Key Expiration",
    difficulty: "Hard",
    tagline:
      "Implement millisecond-precision key expiration with dual-mode passive eviction on read and active background sweeping.",
    learningLoop: {
      bottleneck:
        "In high-throughput caches, unbounded data accumulation leads to Out-Of-Memory (OOM) fatal kills. How do you evict expired keys without degrading read/write latency?",
      whatYouUnderstand: [
        "Dual-Mode Eviction Architecture: Combining passive (lazy) evaluation on read with active background sweeping to prevent memory leaks.",
        "Lazy Eviction Mechanics: Deferring key expiration checks until GET/EXISTS is invoked, consuming zero CPU cycles for keys that are never queried.",
        "Active Sweeping & Probabilistic Sampling: Why relying exclusively on lazy eviction causes permanent memory leaks for abandoned keys, and how periodic sampling keeps heap clean.",
        "Monotonic vs Wall-Clock Timers: Why wall-clock time (time.time()) can jump backwards during NTP synchronization, and why monotonic clocks (steady_clock) are required for TTL reliability.",
        "TTL Mutation Semantics: How overwrites (SET), explicit expiration (EXPIRE), and removal (PERSIST) transition key lifecycle state.",
      ],
      productionParity:
        "Redis's activeExpireCycle algorithm and Memcached's slab item LRU expiration.",
      outcomeSummary:
        "You master dual-mode TTL lifecycle management, steady monotonic timing, and memory-safe cache eviction.",
    },
    operations: [
      { cmd: "EXPIRE key ttl_ms", desc: "Sets time-to-live in milliseconds on key. Returns OK, or NOT_FOUND if key does not exist." },
      { cmd: "TTL key", desc: "Returns remaining lifetime in milliseconds, -1 if key has no TTL, or -2 if key does not exist." },
      { cmd: "PERSIST key", desc: "Removes expiration timer from key, making it permanent. Returns OK or NOT_FOUND." },
      { cmd: "GET key", desc: "Checks expiration timestamp. If current_time >= expire_at, deletes key and returns NULL." },
    ],
    durabilityRules: [
      "Passive Eviction (Lazy): Every read operation (GET, EXISTS, TTL) evaluates expiration. If expired, remove key immediately.",
      "Active Eviction Sweep: Periodically sample keys with TTL to evict expired keys that are never queried, preventing memory leaks.",
      "Overwrite Semantics: A SET command on an existing key without EXPIRE clears any previously set TTL (resets TTL to -1).",
      "Monotonic Clock: Use monotonic time (time.monotonic() in Python or steady_clock in C++) to prevent NTP/wall-clock drift issues.",
    ],
    examples: [
      {
        title: "Example 1: TTL Expiration",
        input: "SET token xyz\nEXPIRE token 50\n# sleep 60ms\nGET token\nTTL token",
        output: "OK\nOK\nNULL\n-2",
      },
      {
        title: "Example 2: PERSIST Command",
        input: "SET session 123\nEXPIRE session 60000\nTTL session\nPERSIST session\nTTL session",
        output: "OK\nOK\n>0\nOK\n-1",
      },
    ],
    constraints: [
      "Time Precision: Millisecond resolution (ttl_ms >= 1).",
      "TTL Return Codes: Positive integer (ms remaining), -1 (no expiration), -2 (key does not exist).",
      "Memory Cleanup: Bound expired keys memory under heavy workloads.",
      "Clock Monotonicity: Use steady/monotonic system time sources.",
    ],
    cases: [
      { name: "Case 1: EXPIRE & Query", input: "SET auth 99\nEXPIRE auth 5000\nGET auth", expected: "OK\nOK\n99" },
      { name: "Case 2: TTL Check", input: "SET perm 42\nTTL perm\nTTL not_there", expected: "OK\n-1\n-2" },
      { name: "Case 3: PERSIST Clears Expiration", input: "SET token abc\nEXPIRE token 10000\nPERSIST token\nTTL token", expected: "OK\nOK\nOK\n-1" },
      { name: "Case 4: Overwrite Clears TTL", input: "SET a 1\nEXPIRE a 1000\nSET a 2\nTTL a", expected: "OK\nOK\nOK\n-1" },
      { name: "Case 5: DELETE Expired Key", input: "SET b 1\nDELETE b\nTTL b", expected: "OK\nOK\n-2" },
    ],
  },
  5: {
    level: 5,
    shortTitle: "Concurrency",
    title: "Concurrency & Thread-Safe Operations",
    difficulty: "Hard",
    tagline:
      "Scale across 16+ parallel client threads. Implement striped locking (sharded mutexes) or read-write locks to maximize concurrent throughput.",
    learningLoop: {
      bottleneck:
        "A single global mutex (like Python's GIL or a monolithic lock) serializes all incoming requests, reducing a 32-core server to the speed of a single core. How do you scale across parallel threads?",
      whatYouUnderstand: [
        "Lock Contention & Amdahl's Law: How fine-grained locking prevents concurrent workers from stalling each other under high load.",
        "Striped Locking (Sharded Mutexes): Partitioning the keyspace into 32 or 64 independent mutex shards so threads modifying different keys execute in true parallel.",
        "Reader-Writer Parallelism: Allowing unlimited simultaneous concurrent readers (GET) while acquiring exclusive write locks only during mutations.",
        "Deadlock Prevention in Multi-Key Transactions: Why atomic operations on multiple keys (MGET, MSET) cause cyclic deadlocks if locks are acquired arbitrarily, and how sorting shard indices guarantees deadlock freedom.",
        "ThreadSanitizer & Race Condition Safety: Detecting data races and memory corruption under concurrent 16-thread pressure.",
      ],
      productionParity:
        "The striped mutex architecture of Java's ConcurrentHashMap, Go's partitioned caches, and multi-threaded key-value engines like Dragonfly and KeyDB.",
      outcomeSummary:
        "You understand how multi-core storage engines eliminate lock contention through striped sharding while guaranteeing mathematical deadlock freedom.",
    },
    operations: [
      { cmd: "All Level 1-4 Operations", desc: "Fully thread-safe under concurrent multi-threaded execution without data races." },
      { cmd: "PING [msg]", desc: "Server health check. Returns PONG or echoed string." },
      { cmd: "MGET key1 key2 ...", desc: "Atomically retrieves multiple keys in a single consistent snapshot. Returns space-separated values." },
      { cmd: "MSET k1 v1 k2 v2 ...", desc: "Atomically stores multiple key-value pairs without interleaving partial writes. Returns OK." },
    ],
    durabilityRules: [
      "Striped Locking: Partition keyspace into 32 or 64 independent mutex shards to eliminate global lock bottleneck.",
      "Reader-Writer Locks: Allow concurrent simultaneous readers while acquiring exclusive locks only for mutations.",
      "Deadlock Avoidance: For multi-key operations (MGET, MSET), always acquire locks in sorted order of shard index.",
      "Thread Safety: Zero race conditions under 16 concurrent worker threads (verified via ThreadSanitizer).",
    ],
    examples: [
      {
        title: "Example 1: PING & Multi-Key Read",
        input: "PING\nSET k1 10\nSET k2 20\nMGET k1 k2 k3",
        output: "PONG\nOK\nOK\n10 20 NULL",
      },
      {
        title: "Example 2: Atomic Multi-Set",
        input: "MSET a 1 b 2 c 3\nGET a\nGET b\nGET c",
        output: "OK\n1\n2\n3",
      },
    ],
    constraints: [
      "Parallel Clients: Support 16+ concurrent threads without race conditions.",
      "Lock Striping Factor: At least 16 independent mutex partitions.",
      "Deadlock Free: Multi-key lock ordering must guarantee zero deadlocks.",
      "Correctness Gate: 100% test pass rate required under concurrent stress.",
    ],
    cases: [
      { name: "Case 1: PING Healthcheck", input: "PING\nPING hello", expected: "PONG\nhello" },
      { name: "Case 2: MSET Batch", input: "MSET alpha 1 beta 2 gamma 3\nGET alpha\nGET beta", expected: "OK\n1\n2" },
      { name: "Case 3: MGET Multi-Key Fetch", input: "SET x 10\nSET y 20\nMGET x y z", expected: "OK\nOK\n10 20 NULL" },
      { name: "Case 4: Concurrent Overwrite Consistency", input: "SET score 5\nSET score 10\nGET score", expected: "OK\nOK\n10" },
      { name: "Case 5: MSET with Existing Key Overwrite", input: "SET a 1\nMSET a 99 b 100\nGET a\nGET b", expected: "OK\nOK\n99\n100" },
    ],
  },
  6: {
    level: 6,
    shortTitle: "Peak Perf & Memory",
    title: "Extreme Optimization & Memory Compaction",
    difficulty: "Hard",
    tagline:
      "Push hardware limits. Exceed 100,000 ops/sec with sub-0.20ms p99 latency under a strict 256MB memory cap using custom memory pooling and WAL compaction.",
    learningLoop: {
      bottleneck:
        "Pushing beyond 100,000 ops/sec with sub-0.20ms latency requires eliminating operating system malloc fragmentation, CPU cache misses, and unbounded log file growth.",
      whatYouUnderstand: [
        "Online WAL Compaction: How to defragment an append-only log on the fly, condensing thousands of intermediate mutations into final states to reclaim disk space.",
        "Slab Allocation & Memory Arenas: Why frequent malloc/free calls fragment the heap until the OS cgroup kills the container, and how fixed-size memory pools maintain 1.0 fragmentation ratio.",
        "CPU Cache Locality & 64-Byte Alignment: Structuring memory to match hardware L1/L2 cache lines (64 bytes), avoiding multi-cycle CPU cache misses.",
        "Zero-Copy Serialization: Parsing network and stream buffers directly in place without intermediate string memory allocations.",
      ],
      productionParity:
        "RocksDB SSTable compaction, Redis jemalloc memory arena tuning, and bare-metal high-frequency trading memory pools.",
      outcomeSummary:
        "You master the apex of systems engineering: sub-millisecond p99 latency, zero-copy memory layouts, and hardware-aligned resource efficiency.",
    },
    operations: [
      { cmd: "All Prior Operations", desc: "Executed with zero-copy I/O parsing, SIMD string comparisons, and cache-line aligned layouts." },
      { cmd: "COMPACT", desc: "Rewrites Write-Ahead Log by discarding superseded mutations and defragmenting memory. Returns OK." },
      { cmd: "MEMSTATS", desc: "Returns detailed memory metrics: ALLOCATED_BYTES: <n> PEAK_BYTES: <m> FRAGMENTATION_RATIO: <r>." },
    ],
    durabilityRules: [
      "Custom Memory Arena: Allocate memory in fixed-size slab pools to eliminate malloc/free heap fragmentation.",
      "Cache-Line Packing: Align hot data structures (hash node headers, key pointers) to 64-byte CPU cache lines.",
      "Zero-Copy Parsing: Parse incoming protocol buffers directly without allocating intermediate strings.",
      "Online WAL Compaction: Atomically replace bloated log files with clean point-in-time state snapshots.",
    ],
    examples: [
      {
        title: "Example 1: Log Compaction & Memory Stats",
        input: "SET key 1\nSET key 2\nSET key 3\nCOMPACT\nMEMSTATS\nGET key",
        output: "OK\nOK\nOK\nOK\nALLOCATED_BYTES: 1048 PEAK_BYTES: 2048 FRAGMENTATION_RATIO: 1.02\n3",
      },
      {
        title: "Example 2: High-Throughput Burst",
        input: "SET burst:1 val\nSET burst:2 val\nGET burst:1\nDELETE burst:2\nEXISTS burst:2",
        output: "OK\nOK\nval\nOK\nFALSE",
      },
    ],
    constraints: [
      "Throughput Benchmark: > 100,000 ops/sec sustained.",
      "p99 Latency Cap: < 0.20 ms under heavy load.",
      "Memory Quota: Hard 256MB cgroup enforcement.",
      "Durability: Full WAL crash recovery fidelity preserved after compaction.",
    ],
    cases: [
      { name: "Case 1: COMPACT Log Compaction", input: "SET user:1 old\nSET user:1 new\nCOMPACT\nGET user:1", expected: "OK\nOK\nOK\nnew" },
      { name: "Case 2: MEMSTATS Resource Breakdown", input: "SET sample test\nMEMSTATS", expected: "OK\nALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00" },
      { name: "Case 3: High-Frequency Insertion", input: "SET a 1\nSET b 2\nSET c 3\nGET b", expected: "OK\nOK\nOK\n2" },
      { name: "Case 4: Cache-Line Aligned Retrieval", input: "SET metric 99.9\nGET metric", expected: "OK\n99.9" },
      { name: "Case 5: Full Cycle Verification", input: "SET k v\nEXISTS k\nDELETE k\nEXISTS k", expected: "OK\nTRUE\nOK\nFALSE" },
    ],
  },
};
