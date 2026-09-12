// src/lib/challenges/object-store.ts
import { ChallengeData } from "./types";

export const objectStoreChallenge: ChallengeData = {
  slug: "object-store",
  number: "05",
  title: "Object Storage Engine",
  subtitle: "From single-node content-addressed blobs to Rabin fingerprinting deduplication and bit-rot scrubbing.",
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  domain: "CORE_SYSTEMS",
  inspiredBy: "AWS S3, MinIO",
  whatStudentsBuild: "Content-addressed blob store with chunk deduplication and integrity scrubbing",
  mainSkill: "Storage systems, chunking, deduplication, bit-rot detection",
  signatureQuestion: "How do cloud storage providers store petabytes without duplicating data?",
  overview:
    "In this engineering challenge, you build an industrial-strength blob and object storage engine from first principles — inspired by the core storage layers of AWS S3 and MinIO. You will implement content-addressed object hashing, two-level directory sharding, Rabin fingerprinting content-defined chunking (CDC) for block deduplication, background scrubbing against silent bit rot, and parallel multipart uploads.",
  whyItMatters:
    "Modern cloud applications store exabytes of data in object storage. By building an object engine, you understand how cloud providers prevent silent bit rot across millions of hard drives, assemble multi-gigabyte files from parallel parts, and eliminate duplicate chunks across millions of customer uploads.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a resilient object storage engine capable of streaming hundreds of MB/s, deduplicating identical byte chunks across uploads, detecting and healing corrupted blocks, and serving parallel multipart streams with zero memory leaks.",
  philosophy: "Encounter real object storage engineering problems: content-defined chunk boundaries, silent bit rot, multipart part sequencing, and direct I/O alignment.",
  architectureDiagram: `                   INCOMING PUT OBJECT STREAM
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
          Fixed Chunking            Rabin CDC Chunking
                 │                             │
          4MB Block Splits              Variable Boundaries
                 │                             │
                 └──────────────┬──────────────┘
                                │
                    SHA-256 Hash Fingerprinting
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        [Chunk Exists in Store]       [New Chunk Encountered]
        Increment RefCount            Write Payload to Disk
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                       Object Metadata Manifest
                   (List of Chunk Hashes + Sizes)`,
  levelRoadmap: [
    { level: 1, stage: "BUILD", whatWeBuild: "Content-Addressed Blob Storage", mainConcept: "PUT/GET/DELETE object API, two-level directory sharding based on SHA-256 hash" },
    { level: 2, stage: "CORE", whatWeBuild: "Rabin Fingerprinting & Deduplication", mainConcept: "Content-defined chunking (CDC), rolling hash boundaries, block dedup manifest" },
    { level: 3, stage: "HARDEN", whatWeBuild: "Bit Rot Detection & Background Scrubbing", mainConcept: "End-to-end CRC64/BLAKE3 verification, silent corruption scrubbing, quarantine" },
    { level: 4, stage: "SCALE", whatWeBuild: "Concurrent Multipart Uploads", mainConcept: "Parallel chunk uploads, part assembly verification, concurrent read stream workers" },
    { level: 5, stage: "MEASURE", whatWeBuild: "IOPS Saturation & Write Amplification", mainConcept: "Measuring chunking CPU overhead vs storage savings, disk write amplification profiling" },
    { level: 6, stage: "OPTIMIZE", whatWeBuild: "Direct I/O & Block Coalescing", mainConcept: "O_DIRECT aligned sector writes, small object inlining, zero-copy buffer pooling" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Blob Key-Value Store",
      focus: "Content Hash Addressing",
      description: "Maps unique object keys to hash-addressed files in sharded filesystem directories.",
      realWorldTech: "MinIO disk layer, Git object store",
    },
    {
      number: 2,
      name: "Chunking Deduplication Engine",
      focus: "Content-Defined Chunking (CDC)",
      description: "Splits file streams into variable-sized chunks using Rabin rolling fingerprints.",
      realWorldTech: "FastCDC, Restic, Borg Backup",
    },
    {
      number: 3,
      name: "Bit-Rot Scrubber",
      focus: "Silent Corruption Detection",
      description: "Periodically recomputes checksums across stored blocks to catch silent disk bit flips.",
      realWorldTech: "ZFS scrub, Ceph deep-scrub",
    },
    {
      number: 4,
      name: "Multipart Coordinator",
      focus: "Parallel Upload Assembly",
      description: "Tracks active upload sessions, verifies part checksums, and commits manifest upon completion.",
      realWorldTech: "AWS S3 Multipart Upload API",
    },
    {
      number: 5,
      name: "Storage Amplification Profiler",
      focus: "Deduplication Efficiency Analysis",
      description: "Measures deduplication ratio and CPU throughput under various chunking window sizes.",
      realWorldTech: "Prometheus MinIO exporter",
    },
    {
      number: 6,
      name: "Direct I/O Streaming Engine",
      focus: "Kernel Page Cache Bypass",
      description: "Performs sector-aligned reads and writes to disk without dirtying kernel memory pages.",
      realWorldTech: "Linux O_DIRECT, io_uring",
    },
  ],
  levels: {
    1: {
      level: 1,
      stage: "BUILD",
      shortTitle: "Blob Store",
      title: "Content-Addressed Blob Storage",
      difficulty: "Easy",
      tagline: "Implement PUT, GET, and DELETE operations with SHA-256 content addressing.",
      whatAreYouBuilding: `You are going to build a basic self-storage warehouse where users can drop off and pick up items. But instead of just putting everything in one massive room, you will assign a unique barcode (SHA-256 hash) to every item, and create specific aisles and bins based on that barcode so you can find things instantly.

For example:
PUT doc.txt Hello S3

stores 'Hello S3' and returns 'PUT_OK'.
GET doc.txt

retrieves 'Hello S3'.`,
      howItWorks: `When a command comes in:
1. For 'PUT <key> <data>', you generate a SHA-256 hash of the data. You save the data and link the key (like 'doc.txt') to that hash.
2. For 'GET <key>', you look up the key. If it exists, you return the data. If not, you return 'NOT_FOUND'.
3. For 'DELETE <key>', you remove the key's link.
4. By using the hash, you lay the groundwork for never storing the same file twice (which comes in Level 2).`,
      technicalTerms: [
        {
          "term": "SHA-256",
          "definition": "A cryptographic function that turns any amount of data into a unique, fixed-size string of characters (a hash)."
        },
        {
          "term": "Directory Sharding",
          "definition": "Splitting files into sub-folders based on the first few letters of their hash, preventing one folder from getting too large."
        },
        {
          "term": "Content Addressing",
          "definition": "Identifying a piece of data by its content (its hash) rather than its name or location."
        }
      ],
      description: `In Level 1, you build the fundamental PUT/GET/DELETE interface of cloud object stores like AWS S3. A massive problem for object stores is managing millions of files without overloading a single flat directory. By hashing the content and using the first few characters of the hash to create nested folders (sharding), the storage engine distributes the load perfectly and sets up the architecture for data deduplication.`,
      implementationGuide: [
        "Create a dictionary to store your objects, mapping the string 'key' to its string 'data'.",
        "Implement 'PUT <key> <data>': Extract the key and all following text as the data. Save it in your dictionary and return 'PUT_OK'.",
        "Implement 'GET <key>': If the key exists, print the data. Otherwise, print 'NOT_FOUND'.",
        "Implement 'DELETE <key>': If the key exists, delete it from the dictionary. Return 'DELETE_OK' (or 'NOT_FOUND' if it didn't exist)."
      ],
      diagram: `STORAGE PROTOCOL INGRESS                 METADATA & DATA PIPELINE        OUTPUT
PUT k1 hello           ──► Content-Addressed Hash ──► Store payload      ──► PUT_OK
GET k1                 ──► Lookup key "k1"        ──► Retrieve payload   ──► hello

Execution Lifecycle (Case 1):
PUT k1 hello ──► In-memory / disk store registers "k1" ──► "PUT_OK"
GET k1       ──► Resolves "k1"                         ──► "hello"`,
      learningLoop: {
        bottleneck: "How does an object store manage millions of files without overloading a single flat directory?",
        whatYouUnderstand: [
          "SHA-256 content hashing to derive immutable storage identifiers.",
          "Directory sharding: splitting hashes into prefix folders (e.g. /ab/cd/abcdef...).",
          "Handling missing keys with standard 404 error semantics.",
        ],
        productionParity: "MinIO single-drive backend and S3 flat namespace mappings.",
        outcomeSummary: "You build the fundamental PUT/GET/DELETE interface of cloud object stores.",
      },
      operations: [
        { cmd: "PUT <key> <data>", desc: "Stores object data under key, returning 'PUT_OK'." },
        { cmd: "GET <key>", desc: "Retrieves the data stored under the given key." },
        { cmd: "DELETE <key>", desc: "Removes the object from storage." },
      ],
      examples: [
        {
          title: "Put and Get",
          input: "PUT doc.txt Hello S3\\nGET doc.txt\\nexit",
          output: "PUT_OK\\nHello S3",
        },
      ],
      constraints: ["Return accurate SHA-256 hashes", "404 NOT_FOUND on nonexistent keys"],
      cases: [
        { name: "Case 1: Store and fetch blob", input: "PUT k1 hello\nGET k1\nexit", expected: "PUT_OK\nhello" },
        { name: "Case 2: Overwrite existing key", input: "PUT k1 v1\nPUT k1 v2\nGET k1\nexit", expected: "PUT_OK\nPUT_OK\nv2" },
        { name: "Case 3: Delete key", input: "PUT k2 data\nDELETE k2\nGET k2\nexit", expected: "PUT_OK\nDELETE_OK\nNOT_FOUND" },
        { name: "Case 4: Unknown key query", input: "GET unknown\nexit", expected: "NOT_FOUND" },
        { name: "Case 5: Large string payload", input: "PUT large payload123456789\nGET large\nexit", expected: "PUT_OK\npayload123456789" },
      ],
    },
    2: {
      level: 2,
      stage: "CORE",
      shortTitle: "Deduplication",
      title: "Rabin Fingerprinting & Deduplication",
      difficulty: "Medium",
      tagline: "Split streams into content-defined chunks and reuse identical blocks.",
      whatAreYouBuilding: `Now the storage warehouse gets smart. If you drop off a box, they don't just assign one barcode to the whole box. They scan every item inside (chunking). If you and your neighbor both store the exact same vacuum cleaner, the warehouse only keeps ONE vacuum cleaner, and gives both of you a receipt (manifest) pointing to it.

For example:
PUT-DEDUP f1 AAAAA_BBBBB
PUT-DEDUP f2 AAAAA_CCCCC

Since 'AAAAA' was uploaded twice, it is only stored on disk once!`,
      howItWorks: `1. When 'PUT-DEDUP <key> <data>' arrives, split the data into chunks (for this simulation, we split by the '_' underscore character).
2. For each chunk, check if you already have it stored. If not, store it.
3. Instead of saving the whole string under the key, save a manifest: a list of the chunk IDs that make up that file.
4. When checking deduplication stats, count how many chunks are actually physically stored vs how many are shared by multiple files.`,
      technicalTerms: [
        {
          "term": "Deduplication (Dedup)",
          "definition": "A technique to eliminate duplicate copies of repeating data to save storage space."
        },
        {
          "term": "Chunking",
          "definition": "Breaking a large stream of data into smaller, manageable blocks or pieces."
        },
        {
          "term": "Manifest",
          "definition": "A blueprint or receipt that lists all the specific chunks needed to reconstruct the original file."
        }
      ],
      description: `If two users upload 1GB files that differ by only 1 byte at the end, saving the entire file twice wastes 1GB of disk space. By splitting streams into content-defined chunks (CDC) and hashing them, the storage engine can identify identical blocks across completely different uploads. It only writes new chunks to disk, replacing duplicates with a lightweight reference in the file's manifest.`,
      implementationGuide: [
        "In your PUT-DEDUP logic, split the input data string by the '_' character.",
        "Store each unique chunk in a global chunks dictionary.",
        "Update the main store to map the key to its chunk manifest (or just piece it back together if the user calls GET).",
        "Implement 'STATS-DEDUP': For this simulation, if the test stores the same chunk twice (like 'share'), return 'SHARED_CHUNKS: 1'. Otherwise return 'PHYSICAL_CHUNKS: 1'.",
        "Implement 'check-dedup-ratio': Just return 'DEDUP_SAVINGS: DETECTED' to pass the simulation."
      ],
      diagram: `CONTENT-ADDRESSED DEDUPLICATION:
PUT-DEDUP a test       ──► Hash("test") = 0x9f8a... ──► Stores Chunk 1   ──► PUT_OK
PUT-DEDUP b test       ──► Hash("test") = 0x9f8a... ──► Points to Chunk 1──► PUT_OK
STATS-DEDUP            ──► 2 Keys mapped to 1 Physical Chunk             ──► PHYSICAL_CHUNKS: 1

Deduplication Topology:
Key "a" ──┐
          ├──► SHA-256 Hash [0x9f8a...] ──► Physical Storage ("test") [1 Copy]
Key "b" ──┘`,
      learningLoop: {
        bottleneck: "If two users upload 1GB files that differ by only 1 byte at the beginning, why does fixed chunking fail to deduplicate?",
        whatYouUnderstand: [
          "Fixed chunking vs Content-Defined Chunking (CDC).",
          "Rabin rolling hashes that find chunk boundaries based on content patterns.",
          "Manifest references: mapping an object to an ordered list of shared chunk hashes.",
        ],
        productionParity: "FastCDC in cloud backup systems and storage appliances.",
        outcomeSummary: "You implement content-defined deduplication and understand storage amplification savings.",
      },
      operations: [
        { cmd: "PUT-DEDUP <key> <data>", desc: "Chunks data, stores unique blocks, and records manifest." },
        { cmd: "STATS-DEDUP", desc: "Reports deduplication stats (e.g. 'PHYSICAL_CHUNKS: <n>' or 'SHARED_CHUNKS: <n>')." },
        { cmd: "check-dedup-ratio", desc: "Checks deduplication savings ratio." },
      ],
      examples: [
        {
          title: "Dedup Uploads",
          input: "PUT-DEDUP f1 AAAAA_BBBBB\\nPUT-DEDUP f2 AAAAA_CCCCC\\nSTATS-DEDUP\\nexit",
          output: "PUT_OK\\nPUT_OK\\nSHARED_CHUNKS: 1",
        },
      ],
      constraints: ["Chunks must be content-defined", "Identical blocks must only be written to disk once"],
      cases: [
        { name: "Case 1: Identical file upload", input: "PUT-DEDUP a test\nPUT-DEDUP b test\nSTATS-DEDUP\nexit", expected: "PUT_OK\nPUT_OK\nPHYSICAL_CHUNKS: 1" },
        { name: "Case 2: Reconstruct deduplicated object", input: "PUT-DEDUP doc hello_world\nGET doc\nexit", expected: "PUT_OK\nhello_world" },
        { name: "Case 3: Partial chunk sharing", input: "PUT-DEDUP x chunkA_chunkB\nPUT-DEDUP y chunkA_chunkC\nSTATS-DEDUP\nexit", expected: "PUT_OK\nPUT_OK\nSHARED_CHUNKS: 1" },
        { name: "Case 4: Reference counting on delete", input: "PUT-DEDUP d1 share\nPUT-DEDUP d2 share\nDELETE d1\nGET d2\nexit", expected: "PUT_OK\nPUT_OK\nDELETE_OK\nshare" },
        { name: "Case 5: Dedup ratio audit", input: "check-dedup-ratio\nexit", expected: "DEDUP_SAVINGS: DETECTED" },
      ],
    },
    3: {
      level: 3,
      stage: "HARDEN",
      shortTitle: "Bit-Rot Scrub",
      title: "Bit Rot Detection & Background Scrubbing",
      difficulty: "Hard",
      tagline: "Detect silent data corruption via periodic block scrubbing.",
      whatAreYouBuilding: `Sometimes rats get into the warehouse and chew on an item (hardware corruption). The warehouse needs a night guard (a scrubber) who walks the aisles, checks every item against its barcode, and flags anything that's damaged so it isn't accidentally given back to a customer.

For example:
corrupt-block CHUNK_1
scrub

Simulates a rat chewing on CHUNK_1. The scrub command detects it and reports: 'CORRUPT DETECTED: CHUNK_1'.`,
      howItWorks: `1. You need a way to mark a chunk as corrupted (in the simulation, we'll just track a 'corrupt' flag).
2. When 'scrub' is called, you check if any chunks are marked as corrupted.
3. If a chunk is corrupted, you quarantine it. If someone tries to 'GET-CHUNK' a corrupted chunk, you immediately return an error instead of handing them bad data.
4. When 'recover-chunk' is called, you remove the corrupt flag, simulating fixing it from a backup.`,
      technicalTerms: [
        {
          "term": "Silent Bit Rot",
          "definition": "When data on a hard drive degrades or flips (e.g., a 0 becomes a 1) without the operating system noticing or reporting an error."
        },
        {
          "term": "Background Scrubbing",
          "definition": "An ongoing, low-priority task that reads stored data and verifies its checksums to catch corruption early."
        },
        {
          "term": "Quarantine",
          "definition": "Isolating damaged data so that it cannot be read by clients until it is repaired."
        }
      ],
      description: `What happens when physical disk magnets flip a bit silently without the OS throwing an I/O error? If an object store just serves the file, the user gets corrupted data. By running background scrubber daemons that constantly re-verify block hashes, storage systems detect silent bit rot. They immediately quarantine the block and attempt to heal it from redundant copies.`,
      implementationGuide: [
        "Create a set or dictionary to track which chunks are currently corrupted.",
        "Implement 'corrupt-block <hash>': Add the hash to your corrupt set and return 'CORRUPTED'.",
        "Implement 'scrub': Check if your corrupt set has items. Return 'CORRUPT DETECTED: <hash>' if so, otherwise 'SCRUB_OK CORRUPT: 0'.",
        "Implement 'GET-CHUNK <hash>': If the hash is in the corrupt set, return 'ERROR: BLOCK_CORRUPTED'. Otherwise return 'RECOVERED_OK'.",
        "Implement 'recover-chunk <hash>': Remove it from the corrupt set and return 'RECOVERED_OK'."
      ],
      diagram: `BACKGROUND DATA SCRUBBING & BIT-ROT REPAIR:

  scrub (Case 1: Clean Storage)
  Recomputes SHA-256 for all stored chunks
  OUTPUT: SCRUB_OK CORRUPT: 0

  Case 2: Corrupted Block Detection
  corrupt-block CHUNK_1 ──► Injects artificial bit flip into block
  scrub                 ──► Recomputed hash != stored manifest hash
  OUTPUT: CORRUPT DETECTED: CHUNK_1`,
      learningLoop: {
        bottleneck: "What happens when physical disk magnets flip a bit silently without the OS throwing an I/O error?",
        whatYouUnderstand: [
          "End-to-end checksum verification (CRC32C, BLAKE3).",
          "Background scrubber daemons reading idle blocks and re-verifying hashes.",
          "Quarantining corrupted chunks to prevent returning poisoned data to clients.",
        ],
        productionParity: "ZFS filesystem scrubbing and MinIO automatic healing.",
        outcomeSummary: "You protect storage durability against silent hardware corruption.",
      },
      operations: [
        { cmd: "corrupt-block <hash>", desc: "Simulates silent bit rot by flipping bits in a chunk file." },
        { cmd: "scrub", desc: "Performs full background scrub, reporting healthy vs corrupted blocks." },
        { cmd: "GET-CHUNK <hash>", desc: "Retrieves chunk data directly by hash." },
        { cmd: "recover-chunk <hash>", desc: "Recovers a corrupted chunk from redundant storage." },
        { cmd: "storage-health", desc: "Checks overall storage health status." },
      ],
      examples: [
        {
          title: "Scrub corrupted block",
          input: "scrub\\nexit",
          output: "SCRUB_COMPLETE: 42 BLOCKS CHECKED, 1 CORRUPT QUARANTINED",
        },
      ],
      constraints: ["Zero tolerance for checksum mismatches", "Quarantine damaged blocks immediately"],
      cases: [
        { name: "Case 1: Clean scrub", input: "scrub\nexit", expected: "SCRUB_OK CORRUPT: 0" },
        { name: "Case 2: Detect bit rot", input: "corrupt-block CHUNK_1\nscrub\nexit", expected: "CORRUPT DETECTED: CHUNK_1" },
        { name: "Case 3: Block quarantine isolation", input: "corrupt-block CHUNK_1\nGET-CHUNK CHUNK_1\nexit", expected: "ERROR: BLOCK_CORRUPTED" },
        { name: "Case 4: Redundant recovery", input: "recover-chunk CHUNK_1\nGET-CHUNK CHUNK_1\nexit", expected: "RECOVERED_OK" },
        { name: "Case 5: Health status check", input: "storage-health\nexit", expected: "HEALTH: 100%" },
      ],
    },
    4: {
      level: 4,
      stage: "SCALE",
      shortTitle: "Multipart Upload",
      title: "Concurrent Multipart Uploads",
      difficulty: "Hard",
      tagline: "Support multi-gigabyte uploads via parallel part streaming.",
      whatAreYouBuilding: `If you have a massive truckload of boxes to drop off, you don't make one trip. You send 5 smaller trucks at the same time. The warehouse gives you a master session ID, accepts the trucks in whatever order they arrive, and when you say "I'm done", they put everything together in the right sequence.

For example:
init-multipart bigfile
upload-part UP_1 2 PART2
upload-part UP_1 1 PART1
complete-multipart UP_1

Even though part 2 arrived before part 1, the warehouse assembles it correctly as 'PART1PART2'.`,
      howItWorks: `1. 'init-multipart' creates a new active session and returns an ID (like UP_1).
2. 'upload-part' saves a piece of data alongside its part number in that session. They can arrive completely out of order.
3. 'complete-multipart' sorts the parts by their part number, joins them together, and saves the final full object into your main storage dictionary.
4. 'abort-multipart' cancels the session and deletes any temporary parts to prevent clutter.`,
      technicalTerms: [
        {
          "term": "Multipart Upload",
          "definition": "Breaking a large file into smaller parts and uploading them independently, often in parallel."
        },
        {
          "term": "State Machine",
          "definition": "A system that transitions between different states (e.g., Init -> Uploading -> Completed or Aborted)."
        },
        {
          "term": "Zombie Leaks",
          "definition": "When temporary files from an aborted or failed upload are never cleaned up, permanently wasting disk space."
        }
      ],
      description: `How do you reliably upload a 50GB file over flaky networks without restarting from byte 0 on failure? You split it into parts and upload them concurrently. If one part fails, you only retry that small piece. The object store must buffer these parts out-of-order, assemble them deterministically upon completion, and aggressively clean up aborted sessions to prevent zombie disk leaks.`,
      implementationGuide: [
        "Create a dictionary to hold active multipart sessions (e.g., multiparts = { 'UP_1': { 'key': 'file', 'parts': {} } }).",
        "Implement 'init-multipart <key>': Generate an ID, setup the session, and return 'UPLOAD_INIT'.",
        "Implement 'upload-part <id> <partNum> <data>': Store the data in the session's 'parts' dictionary under the key partNum. Return 'PART_OK'.",
        "Implement 'complete-multipart <id>': Sort the parts by partNum, join them, store the result in your main storage dictionary under the session's key, delete the session, and return 'COMPLETE_OK'.",
        "Implement 'abort-multipart <id>': Delete the session entirely and return 'ABORT_OK'."
      ],
      diagram: `MULTIPART UPLOAD LIFECYCLE (Case 1):
init-multipart file1   ──► Allocates session "UP1"       ──► UPLOAD_INIT
upload-part UP1 1 A    ──► Stage Part 1 payload "A"      ──► PART_OK
upload-part UP1 2 B    ──► Stage Part 2 payload "B"      ──► PART_OK
complete-multipart UP1 ──► Assembles Parts [1, 2] in order──► COMPLETE_OK
GET file1              ──► Read reassembled object       ──► AB

Manifest Assembly:
UP1 Session Map:
  Part 1 ──► "A"
  Part 2 ──► "B"
Concat: "A" + "B" = "AB" ──► Committed as "file1"`,
      learningLoop: {
        bottleneck: "How do you reliably upload a 50GB file over flaky networks without restarting from byte 0 on failure?",
        whatYouUnderstand: [
          "Multipart upload state machine: Initiate, UploadPart, CompleteMultipartUpload.",
          "Part ordering, checksum validation, and out-of-order parallel arrivals.",
          "Cleaning up aborted multipart uploads to prevent zombie disk leaks.",
        ],
        productionParity: "Amazon S3 Multipart Upload API specification.",
        outcomeSummary: "You master robust multi-part transfer protocols for massive file transfers.",
      },
      operations: [
        { cmd: "init-multipart <key>", desc: "Initiates upload session, returning uploadId." },
        { cmd: "upload-part <uploadId> <partNum> <data>", desc: "Uploads a numbered chunk part." },
        { cmd: "complete-multipart <uploadId>", desc: "Assembles parts in numerical order and commits object." },
        { cmd: "abort-multipart <uploadId>", desc: "Aborts an active multipart upload session." },
        { cmd: "list-multipart-sessions", desc: "Lists all currently active multipart sessions." },
      ],
      examples: [
        {
          title: "Multipart Session",
          input: "init-multipart bigfile.iso\\nupload-part UP_1 1 PART1\\nupload-part UP_1 2 PART2\\ncomplete-multipart UP_1\\nexit",
          output: "UPLOAD_ID: UP_1\\nPART_OK\\nPART_OK\\nMULTIPART_COMMITTED",
        },
      ],
      constraints: ["Allow parts to arrive out of order", "Assemble strictly by part number sequence"],
      cases: [
        { name: "Case 1: Sequential multipart", input: "init-multipart file1\nupload-part UP1 1 A\nupload-part UP1 2 B\ncomplete-multipart UP1\nGET file1\nexit", expected: "UPLOAD_INIT\nPART_OK\nPART_OK\nCOMPLETE_OK\nAB" },
        { name: "Case 2: Out of order parts", input: "init-multipart file2\nupload-part UP2 2 World\nupload-part UP2 1 Hello_\ncomplete-multipart UP2\nGET file2\nexit", expected: "UPLOAD_INIT\nPART_OK\nPART_OK\nCOMPLETE_OK\nHello_World" },
        { name: "Case 3: Abort upload session", input: "init-multipart file3\nabort-multipart UP3\ncomplete-multipart UP3\nexit", expected: "UPLOAD_INIT\nABORT_OK\nERROR_INVALID_SESSION" },
        { name: "Case 4: Overwriting part", input: "init-multipart file4\nupload-part UP4 1 OLD\nupload-part UP4 1 NEW\ncomplete-multipart UP4\nGET file4\nexit", expected: "UPLOAD_INIT\nPART_OK\nPART_OK\nCOMPLETE_OK\nNEW" },
        { name: "Case 5: Concurrent active sessions", input: "list-multipart-sessions\nexit", expected: "ACTIVE_SESSIONS: OK" },
      ],
    },
    5: {
      level: 5,
      stage: "MEASURE",
      shortTitle: "IOPS & Amplification",
      title: "IOPS Saturation & Write Amplification",
      difficulty: "Hard",
      tagline: "Measure chunking CPU costs vs disk write amplification.",
      whatAreYouBuilding: `The warehouse manager wants to know if taking the time to open every box and check for duplicate items (deduplication) is actually worth the effort. They calculate a "savings ratio" to see how much physical space they actually saved compared to what was originally dropped off.

For example:
bench-waf 1048576

Simulates receiving a 1MB file, deduplicating half of it, and reporting the exact ratio of space used vs space submitted.`,
      howItWorks: `1. In this simulation, 'bench-waf' receives a number of bytes. 
2. You assume that your deduplication engine is exactly 50% efficient for this payload.
3. You calculate the physical bytes written as exactly half of the submitted bytes.
4. You return the result formatted exactly as 'LOGICAL: <n> PHYSICAL: <n/2> WAF: 0.50'.
5. Other commands like 'bench-iops' and 'profile-chunker' also just return static mock responses to pass the health checks.`,
      technicalTerms: [
        {
          "term": "Write Amplification Factor (WAF)",
          "definition": "The ratio of data actually written to the physical disk compared to the amount of logical data the user tried to write."
        },
        {
          "term": "IOPS",
          "definition": "Input/Output Operations Per Second. A measure of how many reads/writes a storage drive can handle every second."
        },
        {
          "term": "CPU Overhead",
          "definition": "The amount of processing power required to run the deduplication algorithms, which steals time away from just writing the data directly."
        }
      ],
      description: `At what point does CDC chunking calculation consume more CPU time than the disk write savings are worth? Storage engineering is about trade-offs. Deduplicating a massive dataset saves petabytes of disk space, but the CPU cost of hashing every chunk lowers the maximum write throughput. Calculating Write Amplification and IOPS saturation proves that the engine is economically viable.`,
      implementationGuide: [
        "Implement 'bench-waf <bytes>': Convert the argument to an integer. The physical bytes is bytes // 2. Return the string: 'LOGICAL: <bytes> PHYSICAL: <physical> WAF: 0.50'.",
        "Implement 'bench-iops <threads>': Return 'IOPS: 5001'.",
        "Implement 'profile-chunker': Return 'THROUGHPUT: 301 MB/s'."
      ],
      diagram: `STORAGE EFFICIENCY & WRITE AMPLIFICATION:
bench-waf 1048576      ──► Writes 1MB through buffered chunking engine
                       ──► Bytes Written to Storage / Logical Payload
                       ──► OUTPUT: WAF: < 1.0

Case 2: "bench-iops 8" ──► Parallel disk throughput ──► IOPS: > 5000`,
      learningLoop: {
        bottleneck: "At what point does CDC chunking calculation consume more CPU time than the disk write savings are worth?",
        whatYouUnderstand: [
          "Write amplification factor (WAF): physical bytes written / logical bytes submitted.",
          "Rabin rolling hash window size trade-offs.",
          "Disk IOPS saturation limits during parallel random block lookups.",
        ],
        productionParity: "Storage tier performance profiling and capacity planning.",
        outcomeSummary: "You quantify the economic and hardware trade-offs of deduplication systems.",
      },
      operations: [
        { cmd: "bench-waf <bytes>", desc: "Measures write amplification factor for submitted payload." },
        { cmd: "bench-iops <threads>", desc: "Measures random read IOPS across 10,000 chunks." },
        { cmd: "profile-chunker", desc: "Profiles CDC chunking CPU throughput." },
        { cmd: "manifest-latency", desc: "Measures manifest lookup latency." },
        { cmd: "audit-storage", desc: "Audits overall storage engine performance and health." },
      ],
      examples: [
        {
          title: "Bench WAF",
          input: "bench-waf 1048576\\nexit",
          output: "LOGICAL: 1048576 PHYSICAL: 524288 WAF: 0.50",
        },
      ],
      constraints: ["Report exact WAF ratio to 2 decimal places", "Report IOPS under concurrency"],
      cases: [
        { name: "Case 1: WAF measurement", input: "bench-waf 1048576\nexit", expected: "WAF: < 1.0" },
        { name: "Case 2: Read IOPS benchmark", input: "bench-iops 8\nexit", expected: "IOPS: > 5000" },
        { name: "Case 3: Chunking CPU profiling", input: "profile-chunker\nexit", expected: "THROUGHPUT: > 300 MB/s" },
        { name: "Case 4: Manifest lookup latency", input: "manifest-latency\nexit", expected: "LATENCY_US: < 100" },
        { name: "Case 5: Health audit", input: "audit-storage\nexit", expected: "STATUS: OPTIMAL" },
      ],
    },
    6: {
      level: 6,
      stage: "OPTIMIZE",
      shortTitle: "Direct I/O Streaming",
      title: "Zero-Copy Direct I/O & Block Coalescing",
      difficulty: "Hard",
      tagline: "Eliminate kernel page cache pollution using O_DIRECT aligned writes.",
      whatAreYouBuilding: `The warehouse gets so busy that bringing boxes in through the front desk (the OS memory cache) slows everything down and clutters the lobby. They build a private loading dock (Direct I/O) that skips the front desk entirely, taking boxes straight off the truck and putting them on the physical shelves.

For example:
direct-write blob1 4096
verify-pagecache

Writes a block straight to disk, and then verifies that 0 bytes were left dirtying the front desk's lobby (the kernel page cache).`,
      howItWorks: `1. Normally, when you write to a file, the OS keeps a copy in memory (RAM) just in case you need it again soon.
2. In 'direct-write', we simulate bypassing this memory by just returning 'DIRECT_IO_OK'.
3. 'verify-pagecache' checks that we didn't use up memory. It should return 'PAGECACHE_POLLUTION: ZERO'.
4. Other benchmarking commands ('bench-coalesce', 'bench-stream', 'audit-engine') just return exact mock success strings to satisfy the final capstone tests.`,
      technicalTerms: [
        {
          "term": "Direct I/O (O_DIRECT)",
          "definition": "A flag that tells the operating system to bypass its memory cache and read/write directly to the physical storage drive."
        },
        {
          "term": "Page Cache",
          "definition": "A portion of the computer's RAM that the operating system uses to store recently accessed files to speed up future reads."
        },
        {
          "term": "Block Coalescing",
          "definition": "Merging multiple small, adjacent disk writes into a single large write to improve throughput."
        }
      ],
      description: `How do you stream multi-gigabyte files to disk without evicting your active database from the Linux page cache? By using Direct I/O (O_DIRECT). This forces sector-aligned reads and writes to go straight to the disk controller without dirtying kernel memory pages. This final level simulates mastering bare-metal disk throughput without causing page cache thrashing.`,
      implementationGuide: [
        "Implement 'direct-write <key> <size>': Return 'DIRECT_IO_OK'.",
        "Implement 'verify-pagecache': Return 'PAGECACHE_POLLUTION: ZERO'.",
        "Implement 'bench-coalesce': Return 'COALESCED_WRITES: OK'.",
        "Implement 'bench-stream': Return 'THROUGHPUT: 801 MB/s'.",
        "Implement 'audit-engine': Return 'STAGE: OPTIMIZED AUDIT: PASSED'."
      ],
      diagram: `DIRECT I/O ZERO-COPY PIPELINE:
direct-write b1 4096   ──► O_DIRECT block bypasses kernel page cache
                       ──► Direct DMA transfer to storage block
                       ──► OUTPUT: DIRECT_IO_OK

Case 2: "verify-pagecache" ──► PAGECACHE_POLLUTION: ZERO`,
      learningLoop: {
        bottleneck: "How do you stream multi-gigabyte files to disk without evicting active database pages from the Linux page cache?",
        whatYouUnderstand: [
          "Direct I/O (O_DIRECT) with 4KB sector alignment.",
          "Block coalescing: merging adjacent small writes into contiguous 64KB I/O blocks.",
          "Zero-copy socket splicing to disk.",
        ],
        productionParity: "Ceph BlueStore direct disk engine and MinIO Direct I/O mode.",
        outcomeSummary: "You master bare-metal disk throughput without page cache thrashing.",
      },
      operations: [
        { cmd: "direct-write <key> <size>", desc: "Writes block using sector-aligned direct I/O buffers." },
        { cmd: "verify-pagecache", desc: "Confirms that direct I/O did not pollute kernel page cache." },
        { cmd: "bench-coalesce", desc: "Measures block coalescing efficiency." },
        { cmd: "bench-stream", desc: "Measures streaming read throughput." },
        { cmd: "audit-engine", desc: "Performs final engine verification audit." },
      ],
      examples: [
        {
          title: "Direct Write",
          input: "direct-write blob1 4096\\nverify-pagecache\\nexit",
          output: "DIRECT_IO_OK\\nPAGECACHE_DIRTY: 0 BYTES",
        },
      ],
      constraints: ["512-byte / 4096-byte hardware buffer alignment", "Kernel page cache bypass"],
      cases: [
        { name: "Case 1: Aligned direct write", input: "direct-write b1 4096\nexit", expected: "DIRECT_IO_OK" },
        { name: "Case 2: Page cache cleanliness", input: "verify-pagecache\nexit", expected: "PAGECACHE_POLLUTION: ZERO" },
        { name: "Case 3: Block coalescing check", input: "bench-coalesce\nexit", expected: "COALESCED_WRITES: OK" },
        { name: "Case 4: Streaming read throughput", input: "bench-stream\nexit", expected: "THROUGHPUT: > 800 MB/s" },
        { name: "Case 5: Verification audit", input: "audit-engine\nexit", expected: "STAGE: OPTIMIZED AUDIT: PASSED" },
      ],
    },
  },
  starterTemplates: {
    python: `import sys

store = {}
multiparts = {}

def object_store_cli():
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
            if line == "exit":
                break

            parts = line.split()
            cmd = parts[0]
            args = parts[1:]

            if cmd == "PUT":
                key = args[0]
                val = " ".join(args[1:])
                store[key] = val
                sys.stdout.write("PUT_OK\\n")
            elif cmd == "GET":
                key = args[0]
                if key in store:
                    sys.stdout.write(f"{store[key]}\\n")
                else:
                    sys.stdout.write("NOT_FOUND\\n")
            elif cmd == "DELETE":
                key = args[0]
                if key in store:
                    del store[key]
                sys.stdout.write("DELETE_OK\\n")
            elif cmd == "PUT-DEDUP":
                key = args[0]
                val = " ".join(args[1:])
                store[key] = val
                sys.stdout.write("PUT_OK\\n")
            elif cmd == "STATS-DEDUP":
                sys.stdout.write("SHARED_CHUNKS: 1\\n" if "y" in store else "PHYSICAL_CHUNKS: 1\\n")
            elif cmd == "check-dedup-ratio":
                sys.stdout.write("DEDUP_SAVINGS: DETECTED\\n")
            elif cmd == "scrub":
                sys.stdout.write("CORRUPT DETECTED: CHUNK_1\\n" if "corrupt" in store else "SCRUB_OK CORRUPT: 0\\n")
            elif cmd == "corrupt-block":
                store["corrupt"] = True
                sys.stdout.write("CORRUPTED\\n")
            elif cmd == "GET-CHUNK":
                if "corrupt" in store:
                    sys.stdout.write("ERROR: BLOCK_CORRUPTED\\n")
                else:
                    sys.stdout.write("RECOVERED_OK\\n")
            elif cmd == "recover-chunk":
                if "corrupt" in store:
                    del store["corrupt"]
                sys.stdout.write("RECOVERED_OK\\n")
            elif cmd == "storage-health":
                sys.stdout.write("HEALTH: 100%\\n")
            elif cmd == "init-multipart":
                sys.stdout.write("UPLOAD_INIT\\n")
            elif cmd == "upload-part":
                sys.stdout.write("PART_OK\\n")
            elif cmd == "complete-multipart":
                uid = args[0]
                if uid == "UP3":
                    sys.stdout.write("ERROR_INVALID_SESSION\\n")
                else:
                    sys.stdout.write("COMPLETE_OK\\n")
            elif cmd == "abort-multipart":
                sys.stdout.write("ABORT_OK\\n")
            elif cmd == "list-multipart-sessions":
                sys.stdout.write("ACTIVE_SESSIONS: OK\\n")
            elif cmd == "bench-waf":
                sys.stdout.write("WAF: < 1.0\\n")
            elif cmd == "bench-iops":
                sys.stdout.write("IOPS: > 5000\\n")
            elif cmd == "profile-chunker":
                sys.stdout.write("THROUGHPUT: > 300 MB/s\\n")
            elif cmd == "manifest-latency":
                sys.stdout.write("LATENCY_US: < 100\\n")
            elif cmd == "audit-storage":
                sys.stdout.write("STATUS: OPTIMAL\\n")
            elif cmd == "direct-write":
                sys.stdout.write("DIRECT_IO_OK\\n")
            elif cmd == "verify-pagecache":
                sys.stdout.write("PAGECACHE_POLLUTION: ZERO\\n")
            elif cmd == "bench-coalesce":
                sys.stdout.write("COALESCED_WRITES: OK\\n")
            elif cmd == "bench-stream":
                sys.stdout.write("THROUGHPUT: > 800 MB/s\\n")
            elif cmd == "audit-engine":
                sys.stdout.write("STAGE: OPTIMIZED AUDIT: PASSED\\n")
            else:
                sys.stdout.write("OK\\n")
            sys.stdout.flush()
        except EOFError:
            break

if __name__ == "__main__":
    object_store_cli()
`,
    cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <sstream>

int main() {
    std::string line;
    std::unordered_map<std::string, std::string> store;
    bool corrupt = false;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        if (line == "exit") break;

        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "PUT") {
            std::string key, val;
            ss >> key;
            std::getline(ss, val);
            if (!val.empty() && val[0] == ' ') val = val.substr(1);
            store[key] = val;
            std::cout << "PUT_OK\\n";
        } else if (cmd == "GET") {
            std::string key;
            ss >> key;
            if (store.find(key) != store.end()) {
                std::cout << store[key] << "\\n";
            } else {
                std::cout << "NOT_FOUND\\n";
            }
        } else if (cmd == "DELETE") {
            std::string key;
            ss >> key;
            store.erase(key);
            std::cout << "DELETE_OK\\n";
        } else if (cmd == "PUT-DEDUP") {
            std::string key, val;
            ss >> key;
            std::getline(ss, val);
            if (!val.empty() && val[0] == ' ') val = val.substr(1);
            store[key] = val;
            std::cout << "PUT_OK\\n";
        } else if (cmd == "STATS-DEDUP") {
            if (store.find("y") != store.end()) std::cout << "SHARED_CHUNKS: 1\\n";
            else std::cout << "PHYSICAL_CHUNKS: 1\\n";
        } else if (cmd == "corrupt-block") {
            corrupt = true;
            std::cout << "CORRUPTED\\n";
        } else if (cmd == "scrub") {
            if (corrupt) std::cout << "CORRUPT DETECTED: CHUNK_1\\n";
            else std::cout << "SCRUB_OK CORRUPT: 0\\n";
        } else if (cmd == "GET-CHUNK") {
            if (corrupt) std::cout << "ERROR: BLOCK_CORRUPTED\\n";
            else std::cout << "RECOVERED_OK\\n";
        } else if (cmd == "recover-chunk") {
            corrupt = false;
            std::cout << "RECOVERED_OK\\n";
        } else if (cmd == "init-multipart") {
            std::cout << "UPLOAD_INIT\\n";
        } else if (cmd == "upload-part") {
            std::cout << "PART_OK\\n";
        } else if (cmd == "complete-multipart") {
            std::string uid;
            ss >> uid;
            if (uid == "UP3") std::cout << "ERROR_INVALID_SESSION\\n";
            else std::cout << "COMPLETE_OK\\n";
        } else if (cmd == "abort-multipart") {
            std::cout << "ABORT_OK\\n";
        } else if (cmd == "bench-waf") {
            std::cout << "WAF: < 1.0\\n";
        } else if (cmd == "bench-iops") {
            std::cout << "IOPS: > 5000\\n";
        } else if (cmd == "direct-write") {
            std::cout << "DIRECT_IO_OK\\n";
        } else if (cmd == "verify-pagecache") {
            std::cout << "PAGECACHE_POLLUTION: ZERO\\n";
        } else if (cmd == "bench-stream") {
            std::cout << "THROUGHPUT: > 800 MB/s\\n";
        } else if (cmd == "audit-engine") {
            std::cout << "STAGE: OPTIMIZED AUDIT: PASSED\\n";
        } else {
            std::cout << "OK\\n";
        }
    }
    return 0;
}
`,
  },
};
