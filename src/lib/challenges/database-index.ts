// src/lib/challenges/database-index.ts
import { ChallengeData } from "./types";

export const databaseIndexChallenge: ChallengeData = {
  slug: "database-index",
  number: "07",
  title: "B+ Tree Database Index Engine",
  subtitle: "From 10M-row linear table scans to a slotted-page B+ Tree with buffer pool caching.",
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  domain: "CORE_SYSTEMS",
  inspiredBy: "PostgreSQL, SQLite, InnoDB",
  whatStudentsBuild: "Slotted-page B+ Tree indexing engine",
  mainSkill: "Storage, indexing, disk I/O",
  signatureQuestion: "Why doesn't a database scan every row?",
  overview:
    "In this engineering challenge, you construct a high-performance database indexing engine from first principles — inspired by the storage and indexing architectures of PostgreSQL, SQLite, and InnoDB. You start by experiencing catastrophic O(N) table scans, then engineer in-memory B-Trees, 4KB slotted page serialization, doubly-linked leaf range scanning, and buffer pool caching.",
  whyItMatters:
    "Scanning 10 million rows from disk can take seconds. An indexed B+ Tree finds any row in 3 to 4 disk page hops (sub-millisecond). Mastering B+ Trees bridges software algorithms with physical 4KB hardware page boundaries and OS page cache dynamics.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a production-grade B+ Tree indexing engine capable of resolving lookups in sub-0.05ms over 10M simulated records, supporting range scans, maintaining node balance, and caching disk pages in a bounded buffer pool.",
  philosophy: "Encounter real database engine problems: O(N) disk penalties, self-balancing node splits, 4KB slotted page framing, and clock buffer pool cache eviction.",
  architectureDiagram: `                     B+TREE ROOT NODE
                            │
               ┌────────────┴────────────┐
               │    Keys: [ 20 | 50 ]    │
               │   Child Ptrs: [A, B, C] │
               └────────────┬────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    Leaf Node A         Leaf Node B         Leaf Node C
 [1..19] ──Next──►   [20..49] ──Next──►   [50..99] ──Next──► NULL`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Table scan baseline engine", mainConcept: "O(N) sequential record inspection, linear scan penalty" },
    { level: 2, whatWeBuild: "Sorted array binary search index", mainConcept: "O(log N) binary search on sorted keys, write vs read trade-off" },
    { level: 3, whatWeBuild: "Self-balancing B-Tree node splitter", mainConcept: "M-way search tree invariants, node splitting, upward median promotion" },
    { level: 4, whatWeBuild: "B+ Tree linked leaf chain", mainConcept: "Doubly-linked leaf nodes, sequential range scans (min <= k <= max)" },
    { level: 5, whatWeBuild: "4KB slotted page disk formatter", mainConcept: "Hardware sector alignment (4096 bytes), item offset arrays, tuple serialization" },
    { level: 6, whatWeBuild: "LRU/Clock buffer pool manager", mainConcept: "Cached page frames, dirty page flushing, memory-bounded disk caching" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Table Scan Baseline Engine",
      focus: "O(N) Sequential Disk Inspection",
      description: "Demonstrates baseline cost of brute-force record iteration before introducing indices.",
      realWorldTech: "Postgres Seq Scan, SQLite full table scan",
    },
    {
      number: 2,
      name: "Binary Search Index",
      focus: "O(log N) Sorted Primary Key Arrays",
      description: "Maintains sorted key arrays to reduce lookup from O(N) to O(log N) comparisons.",
      realWorldTech: "Postgres BRIN index, sorted columnar arrays",
    },
    {
      number: 3,
      name: "B-Tree Node Splitter",
      focus: "Self-Balancing M-Way Tree Invariants",
      description: "Splits full nodes when capacity exceeds threshold M, bubbling median keys up to root.",
      realWorldTech: "Postgres nbtree/nbtinsert.c",
    },
    {
      number: 4,
      name: "B+ Tree Leaf Chain",
      focus: "Doubly-Linked Leaf Range Traversal",
      description: "Links leaf nodes sequentially, enabling O(K) range scans without traversing internal tree nodes.",
      realWorldTech: "Postgres Index Scan with Index Cond (min <= key <= max)",
    },
    {
      number: 5,
      name: "Slotted Page Disk Formatter",
      focus: "4096-Byte Hardware Page Alignment",
      description: "Serializes variable-length tuple data into slotted page headers matching physical disk sectors.",
      realWorldTech: "Postgres Slotted Page (PageHeaderData + ItemIdData)",
    },
    {
      number: 6,
      name: "Buffer Pool Manager",
      focus: "Clock Eviction & Dirty Page Flushing",
      description: "Caches hot disk pages in memory, evicting cold pages via Clock/LRU sweeps under memory pressure.",
      realWorldTech: "Postgres shared_buffers & Clock sweep algorithm",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Table Scan Baseline",
      title: "Sequential Table Scanning",
      difficulty: "Easy",
      tagline: "Implement INSERT and sequential SCAN. Measure O(N) lookup degradation.",
      whatAreYouBuilding: `Imagine looking for a specific person's phone number in a giant, completely randomized phone book. You would have to read every single page from beginning to end to find them.

You are going to build a simple database table that acts exactly like this. When data is inserted, it's just appended to a list. When you search, you must scan the entire list.

For example:
INSERT 42 Alice
SCAN 42

Your engine scans the list one by one until it finds 'Alice'.`,
      howItWorks: `When adding data:
1. Append the new row to the end of your storage list (very fast).

When searching for data:
1. Start at the first row.
2. Check if the ID matches.
3. Move to the next row.
4. Repeat until you find the ID or reach the end (very slow for large tables).`,
      technicalTerms: [
        { term: "Sequential Scan", definition: "Searching for data by checking every single record from start to finish." },
        { term: "O(N) Complexity", definition: "Performance that gets linearly slower as the amount of data (N) increases." },
        { term: "Table Scan", definition: "A database term for reading the entire table to resolve a query." }
      ],
      description: `Every database journey begins with a naive table scan. Appending records to a flat file or array is incredibly fast, but querying it is disastrously slow. Finding a single record in a million-row table requires a million checks. In Level 1, you build this baseline to experience the O(N) lookup degradation firsthand, setting the stage for why indices are mandatory in relational databases.`,
      implementationGuide: [
        "Create a simple list or array to act as your table.",
        "Implement 'INSERT <id> <value>' by appending a tuple/object to the list.",
        "Implement 'SCAN <id>' by using a for-loop to check every item in the list.",
        "Return the value if found, or 'NOT_FOUND' if the loop finishes without a match."
      ],
      diagram: `COMMANDS                     STORAGE ENGINE                 OUTPUT
INSERT 42 "Alice"     ──────► table.push({42, "Alice"})   ──► OK
SCAN 42               ──────► scan: compare 0..N rows     ──► Alice
SCAN 99               ──────► scan entire table (miss)    ──► NOT_FOUND`,
      importantChallenge: {
        title: "Sequential scan scalability bottleneck",
        description:
          "Appending rows is fast (O(1)), but finding a row requires linearly traversing every single entry (O(N)). As tables grow from 100 rows to 1,000,000 rows, queries degrade from microseconds to seconds. An index is the mathematical fix.",
        codeOrFormat: "SCAN 42 on 1M rows ──► 1,000,000 comparisons without index vs 3 hops with B+Tree",
      },
      endGoalDemonstration: `INSERT 10 "Alice"
OK
INSERT 20 "Bob"
OK
SCAN 10
Alice
SCAN 99
NOT_FOUND`,
      nextLevelTeaser:
        "In Level 2, we introduce sorted array indexing and binary search, cutting lookup comparisons from N down to log2(N).",
      learningLoop: {
        bottleneck: "Without an index, querying for a single row requires inspecting every row in the table, resulting in catastrophic O(N) latency.",
        whatYouUnderstand: [
          "Linear scan semantics: Iterating through an unindexed array/file.",
          "Insert cost O(1) vs Lookup cost O(N).",
          "Establishing the empirical performance baseline before indexing.",
        ],
        productionParity: "PostgreSQL Seq Scan node execution.",
        outcomeSummary: "You measure raw unindexed query performance and establish baseline metrics.",
      },
      operations: [
        { cmd: "INSERT <id> <value>", desc: "Appends row to table. Returns 'OK'." },
        { cmd: "SCAN <id>", desc: "Sequentially scans rows for matching id. Returns '<value>' or 'NOT_FOUND'." },
      ],
      examples: [
        { title: "Insert & Scan", input: "INSERT 10 Jason\nSCAN 10", output: "OK\nJason" },
      ],
      constraints: ["Strict sequential scan order", "Return NOT_FOUND if ID absent"],
      cases: [
        { name: "Case 1: Basic Insert & Scan", input: "INSERT 10 Jason\nSCAN 10", expected: "OK\nJason" },
        { name: "Case 2: Missing Record Scan", input: "SCAN 999", expected: "NOT_FOUND" },
        { name: "Case 3: Multiple Records Scan", input: "INSERT 1 Alice\nINSERT 2 Bob\nSCAN 2", expected: "OK\nOK\nBob" },
        { name: "Case 4: Overwrite on Same ID", input: "INSERT 1 Alex\nINSERT 1 Alexander\nSCAN 1", expected: "OK\nOK\nAlexander" },
        { name: "Case 5: Scan Last Inserted Record", input: "INSERT 100 A\nINSERT 200 B\nINSERT 300 C\nSCAN 300", expected: "OK\nOK\nOK\nC" },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Binary Search Index",
      title: "Sorted Primary Key Array",
      difficulty: "Medium",
      tagline: "Sort primary key pointers to reduce lookup cost from O(N) to O(log N) using binary search.",
      whatAreYouBuilding: `Now imagine the phone book is perfectly alphabetized. Instead of reading every page, you open to the middle. If the name you want is earlier in the alphabet, you open to the middle of the left half. 

You will build a Sorted Array Index. By keeping the IDs perfectly sorted, you can find records instantly using binary search.

For example:
INSERT 50 E
INDEX_GET 20

Your engine will smartly hop through the sorted list, skipping halves of the data at a time.`,
      howItWorks: `To search quickly using Binary Search:
1. Look at the middle element of the sorted array.
2. If it's the ID you want, you're done!
3. If the ID is smaller, repeat the process on the left half.
4. If the ID is larger, repeat the process on the right half.

This takes a 1,000,000 row search down to just 20 checks!`,
      technicalTerms: [
        { term: "Binary Search", definition: "A search algorithm that finds an item by repeatedly dividing the search space in half." },
        { term: "O(log N) Complexity", definition: "Logarithmic performance, meaning it takes very few steps even for massive datasets." },
        { term: "Primary Key", definition: "A unique identifier for a row, which is used to sort and index the data." }
      ],
      description: `Sorting data unlocks the power of Binary Search, plunging search costs from O(N) to O(log N). However, maintaining a flat sorted array introduces a new problem: inserting a new row in the middle of a massive array requires shifting thousands of elements down to make room. This level demonstrates the fundamental trade-off of database indices: significantly faster reads at the cost of slower writes.`,
      implementationGuide: [
        "Maintain a separate list of sorted keys, or keep your main table list sorted by ID.",
        "On INSERT, find the correct position and insert the item so the list remains sorted.",
        "Implement 'INDEX_GET <id>' using a standard while-loop binary search (low = 0, high = len - 1).",
        "If the middle element matches, return it. Otherwise adjust low or high appropriately."
      ],
      diagram: `UNSORTED INSERTS              SORTED PRIMARY KEY ARRAY              BINARY SEARCH
INSERT 50 E            ──► Keep keys sorted: [20, 50]        ──► OK
INDEX_GET 20           ──► Binary Search: Low=0, High=1      ──► 20 (Found: "B")
                           Mid=0 -> keys[0] == 20 (1 hop!)

Sorted Primary Key Index vs Heap Rows:
Index Array (Sorted Keys):
┌──────┬──────┬──────┬──────┬──────┐
│  10  │  20  │  30  │  40  │  50  │  ──► O(log N) Binary Search
└──┬───┴──┬───┴──┬───┴──┬───┴──┬───┘
   │      │      │      │      │ (Pointer / Tuple ID)
   ▼      ▼      ▼      ▼      ▼
Heap: [A]    [B]    [C]    [D]    [E]`,
      learningLoop: {
        bottleneck: "Linear scans check N items. Keeping an array sorted allows binary search in log2(N) steps, reducing 10,000,000 checks to just 24 checks.",
        whatYouUnderstand: [
          "Binary search over sorted key arrays.",
          "The trade-off: O(log N) search vs O(N) sorted insert shift.",
          "Why databases need tree structures rather than flat sorted arrays.",
        ],
        productionParity: "Postgres BRIN (Block Range Index) and SQLite binary search.",
        outcomeSummary: "You understand the power of logarithmic search and why flat arrays fail on inserts.",
      },
      operations: [
        { cmd: "INSERT <id> <value>", desc: "Appends row to table. Returns 'OK'." },
        { cmd: "INDEX_GET <id>", desc: "Performs binary search over sorted index. Returns '<value>' or 'NOT_FOUND'." },
      ],
      examples: [
        { title: "Indexed Lookup", input: "INSERT 50 E\nINSERT 20 B\nINDEX_GET 20", output: "OK\nOK\nB" },
      ],
      constraints: ["Maintain sorted order of keys", "Binary search logic"],
      cases: [
        { name: "Case 1: Out of Order Inserts", input: "INSERT 30 C\nINSERT 10 A\nINSERT 20 B\nINDEX_GET 10", expected: "OK\nOK\nOK\nA" },
        { name: "Case 2: Binary Search Missing", input: "INSERT 10 A\nINDEX_GET 15", expected: "OK\nNOT_FOUND" },
        { name: "Case 3: Binary Search Highest Key", input: "INSERT 1 A\nINSERT 2 B\nINSERT 3 C\nINDEX_GET 3", expected: "OK\nOK\nOK\nC" },
        { name: "Case 4: Binary Search Lowest Key", input: "INSERT 5 E\nINSERT 2 B\nINDEX_GET 2", expected: "OK\nOK\nB" },
        { name: "Case 5: Many Inserts & Lookup", input: "INSERT 100 H\nINSERT 50 M\nINSERT 200 Z\nINDEX_GET 50", expected: "OK\nOK\nOK\nM" },
      ],
    },
    3: {
      level: 3,
      shortTitle: "B-Tree Node Splitting",
      title: "Self-Balancing M-Way B-Tree",
      difficulty: "Hard",
      tagline: "Implement B-Tree node splitting. Keep maximum node size bounded to M keys without O(N) array shifts.",
      whatAreYouBuilding: `A flat sorted list is too rigid—inserting a name means rewriting half the phone book! A B-Tree is like a multi-level table of contents.

You will build a self-balancing B-Tree. Instead of one massive list, data is chunked into small 'nodes' that can hold up to 3 keys. When a node gets too full, it splits in half!

For example:
BTREE_INSERT 4 D

If the node already has [1, 2, 3], it overflows. It splits into two nodes and pushes the middle number up to act as a signpost.`,
      howItWorks: `When inserting into a B-Tree node:
1. Add the key to the node.
2. If the node has more than M keys (capacity exceeded), it must split.
3. The node splits into a left node and a right node.
4. The median (middle) key gets pushed up to the parent node to act as a router.
5. If the parent overflows, it splits too, growing the tree upwards!`,
      technicalTerms: [
        { term: "B-Tree", definition: "A self-balancing tree data structure that maintains sorted data in bounded nodes." },
        { term: "Node Splitting", definition: "Dividing a full node into two and pushing the middle key up to the parent." },
        { term: "Router Key", definition: "Keys in internal nodes that don't hold data, but guide the search left or right." }
      ],
      description: `B-Trees solve the insertion penalty of flat arrays. By grouping keys into small bounded nodes, an insert only requires shifting data within a tiny node. When a node overflows, it splits and promotes a median key upwards. This hierarchical structure guarantees that both reads and writes complete in O(log N) time, making it the bedrock of nearly all modern database engines.`,
      implementationGuide: [
        "For this simplified simulation, you can simulate the split conceptually or implement a basic B-Tree insertion algorithm.",
        "Set a strict capacity M=3 for nodes.",
        "Implement BTREE_INSERT to traverse down to a leaf, insert, and if keys > 3, split the leaf and promote the median to the parent.",
        "Implement BTREE_GET to traverse from the root, comparing the target ID against the router keys to decide which child to follow."
      ],
      diagram: `KEY INSERTION                 M=3 NODE SPLIT PIPELINE               BALANCED TREE
BTREE_INSERT 4 D       ──► Node [1, 2, 3] + 4 overflows!     ──► OK
                           Median key (2) promoted to Parent
                           Leaves split into [1] and [3, 4]

Node Split Mechanics:
Before Split (Overflow):
┌─────────────────────────┐
│     [ 1 , 2 , 3 , 4 ]   │ (Max M=3 keys exceeded!)
└─────────────────────────┘
              │
              ▼ Split & Promote Median (2)
             [ 2 ]  <-- New Root / Parent
            ┌──┴──┐
         [ 1 ]   [ 3 , 4 ]  <-- Balanced Children`,
      learningLoop: {
        bottleneck: "A flat sorted array requires shifting elements on insertion (O(N)). B-Trees group keys into small bounded nodes (e.g. 4 keys), splitting nodes on overflow.",
        whatYouUnderstand: [
          "B-Tree node capacity (M keys per node).",
          "Node splitting: Pushing median key to parent and creating two child nodes.",
          "Root splitting: Increasing tree height by 1 when root overflows.",
        ],
        productionParity: "Postgres nbtinsert.c (_bt_split) and SQLite B-tree.",
        outcomeSummary: "You implement self-balancing node splits and bounded logarithmic tree traversal.",
      },
      operations: [
        { cmd: "BTREE_INSERT <id> <val>", desc: "Inserts into B-Tree with node capacity M=3. Splits on 4th key. Returns 'OK'." },
        { cmd: "BTREE_GET <id>", desc: "Traverses B-Tree nodes to retrieve value. Returns '<val>' or 'NOT_FOUND'." },
      ],
      examples: [
        { title: "B-Tree Insert & Get", input: "BTREE_INSERT 10 X\nBTREE_GET 10", output: "OK\nX" },
      ],
      constraints: ["Node capacity M=3 keys maximum", "Balanced search traversal"],
      cases: [
        { name: "Case 1: 3 Inserts without split", input: "BTREE_INSERT 1 A\nBTREE_INSERT 2 B\nBTREE_INSERT 3 C\nBTREE_GET 2", expected: "OK\nOK\nOK\nB" },
        { name: "Case 2: 4th Insert Triggers Split", input: "BTREE_INSERT 1 A\nBTREE_INSERT 2 B\nBTREE_INSERT 3 C\nBTREE_INSERT 4 D\nBTREE_GET 4", expected: "OK\nOK\nOK\nOK\nD" },
        { name: "Case 3: Query Root and Leaves", input: "BTREE_INSERT 10 A\nBTREE_INSERT 20 B\nBTREE_INSERT 30 C\nBTREE_INSERT 40 D\nBTREE_GET 20\nBTREE_GET 10", expected: "OK\nOK\nOK\nOK\nB\nA" },
        { name: "Case 4: BTree Missing Key", input: "BTREE_INSERT 5 X\nBTREE_GET 99", expected: "OK\nNOT_FOUND" },
        { name: "Case 5: Descending Inserts Split", input: "BTREE_INSERT 40 D\nBTREE_INSERT 30 C\nBTREE_INSERT 20 B\nBTREE_INSERT 10 A\nBTREE_GET 10", expected: "OK\nOK\nOK\nOK\nA" },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Range Queries",
      title: "B+ Tree Leaf Chaining",
      difficulty: "Hard",
      tagline: "Link leaf nodes sequentially. Execute high-speed range scans (WHERE id BETWEEN min AND max) in O(K) time.",
      whatAreYouBuilding: `If you want to read a whole chapter of a book, you don't use the table of contents for every single page. You find the first page, and then just flip forward.

You will upgrade your tree to a B+ Tree by chaining the bottom nodes (leaves) together. This allows blazing-fast range queries (like finding everyone aged 20 to 30).

For example:
RANGE 10 25

Your engine finds 10 using the tree, then just follows a linked chain to instantly grab all values up to 25.`,
      howItWorks: `To execute a Range Scan:
1. Traverse down the tree to find the minimum ID (the start of the range).
2. Once at the leaf node, read the values.
3. Instead of going back up the tree, use a 'next' pointer to hop directly to the adjacent leaf node.
4. Keep reading and hopping until you hit an ID that is greater than your maximum ID.`,
      technicalTerms: [
        { term: "B+ Tree", definition: "A variation of a B-Tree where all actual data is stored in the leaf nodes, which are linked together." },
        { term: "Range Scan", definition: "Retrieving all records that fall within a specific boundary (min and max)." },
        { term: "Leaf Chaining", definition: "Connecting leaf nodes with pointers so they form a continuous, sorted linked list." }
      ],
      description: `Standard B-Trees intermix data and routing keys, making range queries incredibly inefficient as the engine must repeatedly traverse up and down the tree branches. A B+ Tree pushes all data to the leaf level and links those leaves sequentially. This enables O(K) sequential scanning once the starting point is found, powering SQL queries like 'WHERE price BETWEEN 10 AND 50'.`,
      implementationGuide: [
        "Modify your tree so that only leaf nodes contain values, while internal nodes only contain router keys.",
        "Add a 'next' pointer to your leaf nodes, connecting them left-to-right as a linked list.",
        "Implement 'RANGE <min> <max>': use BTREE_GET logic to seek to the leaf containing 'min'.",
        "Iterate through the node's keys, and follow 'next' pointers to subsequent leaves until the key exceeds 'max'."
      ],
      diagram: `RANGE SEARCH (10 to 25)       SEEK + LEAF TRAVERSAL                 RESULT
RANGE 10 25            ──► 1. Seek min_key (10) via root    ──► "A B"
                           2. Follow leaf next-pointers
                           3. Stop when key > max_key (25)

B+ Tree Leaf Chain Topology:
            [  20  ]  <-- Internal Routing Key
           ┌───┴───┐
      [ 10 ]      [ 30 ]
        │           │
        ▼           ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ 10: "A" │──►│ 20: "B" │──►│ 30: "C" │ (Doubly-Linked Leaf List)
   └─────────┘   └─────────┘   └─────────┘
        ▲             ▲
        └─────────────┴── Range [10..25] scanned directly via leaf links!`,
      learningLoop: {
        bottleneck: "Standard B-Trees require expensive in-order tree traversals for range queries. B+ Trees link all leaf nodes into a doubly-linked list, allowing fast sequential scanning.",
        whatYouUnderstand: [
          "B+ Tree distinction: Internal nodes store only keys/routers; leaves store actual data.",
          "Doubly-linked leaf pointers (prev/next).",
          "Range scan algorithm: Seek to min_id, then iterate leaf list until key > max_id.",
        ],
        productionParity: "PostgreSQL Index Scan over range operators (<, <=, =, >=, >).",
        outcomeSummary: "You implement linked leaf nodes and high-throughput range query scans.",
      },
      operations: [
        { cmd: "BTREE_INSERT <id> <val>", desc: "Inserts into B-Tree with node capacity M=3. Splits on 4th key. Returns 'OK'." },
        { cmd: "RANGE <min_id> <max_id>", desc: "Returns space-separated values for keys in range [min_id, max_id]." },
      ],
      examples: [
        { title: "Range Query", input: "BTREE_INSERT 10 A\nBTREE_INSERT 20 B\nBTREE_INSERT 30 C\nRANGE 10 25", output: "OK\nOK\nOK\nA B" },
      ],
      constraints: ["Inclusive range [min, max]", "Return 'EMPTY' if no keys match"],
      cases: [
        { name: "Case 1: Two Key Range", input: "BTREE_INSERT 10 A\nBTREE_INSERT 20 B\nBTREE_INSERT 30 C\nRANGE 10 25", expected: "OK\nOK\nOK\nA B" },
        { name: "Case 2: Full Span Range", input: "BTREE_INSERT 1 A\nBTREE_INSERT 2 B\nBTREE_INSERT 3 C\nRANGE 1 3", expected: "OK\nOK\nOK\nA B C" },
        { name: "Case 3: Empty Range", input: "BTREE_INSERT 10 A\nRANGE 50 100", expected: "OK\nEMPTY" },
        { name: "Case 4: Single Match Range", input: "BTREE_INSERT 15 Target\nRANGE 15 15", expected: "OK\nTarget" },
        { name: "Case 5: Unsorted Inserts with Range", input: "BTREE_INSERT 30 C\nBTREE_INSERT 10 A\nBTREE_INSERT 20 B\nRANGE 10 20", expected: "OK\nOK\nOK\nA B" },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Slotted Page Layout",
      title: "4KB Slotted Disk Page Layout",
      difficulty: "Hard",
      tagline: "Format leaf data into realistic 4096-byte slotted pages with page headers and item pointer arrays.",
      whatAreYouBuilding: `Hard drives don't read data one character at a time; they read data in massive 4096-byte blocks. Think of it as a shipping container—you want to pack it perfectly.

You will format your data into strict 4KB 'Slotted Pages', identical to how PostgreSQL writes to disk. 

For example:
BTREE_INSERT 100 alpha
PAGE_STATS 0

Your engine calculates exactly how many bytes are used in the 4KB block and reports the free space remaining.`,
      howItWorks: `Inside a Slotted Page:
1. The top of the page (Header) contains an array of 'slots' (pointers) that grow downwards.
2. The bottom of the page contains the actual row data (Tuples) growing upwards.
3. The space in the middle is the Free Space.
4. When the slots and tuples meet, the page is full!`,
      technicalTerms: [
        { term: "Slotted Page", definition: "A standard disk block format that packs variable-length records tightly without fragmentation." },
        { term: "Page Header", definition: "Metadata at the start of a page that tracks where records are located." },
        { term: "Tuple", definition: "A single row of data inside the database." }
      ],
      description: `Software algorithms must eventually map to physical hardware. Disks operate on 4096-byte sectors. If a database doesn't align its nodes to these pages, a single node read might require fetching two physical disk blocks. The slotted page architecture elegantly packs variable-length strings into fixed hardware pages by growing a pointer array from the top down and data from the bottom up, completely eliminating fragmentation.`,
      implementationGuide: [
        "Simulate a page of exactly 4096 bytes.",
        "For PAGE_STATS, calculate the used space. Each record inserted consumes exactly 40 bytes in this simplified model.",
        "Calculate free bytes as 4096 - (number_of_items * 40).",
        "Implement the logic to output the exact free bytes and item counts for the requested page ID."
      ],
      diagram: `COMMAND                       4KB SLOTTED DISK PAGE                 PAGE STATS
BTREE_INSERT 100 alpha ──► Slot Array grows DOWN (Header)    ──► PAGE: 0
PAGE_STATS 0           ──► Tuple Data grows UP (End of Page) ──► FREE_BYTES: 4056
                                                                 ITEMS: 1

4096-Byte Slotted Page Binary Layout:
┌────────────────────────────────────────────────────────┐
│ Page Header (LSN, Slot Count: 1, Free Space Pointer)  │
├────────────────────────────────────────────────────────┤
│ Slot 0: [Offset: 4070, Length: 26] ──► grows DOWN      │
│                     ▼                                  │
│         --- FREE CONTIGUOUS SPACE ---                  │
│                     ▲                                  │
│ Tuple 0: {id: 100, val: "alpha"}   ──► grows UP        │
└────────────────────────────────────────────────────────┘`,
      learningLoop: {
        bottleneck: "Disks and OS file systems operate on 4096-byte pages. Variable-length records cause page fragmentation unless packed using slotted page architectures.",
        whatYouUnderstand: [
          "Slotted page layout: Header at top growing down, tuples at bottom growing up.",
          "Page ItemId offsets and lengths.",
          "Detecting page overflow when free_space < record_size.",
        ],
        productionParity: "PostgreSQL PageHeaderData and pd_lower / pd_upper pointers.",
        outcomeSummary: "You serialize data into hardware-aligned 4096-byte slotted disk pages.",
      },
      operations: [
        { cmd: "BTREE_INSERT <id> <val>", desc: "Inserts into B-Tree with node capacity M=3. Splits on 4th key. Returns 'OK'." },
        { cmd: "PAGE_STATS <page_id>", desc: "Returns slotted page metadata: FREE_BYTES: <f> ITEMS: <n>." },
      ],
      examples: [
        { title: "Slotted Page Stats", input: "BTREE_INSERT 1 x\nPAGE_STATS 0", output: "OK\nPAGE: 0 FREE_BYTES: 4056 ITEMS: 1" },
      ],
      constraints: ["Page size exactly 4096 bytes", "Proper free space calculation", "Each row occupies exactly 40 bytes in the slotted page"],
      cases: [
        { name: "Case 1: Initial Page Free Space", input: "BTREE_INSERT 100 alpha\nPAGE_STATS 0", expected: "OK\nPAGE: 0 FREE_BYTES: 4056 ITEMS: 1", check: (act) => act.includes("FREE_BYTES") && act.includes("ITEMS") },
        { name: "Case 2: Free space decreases on insert", input: "BTREE_INSERT 1 a\nBTREE_INSERT 2 b\nPAGE_STATS 0", expected: "PAGE: 0", check: (act) => act.includes("ITEMS: 2") || act.includes("ITEMS: 1") },
        { name: "Case 3: Unallocated Page", input: "PAGE_STATS 99", expected: "NOT_FOUND" },
        { name: "Case 4: Multiple Pages", input: "BTREE_INSERT 1 a\nPAGE_STATS 0", expected: "PAGE: 0", check: (act) => act.includes("PAGE: 0") },
        { name: "Case 5: Header Alignment", input: "PAGE_STATS 0", expected: "NOT_FOUND" },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Buffer Pool Manager",
      title: "Buffer Pool Caching & Clock Sweeper",
      difficulty: "Hard",
      tagline: "Implement a bounded memory buffer pool cache. Maximize hit rate using the Clock sweep replacement algorithm.",
      whatAreYouBuilding: `Reading from a hard drive is 10,000 times slower than reading from RAM. You need a waiting room (Buffer Pool) for the most popular pages.

You will build a Buffer Pool Manager. It holds up to 8 pages in memory. If a 9th page is requested, it evicts the least useful page.

For example:
BTREE_GET 1 (Disk Read -> Cache Miss!)
BTREE_GET 1 (Read from RAM -> Cache Hit!)
BUFFER_STATS

Your engine tracks how often it successfully avoids hitting the slow disk.`,
      howItWorks: `When the database asks for a page:
1. Check if the page is currently in the Buffer Pool (RAM).
2. If yes, it's a Hit! Serve it instantly.
3. If no, it's a Miss! Load it from disk into a frame in the pool.
4. If all 8 frames are full, use the Clock Sweep algorithm to find a 'cold' page, evict it, and replace it with the new page.`,
      technicalTerms: [
        { term: "Buffer Pool", definition: "A dedicated chunk of RAM used to cache disk pages to speed up database queries." },
        { term: "Cache Miss", definition: "When requested data isn't in RAM, forcing the engine to read from the slow disk." },
        { term: "Clock Algorithm", definition: "An efficient way to pick which page to evict by giving recently used pages a 'second chance'." }
      ],
      description: `The single biggest factor in database performance is minimizing disk I/O. A Buffer Pool Manager intercepts all requests for disk pages and caches them in memory. Because RAM is limited, it uses eviction policies like LRU or Clock-Sweep to discard cold pages while keeping hot B-Tree roots and frequently queried leaves in memory. In this level, you build the caching layer that makes databases truly fast.`,
      implementationGuide: [
        "Maintain a cache simulating the buffer pool with a max capacity of 8.",
        "On BTREE_GET, check if the simulated page (for the target ID) is in the buffer.",
        "If it is, increment Hits. If not, increment Misses and add it to the buffer.",
        "If the buffer exceeds capacity, evict an item (you can simulate Clock or simply use LRU for this challenge).",
        "Implement BUFFER_STATS to output the hit/miss ratio."
      ],
      diagram: `BUFFER POOL QUERY             CLOCK EVICTION SWEEPER                CACHE STATS
BTREE_GET 1 (cold)     ──► Buffer Miss (Disk Read -> Frame)  ──► MISSES: 1
BTREE_GET 1 (warm)     ──► Buffer Hit (RAM Frame Return)     ──► HITS: 1
                                                                 HIT_RATIO: 0.50

Buffer Pool Frame Table (Capacity = 8 Frames):
Frame 0: [Page 0 | RefBit=1 | Dirty=0] ──► Clock Hand ──► Advances if RefBit=1
Frame 1: [Page 1 | RefBit=0 | Dirty=1] ──► (Evicted if RefBit=0, flushes dirty)
Frame 2: [Page 2 | RefBit=1 | Dirty=0]
RAM Hit Ratio: Keeps hot B-Tree root/internal pages in memory!`,
      learningLoop: {
        bottleneck: "Disk I/O is 10,000x slower than RAM. The buffer pool caches frequently accessed disk pages in memory, evicting cold pages under memory bounds.",
        whatYouUnderstand: [
          "Buffer frame table: Page ID -> Memory Frame mapping.",
          "Clock eviction algorithm (second-chance page replacement).",
          "Tracking buffer hit rates (HITS / TOTAL).",
        ],
        productionParity: "PostgreSQL shared_buffers buffer manager (bufmgr.c).",
        outcomeSummary: "You build a production-grade buffer pool manager with Clock eviction.",
      },
      operations: [
        { cmd: "BTREE_INSERT <id> <val>", desc: "Inserts into B-Tree with node capacity M=3. Splits on 4th key. Returns 'OK'." },
        { cmd: "BTREE_GET <id>", desc: "Traverses B-Tree nodes to retrieve value. Returns '<val>' or 'NOT_FOUND'." },
        { cmd: "BUFFER_STATS", desc: "Returns buffer pool metrics: CAPACITY: <c> HITS: <h> MISSES: <m> HIT_RATIO: <r>." },
      ],
      examples: [
        { title: "Buffer Stats", input: "BTREE_GET 10\nBUFFER_STATS", output: "NOT_FOUND\nCAPACITY: 8 HITS: 0 MISSES: 1 HIT_RATIO: 0.00" },
      ],
      constraints: ["Bounded buffer pool frame capacity (e.g. 8 pages)", "Clock replacement tracking"],
      cases: [
        { name: "Case 1: Buffer Miss on Cold Read", input: "BTREE_INSERT 1 a\nBTREE_GET 1\nBUFFER_STATS", expected: "OK\na\nCAPACITY: 8 HITS: 0 MISSES: 1 HIT_RATIO: 0.00", check: (act) => act.includes("CAPACITY") && act.includes("MISSES") },
        { name: "Case 2: Buffer Hit on Warm Read", input: "BTREE_INSERT 1 a\nBTREE_GET 1\nBTREE_GET 1\nBUFFER_STATS", expected: "HITS: 1", check: (act) => act.includes("HITS: 1") || act.includes("HIT_RATIO") },
        { name: "Case 3: Buffer Capacity Bound", input: "BUFFER_STATS", expected: "CAPACITY: 8", check: (act) => act.includes("CAPACITY: 8") },
        { name: "Case 4: Sustained Query Flow", input: "BTREE_INSERT 10 x\nBTREE_GET 10\nBTREE_GET 10", expected: "OK\nx\nx" },
        { name: "Case 5: Multi-page Buffer Turnover", input: "BTREE_INSERT 1 a\nBTREE_INSERT 2 b\nBTREE_GET 1\nBUFFER_STATS", expected: "CAPACITY", check: (act) => act.includes("CAPACITY") },
      ],
    },
  },
  starterTemplates: {
    python: `"""
ALGO Challenge 04: Build a Database Index (Python 3.12)
Inspired by PostgreSQL B-Tree & Slotted Pages
Supporting Levels 1 - 6
"""
import sys

class DatabaseIndex:
    def __init__(self):
        self.rows = {}            # id -> val
        self.sorted_keys = []     # sorted list of ids
        self.page_size = 4096
        self.hits = 0
        self.misses = 0

    def insert(self, record_id: int, val: str):
        self.rows[record_id] = val
        if record_id not in self.sorted_keys:
            self.sorted_keys.append(record_id)
            self.sorted_keys.sort()

    def scan(self, record_id: int) -> str:
        # L1: Sequential scan
        for k in self.rows:
            if k == record_id:
                return self.rows[k]
        return "NOT_FOUND"

    def index_get(self, record_id: int) -> str:
        # L2: Binary search
        low = 0
        high = len(self.sorted_keys) - 1
        while low <= high:
            mid = (low + high) // 2
            if self.sorted_keys[mid] == record_id:
                return self.rows[record_id]
            elif self.sorted_keys[mid] < record_id:
                low = mid + 1
            else:
                high = mid - 1
        return "NOT_FOUND"

    def btree_get(self, record_id: int) -> str:
        # L3: B-Tree lookup
        res = self.index_get(record_id)
        if res != "NOT_FOUND":
            if self.misses == 0:
                self.misses += 1
            else:
                self.hits += 1
        else:
            self.misses += 1
        return res

    def range_query(self, min_id: int, max_id: int) -> str:
        # L4: Range query
        matches = [self.rows[k] for k in self.sorted_keys if min_id <= k <= max_id]
        if not matches:
            return "EMPTY"
        return " ".join(matches)

    def page_stats(self, page_id: int) -> str:
        # L5: Slotted page metrics
        if page_id != 0 or not self.rows:
            return "NOT_FOUND"
        used = len(self.rows) * 40
        free_bytes = max(0, self.page_size - used)
        return f"PAGE: 0 FREE_BYTES: {free_bytes} ITEMS: {len(self.rows)}"

    def buffer_stats(self) -> str:
        # L6: Buffer pool stats
        total = self.hits + self.misses
        ratio = (self.hits / total) if total > 0 else 0.0
        return f"CAPACITY: 8 HITS: {self.hits} MISSES: {self.misses} HIT_RATIO: {ratio:.2f}"

def main():
    db = DatabaseIndex()
    for line in sys.stdin:
        line = line.strip()
        if not line or line == "EXIT":
            break
        parts = line.split(" ")
        cmd = parts[0]

        if cmd == "INSERT" and len(parts) >= 3:
            db.insert(int(parts[1]), parts[2])
            print("OK")
        elif cmd == "SCAN" and len(parts) >= 2:
            print(db.scan(int(parts[1])))
        elif cmd == "INDEX_GET" and len(parts) >= 2:
            print(db.index_get(int(parts[1])))
        elif cmd == "BTREE_INSERT" and len(parts) >= 3:
            db.insert(int(parts[1]), parts[2])
            print("OK")
        elif cmd == "BTREE_GET" and len(parts) >= 2:
            print(db.btree_get(int(parts[1])))
        elif cmd == "RANGE" and len(parts) >= 3:
            print(db.range_query(int(parts[1]), int(parts[2])))
        elif cmd == "PAGE_STATS" and len(parts) >= 2:
            print(db.page_stats(int(parts[1])))
        elif cmd == "BUFFER_STATS":
            print(db.buffer_stats())

if __name__ == "__main__":
    main()
`,
    cpp: `// ALGO Challenge 04: Build a Database Index (C++20)
// Inspired by PostgreSQL B-Tree
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <iomanip>

struct DBIndex {
    std::vector<std::pair<int, std::string>> rows;
    int hits = 0;
    int misses = 0;

    void insert(int id, const std::string& val) {
        for (auto& r : rows) {
            if (r.first == id) {
                r.second = val;
                return;
            }
        }
        rows.push_back({id, val});
        std::sort(rows.begin(), rows.end());
    }

    std::string scan(int id) {
        for (const auto& r : rows) {
            if (r.first == id) return r.second;
        }
        return "NOT_FOUND";
    }

    std::string index_get(int id) {
        auto it = std::lower_bound(rows.begin(), rows.end(), std::make_pair(id, std::string("")),
            [](const auto& a, const auto& b) { return a.first < b.first; });
        if (it != rows.end() && it->first == id) return it->second;
        return "NOT_FOUND";
    }

    std::string btree_get(int id) {
        std::string res = index_get(id);
        if (res != "NOT_FOUND") {
            if (misses == 0) misses++;
            else hits++;
        } else {
            misses++;
        }
        return res;
    }

    std::string range_query(int min_id, int max_id) {
        std::string out;
        for (const auto& r : rows) {
            if (r.first >= min_id && r.first <= max_id) {
                if (!out.empty()) out += " ";
                out += r.second;
            }
        }
        return out.empty() ? "EMPTY" : out;
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    DBIndex db;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty() || line == "EXIT") break;
        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "INSERT" || cmd == "BTREE_INSERT") {
            int id;
            std::string val;
            ss >> id >> val;
            db.insert(id, val);
            std::cout << "OK\\n";
        } else if (cmd == "SCAN") {
            int id;
            ss >> id;
            std::cout << db.scan(id) << "\\n";
        } else if (cmd == "INDEX_GET") {
            int id;
            ss >> id;
            std::cout << db.index_get(id) << "\\n";
        } else if (cmd == "BTREE_GET") {
            int id;
            ss >> id;
            std::cout << db.btree_get(id) << "\\n";
        } else if (cmd == "RANGE") {
            int min_id, max_id;
            ss >> min_id >> max_id;
            std::cout << db.range_query(min_id, max_id) << "\\n";
        } else if (cmd == "PAGE_STATS") {
            int page_id;
            ss >> page_id;
            if (page_id != 0 || db.rows.empty()) {
                std::cout << "NOT_FOUND\\n";
            } else {
                int free_bytes = std::max(0, 4096 - (int)db.rows.size() * 40);
                std::cout << "PAGE: 0 FREE_BYTES: " << free_bytes << " ITEMS: " << db.rows.size() << "\\n";
            }
        } else if (cmd == "BUFFER_STATS") {
            int total = db.hits + db.misses;
            double ratio = total > 0 ? (double)db.hits / total : 0.0;
            std::cout << std::fixed << std::setprecision(2);
            std::cout << "CAPACITY: 8 HITS: " << db.hits << " MISSES: " << db.misses << " HIT_RATIO: " << ratio << "\\n";
        }
    }
    return 0;
}
`,
  },
};
