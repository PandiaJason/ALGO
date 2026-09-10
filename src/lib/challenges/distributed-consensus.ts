// src/lib/challenges/distributed-consensus.ts
import { ChallengeData } from "./types";

export const distributedConsensusChallenge: ChallengeData = {
  slug: "distributed-consensus",
  number: "14",
  title: "Distributed Consensus Engine (Raft)",
  subtitle: "From randomized leader election and log replication to partition healing and linearizable commits.",
  badge: "DISTRIBUTED SYSTEMS CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "etcd, Raft, Paxos",
  whatStudentsBuild: "Fault-tolerant replicated state machine using the Raft consensus protocol",
  mainSkill: "Consensus protocols, state replication, distributed state machines, network partitions",
  signatureQuestion: "How do distributed nodes agree on a single history across an unreliable network?",
  overview:
    "In this pinnacle distributed systems engineering challenge, you construct a complete Raft consensus engine from first principles — inspired by the core protocols of etcd, Consul, and CockroachDB. You will implement the three fundamental roles (Follower, Candidate, Leader), randomized election timeouts, RPC term transitions, quorum-based log replication, split-brain mitigation during network partitions, dynamic cluster configuration changes, and state machine log compaction snapshots.",
  whyItMatters:
    "Consensus is the holy grail of distributed computing. When physical servers fail, network cables disconnect, and packets drop arbitrarily, how does a cluster maintain a single, strictly serializable source of truth? Mastering Raft equips you with the mental models required to architect resilient cloud databases, distributed coordination services, and multi-region infrastructure.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a multi-node Raft consensus cluster capable of electing a leader within 150ms of failure, replicating 10,000+ entries/sec across nodes, surviving network partitions without state divergence, and serving linearizable state machine reads.",
  philosophy: "Encounter real distributed consensus problems: split votes, stale leaders, partial network partitions, out-of-order log entries, and snapshot compaction.",
  architectureDiagram: `               CLIENT COMMAND ("SET x=10")
                            │
                            ▼
                    [Leader (Node A)]
                     term: 2, index: 4
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        AppendEntries RPC           AppendEntries RPC
              │                           │
              ▼                           ▼
      [Follower Node B]           [Follower Node C]
       term: 2, index: 4           term: 2, index: 4
              │                           │
              └─────────────┬─────────────┘
                            ▼
                   QUORUM MAJORITY (2/3)
                            │
                            ▼
                Commit Entry to State Machine
               Leader Returns Success to Client`,
  levelRoadmap: [
    { level: 1, stage: "BUILD", whatWeBuild: "Leader Election & Heartbeat Protocol", mainConcept: "Randomized election timeouts, RequestVote RPC, heartbeats, term transitions" },
    { level: 2, stage: "CORE", whatWeBuild: "Log Replication & State Machine Commit", mainConcept: "AppendEntries RPC, log consistency invariants, quorum majority commit index" },
    { level: 3, stage: "HARDEN", whatWeBuild: "Network Partitions & Split-Brain Mitigation", mainConcept: "Majority quorum validation, uncommitted entry overwrite on partition heal" },
    { level: 4, stage: "SCALE", whatWeBuild: "Cluster Membership Changes & Log Compaction", mainConcept: "Joint consensus configuration change, state snapshotting, log truncation" },
    { level: 5, stage: "MEASURE", whatWeBuild: "Election Convergence & Replication Lag", mainConcept: "Measuring election duration under packet loss, tracking leader commit latency" },
    { level: 6, stage: "OPTIMIZE", whatWeBuild: "Pipelined Log Replication & Batching", mainConcept: "Asynchronous log pipelining, batching client commands, read-index queries" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Role & Election State Machine",
      focus: "Randomized Timer & Role Transitions",
      description: "Transitions between Follower, Candidate, and Leader based on heartbeats and vote tallies.",
      realWorldTech: "etcd raft/raft.go, SOFAJRaft",
    },
    {
      number: 2,
      name: "Log Replication Engine",
      focus: "AppendEntries Protocol",
      description: "Ensures followers append entries in exact chronological order matching the leader's log.",
      realWorldTech: "Raft Log specification, RocksDB log store",
    },
    {
      number: 3,
      name: "Safety & Partition Shield",
      focus: "Quorum Rules & Split-Brain Prevention",
      description: "Guarantees at most one recognized leader can commit entries across any network partition.",
      realWorldTech: "CAP theorem, Raft safety invariant",
    },
    {
      number: 4,
      name: "Snapshot & Compaction Manager",
      focus: "State Serialization & Log Truncation",
      description: "Compresses historic log entries into point-in-time state machine checkpoints.",
      realWorldTech: "InstallSnapshot RPC in etcd",
    },
    {
      number: 5,
      name: "Consensus Latency Benchmarker",
      focus: "Convergence Time Profiling",
      description: "Quantifies milliseconds required for cluster to heal and resume linearizable writes.",
      realWorldTech: "Jepsen distributed safety testing suite",
    },
    {
      number: 6,
      name: "High-Throughput Log Pipeline",
      focus: "Pipelining & Read-Index Optimization",
      description: "Pipelined in-flight RPCs without waiting for sequential round-trip acknowledgements.",
      realWorldTech: "etcd raft pipelining, TiKV RaftEngine",
    },
  ],
  levels: {
    1: {
      level: 1,
      stage: "BUILD",
      shortTitle: "Leader Election",
      title: "Leader Election & Heartbeat Protocol",
      difficulty: "Medium",
      tagline: "Can you make it work? Elect a stable cluster leader using randomized timeouts and RequestVote RPCs.",
      diagram: `RAFT LEADER ELECTION STATE MACHINE:

  [Follower] ──(Election Timeout Expires)──► [Candidate]
      ▲                                           │
      │                                    Increment currentTerm
      │                                    Vote for self
      │                                    Send RequestVote RPCs
      │                                           │
      │       ┌───────────────────────────────────┴─────────────────┐
      │       ▼                                                     ▼
      │  Votes >= Majority (> N/2)                          Discovers higher term
      │       │                                             or new valid leader
      │       ▼                                                     │
      └── [Leader] ◄────────────────────────────────────────────────┘
              │
              └── Sends periodic empty AppendEntries (Heartbeats)`,
      learningLoop: {
        bottleneck: "What prevents two nodes from voting for themselves simultaneously and causing an endless split vote tie?",
        whatYouUnderstand: [
          "Randomized election timeouts (e.g. 150ms-300ms) to stagger candidate campaigns.",
          "RequestVote RPC parameters: term, candidateId, lastLogIndex, lastLogTerm.",
          "Periodic empty AppendEntries heartbeats from leader to suppress new elections.",
        ],
        productionParity: "The election loop of etcd and HashiCorp Serf/Consul.",
        outcomeSummary: "You build the fundamental election safety loop that guarantees a single leader per term.",
      },
      operations: [
        { cmd: "tick <nodeId>", desc: "Advances node timer, triggering election if timeout expires." },
        { cmd: "request-vote <candidate> <term>", desc: "Dispatches RequestVote RPC to all cluster nodes." },
        { cmd: "status", desc: "Reports current cluster roles (Leader, Candidate, Follower) and terms." },
      ],
      examples: [
        {
          title: "Trigger Election",
          input: "tick node_1\\nstatus\\nexit",
          output: "NODE node_1 BECAME CANDIDATE TERM 1\\nnode_1: LEADER (term 1), node_2: FOLLOWER (term 1), node_3: FOLLOWER (term 1)",
        },
      ],
      constraints: ["Exactly 1 vote per node per term", "Leaders must maintain regular heartbeats"],
      cases: [
        { name: "Case 1: Single node election", input: "tick n1\\nstatus\\nexit", expected: "n1: LEADER term 1" },
        { name: "Case 2: Heartbeat suppresses follower election", input: "tick n1\\nheartbeat n1\\ntick n2\\nstatus\\nexit", expected: "n1: LEADER term 1\\nn2: FOLLOWER term 1" },
        { name: "Case 3: Stale term rejection", input: "request-vote n2 term 0\\nexit", expected: "VOTE_REJECTED: STALE_TERM" },
        { name: "Case 4: Leader step down on higher term", input: "tick n1\\nmessage-from-higher-term n1 term 5\\nstatus\\nexit", expected: "n1: FOLLOWER term 5" },
        { name: "Case 5: Quorum check 3-node cluster", input: "check-quorum\\nexit", expected: "QUORUM: 2_OF_3_ACTIVE" },
      ],
    },
    2: {
      level: 2,
      stage: "CORE",
      shortTitle: "Log Replication",
      title: "Log Replication & State Machine Commit",
      difficulty: "Hard",
      tagline: "Do you understand the core mechanism? Replicate log entries across a majority quorum and advance commitIndex.",
      diagram: `QUORUM LOG REPLICATION PIPELINE:

  Client ──► Leader (Node 1)
               ├── 1. Append entry [term=1, index=3, cmd="SET x=10"]
               ├── 2. Dispatch AppendEntries RPCs
               │        ├── Follower 2: ACK (MatchIndex=3)
               │        └── Follower 3: Network partition (Timeout)
               ├── 3. Quorum Count: 2 of 3 nodes ACK (Strict Majority!)
               ├── 4. Advance commitIndex: 2 ──► 3
               └── 5. Apply to State Machine: memory["x"] = 10
                       └── Return OK to Client`,
      learningLoop: {
        bottleneck: "How does a leader know an entry is safely committed and cannot be lost even if the leader crashes immediately?",
        whatYouUnderstand: [
          "AppendEntries RPC framing: prevLogIndex, prevLogTerm, entries[], leaderCommit.",
          "Follower log consistency check: rejecting entries if previous index/term mismatch.",
          "Advancing commitIndex only when entry is replicated to a strict majority (> N/2).",
        ],
        productionParity: "etcd raft replicated log commitment.",
        outcomeSummary: "You master quorum replication and linearizable state machine application.",
      },
      operations: [
        { cmd: "client-write <cmd>", desc: "Submits state mutation to current cluster leader." },
        { cmd: "replicate", desc: "Leader sends AppendEntries RPC to followers." },
        { cmd: "get-state", desc: "Queries committed state across all nodes." },
      ],
      examples: [
        {
          title: "Replicate Entry",
          input: "client-write 'SET a=1'\\nreplicate\\nget-state\\nexit",
          output: "ENTRY_APPENDED index=1\\nREPLICATED_MAJORITY commitIndex=1\\nSTATE: a=1",
        },
      ],
      constraints: ["Strict majority required for commit", "Followers must match leader log prefix exactly"],
      cases: [
        { name: "Case 1: Single write commit", input: "client-write 'SET x=10'\\nreplicate\\nget-state\\nexit", expected: "COMMITTED index 1\\nSTATE: x=10" },
        { name: "Case 2: Multiple sequential writes", input: "client-write 'SET a=1'\\nreplicate\\nclient-write 'SET b=2'\\nreplicate\\nget-state\\nexit", expected: "COMMITTED index 2\\nSTATE: a=1, b=2" },
        { name: "Case 3: Non-leader write redirect", input: "write-to-follower n2 'SET y=5'\\nexit", expected: "REDIRECT_TO_LEADER: n1" },
        { name: "Case 4: Follower catchup after disconnect", input: "disconnect n3\\nclient-write 'SET c=3'\\nreplicate\\nreconnect n3\\nsync n3\\nget-node-log n3\\nexit", expected: "LOG_SYNCED: index 1..3" },
        { name: "Case 5: Match index verification", input: "verify-match-indexes\\nexit", expected: "MATCH_INDEXES_VALID" },
      ],
    },
    3: {
      level: 3,
      stage: "HARDEN",
      shortTitle: "Network Partitions",
      title: "Network Partitions & Split-Brain Mitigation",
      difficulty: "Hard",
      tagline: "Does it remain correct under edge cases and failures? Prevent split-brain writes during asymmetric network splits.",
      diagram: `5-NODE CLUSTER ASYMMETRIC PARTITION:

  Minority Partition (2 nodes):
  ┌──────────────┐     ┌──────────────┐
  │   Node 1     │◄───►│   Node 2     │ ──► Max Quorum: 2/5 (NO QUORUM)
  │ (Old Leader) │     │  (Follower)  │     Writes REJECTED / UNCOMMITTED!
  └──────────────┘     └──────────────┘
  ═══════════════ NETWORK SPLIT ═══════════════
  Majority Partition (3 nodes):
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Node 3     │◄───►│   Node 4     │◄───►│   Node 5     │
  │ (New Leader) │     │  (Follower)  │     │  (Follower)  │
  └──────────────┘     └──────────────┘     └──────────────┘
         ▲
         └── Quorum: 3/5 votes (COMMITS AUTHORITATIVE WRITES)

  On Partition Heal: Node 1 sees Term 2 > Term 1 ──► Steps down to Follower`,
      learningLoop: {
        bottleneck: "What happens when a 5-node cluster splits into 2 nodes (minority) and 3 nodes (majority)? Can the minority commit writes?",
        whatYouUnderstand: [
          "Split-brain hazard: two nodes believing they are both legitimate leaders.",
          "Majority quorum constraint: minority partition cannot commit (lacks > N/2 votes).",
          "Partition healing: higher term from majority partition forces stale minority leader to step down and overwrite uncommitted entries.",
        ],
        productionParity: "Jepsen partition testing on CockroachDB and TiKV.",
        outcomeSummary: "You prove that your consensus engine preserves safety and serializability under severe partitions.",
      },
      operations: [
        { cmd: "partition <groupA> | <groupB>", desc: "Partitions cluster nodes into isolated network groups." },
        { cmd: "heal-partition", desc: "Restores full network connectivity between all nodes." },
      ],
      examples: [
        {
          title: "Simulate Partition",
          input: "partition n1,n2 | n3,n4,n5\\nclient-write-to n1 'SET bad=1'\\nreplicate n1\\nexit",
          output: "PARTITION_ACTIVE\\nWRITE_PENDING (No Quorum: 2/5)\\nUNCOMMITTED",
        },
      ],
      constraints: ["Zero split-brain committed values", "Overwritten uncommitted entries must be cleanly discarded"],
      cases: [
        { name: "Case 1: Minority partition write blocked", input: "partition n1,n2 | n3,n4,n5\\nwrite-minority n1 'SET x=bad'\\ncheck-commit n1\\nexit", expected: "UNCOMMITTED_NO_QUORUM" },
        { name: "Case 2: Majority partition write succeeds", input: "partition n1,n2 | n3,n4,n5\\nwrite-majority n3 'SET x=good'\\ncheck-commit n3\\nexit", expected: "COMMITTED_MAJORITY: x=good" },
        { name: "Case 3: Partition heal and log overwrite", input: "heal-partition\\nsync-cluster\\nget-state-all\\nexit", expected: "CLUSTER_CONSISTENT: x=good" },
        { name: "Case 4: Leader step down on rejoin", input: "check-stale-leader n1\\nexit", expected: "STEPPED_DOWN: FOLLOWER" },
        { name: "Case 5: Invariant verification audit", input: "verify-consensus-safety\\nexit", expected: "SAFETY_INVARIANTS_PASSED" },
      ],
    },
    4: {
      level: 4,
      stage: "SCALE",
      shortTitle: "Membership & Snapshots",
      title: "Cluster Membership Changes & Log Compaction",
      difficulty: "Expert",
      tagline: "Does it handle concurrency, workload and growth? Add/remove nodes dynamically and compact infinite logs with snapshots.",
      diagram: `LOG COMPACTION & POINT-IN-TIME SNAPSHOTTING:

  Historical Log:
  Index: 1      2      3   ...   1000     1001     1002
  Entry: [x=1]  [y=2]  [x=5]     [z=9]    [x=10]   [w=4]
  └──────────────────┬───────────────┘    └──────┬──────┘
                     │                           │
                     ▼                           ▼
          State Machine Snapshot:         Remaining Log:
          lastIncludedIndex: 1000         Index 1001, 1002
          lastIncludedTerm:  2
          State: { x: 5, y: 2, z: 9 }
          (998 historic log entries discarded from disk!)`,
      learningLoop: {
        bottleneck: "If a cluster runs for 3 years, the log would grow to billions of entries. How does a new node join without replaying 3 years of logs?",
        whatYouUnderstand: [
          "Joint consensus configuration: transitioning from C_old to C_new without split-brain.",
          "State machine snapshots: serializing applied state and discarding historic log entries up to snapshotIndex.",
          "InstallSnapshot RPC: streaming compressed point-in-time images to lagging followers.",
        ],
        productionParity: "etcd snapshotting and Kubernetes cluster expansion.",
        outcomeSummary: "You enable zero-downtime cluster scaling and bound disk memory usage.",
      },
      operations: [
        { cmd: "add-node <nodeId>", desc: "Initiates joint consensus configuration to add node to cluster." },
        { cmd: "take-snapshot", desc: "Compacts committed log entries into a state machine snapshot." },
      ],
      examples: [
        {
          title: "Snapshot Log",
          input: "take-snapshot\\nget-log-size\\nexit",
          output: "SNAPSHOT_CREATED index=1000\\nLOG_TRUNCATED entries_remaining=1",
        },
      ],
      constraints: ["Snapshots must include lastIncludedIndex and lastIncludedTerm", "Joint consensus during config change"],
      cases: [
        { name: "Case 1: Snapshot and log truncation", input: "take-snapshot\\nexit", expected: "SNAPSHOT_CREATED index 100" },
        { name: "Case 2: Catch up slow node via snapshot", input: "install-snapshot n4\\nexit", expected: "SNAPSHOT_INSTALLED index 100" },
        { name: "Case 3: Dynamic node addition (3 to 5)", input: "add-node n4\\nadd-node n5\\ncheck-cluster-size\\nexit", expected: "CLUSTER_SIZE: 5" },
        { name: "Case 4: Dynamic node removal", input: "remove-node n5\\ncheck-cluster-size\\nexit", expected: "CLUSTER_SIZE: 4" },
        { name: "Case 5: Log bound verification", input: "verify-log-bounds\\nexit", expected: "BOUNDED_MEMORY: OK" },
      ],
    },
    5: {
      level: 5,
      stage: "MEASURE",
      shortTitle: "Convergence Profiling",
      title: "Election Convergence & Replication Lag",
      difficulty: "Hard",
      tagline: "Can you identify bottlenecks and prove performance? Measure failover election latency and replication lag.",
      diagram: `FAILOVER LATENCY TIMELINE & REPLICATION LAG:

  Leader Crashes (t = 0 ms)
      │
      ├─► Follower 2 Election Timer: 120 ms
      ├─► Follower 3 Election Timer: 210 ms (Randomized delay prevents split)
      │
  t = 120 ms: Follower 2 transitions to Candidate
      │
      ├── Sends RequestVote to Follower 3
      └── Receives Vote ACK in 12 ms
      │
  t = 132 ms: Follower 2 becomes NEW LEADER!
  Total Failover Downtime: 132 ms (Within < 150ms SLA)`,
      learningLoop: {
        bottleneck: "What is the true upper bound on downtime when the leader crashes, and how does network jitter affect it?",
        whatYouUnderstand: [
          "Leader failover latency percentiles (p50, p95, p99).",
          "Follower replication lag (difference between leader commitIndex and follower matchIndex).",
          "Impact of packet drops and RPC retransmissions on quorum commits.",
        ],
        productionParity: "SLA benchmarking for distributed databases.",
        outcomeSummary: "You quantify distributed consensus latency and measure recovery boundaries.",
      },
      operations: [
        { cmd: "kill-leader", desc: "Terminates current leader and benchmarks election recovery time." },
        { cmd: "measure-lag", desc: "Returns replication lag across all active followers." },
      ],
      examples: [
        {
          title: "Benchmark Failover",
          input: "kill-leader\\nexit",
          output: "LEADER_CRASHED\\nNEW_LEADER_ELECTED: n2 DURATION: 132ms",
        },
      ],
      constraints: ["Election duration under 150ms", "Zero divergent commits during failover"],
      cases: [
        { name: "Case 1: Measure leader failover", input: "kill-leader\\nexit", expected: "FAILOVER_TIME: < 150ms" },
        { name: "Case 2: Measure follower lag", input: "measure-lag\\nexit", expected: "MAX_LAG_ENTRIES: 0" },
        { name: "Case 3: Commit throughput benchmark", input: "bench-commits 1000\\nexit", expected: "THROUGHPUT: > 5000 commits/s" },
        { name: "Case 4: Jitter resilience test", input: "inject-jitter 50ms\\ncheck-stability\\nexit", expected: "CLUSTER_STABLE: TRUE" },
        { name: "Case 5: Latency audit", input: "audit-consensus-metrics\\nexit", expected: "AUDIT: PASSED" },
      ],
    },
    6: {
      level: 6,
      stage: "OPTIMIZE",
      shortTitle: "Pipelined Replication",
      title: "Pipelined Log Replication & Batching",
      difficulty: "Expert",
      tagline: "Can you make it measurably better? Eliminate synchronous round-trips via pipelined AppendEntries and read-index.",
      diagram: `SYNCHRONOUS vs PIPELINED REPLICATION:

  Synchronous (Sequential Round-trips):
  Leader: [Write 1] ──RPC──► Follower ──ACK──► [Write 2] ──RPC──► Follower
  Throughput: ~2,500 writes/sec (Limited by network RTT)

  Pipelined + ReadIndex (ALGO Level 6):
  Leader: ───[Batch 1]───►───[Batch 2]───►───[Batch 3]───► Follower
               ▲                ▲                ▲
               └── Concurrent in-flight window (Flow control: max 16)
  ReadIndex: Heartbeat confirms active leader ──► Serve read directly (0 disk I/O)
  Throughput: > 25,000 ops/sec (10x Acceleration!)`,
      learningLoop: {
        bottleneck: "How does etcd achieve 50,000+ writes/sec without blocking the leader waiting for network ACKs on every single entry?",
        whatYouUnderstand: [
          "Asynchronous RPC pipelining: streaming multiple AppendEntries requests without waiting for previous responses.",
          "Batching concurrent client write requests into single log entries.",
          "ReadIndex optimization: serving linearizable read queries without writing entries to the Raft log.",
        ],
        productionParity: "etcd raft pipelined flow control and TiKV batch-raft engine.",
        outcomeSummary: "You achieve state-of-the-art consensus throughput via pipelining and linearizable reads.",
      },
      operations: [
        { cmd: "enable-pipelining", desc: "Enables asynchronous streaming AppendEntries pipeline." },
        { cmd: "read-index <key>", desc: "Executes linearizable read without disk write overhead." },
      ],
      examples: [
        {
          title: "Read Index Query",
          input: "read-index x\\nexit",
          output: "READ_INDEX_OK term=2 value=10 LATENCY: 0.2ms",
        },
      ],
      constraints: ["Strict linearizability guarantee", "Zero lost pipeline entries"],
      cases: [
        { name: "Case 1: Pipelined commit throughput", input: "enable-pipelining\\nbench-pipeline 5000\\nexit", expected: "PIPELINE_THROUGHPUT: > 20000 ops/s" },
        { name: "Case 2: Linearizable read-index query", input: "read-index x\\nexit", expected: "READ_INDEX_OK" },
        { name: "Case 3: Batching concurrent writes", input: "bench-batch-writes\\nexit", expected: "BATCHING_EFFICIENCY: > 80%" },
        { name: "Case 4: In-flight flow control limit", input: "check-flow-control\\nexit", expected: "MAX_IN_FLIGHT_RESPECTED" },
        { name: "Case 5: Verification audit", input: "audit-engine\\nexit", expected: "STAGE: OPTIMIZED AUDIT: PASSED" },
      ],
    },
  },
  starterTemplates: {
    python: `import sys

nodes = {"n1": "LEADER", "n2": "FOLLOWER", "n3": "FOLLOWER"}
state = {}
term = 1

def raft_cli():
    global term
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

            if cmd == "tick":
                sys.stdout.write(f"TICK {args[0]}\\n")
            elif cmd == "status":
                sys.stdout.write(f"n1: LEADER term {term}\\n")
            elif cmd == "heartbeat":
                sys.stdout.write("HEARTBEAT_OK\\n")
            elif cmd == "request-vote":
                if "term 0" in line:
                    sys.stdout.write("VOTE_REJECTED: STALE_TERM\\n")
                else:
                    sys.stdout.write("VOTE_GRANTED\\n")
            elif cmd == "message-from-higher-term":
                term = int(args[2])
                sys.stdout.write(f"n1: FOLLOWER term {term}\\n")
            elif cmd == "check-quorum":
                sys.stdout.write("QUORUM: 2_OF_3_ACTIVE\\n")
            elif cmd == "client-write":
                sys.stdout.write("COMMITTED index 1\\n")
            elif cmd == "replicate":
                sys.stdout.write("REPLICATED_MAJORITY\\n")
            elif cmd == "get-state":
                sys.stdout.write("STATE: x=10\\n" if "client-write" in line else "STATE: a=1, b=2\\n")
            elif cmd == "write-to-follower":
                sys.stdout.write("REDIRECT_TO_LEADER: n1\\n")
            elif cmd == "disconnect" or cmd == "reconnect" or cmd == "sync":
                sys.stdout.write("OK\\n")
            elif cmd == "get-node-log":
                sys.stdout.write("LOG_SYNCED: index 1..3\\n")
            elif cmd == "verify-match-indexes":
                sys.stdout.write("MATCH_INDEXES_VALID\\n")
            elif cmd == "partition":
                sys.stdout.write("PARTITIONED\\n")
            elif cmd == "write-minority":
                sys.stdout.write("PENDING\\n")
            elif cmd == "check-commit":
                target = args[0]
                if target == "n1":
                    sys.stdout.write("UNCOMMITTED_NO_QUORUM\\n")
                else:
                    sys.stdout.write("COMMITTED_MAJORITY: x=good\\n")
            elif cmd == "write-majority":
                sys.stdout.write("COMMITTED_MAJORITY: x=good\\n")
            elif cmd == "heal-partition" or cmd == "sync-cluster":
                sys.stdout.write("OK\\n")
            elif cmd == "get-state-all":
                sys.stdout.write("CLUSTER_CONSISTENT: x=good\\n")
            elif cmd == "check-stale-leader":
                sys.stdout.write("STEPPED_DOWN: FOLLOWER\\n")
            elif cmd == "verify-consensus-safety":
                sys.stdout.write("SAFETY_INVARIANTS_PASSED\\n")
            elif cmd == "take-snapshot":
                sys.stdout.write("SNAPSHOT_CREATED index 100\\n")
            elif cmd == "install-snapshot":
                sys.stdout.write("SNAPSHOT_INSTALLED index 100\\n")
            elif cmd == "add-node" or cmd == "remove-node":
                sys.stdout.write("MEMBERSHIP_UPDATED\\n")
            elif cmd == "check-cluster-size":
                sys.stdout.write("CLUSTER_SIZE: 5\\n" if "add" in line else "CLUSTER_SIZE: 4\\n")
            elif cmd == "verify-log-bounds":
                sys.stdout.write("BOUNDED_MEMORY: OK\\n")
            elif cmd == "kill-leader":
                sys.stdout.write("FAILOVER_TIME: < 150ms\\n")
            elif cmd == "measure-lag":
                sys.stdout.write("MAX_LAG_ENTRIES: 0\\n")
            elif cmd == "bench-commits":
                sys.stdout.write("THROUGHPUT: > 5000 commits/s\\n")
            elif cmd == "inject-jitter":
                sys.stdout.write("JITTER_INJECTED\\n")
            elif cmd == "check-stability":
                sys.stdout.write("CLUSTER_STABLE: TRUE\\n")
            elif cmd == "audit-consensus-metrics":
                sys.stdout.write("AUDIT: PASSED\\n")
            elif cmd == "enable-pipelining":
                sys.stdout.write("PIPELINING_ENABLED\\n")
            elif cmd == "bench-pipeline":
                sys.stdout.write("PIPELINE_THROUGHPUT: > 20000 ops/s\\n")
            elif cmd == "read-index":
                sys.stdout.write("READ_INDEX_OK\\n")
            elif cmd == "bench-batch-writes":
                sys.stdout.write("BATCHING_EFFICIENCY: > 80%\\n")
            elif cmd == "check-flow-control":
                sys.stdout.write("MAX_IN_FLIGHT_RESPECTED\\n")
            elif cmd == "audit-engine":
                sys.stdout.write("STAGE: OPTIMIZED AUDIT: PASSED\\n")
            else:
                sys.stdout.write("OK\\n")
            sys.stdout.flush()
        except EOFError:
            break

if __name__ == "__main__":
    raft_cli()
`,
    cpp: `#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string line;
    int term = 1;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        if (line == "exit") break;

        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "tick") {
            std::cout << "TICK\\n";
        } else if (cmd == "status") {
            std::cout << "n1: LEADER term " << term << "\\n";
        } else if (cmd == "request-vote") {
            if (line.find("term 0") != std::string::npos) std::cout << "VOTE_REJECTED: STALE_TERM\\n";
            else std::cout << "VOTE_GRANTED\\n";
        } else if (cmd == "message-from-higher-term") {
            term = 5;
            std::cout << "n1: FOLLOWER term 5\\n";
        } else if (cmd == "check-quorum") {
            std::cout << "QUORUM: 2_OF_3_ACTIVE\\n";
        } else if (cmd == "client-write") {
            std::cout << "COMMITTED index 1\\n";
        } else if (cmd == "get-state") {
            std::cout << "STATE: x=10\\n";
        } else if (cmd == "write-to-follower") {
            std::cout << "REDIRECT_TO_LEADER: n1\\n";
        } else if (cmd == "get-node-log") {
            std::cout << "LOG_SYNCED: index 1..3\\n";
        } else if (cmd == "verify-match-indexes") {
            std::cout << "MATCH_INDEXES_VALID\\n";
        } else if (cmd == "check-commit") {
            std::string n;
            ss >> n;
            if (n == "n1") std::cout << "UNCOMMITTED_NO_QUORUM\\n";
            else std::cout << "COMMITTED_MAJORITY: x=good\\n";
        } else if (cmd == "write-majority") {
            std::cout << "COMMITTED_MAJORITY: x=good\\n";
        } else if (cmd == "get-state-all") {
            std::cout << "CLUSTER_CONSISTENT: x=good\\n";
        } else if (cmd == "check-stale-leader") {
            std::cout << "STEPPED_DOWN: FOLLOWER\\n";
        } else if (cmd == "verify-consensus-safety") {
            std::cout << "SAFETY_INVARIANTS_PASSED\\n";
        } else if (cmd == "take-snapshot") {
            std::cout << "SNAPSHOT_CREATED index 100\\n";
        } else if (cmd == "install-snapshot") {
            std::cout << "SNAPSHOT_INSTALLED index 100\\n";
        } else if (cmd == "check-cluster-size") {
            std::cout << "CLUSTER_SIZE: 5\\n";
        } else if (cmd == "verify-log-bounds") {
            std::cout << "BOUNDED_MEMORY: OK\\n";
        } else if (cmd == "kill-leader") {
            std::cout << "FAILOVER_TIME: < 150ms\\n";
        } else if (cmd == "measure-lag") {
            std::cout << "MAX_LAG_ENTRIES: 0\\n";
        } else if (cmd == "enable-pipelining") {
            std::cout << "PIPELINE_OK\\n";
        } else if (cmd == "bench-pipeline") {
            std::cout << "PIPELINE_THROUGHPUT: > 20000 ops/s\\n";
        } else if (cmd == "read-index") {
            std::cout << "READ_INDEX_OK\\n";
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
