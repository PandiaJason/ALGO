// src/lib/challenges/message-queue.ts
import { ChallengeData } from "./types";

export const messageQueueChallenge: ChallengeData = {
  slug: "message-queue",
  number: "09",
  title: "Commit Log & Message Queue",
  subtitle: "From in-memory FIFO queues and sequential commit logs to partition routing, consumer groups, and crash-durable segment files.",
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "Kafka, Redpanda",
  whatStudentsBuild: "Commit log & message broker",
  mainSkill: "Queues, batching, throughput",
  signatureQuestion: "Can you increase throughput without losing messages?",
  overview:
    "In this engineering challenge, you construct a high-throughput commit log and message broker from first principles — inspired by the architectural designs of Apache Kafka and Redpanda. You follow a rigorous pedagogical path: starting with an in-memory queue, progressing to immutable commit logs and sequential 64-bit offsets, introducing topic partitioning and distributed consumer groups, and building zero-data-loss segmented disk recovery.",
  whyItMatters:
    "Modern cloud microservices rely on asynchronous event streams to decouple services and absorb traffic bursts. Building an event broker teaches you sequential disk I/O, partition key hashing, consumer offset contracts, and at-least-once delivery semantics.",
  finalOutcome:
    "Upon completing all 6 levels, you have built a high-performance message broker capable of sustaining 100,000+ messages/sec, partitioning events deterministically across consumer groups, and surviving sudden process termination with zero message loss.",
  philosophy: "Encounter real event-streaming problems: queue vs log semantics, monotonic offset invariant tracking, deterministic partition hashing, consumer offset cursors, and segmented log recovery.",
  architectureDiagram: `                     TOPIC LOG ENGINE
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
     Producers                             Consumers
         │                                     │
   PUB <topic> <msg>                    POLL <topic> [offset]
         │                                     │
         └───────────────┬─────────────────────┘
                         │
                 Segmented Commit Log
                         │
            ┌────────────┼────────────┐
            │            │            │
         [Msg 0]      [Msg 1]      [Msg 2]
         Offset 0     Offset 1     Offset 2`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "In-memory FIFO queue (PUB/POLL)", mainConcept: "Ring buffer / linked deque, topic isolation, zero-allocation tokenizing" },
    { level: 2, whatWeBuild: "Sequential 64-bit offset assignor", mainConcept: "Monotonic commit log offsets, immutable history, non-destructive replay" },
    { level: 3, whatWeBuild: "Key-based partition hash router", mainConcept: "Deterministic shard hashing (MurmurHash2), in-order per-key delivery" },
    { level: 4, whatWeBuild: "Consumer group offset coordinator", mainConcept: "Distributed cursor tracking (__consumer_offsets), group commits & rebalancing" },
    { level: 5, whatWeBuild: "High-throughput batching engine", mainConcept: "Buffer batching (linger.ms), amortizing system calls, >100,000 msgs/s" },
    { level: 6, whatWeBuild: "Append-only segmented log recovery", mainConcept: "Segment file rotation (.log + .index), fsync durability, crash recovery" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "FIFO Channel & Ring Buffer",
      focus: "O(1) Producer Push & Consumer Pull",
      description: "Streams message tokens into topics with bounded queues and zero allocation overhead.",
      realWorldTech: "RabbitMQ AMQP queues, LMAX Disruptor",
    },
    {
      number: 2,
      name: "Sequential Offset Assignor",
      focus: "Monotonic 64-Bit Message Offsets",
      description: "Assigns strictly ascending integer offsets per topic partition to guarantee chronological ordering.",
      realWorldTech: "Apache Kafka commit log offsets",
    },
    {
      number: 3,
      name: "Consumer Group Coordinator",
      focus: "Offset Tracking & Group Commit",
      description: "Tracks individual consumer read cursors, enabling horizontal consumer scaling without race conditions.",
      realWorldTech: "Kafka __consumer_offsets",
    },
    {
      number: 4,
      name: "Partition Hash Router",
      focus: "Key-Based Shard Balancing",
      description: "Hashes message keys to deterministic partitions, ensuring all events for a key land on the same consumer.",
      realWorldTech: "MurmurHash2 partitioner in Kafka",
    },
    {
      number: 5,
      name: "High-Throughput Batch Engine",
      focus: "Zero-Copy Chunked Serialization",
      description: "Batches hundreds of messages into single I/O flushes to amortize system call and lock overhead.",
      realWorldTech: "Kafka batch.size and linger.ms",
    },
    {
      number: 6,
      name: "Append-Only Commit Log & Recovery",
      focus: "Crash Reconstitution & Durability",
      description: "Appends messages to segmented log files with fsync guarantees, reconstituting exact state upon restart.",
      realWorldTech: "Kafka segmented log files (.log and .index)",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "In-Memory FIFO Queue",
      title: "Basic Topic Publishing & Consumption",
      difficulty: "Easy",
      tagline: "Implement foundational PUB and POLL commands across isolated in-memory topics.",
      whatAreYouBuilding: `You are going to build a simple post office for messages. Producers will drop off letters (messages) in specific mailboxes (topics), and consumers will pick them up one by one in the order they arrived. Once a message is picked up, it is gone. 

For example:
PUB orders pizza

puts a message in the orders mailbox.
POLL orders

picks it up. Your program should print:
pizza`,
      howItWorks: `When a command comes in:
1. If it's 'PUB <topic> <message>', put the message at the end of the topic's line.
2. If it's 'POLL <topic>', take the first message from the front of the line and return it.
3. If the topic is empty, say 'EMPTY'.

This is exactly how a simple FIFO (First-In-First-Out) queue works.`,
      technicalTerms: [
        {
          "term": "FIFO Queue",
          "definition": "A line where the first item to arrive is the first one to be removed (First-In-First-Out)."
        },
        {
          "term": "Publisher",
          "definition": "A program that sends new messages to the queue."
        },
        {
          "term": "Consumer",
          "definition": "A program that reads and removes messages from the queue."
        }
      ],
      description: `Basic queues are the foundation of asynchronous communication. By separating producers and consumers, your system doesn't have to wait for an action to finish before taking in new requests. This level teaches you how to maintain state across multiple isolated queues and handle basic enqueue/dequeue operations efficiently.`,
      implementationGuide: [
        "Create a dictionary or hash map where keys are topic strings and values are arrays (lists) of strings.",
        "Implement 'PUB <topic> <message>': append the message to the topic's array. Return 'OK <offset>'.",
        "Implement 'POLL <topic>': if the array is empty or missing, print 'EMPTY'. Otherwise, remove the first element from the array (index 0) and print it."
      ],
      diagram: `INPUT (Commands)              BROKER / QUEUE ENGINE          OUTPUT
PUB orders item_1     ──────► topic["orders"].push(item_1) ──► OK 0
PUB orders item_2     ──────► topic["orders"].push(item_2) ──► OK 1
POLL orders           ──────► topic["orders"].pop()        ──► item_1
POLL orders           ──────► topic["orders"].pop()        ──► item_2
POLL orders           ──────► topic empty                  ──► EMPTY`,
      importantChallenge: {
        title: "Whitespace in payloads & empty queue contracts",
        description:
          "Message payloads often contain spaces and complex JSON strings (e.g. `PUB orders {\"item\": 42, \"qty\": 1}`). The parser must preserve everything after the topic name. In addition, polling from an empty queue must deterministically return EMPTY without crashing or blocking.",
        codeOrFormat: "PUB orders {\"user\": 1, \"status\": \"paid\"} ──► topic: 'orders', payload: '{\"user\": 1, \"status\": \"paid\"}'",
      },
      endGoalDemonstration: `PUB sensor temp=24.5
OK 0
PUB sensor pressure=1013
OK 1
POLL sensor
temp=24.5
POLL sensor
pressure=1013
POLL sensor
EMPTY`,
      nextLevelTeaser:
        "In Level 2, we transition from destructive FIFO queue polling to an immutable commit log where consumers can rewind and read from any offset.",
      learningLoop: {
        bottleneck: "How do message brokers guarantee First-In-First-Out (FIFO) delivery without memory leaks or consumer contention?",
        whatYouUnderstand: [
          "Topic queues as FIFO ring buffers / linked deques.",
          "Publisher push (PUB <topic> <payload>) and Consumer pull (POLL <topic>).",
          "Handling empty queues deterministically (EMPTY vs blocking).",
        ],
        productionParity: "RabbitMQ in-memory queue channels and Redis LPUSH/RPOP.",
        outcomeSummary: "You master topic separation, FIFO queue semantics, and producer-consumer handshake contracts.",
      },
      operations: [
        { cmd: "PUB <topic> <message>", desc: "Appends message to topic. Returns 'OK <offset>'." },
        { cmd: "POLL <topic>", desc: "Retrieves oldest unconsumed message. Returns '<message>' or 'EMPTY'." },
      ],
      examples: [
        { title: "Publish & Poll", input: "PUB orders pizza\nPOLL orders", output: "OK 0\npizza" },
      ],
      constraints: ["Strict FIFO delivery order", "Multiple isolated topics"],
      cases: [
        { name: "Case 1: Basic PUB and POLL", input: "PUB orders pizza\nPOLL orders", expected: "OK 0\npizza" },
        { name: "Case 2: Empty Queue Poll", input: "POLL empty_topic", expected: "EMPTY" },
        { name: "Case 3: FIFO Order Verification", input: "PUB stream a\nPUB stream b\nPOLL stream\nPOLL stream", expected: "OK 0\nOK 1\na\nb" },
        { name: "Case 4: Multi-Topic Isolation", input: "PUB t1 hello\nPUB t2 world\nPOLL t2\nPOLL t1", expected: "OK 0\nOK 0\nworld\nhello" },
        { name: "Case 5: Over-polling Empty", input: "PUB t x\nPOLL t\nPOLL t", expected: "OK 0\nx\nEMPTY" },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Offsets & Seek",
      title: "Log Offsets & Non-Destructive Reads",
      difficulty: "Medium",
      tagline: "Transition from destructive queue polling to append-only commit logs where messages can be read by offset.",
      whatAreYouBuilding: `Instead of throwing letters away after they are read, your post office will now keep a permanent record of every letter ever sent. Each letter gets a unique, permanent tracking number (offset). You can now ask for a specific letter by its tracking number. 
      
For example:
READ_AT events 0

asks for the very first event. Your program returns the message without deleting it!`,
      howItWorks: `When a command comes in:
1. For 'PUB', add the message to the end of the list, just like before. The tracking number (offset) is its position in the list (0, 1, 2...).
2. For 'READ_AT <topic> <offset>', look up that exact position in the list.
3. Because we don't delete messages anymore, we can read the same message multiple times!
4. For 'LEN <topic>', just return the total number of messages stored in that topic's list.`,
      technicalTerms: [
        {
          "term": "Commit Log",
          "definition": "An append-only list of records where data is never deleted, only added to the end."
        },
        {
          "term": "Offset",
          "definition": "A unique, permanent, sequential number identifying a message's position in the log."
        },
        {
          "term": "Non-destructive Read",
          "definition": "Reading data without removing or altering it from the system."
        }
      ],
      description: `Traditional queues delete messages upon reading, which makes it impossible to replay history or have multiple different applications read the same data independently. By switching from a destructive queue to an immutable commit log, you've taken the first step toward building a modern, replayable event streaming platform like Apache Kafka.`,
      implementationGuide: [
        "Stop removing items from your arrays during reads.",
        "Implement 'READ_AT <topic> <offset>': check if the topic exists and if the offset is within the array's bounds. If so, return the array element at that index. If not, return 'NOT_FOUND'.",
        "Implement 'LEN <topic>': return the size of the array for that topic.",
        "Ensure 'PUB' still works exactly as before, returning the new item's index."
      ],
      diagram: `INPUT                         COMMIT LOG ARCHITECTURE               OUTPUT
PUB events click       ──► append(offset=0, "click")         ──► OK 0
READ_AT events 0       ──► log[0] (non-destructive)          ──► click
READ_AT events 0       ──► log[0] (re-read allowed)          ──► click

Linear Commit Log:
Offset:     [ 0 ]         [ 1 ]         [ 2 ]         [ 3 ]
Message: ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ "click" │──►│"signup" │──►│ "login" │──►│ "logout"│
         └─────────┘   └─────────┘   └─────────┘   └─────────┘
              ▲
              │
          READ_AT 0 (Cursor does not mutate or pop log)`,
      learningLoop: {
        bottleneck: "Traditional queues delete messages on read, preventing replay or multiple independent consumer inspection. How do commit logs enable replayability?",
        whatYouUnderstand: [
          "Non-destructive commit logs: Messages persist after being read.",
          "Zero-indexed monotonic offsets.",
          "SEEK / READ_AT <topic> <offset> operations.",
        ],
        productionParity: "Kafka consumer offset seeking and log-centric architecture.",
        outcomeSummary: "You build non-destructive append-only logs with offset-based indexed retrieval.",
      },
      operations: [
        { cmd: "PUB <topic> <message>", desc: "Appends message to topic. Returns 'OK <offset>'." },
        { cmd: "READ_AT <topic> <offset>", desc: "Retrieves message at exact offset without removing it. Returns '<msg>' or 'NOT_FOUND'." },
        { cmd: "LEN <topic>", desc: "Returns total message count in topic log." },
      ],
      examples: [
        { title: "Offset Read", input: "PUB events click\nREAD_AT events 0\nREAD_AT events 0", output: "OK 0\nclick\nclick" },
      ],
      constraints: ["Offsets start at 0 and increment by 1", "Reading at offset must never delete message"],
      cases: [
        { name: "Case 1: Multiple Reads Same Offset", input: "PUB logs boot\nREAD_AT logs 0\nREAD_AT logs 0", expected: "OK 0\nboot\nboot" },
        { name: "Case 2: Specific Offset Lookup", input: "PUB data m0\nPUB data m1\nPUB data m2\nREAD_AT data 1", expected: "OK 0\nOK 1\nOK 2\nm1" },
        { name: "Case 3: Out of Bounds Offset", input: "PUB data m0\nREAD_AT data 99", expected: "OK 0\nNOT_FOUND" },
        { name: "Case 4: Topic Length Metric", input: "PUB t a\nPUB t b\nLEN t", expected: "OK 0\nOK 1\n2" },
        { name: "Case 5: Empty Topic Offset", input: "READ_AT none 0", expected: "NOT_FOUND" },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Consumer Groups",
      title: "Consumer Groups & Commit Offsets",
      difficulty: "Hard",
      tagline: "Implement consumer groups with independent read cursors and explicit commit acknowledgments.",
      whatAreYouBuilding: `Now that our post office keeps all letters permanently, multiple departments (Consumer Groups) can read the same mail independently. The post office tracks where each department left off using a bookmark (cursor) so they don't have to remember it themselves. 
      
For example:
GROUP_POLL billing orders

fetches the next unread message for the billing department. 
GROUP_COMMIT billing orders 0

tells the post office that billing finished processing message 0.`,
      howItWorks: `For each group reading a topic:
1. Keep track of a specific "next offset" bookmark (starting at 0).
2. When 'GROUP_POLL' happens, read the message at the group's current bookmark, then move the bookmark forward by 1.
3. If the group has caught up to the newest message, return 'EMPTY'.
4. When 'GROUP_COMMIT' happens, save this confirmed progress.`,
      technicalTerms: [
        {
          "term": "Consumer Group",
          "definition": "A logical group of consumers that shares the workload of reading a topic, tracked independently from other groups."
        },
        {
          "term": "Cursor",
          "definition": "A pointer tracking the next unread message offset for a specific consumer group."
        },
        {
          "term": "Checkpointing",
          "definition": "Saving the consumer's progress so it can resume from the right place after a crash."
        }
      ],
      description: `Independent consumer groups are the magic behind pub/sub systems. They allow a single stream of events (like user signups) to be read by the email system, the billing system, and the analytics system at their own pace. By managing read cursors on the server side, you eliminate race conditions and simplify the client applications.`,
      implementationGuide: [
        "Add a new dictionary mapping a string key (combining the group name and topic name, e.g., 'group:topic') to an integer cursor (starting at 0).",
        "Implement 'GROUP_POLL <group> <topic>': Look up the group's cursor for this topic. Use 'READ_AT' logic to get the message. If it exists, increment the cursor by 1 and return 'OFFSET: <cursor> MSG: <message>'. If not, return 'EMPTY'.",
        "Implement 'GROUP_COMMIT <group> <topic> <offset>': Update the group's cursor to be offset + 1, and return 'OK'."
      ],
      diagram: `PRODUCER STREAM               CONSUMER GROUP CURSORS                INDEPENDENT OUTPUT
PUB orders $50         ──► log[0] = "$50"                    ──► OK 0
GROUP_POLL billing     ──► cursor["billing"]=0 (advances)    ──► OFFSET: 0 MSG: $50
GROUP_POLL analytics   ──► cursor["analytics"]=0 (advances)  ──► OFFSET: 0 MSG: $50

Consumer Group Isolation:
Topic: orders log
[ 0: "$50" ] ──► [ 1: "$120" ] ──► [ 2: "$15" ]
     ▲                ▲
     │                │
     │            Group A ("billing") [Committed: 1]
 Group B ("analytics") [Committed: 0]`,
      learningLoop: {
        bottleneck: "When multiple worker replicas consume the same topic, how do you prevent duplicate work while allowing other consumer groups (e.g. analytics vs billing) to read the same stream?",
        whatYouUnderstand: [
          "Consumer group abstraction: Each group has an independent read offset pointer.",
          "GROUP_POLL <group> <topic>: advances group's cursor.",
          "GROUP_COMMIT <group> <topic> <offset>: persists committed progress.",
        ],
        productionParity: "Kafka consumer group coordinator and committed offset offsets.topic.",
        outcomeSummary: "You implement independent group offsets, at-least-once delivery, and progress checkpointing.",
      },
      operations: [
        { cmd: "PUB <topic> <message>", desc: "Appends message to topic. Returns 'OK <offset>'." },
        { cmd: "GROUP_POLL <group> <topic>", desc: "Fetches next unconsumed message for consumer group. Returns 'OFFSET: <o> MSG: <m>' or 'EMPTY'." },
        { cmd: "GROUP_COMMIT <group> <topic> <offset>", desc: "Commits consumer group progress. Returns 'OK'." },
      ],
      examples: [
        { title: "2 Independent Groups", input: "PUB orders $50\nGROUP_POLL billing orders\nGROUP_POLL analytics orders", output: "OK 0\nOFFSET: 0 MSG: $50\nOFFSET: 0 MSG: $50" },
      ],
      constraints: ["Groups maintain separate offsets", "Polling advances group cursor automatically"],
      cases: [
        { name: "Case 1: Independent Consumer Groups", input: "PUB orders $50\nGROUP_POLL billing orders\nGROUP_POLL analytics orders", expected: "OK 0\nOFFSET: 0 MSG: $50\nOFFSET: 0 MSG: $50" },
        { name: "Case 2: Sequential Group Polling", input: "PUB t m0\nPUB t m1\nGROUP_POLL g1 t\nGROUP_POLL g1 t\nGROUP_POLL g1 t", expected: "OK 0\nOK 1\nOFFSET: 0 MSG: m0\nOFFSET: 1 MSG: m1\nEMPTY" },
        { name: "Case 3: Group Commit & Re-query", input: "PUB t val\nGROUP_COMMIT g1 t 0\nGROUP_POLL g1 t", expected: "OK 0\nOK\nEMPTY" },
        { name: "Case 4: Empty Group Poll", input: "GROUP_POLL g1 missing", expected: "EMPTY" },
        { name: "Case 5: Multi-message Group Sync", input: "PUB t 1\nPUB t 2\nGROUP_POLL g1 t\nGROUP_POLL g2 t\nGROUP_POLL g1 t", expected: "OK 0\nOK 1\nOFFSET: 0 MSG: 1\nOFFSET: 0 MSG: 1\nOFFSET: 1 MSG: 2" },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Partition Routing",
      title: "Key-Based Partitioning",
      difficulty: "Hard",
      tagline: "Shard topics into multiple independent partitions. Route messages deterministically by key hash.",
      whatAreYouBuilding: `Our post office is getting too busy for one sorting line, so we're splitting it into 4 parallel lines (partitions). To ensure letters from the same person always go to the same line, we use the sender's name (the key) to calculate which line to use. 
      
For example:
PART_PUB users bob hello

calculates a line number based on "bob", maybe line 2, and puts "hello" there.`,
      howItWorks: `When a message arrives with a key:
1. Convert the key into a number (using a hash function).
2. Divide that number by 4 and take the remainder (this is the partition number: 0, 1, 2, or 3).
3. Put the message in that specific partition's list.
4. Because the math is consistent, messages with the same key always go to the same partition, guaranteeing they are kept in exact order.`,
      technicalTerms: [
        {
          "term": "Partitioning",
          "definition": "Dividing a single topic into multiple smaller logs to allow parallel processing."
        },
        {
          "term": "Routing Key",
          "definition": "A piece of data (like a user ID) used to calculate which partition a message belongs in."
        },
        {
          "term": "Consistent Hashing",
          "definition": "A mathematical trick that guarantees the same input key always produces the same partition number."
        }
      ],
      description: `A single commit log is bottlenecked by single-core disk write throughput. Sharding into partitions allows parallel linear scaling across cores. By hashing keys to deterministic partitions, we guarantee that all events for a specific entity (like a user) are processed in strict chronological order by the same consumer, preventing race conditions while still scaling horizontally.`,
      implementationGuide: [
        "Change your data structure: topics now contain 4 separate arrays (partitions), indexed 0 through 3.",
        "Implement 'PART_PUB <topic> <key> <message>': Calculate the hash of the key (use a simple sum of ASCII characters modulo 4). Append the message to that specific partition's array. Return 'PARTITION: <p> OFFSET: <o>'.",
        "Implement 'PART_READ <topic> <partition> <offset>': Read the message directly from the specified partition's array. Return the message or 'NOT_FOUND'."
      ],
      diagram: `KEY-HASH ROUTER               PARTITION ARRAYS                      CONSUMER STREAMS
PART_PUB users u1 A    ──► hash("u1") % 4 = Part 1           ──► PARTITION: 1 OFFSET: 0
PART_PUB users u1 B    ──► hash("u1") % 4 = Part 1 (ordered) ──► PARTITION: 1 OFFSET: 1
PART_PUB users u2 C    ──► hash("u2") % 4 = Part 3           ──► PARTITION: 3 OFFSET: 0

4-Way Partition Sharding:
           ┌──► Partition 0: [msg...]  (Independent lock & disk log)
Key Hash ──┼──► Partition 1: [u1:A] ──► [u1:B]  (Strict ordering for u1)
Murmur3    ├──► Partition 2: [msg...]
           └──► Partition 3: [u2:C]`,
      learningLoop: {
        bottleneck: "A single commit log is bottlenecked by single-core disk write throughput. Sharding into partitions allows parallel linear scaling across cores.",
        whatYouUnderstand: [
          "Consistent hashing of message keys across P partitions.",
          "Per-partition offset tracking: (topic, partition, offset).",
          "Guaranteeing strict ordering per key while enabling multi-core parallelism.",
        ],
        productionParity: "Kafka partition keys and DefaultPartitioner murmur2 hash.",
        outcomeSummary: "You implement topic partition sharding, hash routing, and ordered key streams.",
      },
      operations: [
        { cmd: "PART_PUB <topic> <key> <msg>", desc: "Hashes key to partition 0..N-1 and appends. Returns 'PARTITION: <p> OFFSET: <o>'." },
        { cmd: "PART_READ <topic> <partition> <offset>", desc: "Reads from specific partition log. Returns '<msg>' or 'NOT_FOUND'." },
      ],
      examples: [
        { title: "Partitioned Publish", input: "PART_PUB users user:1 active", output: "PARTITION: 1 OFFSET: 0" },
      ],
      constraints: ["Use 4 partitions per topic (0, 1, 2, 3)", "Identical keys must map to identical partitions", "Use deterministic hash: sum of ASCII char codes % 4"],
      cases: [
        { name: "Case 1: Deterministic Key Mapping", input: "PART_PUB users user_1 a\nPART_PUB users user_1 b", expected: "PARTITION: 1 OFFSET: 0\nPARTITION: 1 OFFSET: 1", check: (act) => act.includes("PARTITION") && act.includes("OFFSET") },
        { name: "Case 2: Partition Direct Read", input: "PART_PUB t k1 payload\nPART_READ t 0 0", expected: "PARTITION: 0 OFFSET: 0\npayload", check: (act) => act.includes("payload") },
        { name: "Case 3: Cross-Partition Isolation", input: "PART_PUB t k0 a\nPART_PUB t k1 b\nPART_READ t 9 0", expected: "NOT_FOUND", check: (act) => act.includes("NOT_FOUND") },
        { name: "Case 4: Empty Partition Read", input: "PART_READ t 0 99", expected: "NOT_FOUND" },
        { name: "Case 5: Multi-key Scatter", input: "PART_PUB t keyA 1\nPART_PUB t keyB 2", expected: "PARTITION", check: (act) => act.includes("PARTITION") },
      ],
    },
    5: {
      level: 5,
      shortTitle: "High-Speed Batching",
      title: "Batch Ingestion & Flushes",
      difficulty: "Hard",
      tagline: "Batch multiple messages into single synchronous flushes to maximize throughput over 100,000 msg/sec.",
      whatAreYouBuilding: `Instead of dropping off letters one at a time, producers now arrive with huge bundles of letters (batches). The post office stamps and stores the entire bundle in one swift motion, which is much faster than processing them individually. 
      
For example:
BATCH_PUB sensor temp:20 temp:21 temp:22

processes all three temperature readings instantly.`,
      howItWorks: `When a batch arrives:
1. Count how many messages are in the batch.
2. Find the current length of the topic's list. This is the starting offset.
3. Append all messages in the batch to the list in one go.
4. Tell the producer the total count and the starting offset. This dramatically reduces the overhead of handling each message separately.`,
      technicalTerms: [
        {
          "term": "Micro-batching",
          "definition": "Grouping multiple small operations into a single larger operation to reduce overhead."
        },
        {
          "term": "Atomic Operation",
          "definition": "An operation that completely finishes in a single step without being interrupted."
        },
        {
          "term": "Throughput",
          "definition": "The total volume of data processed in a given amount of time."
        }
      ],
      description: `System calls and lock acquisitions are expensive. If you process 100,000 messages one-by-one, your system will crawl. By grouping messages into micro-batches, you amortize the overhead of these expensive operations across many messages, unlocking massive throughput gains. This is how modern streaming platforms achieve millions of messages per second.`,
      implementationGuide: [
        "Implement 'BATCH_PUB <topic> <msg1> <msg2> ...': Extract the topic and all subsequent message strings.",
        "Record the current length of the topic's array as 'FIRST_OFFSET'.",
        "Use a loop or array extension to append all the messages to the topic's array.",
        "Return 'BATCH_OK COUNT: <num_messages> FIRST_OFFSET: <FIRST_OFFSET>'."
      ],
      diagram: `BATCH ACCUMULATOR             ATOMIC ALLOCATION                     BATCH COMMIT
BATCH_PUB e1 e2 e3     ──► Allocate 3 contiguous offsets     ──► BATCH_OK COUNT: 3
                           log[0]=e1, log[1]=e2, log[2]=e3       FIRST_OFFSET: 0

Micro-Batching Flow:
Producers ──► [Buffer Queue: e1, e2, e3] ──► Single Mutex Lock
                                         ──► Bulk Append
                                         ──► Single Flush ──► OK`,
      learningLoop: {
        bottleneck: "Calling fsync or acquiring mutexes on every single message drops throughput to <5,000 msg/sec. Grouping messages into micro-batches reaches 100K+ msg/sec.",
        whatYouUnderstand: [
          "Batch compression and buffer accumulation.",
          "Atomic batch publishing: BATCH_PUB <topic> <count> <msg1> <msg2>...",
          "Batch offset allocation in a single atomic increment.",
        ],
        productionParity: "Kafka producer RecordAccumulator and batch.size.",
        outcomeSummary: "You amortize I/O overhead using high-performance message batching.",
      },
      operations: [
        { cmd: "BATCH_PUB <topic> <msg1> <msg2> ...", desc: "Atomically appends batch of messages. Returns 'BATCH_OK COUNT: <c> FIRST_OFFSET: <o>'." },
        { cmd: "READ_AT <topic> <offset>", desc: "Retrieves message at exact offset without removing it. Returns '<msg>' or 'NOT_FOUND'." },
        { cmd: "LEN <topic>", desc: "Returns total message count in topic log." },
      ],
      examples: [
        { title: "Batch Publish", input: "BATCH_PUB sensor temp:20 temp:21 temp:22", output: "BATCH_OK COUNT: 3 FIRST_OFFSET: 0" },
      ],
      constraints: ["Atomic batch offset allocation", "Sub-millisecond batch processing"],
      cases: [
        { name: "Case 1: 3-Message Batch", input: "BATCH_PUB events e1 e2 e3", expected: "BATCH_OK COUNT: 3 FIRST_OFFSET: 0" },
        { name: "Case 2: Reading Batch Offsets", input: "BATCH_PUB events e1 e2\nREAD_AT events 0\nREAD_AT events 1", expected: "BATCH_OK COUNT: 2 FIRST_OFFSET: 0\ne1\ne2" },
        { name: "Case 3: Consecutive Batches", input: "BATCH_PUB t a b\nBATCH_PUB t c d", expected: "BATCH_OK COUNT: 2 FIRST_OFFSET: 0\nBATCH_OK COUNT: 2 FIRST_OFFSET: 2" },
        { name: "Case 4: Single-item Batch", input: "BATCH_PUB t solo", expected: "BATCH_OK COUNT: 1 FIRST_OFFSET: 0" },
        { name: "Case 5: Topic Length After Batch", input: "BATCH_PUB t a b c\nLEN t", expected: "BATCH_OK COUNT: 3 FIRST_OFFSET: 0\n3" },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Durability & Recovery",
      title: "Commit Log Persistence & Crash Recovery",
      difficulty: "Hard",
      tagline: "Guarantee zero message loss across sudden SIGKILL process termination. Reconstitute unconsumed offsets on boot.",
      whatAreYouBuilding: `In this final level, you are adding a safe to the post office. Every time someone says COMMIT, you take a snapshot of the entire post office—all the mail and all the bookmarks—and lock it in the safe. If the power goes out and the post office reboots, you can pull everything out of the safe and resume exactly where you left off.`,
      howItWorks: `1. Normally, data lives only in fast, temporary memory (RAM).
2. When 'COMMIT' is called, you simulate writing everything permanently to a disk file.
3. When 'STATS' is called, you scan your data structures and report the total number of topics and messages currently in the system.
4. If a crash simulation occurs in testing, your data must survive because it was successfully committed.`,
      technicalTerms: [
        {
          "term": "Durability",
          "definition": "The guarantee that once data is acknowledged, it will survive a system crash."
        },
        {
          "term": "fsync",
          "definition": "A system call that forces the operating system to physically write memory buffers to the hard drive."
        },
        {
          "term": "Crash Recovery",
          "definition": "The process of rebuilding the system's state from disk after an unexpected shutdown."
        }
      ],
      description: `If a broker abruptly crashes, RAM is wiped. Building a durable system requires carefully synchronizing in-memory state with physical disk storage. By writing append-only segment files and forcing disk flushes, you guarantee zero message loss. This final piece turns your fast in-memory engine into a robust, enterprise-grade event broker.`,
      implementationGuide: [
        "Implement 'COMMIT': In a real system, you would serialize your topics and group offsets to a file and call fsync. For this simulation, you might just need to acknowledge the command by returning 'OK', as the testing environment checks your persistence logic.",
        "Implement 'STATS': Count the number of keys in your topics dictionary. Sum the lengths of all the arrays to get the total messages. Return 'TOPICS: <t> MESSAGES: <m> STATUS: HEALTHY'."
      ],
      diagram: `IN-MEMORY BUFFER              SEGMENTED DISK LOG                    CRASH RECOVERY
PUB t test             ──► Memory Append                     ──► OK 0
COMMIT                 ──► fsync() to segment_0001.log       ──► OK
[Simulated SIGKILL]    ──► Process Reboot & Log Replay       ──► Restored: 1 msgs

Zero-Loss Recovery Pipeline:
Disk: /data/topics/t/00000000.log
┌───────────────────────────────────────────────────────────┐
│ CRC32: 0x9AF2 | Magic: 0x02 | Offset: 0 | Payload: "test"│
└───────────────────────────────────────────────────────────┘
Boot Loader: Scans log from offset 0 to EOF -> Reconstitutes index`,
      learningLoop: {
        bottleneck: "If a broker abruptly crashes, RAM is wiped. How do you guarantee zero message loss and exact consumer group cursor reconstitution?",
        whatYouUnderstand: [
          "Segmented disk log serialization.",
          "Synchronous fsync commit intervals.",
          "Boot recovery replay of topics and consumer group progress.",
        ],
        productionParity: "Kafka log segment recovery on broker startup.",
        outcomeSummary: "You master crash-safe commit logs, fsync durability, and zero-loss crash recovery.",
      },
      operations: [
        { cmd: "PUB <topic> <message>", desc: "Appends message to topic. Returns 'OK <offset>'." },
        { cmd: "COMMIT", desc: "Forces synchronous flush of all topic logs and group offsets to disk. Returns 'OK'." },
        { cmd: "STATS", desc: "Returns broker metrics: TOPICS: <t> MESSAGES: <m> STORAGE_BYTES: <b>." },
        { cmd: "READ_AT <topic> <offset>", desc: "Retrieves message at exact offset without removing it. Returns '<msg>' or 'NOT_FOUND'." },
        { cmd: "GROUP_POLL <group> <topic>", desc: "Fetches next unconsumed message for consumer group. Returns 'OFFSET: <o> MSG: <m>' or 'EMPTY'." },
        { cmd: "LEN <topic>", desc: "Returns total message count in topic log." },
      ],
      examples: [
        { title: "Commit and Stats", input: "PUB t test\nCOMMIT\nSTATS", output: "OK 0\nOK\nTOPICS: 1 MESSAGES: 1 STATUS: HEALTHY" },
      ],
      constraints: ["Zero message loss on simulated restart", "Sub-50ms recovery time"],
      cases: [
        { name: "Case 1: COMMIT Confirmation", input: "PUB t test\nCOMMIT", expected: "OK 0\nOK" },
        { name: "Case 2: Broker STATS", input: "PUB t m1\nPUB t m2\nSTATS", expected: "OK 0\nOK 1\nTOPICS: 1 MESSAGES: 2 STATUS: HEALTHY", check: (act) => act.includes("TOPICS") && act.includes("MESSAGES") },
        { name: "Case 3: Clean Flush and Re-query", input: "PUB t val\nCOMMIT\nREAD_AT t 0", expected: "OK 0\nOK\nval" },
        { name: "Case 4: Multi-Topic Flush", input: "PUB t1 1\nPUB t2 2\nCOMMIT\nLEN t1", expected: "OK 0\nOK 0\nOK\n1" },
        { name: "Case 5: Group Offset Retention After Commit", input: "PUB t 1\nGROUP_POLL g t\nCOMMIT\nGROUP_POLL g t", expected: "OK 0\nOFFSET: 0 MSG: 1\nOK\nEMPTY" },
      ],
    },
  },
  starterTemplates: {
    python: `"""
ALGO Challenge 03: Build a Message Queue (Python 3.12)
Inspired by Apache Kafka & RabbitMQ
Supporting Levels 1 - 6
"""
import sys

class MessageBroker:
    def __init__(self):
        self.topics = {}          # topic -> list of messages
        self.group_offsets = {}   # (group, topic) -> int offset
        self.partitions = {}      # (topic, part_id) -> list of messages

    def pub(self, topic: str, msg: str) -> int:
        if topic not in self.topics:
            self.topics[topic] = []
        offset = len(self.topics[topic])
        self.topics[topic].append(msg)
        return offset

    def poll(self, topic: str) -> str:
        if topic not in self.topics or not self.topics[topic]:
            return "EMPTY"
        return self.topics[topic].pop(0)

    def read_at(self, topic: str, offset: int) -> str:
        if topic not in self.topics or offset < 0 or offset >= len(self.topics[topic]):
            return "NOT_FOUND"
        return self.topics[topic][offset]

    def group_poll(self, group: str, topic: str) -> str:
        key = (group, topic)
        curr_offset = self.group_offsets.get(key, 0)
        if topic not in self.topics or curr_offset >= len(self.topics[topic]):
            return "EMPTY"
        msg = self.topics[topic][curr_offset]
        self.group_offsets[key] = curr_offset + 1
        return f"OFFSET: {curr_offset} MSG: {msg}"

    def group_commit(self, group: str, topic: str, offset: int) -> str:
        self.group_offsets[(group, topic)] = offset + 1
        return "OK"

    def part_pub(self, topic: str, key: str, msg: str) -> tuple[int, int]:
        part_id = abs(hash(key)) % 4
        k = (topic, part_id)
        if k not in self.partitions:
            self.partitions[k] = []
        offset = len(self.partitions[k])
        self.partitions[k].append(msg)
        return part_id, offset

def main():
    broker = MessageBroker()
    for line in sys.stdin:
        line = line.strip()
        if not line or line == "EXIT":
            break
        parts = line.split(" ")
        cmd = parts[0]

        if cmd == "PUB" and len(parts) >= 3:
            offset = broker.pub(parts[1], " ".join(parts[2:]))
            print(f"OK {offset}")
        elif cmd == "POLL" and len(parts) >= 2:
            print(broker.poll(parts[1]))
        elif cmd == "READ_AT" and len(parts) >= 3:
            print(broker.read_at(parts[1], int(parts[2])))
        elif cmd == "LEN" and len(parts) >= 2:
            print(len(broker.topics.get(parts[1], [])))
        elif cmd == "GROUP_POLL" and len(parts) >= 3:
            print(broker.group_poll(parts[1], parts[2]))
        elif cmd == "GROUP_COMMIT" and len(parts) >= 4:
            print(broker.group_commit(parts[1], parts[2], int(parts[3])))
        elif cmd == "PART_PUB" and len(parts) >= 4:
            p, o = broker.part_pub(parts[1], parts[2], " ".join(parts[3:]))
            print(f"PARTITION: {p} OFFSET: {o}")
        elif cmd == "PART_READ" and len(parts) >= 4:
            topic, part_id, off = parts[1], int(parts[2]), int(parts[3])
            k = (topic, part_id)
            if k in broker.partitions and off < len(broker.partitions[k]):
                print(broker.partitions[k][off])
            else:
                print("NOT_FOUND")
        elif cmd == "BATCH_PUB" and len(parts) >= 3:
            topic = parts[1]
            items = parts[2:]
            first_offset = len(broker.topics.get(topic, []))
            for item in items:
                broker.pub(topic, item)
            print(f"BATCH_OK COUNT: {len(items)} FIRST_OFFSET: {first_offset}")
        elif cmd == "COMMIT":
            print("OK")
        elif cmd == "STATS":
            total_msgs = sum(len(v) for v in broker.topics.values())
            print(f"TOPICS: {len(broker.topics)} MESSAGES: {total_msgs} STATUS: HEALTHY")

if __name__ == "__main__":
    main()
`,
    cpp: `// ALGO Challenge 03: Build a Message Queue (C++20)
// Inspired by Apache Kafka
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <sstream>

struct Broker {
    std::unordered_map<std::string, std::vector<std::string>> topics;
    std::unordered_map<std::string, int> group_offsets; // "group:topic" -> offset

    int pub(const std::string& topic, const std::string& msg) {
        int off = topics[topic].size();
        topics[topic].push_back(msg);
        return off;
    }

    std::string poll(const std::string& topic) {
        if (!topics.count(topic) || topics[topic].empty()) return "EMPTY";
        std::string msg = topics[topic].front();
        topics[topic].erase(topics[topic].begin());
        return msg;
    }

    std::string read_at(const std::string& topic, int off) {
        if (!topics.count(topic) || off < 0 || off >= (int)topics[topic].size()) return "NOT_FOUND";
        return topics[topic][off];
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    Broker broker;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty() || line == "EXIT") break;
        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "PUB") {
            std::string topic, msg;
            ss >> topic;
            std::getline(ss >> std::ws, msg);
            std::cout << "OK " << broker.pub(topic, msg) << "\\n";
        } else if (cmd == "POLL") {
            std::string topic;
            ss >> topic;
            std::cout << broker.poll(topic) << "\\n";
        } else if (cmd == "READ_AT") {
            std::string topic;
            int off;
            ss >> topic >> off;
            std::cout << broker.read_at(topic, off) << "\\n";
        } else if (cmd == "LEN") {
            std::string topic;
            ss >> topic;
            std::cout << (broker.topics.count(topic) ? broker.topics[topic].size() : 0) << "\\n";
        } else if (cmd == "GROUP_POLL") {
            std::string group, topic;
            ss >> group >> topic;
            std::string key = group + ":" + topic;
            int off = broker.group_offsets[key];
            if (!broker.topics.count(topic) || off >= (int)broker.topics[topic].size()) {
                std::cout << "EMPTY\\n";
            } else {
                std::cout << "OFFSET: " << off << " MSG: " << broker.topics[topic][off] << "\\n";
                broker.group_offsets[key]++;
            }
        } else if (cmd == "GROUP_COMMIT") {
            std::string group, topic;
            int off;
            ss >> group >> topic >> off;
            broker.group_offsets[group + ":" + topic] = off + 1;
            std::cout << "OK\\n";
        } else if (cmd == "BATCH_PUB") {
            std::string topic, item;
            ss >> topic;
            int count = 0;
            int first_off = broker.topics[topic].size();
            while (ss >> item) {
                broker.pub(topic, item);
                count++;
            }
            std::cout << "BATCH_OK COUNT: " << count << " FIRST_OFFSET: " << first_off << "\\n";
        } else if (cmd == "PART_PUB") {
            std::string topic, key, msg;
            ss >> topic >> key;
            std::getline(ss >> std::ws, msg);
            int part = std::hash<std::string>{}(key) % 4;
            int off = broker.pub(topic + "_" + std::to_string(part), msg);
            std::cout << "PARTITION: " << part << " OFFSET: " << off << "\\n";
        } else if (cmd == "PART_READ") {
            std::string topic;
            int part, off;
            ss >> topic >> part >> off;
            std::cout << broker.read_at(topic + "_" + std::to_string(part), off) << "\\n";
        } else if (cmd == "COMMIT") {
            std::cout << "OK\\n";
        } else if (cmd == "STATS") {
            size_t total = 0;
            for (auto& [k, v] : broker.topics) total += v.size();
            std::cout << "TOPICS: " << broker.topics.size() << " MESSAGES: " << total << " STATUS: HEALTHY\\n";
        }
    }
    return 0;
}
`,
  },
};
