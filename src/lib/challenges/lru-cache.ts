// src/lib/challenges/lru-cache.ts
import { ChallengeData } from "./types";

export const lruCacheChallenge: ChallengeData = {
  slug: "lru-cache",
  number: "06",
  title: "Cache & Eviction Engine",
  subtitle: "From doubly-linked LRU lists and LFU frequency tiers to memory-budgeted evictions.",
  badge: "PERFORMANCE ENGINEERING CAPSTONE",
  domain: "CORE_SYSTEMS",
  inspiredBy: "Redis, Memcached, Guava",
  whatStudentsBuild: "Workload-adaptive cache",
  mainSkill: "Caching, eviction, memory",
  signatureQuestion: "Can you increase hit rate without increasing memory?",
  overview:
    "In this engineering challenge, you construct an ultra-low latency cache engine from first principles — inspired by the caching architectures of Redis, Memcached, and Guava. You build raw doubly-linked list node pointer splicing (LRU), frequency count tiering (LFU), millisecond TTL expiration, and byte-accurate memory budgeting.",
  whyItMatters:
    "Caches sit directly in front of primary databases. If a cache algorithm evicts the wrong hot keys or suffers O(N) eviction sweeps, downstream databases collapse under thundering herds. Understanding LRU and LFU eviction dynamics is essential for distributed systems.",
  finalOutcome:
    "Upon completing all 6 levels, you have engineered a production-grade cache engine supporting both LRU and LFU eviction modes, millisecond TTL expiration, strict byte memory caps, and sub-0.01ms O(1) operations.",
  philosophy: "Encounter real caching engineering problems: recency vs frequency trade-offs, O(1) pointer splicing, timer min-heap sweeps, and workload-adaptive replacement.",
  architectureDiagram: `                  HASH MAP (O(1) Lookup)
                   "alpha" ──► Node A
                   "beta"  ──► Node B
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
       [Head / MRU]                   [Tail / LRU]
      ┌─────────────┐               ┌─────────────┐
      │ Node B: 42  │ ◄───────────► │ Node A: 10  │
      └─────────────┘               └─────────────┘
      (Most Recent)                 (Evict First)`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Fixed capacity LRU cache", mainConcept: "Doubly-linked list + Hash map, O(1) tail eviction on overflow" },
    { level: 2, whatWeBuild: "Access recency MRU promotion", mainConcept: "Read-path pointer splicing, promoting keys to head on GET" },
    { level: 3, whatWeBuild: "LFU frequency bucket chains", mainConcept: "Frequency count tiers, least-frequently-used eviction, access decay" },
    { level: 4, whatWeBuild: "Millisecond TTL expiration timer", mainConcept: "Passive on-read check + active timer expiration using monotonic clocks" },
    { level: 5, whatWeBuild: "Byte-accurate memory budgeter", mainConcept: "Tracking physical payload bytes, evicting under byte RAM pressure" },
    { level: 6, whatWeBuild: "Hit-ratio telemetry & benchmarking", mainConcept: "Hit/miss ratios, eviction rate instrumentation under 100K ops/s" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Hash Map + Doubly-Linked List",
      focus: "O(1) Head/Tail Pointer Re-linking",
      description: "Combines hash table key resolution with doubly-linked nodes to track recency in O(1) time.",
      realWorldTech: "Java LinkedHashMap, Python OrderedDict internal C struct",
    },
    {
      number: 2,
      name: "Recency Access Updates",
      focus: "MRU Pointer Promotion on GET",
      description: "Promotes accessed keys to the head of the list on every read to protect active keys from eviction.",
      realWorldTech: "Memcached item LRU promotion",
    },
    {
      number: 3,
      name: "LFU Frequency Buckets",
      focus: "Least Frequently Used Eviction",
      description: "Maintains frequency buckets to preserve high-value items that are accessed repeatedly over time.",
      realWorldTech: "Redis LFU eviction (server.lfu_decay_time)",
    },
    {
      number: 4,
      name: "TTL Expiration Timer",
      focus: "Passive + Active Expiration",
      description: "Enforces time-to-live per key, invalidating expired entries before checking capacity evictions.",
      realWorldTech: "Redis activeExpireCycle, Memcached slab expiration",
    },
    {
      number: 5,
      name: "Byte Memory Budgeter",
      focus: "Payload Size Memory Accounting",
      description: "Calculates accurate byte weights for keys and values, evicting items when memory quota is exceeded.",
      realWorldTech: "Redis maxmemory and maxmemory-policy",
    },
    {
      number: 6,
      name: "Hit Ratio Telemetry",
      focus: "Cache Hit/Miss Instrumentation",
      description: "Measures hit rates, eviction frequency, and memory fragmentation under 1,000,000 simulated requests.",
      realWorldTech: "Memcached stats and Redis INFO stats",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Fixed Capacity LRU",
      title: "Basic LRU Eviction & O(1) Linked List",
      difficulty: "Easy",
      tagline: "Build a fixed-capacity LRU cache. When capacity is exceeded, evict the least recently inserted key.",
      diagram: `INPUT (Capacity=2)            CACHE STATE (MRU ──► LRU)      OUTPUT
PUT k1 v1              ──────► [k1:v1]                   ──► OK
PUT k2 v2              ──────► [k2:v2] ──► [k1:v1]       ──► OK
PUT k3 v3              ──────► [k3:v3] ──► [k2:v2]       ──► OK (k1 evicted!)
GET k1                 ──────► not found                 ──► NULL
GET k2                 ──────► hit                       ──► v2`,
      importantChallenge: {
        title: "Doubly-linked pointer edge-case bugs",
        description:
          "When unlinking a node from the middle, head, or tail of a doubly-linked list, failing to update both prev.next and next.prev corrupts memory. Managing sentinel dummy head and tail nodes eliminates null-pointer checks and prevents memory corruption.",
        codeOrFormat: "node.prev.next = node.next; node.next.prev = node.prev; (always safe with dummy head/tail)",
      },
      endGoalDemonstration: `CAPACITY 2
OK
PUT a 1
OK
PUT b 2
OK
PUT c 3
OK
GET a
NULL
GET b
2`,
      nextLevelTeaser:
        "In Level 2, reads (GET) become state-mutating operations: whenever a key is accessed, it must be spliced out of its current position and promoted to the head (MRU) of the list in strict O(1) time.",
      learningLoop: {
        bottleneck: "Array-based caches require O(N) shifts on eviction. Combining a hash table with a doubly-linked list enables strict O(1) get, put, and eviction.",
        whatYouUnderstand: [
          "Hash Map (for O(1) node address lookup) + Doubly-Linked List (for O(1) eviction).",
          "Evicting the tail node when count > capacity.",
          "Overwriting existing keys without leaking capacity.",
        ],
        productionParity: "The classic LRU cache design in Memcached and standard caching libraries.",
        outcomeSummary: "You master O(1) node unlinking, capacity enforcement, and tail eviction.",
      },
      operations: [
        { cmd: "CAPACITY <n>", desc: "Initializes cache capacity to n items. Returns 'OK'." },
        { cmd: "PUT <key> <val>", desc: "Inserts or updates key. Evicts LRU if at capacity. Returns 'OK'." },
        { cmd: "GET <key>", desc: "Retrieves value. Returns '<val>' or 'NULL'." },
      ],
      examples: [
        { title: "Capacity 2 Eviction", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nPUT c 3\nGET a\nGET c", output: "OK\nOK\nOK\nOK\nNULL\n3" },
      ],
      constraints: ["Strict O(1) get and put time complexity", "Default capacity 3 if not specified"],
      cases: [
        { name: "Case 1: Capacity 2 Eviction", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nPUT c 3\nGET a\nGET c", expected: "OK\nOK\nOK\nOK\nNULL\n3" },
        { name: "Case 2: Overwrite Key Does Not Evict", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nPUT a 10\nGET a\nGET b", expected: "OK\nOK\nOK\nOK\n10\n2" },
        { name: "Case 3: Missing Key Lookup", input: "CAPACITY 2\nGET missing", expected: "OK\nNULL" },
        { name: "Case 4: Capacity 1 Thrashing", input: "CAPACITY 1\nPUT a 1\nPUT b 2\nGET a\nGET b", expected: "OK\nOK\nOK\nNULL\n2" },
        { name: "Case 5: Multiple Updates", input: "CAPACITY 3\nPUT x 1\nPUT y 2\nPUT z 3\nPUT w 4\nGET x", expected: "OK\nOK\nOK\nOK\nOK\nNULL" },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Recency on Read",
      title: "Touch on Read & Pointer Re-linking",
      difficulty: "Medium",
      tagline: "A GET request must 'touch' the accessed key, promoting it to Most Recently Used (MRU) head.",
      diagram: `GET QUERY                     POINTER SPLICING (MRU PROMOTION)       CACHE ORDER
State: [a] <-> [b]     ──► GET a touches node "a"             ──► [a] promoted to HEAD
PUT c 3                ──► Capacity=2: Evicts tail "b"!       ──► Cache: [c] <-> [a]
GET b                  ──► "b" was evicted                    ──► NULL

Doubly-Linked List Pointer Splicing:
Before GET(a):  [HEAD] <──► [ b ] <──► [ a ] <──► [TAIL]
                             ▲           │
                             │   Splice  │ Unlink from middle
                             └─── out ───┘
After GET(a):   [HEAD] <──► [ a ] <──► [ b ] <──► [TAIL]`,
      learningLoop: {
        bottleneck: "If reads don't refresh recency, hot keys accessed a thousand times will be evicted simply because they were inserted earliest. GET must promote keys to head.",
        whatYouUnderstand: [
          "Unlinking node from current position and re-inserting at MRU head.",
          "Preventing hot-key eviction during high read traffic.",
          "Handling edge cases: Touching head node vs touching tail node.",
        ],
        productionParity: "Memcached item_touch and Redis LRU clock update.",
        outcomeSummary: "You implement true LRU read promotion and preserve active working sets.",
      },
      operations: [
        { cmd: "GET <key>", desc: "Returns value and promotes key to MRU head position." },
      ],
      examples: [
        { title: "Read Prevents Eviction", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nGET a\nPUT c 3\nGET a\nGET b", output: "OK\nOK\nOK\n1\nOK\n1\nNULL" },
      ],
      constraints: ["GET must promote node to MRU head in O(1) time"],
      cases: [
        { name: "Case 1: Read Promotes Key", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nGET a\nPUT c 3\nGET a\nGET b", expected: "OK\nOK\nOK\n1\nOK\n1\nNULL" },
        { name: "Case 2: Touching Tail Node", input: "CAPACITY 3\nPUT a 1\nPUT b 2\nPUT c 3\nGET a\nPUT d 4\nGET b\nGET a", expected: "OK\nOK\nOK\nOK\n1\nOK\nNULL\n1" },
        { name: "Case 3: Touching Head Node Is No-Op", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nGET b\nPUT c 3\nGET a", expected: "OK\nOK\nOK\n2\nOK\nNULL" },
        { name: "Case 4: Consecutive Reads", input: "CAPACITY 2\nPUT a 1\nGET a\nGET a\nPUT b 2\nPUT c 3\nGET a", expected: "OK\nOK\n1\n1\nOK\nOK\nNULL" },
        { name: "Case 5: Read Missing Key Does Not Alter Order", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nGET z\nPUT c 3\nGET a", expected: "OK\nOK\nOK\nNULL\nOK\nNULL" },
      ],
    },
    3: {
      level: 3,
      shortTitle: "LFU Eviction Mode",
      title: "Least Frequently Used (LFU) Mode",
      difficulty: "Hard",
      tagline: "Implement LFU mode. Track access frequency counts and evict the least frequently queried key.",
      diagram: `ACCESS WORKLOAD               FREQUENCY BUCKET TRACKING              EVICTION DECISION
MODE LFU               ──► Switch policy to LFU               ──► OK
PUT a 1, GET a, GET a  ──► freq["a"] = 3                      ──► 1
PUT b 2, PUT c 3       ──► freq["b"] = 1, evicts "b" (not a!) ──► OK

LFU Multi-Frequency Lists:
Freq 1: [ b ] (Least Frequently Used -> Eviction candidate)
Freq 2: [ c ]
Freq 3: [ a ] (Protected by high query volume)`,
      learningLoop: {
        bottleneck: "LRU suffers from 'cache pollution': a one-time sequential scan flushes all hot items from the cache. LFU protects frequently accessed keys by tracking access counts.",
        whatYouUnderstand: [
          "LFU frequency tracking: Each key maintains an access counter.",
          "Tie-breaking: If two keys have equal frequency, evict the least recently used among them.",
          "MODE LFU vs MODE LRU dynamic switching.",
        ],
        productionParity: "Redis LFU eviction algorithm (maxmemory-policy allkeys-lfu).",
        outcomeSummary: "You master frequency-based caching and protect caches against scan pollution.",
      },
      operations: [
        { cmd: "MODE LFU", desc: "Switches eviction policy to Least Frequently Used. Returns 'OK'." },
        { cmd: "FREQ <key>", desc: "Returns access count of key." },
      ],
      examples: [
        { title: "LFU Mode Eviction", input: "CAPACITY 2\nMODE LFU\nPUT a 1\nPUT b 2\nGET a\nPUT c 3\nGET a\nGET b", output: "OK\nOK\nOK\nOK\n1\nOK\n1\nNULL" },
      ],
      constraints: ["Track access counts accurately", "Tie-break on equal frequency using LRU"],
      cases: [
        { name: "Case 1: LFU Protects High Frequency Key", input: "CAPACITY 2\nMODE LFU\nPUT a 1\nPUT b 2\nGET a\nGET a\nPUT c 3\nGET a\nGET b", expected: "OK\nOK\nOK\nOK\n1\n1\nOK\n1\nNULL" },
        { name: "Case 2: FREQ Query", input: "CAPACITY 2\nMODE LFU\nPUT a 1\nGET a\nGET a\nFREQ a", expected: "OK\nOK\nOK\n1\n1\n3" },
        { name: "Case 3: LFU Equal Frequency Tie-Break", input: "CAPACITY 2\nMODE LFU\nPUT a 1\nPUT b 2\nPUT c 3\nGET a\nGET b", expected: "OK\nOK\nOK\nOK\nOK\nNULL\n2" },
        { name: "Case 4: Overwrite Preserves Frequency", input: "CAPACITY 2\nMODE LFU\nPUT a 1\nGET a\nPUT a 10\nFREQ a", expected: "OK\nOK\nOK\n1\nOK\n2" },
        { name: "Case 5: Missing Key Frequency", input: "CAPACITY 2\nFREQ missing", expected: "OK\n0" },
      ],
    },
    4: {
      level: 4,
      shortTitle: "TTL Expiration",
      title: "TTL & Key Expiration",
      difficulty: "Hard",
      tagline: "Implement SETEX for millisecond key expiration. Expired keys must never be returned or count against capacity.",
      diagram: `TEMPORAL OPERATION            TTL LIFECYCLE EVALUATION               RETURN VALUE
SETEX token 5000 abc   ──► Store val="abc", expire_at=T+5000 ──► OK
TTL token              ──► Check remaining monotonic ms      ──► 4998 ms
[After 5000ms] GET     ──► Passive Expire: Purge node!       ──► NULL

Dual-Mode Eviction Engine:
Read Access (GET / TTL) ──► Is expired? ──► YES ──► Delete & Return NULL
                                        └──► NO  ──► Return Value & Touch`,
      learningLoop: {
        bottleneck: "Caches must discard stale data before evicting valuable fresh items. Passive lazy evaluation checks expiration on read.",
        whatYouUnderstand: [
          "SETEX <key> <ttl_ms> <val> command contract.",
          "Passive expiration check: If current_time >= expire_at, purge immediately.",
          "TTL <key> returning ms remaining, -1 (permanent), or -2 (absent).",
        ],
        productionParity: "Redis SETEX and PEXPIRE commands.",
        outcomeSummary: "You implement millisecond time-to-live lifecycle management.",
      },
      operations: [
        { cmd: "SETEX <key> <ttl_ms> <val>", desc: "Sets key with millisecond expiration. Returns 'OK'." },
        { cmd: "TTL <key>", desc: "Returns remaining lifetime in ms (-1 permanent, -2 absent)." },
      ],
      examples: [
        { title: "SETEX & TTL", input: "CAPACITY 2\nSETEX token 5000 abc\nTTL token", output: "OK\nOK\n>0" },
      ],
      constraints: ["Millisecond precision timers", "Expired keys return NULL and count as absent"],
      cases: [
        { name: "Case 1: SETEX & Immediate Read", input: "CAPACITY 2\nSETEX session 5000 123\nGET session", expected: "OK\nOK\n123" },
        { name: "Case 2: Permanent Key TTL is -1", input: "CAPACITY 2\nPUT perm 42\nTTL perm", expected: "OK\nOK\n-1" },
        { name: "Case 3: Non-existent Key TTL is -2", input: "CAPACITY 2\nTTL not_found", expected: "OK\n-2" },
        { name: "Case 4: Overwrite Clears TTL", input: "CAPACITY 2\nSETEX a 1000 val\nPUT a val2\nTTL a", expected: "OK\nOK\nOK\n-1" },
        { name: "Case 5: Multiple SETEX Keys", input: "CAPACITY 2\nSETEX k1 10000 v1\nSETEX k2 10000 v2\nGET k1\nGET k2", expected: "OK\nOK\nOK\nv1\nv2" },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Memory Budgeting",
      title: "Byte-Accurate Memory Caps",
      difficulty: "Hard",
      tagline: "Evict based on payload byte weight (MAXMEMORY <bytes>) rather than fixed item count.",
      diagram: `BYTE BUDGET                   HEAP CONSUMPTION TRACKER              EVICTION LOOP
MAXMEMORY 10           ──► Set hard ceiling = 10 bytes        ──► OK
PUT a 12345 (6 bytes)  ──► Used: 6B <= 10B                   ──► OK
PUT b 12345 (6 bytes)  ──► Used: 12B > 10B! Evicts "a"!       ──► OK (Used: 6B)

Memory Allocation Accounting:
Item "a": key(1B) + val(5B) = 6 Bytes
Item "b": key(1B) + val(5B) = 6 Bytes
Total = 12 Bytes > 10 Bytes Limit ──► Evict Tail until used <= 10B`,
      learningLoop: {
        bottleneck: "Ten 10-byte strings take 100 bytes; ten 10MB images take 100MB. Item-count limits cannot prevent Out-Of-Memory kills. Memory limits must be enforced in bytes.",
        whatYouUnderstand: [
          "Tracking payload byte size: len(key) + len(val).",
          "MAXMEMORY budget: Evicting items until total_bytes <= MAXMEMORY.",
          "Single oversized item rejection if item > MAXMEMORY.",
        ],
        productionParity: "Redis maxmemory-policy and jemalloc arena tracking.",
        outcomeSummary: "You implement byte-accurate memory enforcement and memory-bounded eviction.",
      },
      operations: [
        { cmd: "MAXMEMORY <bytes>", desc: "Sets hard memory limit in bytes. Returns 'OK'." },
        { cmd: "MEMORY_USED", desc: "Returns currently allocated payload bytes." },
      ],
      examples: [
        { title: "Byte Limit Eviction", input: "MAXMEMORY 10\nPUT a 12345\nPUT b 12345\nGET a", output: "OK\nOK\nOK\nNULL" },
      ],
      constraints: ["Calculate exact string byte size", "Evict until under budget"],
      cases: [
        { name: "Case 1: Memory Cap Evicts Old Key", input: "MAXMEMORY 10\nPUT k1 1234\nPUT k2 1234\nGET k1", expected: "OK\nOK\nOK\nNULL" },
        { name: "Case 2: Memory Used Tracking", input: "MAXMEMORY 100\nPUT a 1\nMEMORY_USED", expected: "OK\nOK\n2" },
        { name: "Case 3: Overwrite Reduces / Increases Memory", input: "MAXMEMORY 100\nPUT a 12345\nPUT a 1\nMEMORY_USED", expected: "OK\nOK\nOK\n2" },
        { name: "Case 4: Huge Item Evicts Multiple Keys", input: "MAXMEMORY 20\nPUT a 1\nPUT b 2\nPUT c 12345678901234567\nGET a", expected: "OK\nOK\nOK\nOK\nNULL" },
        { name: "Case 5: Zero Memory Initial", input: "MAXMEMORY 50\nMEMORY_USED", expected: "OK\n0" },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Telemetry & Hit Rate",
      title: "Hit-Rate Telemetry & Workload Benchmarking",
      difficulty: "Hard",
      tagline: "Track cache hits, misses, and eviction metrics under heavy 1,000,000 request simulation workloads.",
      diagram: `CACHE WORKLOAD                TELEMETRY COUNTERS                     STATS OUTPUT
GET a (Found in cache) ──► Hits++ (Hits = 1)                 ──► 1
GET b (Not in cache)   ──► Misses++ (Misses = 1)             ──► NULL
STATS                  ──► Hit Ratio = 1 / (1 + 1) = 0.50    ──► HITS: 1 MISSES: 1
                                                                 RATIO: 0.50 EVICTIONS: 0

Production Telemetry Matrix:
┌───────────────────────────┬───────────────────────────┐
│ Cache Hits:      1        │ Hit Ratio:       50.0%    │
│ Cache Misses:    1        │ Eviction Count:  0        │
└───────────────────────────┴───────────────────────────┘`,
      learningLoop: {
        bottleneck: "Without telemetry, engineers cannot know whether a cache is absorbing database load or wasting memory thrashing evictions.",
        whatYouUnderstand: [
          "Hit Rate Formula: HITS / (HITS + MISSES).",
          "Tracking eviction counts across workload phases.",
          "Balancing capacity vs hit rate trade-offs.",
        ],
        productionParity: "Memcached stats and Redis INFO stats (keyspace_hits / keyspace_misses).",
        outcomeSummary: "You build production-grade telemetry and measure cache hit efficiency.",
      },
      operations: [
        { cmd: "STATS", desc: "Returns 'HITS: <h> MISSES: <m> RATIO: <r> EVICTIONS: <e>'." },
        { cmd: "FLUSHALL", desc: "Clears all cached entries and resets stats. Returns 'OK'." },
      ],
      examples: [
        { title: "Stats Query", input: "CAPACITY 2\nPUT a 1\nGET a\nGET b\nSTATS", output: "OK\nOK\n1\nNULL\nHITS: 1 MISSES: 1 RATIO: 0.50 EVICTIONS: 0" },
      ],
      constraints: ["Accurate hit/miss counters", "Track evictions count"],
      cases: [
        { name: "Case 1: 50% Hit Rate", input: "CAPACITY 2\nPUT a 1\nGET a\nGET b\nSTATS", expected: "OK\nOK\n1\nNULL\nHITS: 1 MISSES: 1 RATIO: 0.50 EVICTIONS: 0", check: (act) => act.includes("HITS: 1") && act.includes("MISSES: 1") },
        { name: "Case 2: 100% Hit Rate", input: "CAPACITY 2\nPUT a 1\nGET a\nGET a\nSTATS", expected: "HITS: 2 MISSES: 0", check: (act) => act.includes("HITS: 2") && act.includes("MISSES: 0") },
        { name: "Case 3: Eviction Counter", input: "CAPACITY 2\nPUT a 1\nPUT b 2\nPUT c 3\nSTATS", expected: "EVICTIONS: 1", check: (act) => act.includes("EVICTIONS: 1") },
        { name: "Case 4: FLUSHALL Reset", input: "CAPACITY 2\nPUT a 1\nFLUSHALL\nGET a\nSTATS", expected: "OK\nOK\nOK\nNULL\nHITS: 0 MISSES: 1", check: (act) => act.includes("MISSES: 1") },
        { name: "Case 5: High-Frequency Workload", input: "CAPACITY 3\nPUT a 1\nPUT b 2\nGET a\nGET b\nGET c\nSTATS", expected: "HITS: 2 MISSES: 1", check: (act) => act.includes("HITS: 2") && act.includes("MISSES: 1") },
      ],
    },
  },
  starterTemplates: {
    python: `"""
ALGO Challenge 05: Build a Cache (Python 3.12)
Inspired by Redis & Memcached
Supporting Levels 1 - 6
"""
import sys

class CacheNode:
    def __init__(self, key: str, val: str):
        self.key = key
        self.val = val
        self.freq = 1
        self.prev = None
        self.next = None

class ProductionCache:
    def __init__(self, capacity: int = 3):
        self.capacity = capacity
        self.max_bytes = 0
        self.mode = "LRU"
        self.items = {}       # key -> CacheNode
        self.head = None      # MRU
        self.tail = None      # LRU
        self.ttls = {}        # key -> expire_ms
        self.hits = 0
        self.misses = 0
        self.evictions = 0

    def _remove_node(self, node: CacheNode):
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev
        node.prev = None
        node.next = None

    def _add_to_head(self, node: CacheNode):
        node.next = self.head
        node.prev = None
        if self.head:
            self.head.prev = node
        self.head = node
        if not self.tail:
            self.tail = node

    def put(self, key: str, val: str):
        self.ttls.pop(key, None)
        if key in self.items:
            node = self.items[key]
            node.val = val
            node.freq += 1
            self._remove_node(node)
            self._add_to_head(node)
            return

        # Check memory or capacity eviction
        if self.max_bytes > 0:
            while self.items and (self.memory_used() + len(key) + len(val) > self.max_bytes):
                self._evict()
        elif len(self.items) >= self.capacity:
            self._evict()

        new_node = CacheNode(key, val)
        self.items[key] = new_node
        self._add_to_head(new_node)

    def _evict(self):
        if not self.items:
            return
        self.evictions += 1
        if self.mode == "LFU":
            min_node = min(self.items.values(), key=lambda n: n.freq)
            self.items.pop(min_node.key, None)
            self._remove_node(min_node)
        else:
            if self.tail:
                self.items.pop(self.tail.key, None)
                self._remove_node(self.tail)

    def get(self, key: str) -> str:
        if key not in self.items:
            self.misses += 1
            return "NULL"
        node = self.items[key]
        node.freq += 1
        self.hits += 1
        self._remove_node(node)
        self._add_to_head(node)
        return node.val

    def memory_used(self) -> int:
        return sum(len(n.key) + len(n.val) for n in self.items.values())

    def stats(self) -> str:
        total = self.hits + self.misses
        ratio = (self.hits / total) if total > 0 else 0.0
        return f"HITS: {self.hits} MISSES: {self.misses} RATIO: {ratio:.2f} EVICTIONS: {self.evictions}"

def main():
    cache = ProductionCache()
    for line in sys.stdin:
        line = line.strip()
        if not line or line == "EXIT":
            break
        parts = line.split(" ")
        cmd = parts[0]

        if cmd == "CAPACITY" and len(parts) >= 2:
            cache.capacity = int(parts[1])
            print("OK")
        elif cmd == "MODE" and len(parts) >= 2:
            cache.mode = parts[1]
            print("OK")
        elif cmd == "PUT" and len(parts) >= 3:
            cache.put(parts[1], parts[2])
            print("OK")
        elif cmd == "GET" and len(parts) >= 2:
            print(cache.get(parts[1]))
        elif cmd == "FREQ" and len(parts) >= 2:
            node = cache.items.get(parts[1])
            print(node.freq if node else 0)
        elif cmd == "SETEX" and len(parts) >= 4:
            cache.put(parts[1], parts[3])
            cache.ttls[parts[1]] = int(parts[2])
            print("OK")
        elif cmd == "TTL" and len(parts) >= 2:
            k = parts[1]
            if k not in cache.items:
                print("-2")
            elif k in cache.ttls:
                print(cache.ttls[k])
            else:
                print("-1")
        elif cmd == "MAXMEMORY" and len(parts) >= 2:
            cache.max_bytes = int(parts[1])
            print("OK")
        elif cmd == "MEMORY_USED":
            print(cache.memory_used())
        elif cmd == "STATS":
            print(cache.stats())
        elif cmd == "FLUSHALL":
            cache.items.clear()
            cache.head = None
            cache.tail = None
            cache.hits = 0
            cache.misses = 0
            cache.evictions = 0
            print("OK")

if __name__ == "__main__":
    main()
`,
    cpp: `// ALGO Challenge 05: Build a Cache (C++20)
// Inspired by Redis & Memcached
#include <iostream>
#include <string>
#include <unordered_map>
#include <list>
#include <sstream>
#include <iomanip>

struct CacheItem {
    std::string key;
    std::string val;
    int freq = 1;
};

class Cache {
public:
    int capacity = 3;
    int max_bytes = 0;
    std::string mode = "LRU";
    int hits = 0;
    int misses = 0;
    int evictions = 0;

    std::list<CacheItem> order; // front is MRU, back is LRU
    std::unordered_map<std::string, std::list<CacheItem>::iterator> map;
    std::unordered_map<std::string, int> ttls;

    int memory_used() {
        int bytes = 0;
        for (const auto& item : order) {
            bytes += item.key.size() + item.val.size();
        }
        return bytes;
    }

    void evict() {
        if (order.empty()) return;
        evictions++;
        if (mode == "LFU") {
            auto min_it = order.begin();
            for (auto it = order.begin(); it != order.end(); ++it) {
                if (it->freq < min_it->freq) min_it = it;
            }
            map.erase(min_it->key);
            order.erase(min_it);
        } else {
            map.erase(order.back().key);
            order.pop_back();
        }
    }

    void put(const std::string& k, const std::string& v) {
        ttls.erase(k);
        if (map.count(k)) {
            auto it = map[k];
            it->val = v;
            it->freq++;
            order.splice(order.begin(), order, it);
            return;
        }

        if (max_bytes > 0) {
            while (!order.empty() && (memory_used() + (int)k.size() + (int)v.size() > max_bytes)) {
                evict();
            }
        } else if ((int)order.size() >= capacity) {
            evict();
        }

        order.push_front({k, v, 1});
        map[k] = order.begin();
    }

    std::string get(const std::string& k) {
        if (!map.count(k)) {
            misses++;
            return "NULL";
        }
        hits++;
        auto it = map[k];
        it->freq++;
        order.splice(order.begin(), order, it);
        return it->val;
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    Cache cache;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty() || line == "EXIT") break;
        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "CAPACITY") {
            ss >> cache.capacity;
            std::cout << "OK\\n";
        } else if (cmd == "MODE") {
            ss >> cache.mode;
            std::cout << "OK\\n";
        } else if (cmd == "PUT") {
            std::string k, v;
            ss >> k >> v;
            cache.put(k, v);
            std::cout << "OK\\n";
        } else if (cmd == "GET") {
            std::string k;
            ss >> k;
            std::cout << cache.get(k) << "\\n";
        } else if (cmd == "FREQ") {
            std::string k;
            ss >> k;
            std::cout << (cache.map.count(k) ? cache.map[k]->freq : 0) << "\\n";
        } else if (cmd == "SETEX") {
            std::string k, v;
            int ms;
            ss >> k >> ms >> v;
            cache.put(k, v);
            cache.ttls[k] = ms;
            std::cout << "OK\\n";
        } else if (cmd == "TTL") {
            std::string k;
            ss >> k;
            if (!cache.map.count(k)) std::cout << "-2\\n";
            else if (cache.ttls.count(k)) std::cout << cache.ttls[k] << "\\n";
            else std::cout << "-1\\n";
        } else if (cmd == "MAXMEMORY") {
            ss >> cache.max_bytes;
            std::cout << "OK\\n";
        } else if (cmd == "MEMORY_USED") {
            std::cout << cache.memory_used() << "\\n";
        } else if (cmd == "STATS") {
            int total = cache.hits + cache.misses;
            double ratio = total > 0 ? (double)cache.hits / total : 0.0;
            std::cout << std::fixed << std::setprecision(2);
            std::cout << "HITS: " << cache.hits << " MISSES: " << cache.misses 
                      << " RATIO: " << ratio << " EVICTIONS: " << cache.evictions << "\\n";
        } else if (cmd == "FLUSHALL") {
            cache.order.clear();
            cache.map.clear();
            cache.hits = 0;
            cache.misses = 0;
            cache.evictions = 0;
            std::cout << "OK\\n";
        }
    }
    return 0;
}
`,
  },
};
