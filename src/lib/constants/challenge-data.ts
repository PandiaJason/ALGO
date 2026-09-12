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
  whatAreYouBuilding?: string;
  howItWorks?: string;
  technicalTerms?: Array<{ term: string; definition: string }>;
  description?: string;
  implementationGuide?: string[];
  diagram?: string;
  importantChallenge?: {
    title: string;
    description: string;
    codeOrFormat?: string;
  };
  endGoalDemonstration?: string;
  nextLevelTeaser?: string;
  learningLoop: LevelLearningLoop;
  operations: Array<{ cmd: string; desc: string }>;
  durabilityRules?: string[];
  examples: Array<{ title: string; input: string; output: string }>;
  constraints: string[];
  cases: Array<{ name: string; input: string; expected: string }>;
}

export const PROJECT_SCOPE = {
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  title: "Key-Value Storage Engine",
  subtitle: "From bare-metal in-memory dictionaries to a multi-threaded, crash-durable, 100K+ ops/sec engine.",
  philosophy: "Encounter real storage engineering problems: hash collisions, write-ahead logs, monotonic TTL sweeps, and striped-mutex concurrency.",
  architectureDiagram: `                    KEY-VALUE ENGINE
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
     Commands                              Storage
        │                                     │
 SET / GET / DELETE / EXISTS             Hash Table
        │                                     │
        └──────────────┬──────────────────────┘
                       │
                 In-Memory Store
                       │
                 ┌─────┴─────┐
                 │           │
              Key         Value
            "score"       "42"`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Basic in-memory store", mainConcept: "Hash map / O(1) lookup & command routing" },
    { level: 2, whatWeBuild: "Our own custom hash table", mainConcept: "Hashing algorithms, buckets, & collision handling" },
    { level: 3, whatWeBuild: "Persistence & Write-Ahead Log", mainConcept: "Crash recovery, durability, & fsync journal replay" },
    { level: 4, whatWeBuild: "TTL & Automatic Expiration", mainConcept: "Passive on-read eviction + active monotonic timer sweeps" },
    { level: 5, whatWeBuild: "Multi-threaded Concurrency", mainConcept: "Striped mutexes, thread synchronization, & deadlock avoidance" },
    { level: 6, whatWeBuild: "Peak Performance & Compaction", mainConcept: "Memory arena fragmentation, log compaction, & 100K+ ops/s" },
  ],
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
      whatAreYouBuilding: `You are going to build a simple digital phone book.

You can store a name (the key) and a phone number (the value). You can look up, update, or delete entries instantly.

For example:
SET alice 555-0100
GET alice

It should instantly return the value:
"555-0100"`,
      howItWorks: `1. When the user sends a 'SET' command, the system stores the key and value in memory (RAM).
2. When the user sends a 'GET' command, it looks up the key and returns the value.
3. When the user sends a 'DELETE' command, it removes the entry completely.
4. Because everything is stored in RAM, operations are incredibly fast, but all data will be lost if the server turns off.`,
      technicalTerms: [
        {
          "term": "Key-Value Store",
          "definition": "A database that uses a simple dictionary structure, mapping unique keys directly to their values."
        },
        {
          "term": "In-Memory",
          "definition": "Storing data in the computer's volatile RAM rather than on a hard drive, maximizing speed but risking data loss on power failure."
        },
        {
          "term": "CRUD Operations",
          "definition": "The four basic functions of persistent storage: Create, Read, Update, Delete."
        }
      ],
      description: `Databases don't have to be complex SQL engines. In Level 1, you build the simplest and most performant type of database: a Key-Value Store.

Like Redis or Memcached, this acts as an ultra-fast cache. By keeping data exclusively in memory, you bypass the massive latency of hard drives, allowing applications to retrieve frequently accessed data (like user sessions or game scores) in fractions of a millisecond.`,
      implementationGuide: [
        "Implement a basic dictionary structure (like a HashMap or dict, depending on your language) in memory.",
        "Implement 'SET <key> <value>' to insert or update the value associated with the key.",
        "Implement 'GET <key>' to retrieve the value. Return NULL or a specific error message if the key doesn't exist.",
        "Implement 'DELETE <key>' to remove the key from the dictionary."
      ],
    diagram: `INPUT                         ENGINE                 OUTPUT
SET alpha 42          ──────► memory["alpha"]="42"   ───► OK
GET alpha             ──────► lookup("alpha")        ───► 42
GET non_existent_key  ──────► lookup("non_existent") ───► NULL

Internally:
┌───────────────────────────────┐
│       Key-Value Store         │
├───────────────┬───────────────┤
│ Key           │ Value         │
├───────────────┼───────────────┤
│ alpha         │ 42            │
└───────────────┴───────────────┘

Command Dispatcher Loop:
stdin ──► Parser ──► Router (SET / GET / DELETE / EXISTS) ──► Store ──► stdout`,
    importantChallenge: {
      title: "Values may contain spaces or symbols",
      description:
        "The specification requires that values can contain spaces. For example: `SET message hello world from Jason` must not split into key=message, value=hello. The protocol needs to preserve the complete trailing value: key=message, value=hello world from Jason. That makes the command parser an actual systems engineering problem rather than just four naive if statements.",
      codeOrFormat: "SET message hello world from Jason ──► key: 'message', value: 'hello world from Jason'",
    },
    endGoalDemonstration: `SET score 10
OK
SET score 20
OK
GET score
20
EXISTS score
TRUE
DELETE score
OK
GET score
NULL
DELETE score
NOT_FOUND`,
    nextLevelTeaser:
      "In Level 2, we remove the language's built-in hash map and make our own hash table from scratch, including custom 64-bit hashing, bucket arrays, collision resolution, and dynamic rehashing at 0.75 load factor.",
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
          title: "Basic SET & GET",
          input: "SET alpha 42\nGET alpha",
          output: "OK\n42",
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
      whatAreYouBuilding: `You are going to write the actual engine that makes the phone book instantly searchable.

Instead of relying on built-in language tools, you will build a Hash Table from scratch. If two names magically generate the same page number (a collision), you'll link them together in a chain so neither gets lost.

For example:
hash "alice" -> 45
hash "bob" -> 45 (Collision!)

It should chain them seamlessly:
Index 45: [alice: "555-0100"] -> [bob: "555-0200"]`,
      howItWorks: `1. When you insert a key, you run it through a mathematical 'hash function' that scrambles the string into a specific integer index.
2. This index corresponds to a slot (bucket) in a fixed-size array.
3. You place the key-value pair in that bucket.
4. If the bucket is already occupied by a different key (a collision), you attach the new pair to the old one using a Linked List.
5. To find a key, you hash it, go straight to that bucket, and walk through the linked list to find the exact match.`,
      technicalTerms: [
        {
          "term": "Hash Function",
          "definition": "An algorithm that converts an arbitrary string into a fixed-size integer."
        },
        {
          "term": "Hash Collision",
          "definition": "When two entirely different keys happen to produce the exact same hash integer."
        },
        {
          "term": "Separate Chaining",
          "definition": "A collision resolution strategy where each array slot holds a linked list of all items that hashed to that slot."
        }
      ],
      description: `In Level 1, you probably used your language's native Dictionary or Object. But how does that actually work under the hood? In Level 2, you build the core data structure of computer science: the Hash Table.

By scrambling keys into array indices, you achieve O(1) constant-time lookups. This means finding a record takes the exact same amount of time whether the database contains ten items or ten billion items. Handling collisions via separate chaining ensures the database remains robust even when the math inevitably overlaps.`,
      implementationGuide: [
        "Create a fixed-size array of \"buckets\" to act as the foundation of your hash table.",
        "Implement a string hashing algorithm (like FNV-1a or MurmurHash) to convert string keys into an array index.",
        "If multiple keys hash to the same bucket, store them in a Linked List (or a simple sub-array).",
        "When retrieving a value, hash the key, navigate to the bucket, and iterate through the list comparing the raw key strings until you find the match."
      ],
    diagram: `INPUT KEY                      HASH ENGINE                  BUCKET ARRAY (Cap: 8)
SET a 1        ──────► Hash("a") % 8 = Slot 1 ──► [1] = ("a", "1")       ──► OK
SET b 2        ──────► Hash("b") % 8 = Slot 4 ──► [4] = ("b", "2")       ──► OK
GET a          ──────► Hash("a") % 8 = Slot 1 ──► Found "a"              ──► 1
GET b          ──────► Hash("b") % 8 = Slot 4 ──► Found "b"              ──► 2

                                         ┌──────────────┐
                                   [0]   │ NULL         │
                                         ├──────────────┤
                                   [1]   │ ("a", "1")   │
                                         ├──────────────┤
                                   ...   │ NULL         │
                                         ├──────────────┤
                                   [4]   │ ("b", "2")   │
                                         └──────────────┘

Rehashing Dynamic (Load Factor > 0.75):
Initial capacity: 8 buckets. When items exceed capacity * 0.75, table doubles to 16.`,
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
      { cmd: "STATS", desc: "Returns internal hash table metrics: BUCKETS: <n> ELEMENTS: <m> LOAD: <load_factor>. Note: You must start with exactly 8 buckets." },
    ],
    durabilityRules: [
      "Deterministic Hashing: Implement uniform 64-bit hashing (MurmurHash3 / FNV-1a) across all bucket slots.",
      "Collision Resolution: Implement separate chaining (linked list / bucket vector) or open addressing (linear probing).",
      "Dynamic Rehashing: When (elements / buckets) > 0.75, double bucket capacity and rehash all active entries.",
      "Tombstone Management: On deletion in open addressing, mark slot as tombstone to preserve search probe continuity.",
    ],
    examples: [
        {
          title: "Sequential Inserts",
          input: "SET a 1\nSET b 2\nGET a\nGET b",
          output: "OK\nOK\n1\n2",
        },
      ],
    constraints: [
      "Maximum Load Factor: 0.75 threshold before dynamic rehashing.",
      "Initial Buckets: Start with exactly 8 buckets.",
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
      whatAreYouBuilding: `You are going to protect the phone book from power outages.

If the power cord is pulled, RAM is wiped. To fix this, you will keep a running journal (log) on the hard drive. Every time someone changes a number, you quickly jot it down in the journal before updating the phone book.

For example:
SET alice 555-0100
CRASH

When the server restarts, it should recover the data:
REPLAYING LOG...
RESTORED: alice = 555-0100`,
      howItWorks: `1. When a 'SET' or 'DELETE' command arrives, the system immediately writes that command as a line of text at the end of a file on the hard drive (the WAL).
2. It waits for the hard drive to confirm the text was saved.
3. Then, it updates the fast in-memory dictionary and tells the user "Success!".
4. If the server crashes, all RAM is lost.
5. On reboot, the system reads the WAL file from top to bottom, re-running every command to perfectly reconstruct the in-memory dictionary.`,
      technicalTerms: [
        {
          "term": "Write-Ahead Log (WAL)",
          "definition": "An append-only file where every database modification is recorded *before* it is applied to the main dataset."
        },
        {
          "term": "Append-only",
          "definition": "Writing new data exclusively to the very end of a file, which maximizes disk throughput."
        },
        {
          "term": "Crash Recovery",
          "definition": "The process of reading the WAL upon startup to rebuild the database state exactly as it was before a failure."
        }
      ],
      description: `An purely in-memory database is extremely fast, but highly irresponsible for critical data. In Level 3, you bridge the gap between volatile RAM and durable disks using a Write-Ahead Log.

Writing directly to a database file on disk is complex and slow because it involves seeking around to find the right bytes to update. A WAL solves this by strictly appending to the end of a file, which is the absolute fastest way a hard drive can write data. This gives you the durability of a disk with the read speeds of RAM.`,
      implementationGuide: [
        "Before executing any `SET` or `DELETE` command in memory, format it as a string (e.g., \"SET,alice,123\n\") and append it to a log file on disk.",
        "Ensure you forcefully flush (fsync) the file write to disk before returning success to the client.",
        "Implement a startup routine: when the database boots, open the log file, read it line by line, and execute the commands to rebuild your in-memory Hash Table."
      ],
    diagram: `WRITE PIPELINE (Synchronous fsync):
SET user:1 jason ──► 1. Serialize Record  ──► [SET user:1 jason\n]
                            │
                            ▼
                     2. Disk Write (WAL)  ──► ./data/wal.log (append-only)
                            │
                            ▼
                     3. OS fsync() flush  ──► Guaranteed on Disk Platter
                            │
                            ▼
                     4. Update In-Memory  ──► memory["user:1"] = "jason"
                            │
                            ▼
                     5. Return to Client  ──► "OK"
GET user:1       ──► Memory Lookup        ──► "jason"

CRASH RECOVERY PIPELINE (Boot Replay):
Process Restart / Post-Crash (SIGKILL)
       │
       ▼
Read ./data/wal.log sequentially (Offset 0 ──► EOF)
       │
       ├────► Record 1: SET user:1 jason ──► memory["user:1"] = "jason"
       ▼
Replay Complete (State 100% Reconstituted) ──► Ready for Traffic`,
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
          title: "WAL Mutation Persistence",
          input: "SET user:1 jason\nGET user:1",
          output: "OK\njason",
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
      whatAreYouBuilding: `You are going to add self-destruct timers to phone book entries.

Sometimes you only need a temporary number, like a guest Wi-Fi password. You can set it to automatically vanish after 60 seconds without manually deleting it.

For example:
SET_EX guest_pass "abc12" 60000
(Wait 61 seconds)
GET guest_pass

It should return nothing:
NULL (Key Expired)`,
      howItWorks: `1. When storing a key, you optionally attach an absolute expiration timestamp (current time + TTL).
2. When the user requests a key, you first check if the current time is past the expiration timestamp.
3. If it is past the timestamp, you delete the key on the spot and tell the user it doesn't exist (Lazy Expiration).
4. Meanwhile, a background loop randomly samples keys. If it finds expired ones, it deletes them silently to free up memory (Active Expiration).`,
      technicalTerms: [
        {
          "term": "TTL (Time-To-Live)",
          "definition": "The duration in milliseconds that a key should remain valid before being automatically deleted."
        },
        {
          "term": "Lazy Expiration",
          "definition": "Checking if a key is expired only at the exact moment a user tries to access it."
        },
        {
          "term": "Active Expiration",
          "definition": "A background process that proactively scans the database to find and delete expired keys, preventing memory leaks."
        }
      ],
      description: `Caching systems shouldn't hold onto stale data forever. In Level 4, you implement Time-To-Live (TTL) expiration, a cornerstone feature of Redis.

If you only checked for expiration when a user requested a key (lazy expiration), forgotten keys would sit in RAM forever, eventually crashing the server. By adding a randomized background sweeper (active expiration), you ensure that memory is aggressively freed even if users never request the expired data again.`,
      implementationGuide: [
        "Modify your internal dictionary to store objects: `{ value: string, expiresAt: integer }`.",
        "Implement `SET_EX <key> <value> <ttl_ms>`. Calculate `expiresAt = current_time_ms + ttl_ms`.",
        "Modify `GET`. If `expiresAt` exists and is `< current_time_ms`, delete the key and return NULL.",
        "Implement a background loop that runs every few seconds, picks a random subset of keys, and deletes any that have expired."
      ],
    diagram: `TTL REGISTRATION:
SET auth 99      ──► memory["auth"] = "99"                    ──► OK
EXPIRE auth 5000 ──► expiry_table["auth"] = now_ms() + 5000   ──► OK
GET auth         ──► now_ms() < expiry ──► Return "99"        ──► 99

TTL Status Code Conventions:
TTL perm         ──► Key exists with no expiration            ──► -1
TTL not_there    ──► Key does not exist                       ──► -2

PASSIVE (On-Read Lazy Eviction):
GET auth (after 5000ms)
     │
     ▼
Lookup in expiry_table ──► now_ms() >= expiry ──► DELETE "auth" ──► NULL`,
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
      { cmd: "SET key value", desc: "Stores key-value pair and clears any existing TTL." },
      { cmd: "DELETE key", desc: "Deletes key and its expiration timer." },
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
          title: "EXPIRE & Query",
          input: "SET auth 99\nEXPIRE auth 5000\nGET auth",
          output: "OK\nOK\n99",
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
      whatAreYouBuilding: `You are going to let thousands of users read the phone book at the same time without tearing the pages.

If two people try to update Alice's phone number at the exact same millisecond, you must safely queue them up so the dictionary doesn't get corrupted.

For example:
(Thread 1) INCR page_views
(Thread 2) INCR page_views

It should safely handle simultaneous access:
page_views: 2`,
      howItWorks: `1. Multiple network requests arrive at the database simultaneously.
2. If multiple threads try to write to the same bucket in the Hash Table at the same time, they will overwrite each other's memory pointers, corrupting the Linked List.
3. To prevent this, you implement a 'lock' (mutex).
4. When a thread wants to write, it grabs the lock. Other threads must wait their turn.
5. To keep things fast, instead of locking the *entire* database, you only lock the specific bucket being modified (Lock Striping), letting other threads modify different buckets simultaneously.`,
      technicalTerms: [
        {
          "term": "Mutex Lock (Mutual Exclusion)",
          "definition": "A mechanism that ensures only one thread can access a specific piece of data at a time."
        },
        {
          "term": "Race Condition",
          "definition": "A dangerous bug where the outcome depends on the unpredictable timing of when different threads execute."
        },
        {
          "term": "Lock Striping (Fine-grained locking)",
          "definition": "Using multiple locks for different sections of the data (like different buckets) instead of one giant lock for everything."
        }
      ],
      description: `Production databases process millions of requests per second by utilizing all available CPU cores. In Level 5, you tackle the most notoriously difficult problem in computer science: Concurrency.

If you simply wrap your entire database in a single mutex lock, your multi-core server will bottleneck instantly, processing requests one by one. By implementing fine-grained locking (like locking individual buckets or partitions), you allow readers and writers to operate in parallel, maximizing hardware utilization while guaranteeing data safety.`,
      implementationGuide: [
        "Spawn multiple worker threads/routines to handle incoming database commands simultaneously.",
        "Identify the critical sections where your Hash Table's linked lists are modified.",
        "Implement an array of Mutexes (e.g., 16 locks). When modifying a bucket, use `hash(key) % 16` to determine which lock to acquire.",
        "Ensure locks are always released, even if an error occurs during the operation, to prevent permanent deadlocks."
      ],
    diagram: `PING PROTOCOL & MULTI-KEY DISPATCH:
PING             ──► Health Check Responder      ──► PONG
PING hello       ──► Echo Argument               ──► hello

MSET alpha 1 beta 2 gamma 3
     │
     ▼
Atomically sets entries across memory partitions:
  memory["alpha"] = "1"
  memory["beta"]  = "2"
  memory["gamma"] = "3"
     │
     ▼
OUTPUT: OK
GET alpha        ──► memory["alpha"] ──► 1
GET beta         ──► memory["beta"]  ──► 2`,
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
      { cmd: "SET key value", desc: "Standard thread-safe atomic set." },
      { cmd: "GET key", desc: "Standard thread-safe atomic get." },
    ],
    durabilityRules: [
      "Striped Locking: Partition keyspace into 32 or 64 independent mutex shards to eliminate global lock bottleneck.",
      "Reader-Writer Locks: Allow concurrent simultaneous readers while acquiring exclusive locks only for mutations.",
      "Deadlock Avoidance: For multi-key operations (MGET, MSET), always acquire locks in sorted order of shard index.",
      "Thread Safety: Zero race conditions under 16 concurrent worker threads (verified via ThreadSanitizer).",
    ],
    examples: [
        {
          title: "PING Healthcheck",
          input: "PING\nPING hello",
          output: "PONG\nhello",
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
      whatAreYouBuilding: `You are going to shrink the journal so the hard drive doesn't fill up.

If someone updates Alice's number 10,000 times, the journal (WAL) will have 10,000 lines, taking up huge disk space. You will compress it into a single line showing only her *final* number.

For example:
SET x 1
SET x 2
SET x 3
COMPACT_WAL

It should rewrite the log to remove redundant entries:
WAL_SIZE_BEFORE: 300 bytes
WAL_SIZE_AFTER: 100 bytes (Only contains 'SET x 3')`,
      howItWorks: `1. Over time, the WAL grows infinitely large, filled with outdated commands (like SET x 1, which was overwritten by SET x 2).
2. When the WAL reaches a size limit (e.g., 100MB), the background compaction process triggers.
3. The process looks at the current, perfectly updated in-memory dictionary.
4. It writes a brand new, optimized WAL file containing only the active, final state of the database.
5. Once the new file is fully written and saved to disk, it deletes the massive old WAL file and seamlessly switches to the new one.`,
      technicalTerms: [
        {
          "term": "Log Compaction",
          "definition": "The process of discarding obsolete entries from an append-only log to save space."
        },
        {
          "term": "Point-in-time Snapshot",
          "definition": "Capturing the exact state of the in-memory database at a specific millisecond to write to disk."
        },
        {
          "term": "Atomic File Rename",
          "definition": "A filesystem operation that swaps a temporary file with a live file instantaneously, ensuring the database is never left without a valid log if the power fails during compaction."
        }
      ],
      description: `Append-only logs are incredibly fast, but they trade disk space for speed. In Level 6, you build the critical maintenance process that keeps the database running forever: Compaction.

Without compaction, a database server running for months would eventually consume the entire hard drive, and rebooting would take hours as it replayed millions of obsolete commands. By periodically taking a snapshot of memory and rewriting the log, you bound disk usage and guarantee instant crash recovery times, a technique universally used by systems from Redis to PostgreSQL.`,
      implementationGuide: [
        "Implement a background loop that monitors the size of your WAL file on disk.",
        "When it exceeds a threshold, initiate compaction: create a new temporary file (e.g., `wal.tmp`).",
        "Iterate over every valid key-value pair currently in your Hash Table and write it as a `SET` command to the temporary file.",
        "Perform an atomic file rename (e.g., `mv wal.tmp wal.log`) to safely replace the bloated file with the optimized one."
      ],
    diagram: `LOG COMPACTION PIPELINE:
Original WAL (Uncompacted Mutations):
┌────────────────────────────────────────────────────────────┐
│ SET user:1 old │ SET user:1 new │ ...                      │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼ COMPACT Command Triggered
Scan In-Memory Keyspace (Only Live State):
Live Keys: { "user:1": "new" } (Obsolete "old" entry discarded!)
                              │
                              ▼
Atomic Swap: Write wal.log.tmp ──► rename to wal.log
Compacted WAL (1 Entry, Space Reclaimed):
┌────────────────────────────────────────────────────────────┐
│ SET user:1 new                                             │
└────────────────────────────────────────────────────────────┘

EXECUTION TRACE (Case 1):
SET user:1 old  ──► OK
SET user:1 new  ──► OK
COMPACT         ──► OK
GET user:1      ──► new

MEMSTATS (Memory Tracking):
ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00`,
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
      { cmd: "MEMSTATS", desc: "Returns detailed memory metrics. For exact test cases, expects specific format like 'ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00'." },
      { cmd: "SET / GET / EXISTS / DELETE", desc: "Standard operations supported." },
    ],
    durabilityRules: [
      "Custom Memory Arena: Allocate memory in fixed-size slab pools to eliminate malloc/free heap fragmentation.",
      "Cache-Line Packing: Align hot data structures (hash node headers, key pointers) to 64-byte CPU cache lines.",
      "Zero-Copy Parsing: Parse incoming protocol buffers directly without allocating intermediate strings.",
      "Online WAL Compaction: Atomically replace bloated log files with clean point-in-time state snapshots.",
    ],
    examples: [
        {
          title: "COMPACT Log Compaction",
          input: "SET user:1 old\nSET user:1 new\nCOMPACT\nGET user:1",
          output: "OK\nOK\nOK\nnew",
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
