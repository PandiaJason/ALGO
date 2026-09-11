// src/lib/challenges/task-scheduler.ts
import { ChallengeData } from "./types";

export const taskSchedulerChallenge: ChallengeData = {
  slug: "task-scheduler",
  number: "13",
  title: "Multi-Resource Task Scheduler",
  subtitle: "From priority queues and multi-resource bin-packing to worker failure preemption and dominant resource fairness (DRF).",
  badge: "DISTRIBUTED SYSTEMS CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "Kubernetes (kube-scheduler), Mesos",
  whatStudentsBuild: "Multi-resource cluster task scheduler",
  mainSkill: "Scheduling, priorities, concurrency",
  signatureQuestion: "Can you schedule more work with the same resources?",
  overview:
    "In this engineering challenge, you construct a production-grade multi-resource cluster task scheduler from first principles — inspired by the scheduling architectures of Kubernetes (kube-scheduler) and Apache Mesos. Rather than using simplistic first-in queues, you engineer multi-dimensional resource bin-packing across CPU and RAM, priority-ordered ready queues, node capacity filtering, heartbeat failure recovery, and Dominant Resource Fairness (DRF).",
  whyItMatters:
    "Modern cloud computing runs millions of containers across heterogeneous hardware. Poor scheduling creates massive resource strandedness (nodes running out of RAM while CPU sits idle at 5%), job starvation, and cascading outages when worker nodes fail. Mastering scheduling algorithms is the pinnacle of systems engineering.",
  finalOutcome:
    "Upon completing all 6 levels, you have engineered an autonomous cluster scheduler capable of bin-packing multi-resource tasks, preempting low-priority workloads, recovering from node deaths, and balancing fairness across competing tenants.",
  philosophy: "Encounter real cluster scheduling problems: multi-dimensional bin packing, resource fragmentation, priority preemption, failure rescheduling, and max-min tenant fairness.",
  architectureDiagram: `                     TASK SCHEDULER
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
     Job Queue                             Cluster
         │                                     │
  SUBMIT task cpu=2 ram=2048              Worker Nodes
         │                                     │
         └───────────────┬─────────────────────┘
                         │
                 Scheduling Filter
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
       [Node 1]      [Node 2]      [Node 3]
       4C / 8192M    8C / 16384M   16C / 32768M`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Node registry & FIFO scheduling filter", mainConcept: "Multi-resource capacity checking (CPU + RAM), first-fit node placement" },
    { level: 2, whatWeBuild: "Priority-based ready queue", mainConcept: "Task priority classes, starvation prevention, deterministic tie-breaking" },
    { level: 3, whatWeBuild: "Multi-resource bin packing", mainConcept: "Least-allocated / best-fit vector heuristic, minimizing stranded resources" },
    { level: 4, whatWeBuild: "Task lifecycle & resource deallocation", mainConcept: "State transitions (PENDING -> RUNNING -> COMPLETED), atomic capacity freeing" },
    { level: 5, whatWeBuild: "Node failure & task rescheduling", mainConcept: "Worker heartbeat timeouts, automatic workload eviction, priority requeueing" },
    { level: 6, whatWeBuild: "Dominant Resource Fairness (DRF)", mainConcept: "Berkeley DRF multi-tenant max-min fairness, dominant share tracking" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Node Registry & FIFO Scheduler",
      focus: "Cluster Topology & Capacity Tracking",
      description: "Maintains cluster worker nodes with available CPU and RAM quotas, assigning tasks in arrival order.",
      realWorldTech: "Kubernetes Node controller and basic FIFO queue",
    },
    {
      number: 2,
      name: "Priority Ready Queue",
      focus: "Binary Heap Task Ordering",
      description: "Orders waiting tasks by user priority and deadline using a min/max heap to guarantee high-priority dispatch.",
      realWorldTech: "Kubernetes PriorityClass and scheduling queue",
    },
    {
      number: 3,
      name: "Multi-Resource Bin Packing",
      focus: "Best-Fit / Least-Allocated Heuristic",
      description: "Evaluates multi-dimensional vectors (CPU, RAM) across nodes to minimize stranded resources and fragmentation.",
      realWorldTech: "Borg vector bin-packing, Kubernetes NodeResourcesFit",
    },
    {
      number: 4,
      name: "Lifecycle & Deallocation",
      focus: "Task Completion & Atomic Resource Freeing",
      description: "Tracks task lifecycle transitions (PENDING, RUNNING, COMPLETED) and immediately unblocks waiting tasks when resources free.",
      realWorldTech: "Kubelet pod lifecycle state machine",
    },
    {
      number: 5,
      name: "Node Failure & Task Rescheduling",
      focus: "Worker Eviction & Resiliency",
      description: "Detects worker node crashes, immediately evicts running workloads, and re-queues them with original priority.",
      realWorldTech: "Kubernetes pod eviction on node NotReady",
    },
    {
      number: 6,
      name: "Dominant Resource Fairness (DRF)",
      focus: "Multi-Tenant Resource Allocation",
      description: "Implements Berkeley DRF to equitably share heterogeneous clusters among competing teams without starvation.",
      realWorldTech: "Apache Mesos DRF allocator, Hadoop YARN FairScheduler",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Node Registration & FIFO",
      title: "Cluster Node Registry & FIFO Scheduling",
      difficulty: "Easy",
      tagline: "Register cluster nodes with CPU and RAM capacities. Schedule queued tasks in arrival order on the first eligible node.",
      whatAreYouBuilding: `You are going to build a basic cluster task scheduler. Think of it as an airport gate agent assigning passengers to shuttle buses. A bus must have enough physical seats (CPU) and luggage space (RAM) to take the passenger. The agent processes people first-come, first-served.

For example:
ADD_NODE worker-1 4 8192
SUBMIT task-1 2 2048
SCHEDULE

Your scheduler checks if the worker has enough CPU and RAM, and if so, prints:
SCHEDULED task-1 -> worker-1`,
      howItWorks: `When you run the scheduler:
1. Look at the very first task that was submitted to the queue (FIFO).
2. Iterate through all the registered nodes in the cluster.
3. Check if a node has BOTH enough free CPU and enough free RAM to accommodate the task.
4. If a fitting node is found, deduct the CPU and RAM from its available capacity and schedule the task.
5. If no node has enough space, leave the task in the queue and wait for resources to free up.`,
      technicalTerms: [
        {
          "term": "Multi-Resource Scheduling",
          "definition": "Allocating tasks based on multiple simultaneous hardware constraints, typically CPU cores and Memory (RAM)."
        },
        {
          "term": "First-Fit Algorithm",
          "definition": "A simple bin-packing strategy that places an item in the first container it finds that has enough space."
        },
        {
          "term": "FIFO Queue",
          "definition": "First-In-First-Out. Processing items strictly in the exact order they arrived."
        }
],
      description: `In single-machine environments, the OS handles scheduling. But in a distributed cluster (like Kubernetes), you have a pool of heterogeneous worker nodes. 

A simple task queue is not enough because tasks have multi-dimensional resource requirements. A machine might have 90% of its CPU idle, but if it is completely out of RAM, it cannot accept a memory-heavy job. Level 1 introduces tracking these dual constraints and using a First-Fit algorithm to assign workloads to available cluster capacity.`,
      implementationGuide: [
        "Maintain a list of nodes tracking {id, total_cpu, total_ram, free_cpu, free_ram}.",
        "Maintain a FIFO queue (array) for pending tasks tracking {id, cpu, ram}.",
        "On 'ADD_NODE', store the node and initialize its free resources to its total capacity. Print 'OK'.",
        "On 'SUBMIT', push the task to the back of the pending queue. Print 'QUEUED'.",
        "On 'SCHEDULE', peek at the first task. Loop through the nodes in registration order. If node.free_cpu >= task.cpu AND node.free_ram >= task.ram, assign it.",
        "Deduct the resources from the node, remove the task from the queue, track its status as RUNNING, and print 'SCHEDULED <task_id> -> <node_id>'."
],
      diagram: `TASK SUBMISSION                           SCHEDULING ENGINE               ASSIGNMENT
ADD_NODE worker-1 4 8192      ──► register node capacity   ──► OK
SUBMIT task-1 2 2048          ──► enqueue pending job      ──► QUEUED
SCHEDULE                      ──► first-fit capacity check ──► SCHEDULED task-1 -> worker-1
STATUS task-1                 ──► query task state         ──► RUNNING worker-1`,
      importantChallenge: {
        title: "Multi-Dimensional Resource Constraints",
        description:
          "A node cannot accept a task unless it simultaneously has sufficient available CPU AND sufficient available RAM. Checking either resource independently causes scheduling collisions, out-of-memory kernel kills, or stranded hardware.",
        codeOrFormat: "fits = (node.free_cpu >= task.cpu) and (node.free_ram >= task.ram)",
      },
      endGoalDemonstration: `ADD_NODE worker-1 4 8192
OK
SUBMIT task-1 2 2048
QUEUED
SCHEDULE
SCHEDULED task-1 -> worker-1
STATUS task-1
RUNNING worker-1`,
      nextLevelTeaser:
        "In Level 2, we introduce Priority-Based Queueing, ensuring mission-critical services preempt background batch processing jobs.",
      learningLoop: {
        bottleneck: "Simple schedulers fail to track multi-resource constraints. A node must have both enough CPU AND enough RAM to accept a task.",
        whatYouUnderstand: [
          "Tracking node CPU and RAM capacity vs allocated usage.",
          "Iterating nodes in registration order to find first fitting node (First-Fit).",
          "Queuing tasks when no node currently has sufficient capacity.",
        ],
        productionParity: "The baseline scheduling filter algorithm in early container orchestrators.",
        outcomeSummary: "You implement node registration and multi-resource capacity checking.",
      },
      operations: [
        { cmd: "ADD_NODE <node_id> <cpu> <ram>", desc: "Registers a worker node. Returns 'OK'." },
        { cmd: "SUBMIT <task_id> <cpu> <ram>", desc: "Submits task to the queue. Returns 'QUEUED'." },
        { cmd: "SCHEDULE", desc: "Attempts to schedule the next queued task. Returns 'SCHEDULED <task_id> -> <node_id>' or 'WAITING'." },
        { cmd: "STATUS <task_id>", desc: "Returns 'PENDING', 'RUNNING <node_id>', or 'NOT_FOUND'." },
      ],
      examples: [
        {
          title: "Schedule Task on Node",
          input: "ADD_NODE worker-1 4 8192\nSUBMIT task-1 2 2048\nSCHEDULE\nSTATUS task-1",
          output: "OK\nQUEUED\nSCHEDULED task-1 -> worker-1\nRUNNING worker-1",
        },
      ],
      constraints: ["Node IDs and Task IDs are alphanumeric strings", "CPU is integer cores, RAM is integer MB", "Tasks submitted via SUBMIT have a default priority of 1"],
      cases: [
        {
          name: "Case 1: Single Node Single Task",
          input: "ADD_NODE worker-1 4 8192\nSUBMIT task-1 2 2048\nSCHEDULE\nSTATUS task-1",
          expected: "OK\nQUEUED\nSCHEDULED task-1 -> worker-1\nRUNNING worker-1",
        },
        {
          name: "Case 2: Insufficient Capacity Waits",
          input: "ADD_NODE worker-1 2 4096\nSUBMIT task-1 4 2048\nSCHEDULE\nSTATUS task-1",
          expected: "OK\nQUEUED\nWAITING\nPENDING",
        },
        {
          name: "Case 3: Multiple Nodes First-Fit",
          input: "ADD_NODE n1 2 2048\nADD_NODE n2 8 16384\nSUBMIT t1 4 4096\nSCHEDULE",
          expected: "OK\nOK\nQUEUED\nSCHEDULED t1 -> n2",
        },
        {
          name: "Case 4: Fill Node to Capacity",
          input: "ADD_NODE n1 4 4096\nSUBMIT t1 2 2048\nSUBMIT t2 2 2048\nSUBMIT t3 1 1024\nSCHEDULE\nSCHEDULE\nSCHEDULE",
          expected: "OK\nQUEUED\nQUEUED\nQUEUED\nSCHEDULED t1 -> n1\nSCHEDULED t2 -> n1\nWAITING",
        },
        {
          name: "Case 5: Status of Nonexistent Task",
          input: "STATUS ghost",
          expected: "NOT_FOUND",
        },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Priority-Based Queue",
      title: "Task Priority Ordering & Starvation Prevention",
      difficulty: "Medium",
      tagline: "Incorporate task priority (1-100). Higher-priority tasks must schedule before lower-priority tasks.",
      whatAreYouBuilding: `You are going to build a priority-based queue. Think of the gate agent again, but now VIP passengers get to board the bus before economy passengers, regardless of when they arrived at the gate.

For example:
SUBMIT_P low 10 2 2048
SUBMIT_P high 90 2 2048
SCHEDULE

Your scheduler completely ignores the arrival order and processes the high-priority task first:
SCHEDULED high -> n1`,
      howItWorks: `When you run the scheduler:
1. Look at all the tasks waiting in the pending queue.
2. Sort or organize them so that the task with the highest priority number is always evaluated first.
3. If multiple tasks share the exact same high priority, tie-break them by selecting the one that arrived first (FIFO).
4. Attempt to schedule this highest-priority task on a node.
5. If the highest-priority task is too big to fit anywhere, leave it in the queue and wait (do not skip it to schedule smaller tasks).`,
      technicalTerms: [
        {
          "term": "Priority Queue",
          "definition": "A data structure where each element has a priority, and higher priority elements are served before lower priority ones."
        },
        {
          "term": "Priority Inversion",
          "definition": "A failure mode where a low-priority task hogs resources, preventing a high-priority task from executing."
        },
        {
          "term": "Preemption / Head-of-Line",
          "definition": "Ensuring the most critical task is at the absolute front of the line, blocking others until it gets what it needs."
        }
],
      description: `A strict FIFO queue is disastrous in production. If an engineer submits 1,000 background data-processing jobs, they will clog the entire cluster. When a critical, customer-facing web server crashes and needs to restart, it will be stuck at the back of the queue behind the 1,000 background jobs.

Priority queueing ensures that mission-critical tasks jump to the front of the line. By forcing the scheduler to evaluate by priority rather than arrival time, you guarantee that your most important workloads receive resources first.`,
      implementationGuide: [
        "Update your pending task queue to store {id, priority, cpu, ram, arrival_index}.",
        "On 'SUBMIT_P <id> <priority> <cpu> <ram>', push the task to the queue and print 'QUEUED'.",
        "When 'SCHEDULE' is called, sort the pending queue. Sort primarily by priority (descending). On a tie, sort by arrival_index (ascending).",
        "Take the single highest-priority task at the front of the sorted queue.",
        "Attempt to place it using the First-Fit node logic from Level 1.",
        "If it fits, schedule it. If it doesn't fit, print 'WAITING' (do not try to schedule the second item in the queue)."
],
      diagram: `TASK SUBMISSION (PRIORITY QUEUE)          READY QUEUE (ORDERED HEAP)             SCHEDULER
SUBMIT_P low  10 2 2048  ──► ┌──────────────────────────────────────────┐ ──► SCHEDULE
SUBMIT_P high 90 2 2048  ──► │ P90: [high] (cpu=2, ram=2048)  ▲ HIGHEST │       │
SUBMIT_P med  50 2 2048  ──► │ P50: [med]  (cpu=2, ram=2048)  │         │       ▼
                             │ P10: [low]  (cpu=2, ram=2048)  ▼ LOWEST  │   SCHEDULED high -> n1
                             └──────────────────────────────────────────┘   (FIFO within same P)`,
      learningLoop: {
        bottleneck: "FIFO causes priority inversion: a batch of low-priority reporting jobs blocks critical customer-facing API workers.",
        whatYouUnderstand: [
          "Priority queue dispatch: Higher priority number dispatches first.",
          "Tie-breaking by submission order (FIFO among same priority).",
          "Skipping non-fitting high priority tasks or blocking until resources open.",
        ],
        productionParity: "Kubernetes PodPriority and pre-scheduling queue sorting.",
        outcomeSummary: "You implement priority-ordered queueing with deterministic tie-breaking.",
      },
      operations: [
        { cmd: "SUBMIT_P <task_id> <priority> <cpu> <ram>", desc: "Submits task with priority (higher int = higher priority). Returns 'QUEUED'." },
        { cmd: "SCHEDULE", desc: "Schedules highest priority pending task that fits. Returns 'SCHEDULED <task_id> -> <node_id>' or 'WAITING'." },
      ],
      examples: [
        {
          title: "High Priority Dispatched First",
          input: "ADD_NODE n1 4 8192\nSUBMIT_P low 10 2 2048\nSUBMIT_P high 90 2 2048\nSCHEDULE",
          output: "OK\nQUEUED\nQUEUED\nSCHEDULED high -> n1",
        },
      ],
      constraints: ["Priority is integer between 1 and 1000", "Higher value means higher priority"],
      cases: [
        {
          name: "Case 1: High Priority First",
          input: "ADD_NODE n1 4 8192\nSUBMIT_P low 10 2 2048\nSUBMIT_P high 90 2 2048\nSCHEDULE\nSCHEDULE",
          expected: "OK\nQUEUED\nQUEUED\nSCHEDULED high -> n1\nSCHEDULED low -> n1",
        },
        {
          name: "Case 2: Same Priority Preserves FIFO",
          input: "ADD_NODE n1 8 8192\nSUBMIT_P a 50 2 1024\nSUBMIT_P b 50 2 1024\nSCHEDULE\nSCHEDULE",
          expected: "OK\nQUEUED\nQUEUED\nSCHEDULED a -> n1\nSCHEDULED b -> n1",
        },
        {
          name: "Case 3: Three Priority Levels",
          input: "ADD_NODE n1 8 8192\nSUBMIT_P p1 10 1 1024\nSUBMIT_P p3 99 1 1024\nSUBMIT_P p2 50 1 1024\nSCHEDULE\nSCHEDULE\nSCHEDULE",
          expected: "OK\nQUEUED\nQUEUED\nQUEUED\nSCHEDULED p3 -> n1\nSCHEDULED p2 -> n1\nSCHEDULED p1 -> n1",
        },
        {
          name: "Case 4: High Priority Waits if Too Big",
          input: "ADD_NODE n1 2 2048\nSUBMIT_P big 100 4 8192\nSUBMIT_P small 10 1 1024\nSCHEDULE",
          expected: "OK\nQUEUED\nQUEUED\nSCHEDULED small -> n1",
        },
        {
          name: "Case 5: Empty Queue Schedule",
          input: "SCHEDULE",
          expected: "WAITING",
        },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Bin-Packing Heuristic",
      title: "Best-Fit Resource Packing",
      difficulty: "Medium",
      tagline: "Select the node with the least remaining resources that still fits the task (Best-Fit) to minimize fragmentation.",
      whatAreYouBuilding: `You are going to build a Best-Fit bin-packing algorithm. Think of the gate agent trying to pack the shuttle buses as efficiently as possible. Instead of putting a passenger on the first bus they see, they look at all buses and put the passenger on the bus that leaves the least amount of empty, stranded space.

For example:
SCHEDULE_BEST

Your scheduler checks all nodes and calculates a 'leftover' score, picking the tightest fit:
SCHEDULED t1 -> n-small`,
      howItWorks: `When attempting to place a task:
1. Look at every single node in the cluster.
2. Filter out any nodes that don't have enough CPU or RAM to hold the task.
3. For the nodes that CAN hold the task, calculate a 'score' representing how much empty space would be left over if the task was placed there.
4. Select the node with the lowest score (the tightest fit).
5. If there's a tie for the tightest fit, pick the node whose ID comes first alphabetically.`,
      technicalTerms: [
        {
          "term": "Bin-Packing",
          "definition": "An optimization problem focused on packing items of various sizes into a finite number of containers in the most efficient way."
        },
        {
          "term": "Best-Fit Heuristic",
          "definition": "A strategy that places an item in the container that will leave the least amount of leftover space."
        },
        {
          "term": "Resource Fragmentation",
          "definition": "When a cluster has plenty of total resources, but they are scattered across many machines in small chunks, preventing large tasks from running."
        }
],
      description: `The First-Fit algorithm from Level 1 is fast, but it causes severe 'resource fragmentation'. It tends to spread small tasks thinly across all available servers. Eventually, every server is 50% full. When a massive task arrives requiring 100% of a machine, it cannot be scheduled because no single machine has enough contiguous space, even though the cluster overall is half empty.

The Best-Fit algorithm solves this by tightly packing tasks into servers that are already partially full, intentionally leaving other servers completely empty and available for large, demanding workloads.`,
      implementationGuide: [
        "On 'SCHEDULE_BEST', sort the pending tasks by priority as in Level 2.",
        "For the highest priority task, iterate through all nodes that can fit it (node.free_cpu >= task.cpu AND node.free_ram >= task.ram).",
        "Calculate a leftover score for each eligible node: (node.free_cpu - task.cpu) + ((node.free_ram - task.ram) / 1024).",
        "Find the node with the lowest score. If multiple nodes tie for the lowest score, select the one with the alphabetically smallest node_id.",
        "Deduct the resources from the winning node, mark the task RUNNING, and print 'SCHEDULED <task_id> -> <node_id>'.",
        "If no node can fit the task, print 'WAITING'."
],
      diagram: `INCOMING TASK                               CLUSTER NODES (FIT & SCORE)            PLACEMENT
SUBMIT_P t1 10 2 2048                        ┌──────────────────────────────┐
       │                                     │ [n-large] (16c, 32GB)        │
       ▼                                     │ Leftover: 14c / 30GB  (POOR) │
SCHEDULE_BEST ──────────────────────────────►├──────────────────────────────┤ ──► SCHEDULED t1 -> n-small
Score = (rem_cpu + rem_ram/1024)             │ [n-small] (2c, 2048MB)       │     (Tightest Fit /
Min leftover capacity wins                   │ Leftover: 0c / 0MB   (BEST!) │      Least Stranded)
                                             └──────────────────────────────┘`,
      learningLoop: {
        bottleneck: "First-Fit spreads tasks thinly across all nodes, leaving no node with enough contiguous capacity for a large upcoming task.",
        whatYouUnderstand: [
          "Best-Fit algorithm: Score nodes based on remaining capacity after placing the task.",
          "Score metric: Minimized remaining CPU + RAM normalized ratio.",
          "Tie-breaking nodes deterministically by alphabetical node_id.",
        ],
        productionParity: "Kubernetes NodeResourcesFit MostAllocated strategy.",
        outcomeSummary: "You implement best-fit bin-packing to compact cluster resource utilization.",
      },
      operations: [
        { cmd: "SCHEDULE_BEST", desc: "Schedules highest priority task on node with least leftover capacity. Returns 'SCHEDULED <t> -> <n>' or 'WAITING'." },
      ],
      examples: [
        {
          title: "Best-Fit Selection",
          input: "ADD_NODE n-small 2 2048\nADD_NODE n-large 16 32768\nSUBMIT_P t1 10 2 2048\nSCHEDULE_BEST",
          output: "OK\nOK\nQUEUED\nSCHEDULED t1 -> n-small",
        },
      ],
      constraints: ["Score by leftover CPU remaining + leftover RAM remaining / 1024"],
      cases: [
        {
          name: "Case 1: Picks Tightest Fitting Node",
          input: "ADD_NODE n-large 16 32768\nADD_NODE n-small 2 2048\nSUBMIT_P t1 10 2 2048\nSCHEDULE_BEST",
          expected: "OK\nOK\nQUEUED\nSCHEDULED t1 -> n-small",
        },
        {
          name: "Case 2: Fallback to Large Node When Small Node Full",
          input: "ADD_NODE n1 2 2048\nADD_NODE n2 8 8192\nSUBMIT_P t1 10 2 2048\nSUBMIT_P t2 10 2 2048\nSCHEDULE_BEST\nSCHEDULE_BEST",
          expected: "OK\nOK\nQUEUED\nQUEUED\nSCHEDULED t1 -> n1\nSCHEDULED t2 -> n2",
        },
        {
          name: "Case 3: Node Tie Break Alphabetically",
          input: "ADD_NODE node-b 4 4096\nADD_NODE node-a 4 4096\nSUBMIT_P t1 10 2 2048\nSCHEDULE_BEST",
          expected: "OK\nOK\nQUEUED\nSCHEDULED t1 -> node-a",
        },
        {
          name: "Case 4: Multiple Tasks Packing",
          input: "ADD_NODE n1 4 4096\nADD_NODE n2 8 8192\nSUBMIT_P t1 10 2 2048\nSUBMIT_P t2 10 2 2048\nSCHEDULE_BEST\nSCHEDULE_BEST",
          expected: "OK\nOK\nQUEUED\nQUEUED\nSCHEDULED t1 -> n1\nSCHEDULED t2 -> n1",
        },
        {
          name: "Case 5: Cannot Fit Anywhere",
          input: "ADD_NODE n1 2 2048\nSUBMIT_P t1 10 4 4096\nSCHEDULE_BEST",
          expected: "OK\nQUEUED\nWAITING",
        },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Task Completion & Freeing",
      title: "Task Lifecycle & Dynamic Deallocation",
      difficulty: "Medium",
      tagline: "Support task completion, freeing assigned CPU and RAM, and allowing waiting tasks to schedule immediately.",
      whatAreYouBuilding: `You are going to build a dynamic lifecycle and resource deallocator. Think of passengers finally arriving at the airplane and getting off the shuttle bus. The gate agent immediately marks those seats as available again so waiting passengers can board.

For example:
COMPLETE t1

Your scheduler marks the task as finished, adds its CPU and RAM back to the worker node, and prints:
COMPLETED t1`,
      howItWorks: `When a task finishes:
1. Look up which node the task was running on.
2. Add the task's CPU and RAM requirements back into the node's pool of available free resources.
3. Change the task's internal status from RUNNING to COMPLETED.
4. Now that resources have been freed up, the next time SCHEDULE is called, a previously stuck task might finally be able to run.
5. Calculate cluster-wide statistics by summing up the free resources across all nodes.`,
      technicalTerms: [
        {
          "term": "Task Lifecycle",
          "definition": "The state machine a workload moves through: PENDING (queued) -> RUNNING (assigned) -> COMPLETED (finished)."
        },
        {
          "term": "Resource Deallocation",
          "definition": "The critical process of reclaiming hardware capacity from a finished process so it can be reused."
        },
        {
          "term": "Cluster Telemetry",
          "definition": "Aggregated metrics showing the total health and available capacity of the entire distributed system."
        }
],
      description: `A scheduler is not a one-time script; it is a continuous, dynamic system. Tasks are constantly being submitted, running for a period of time, and then finishing. 

If you do not correctly deallocate resources when a task completes, your cluster will suffer from a permanent 'resource leak'. The system will think the nodes are completely full when they are actually sitting idle. Implementing the COMPLETED state transition ensures that hardware capacity is correctly recycled back into the scheduling pool.`,
      implementationGuide: [
        "Maintain a dictionary tracking the state and assigned node for every task in the system.",
        "On 'COMPLETE <task_id>', verify the task exists and is currently in the RUNNING state. If not, print 'NOT_FOUND'.",
        "Find the node the task was assigned to. Add the task's cpu to node.free_cpu and its ram to node.free_ram.",
        "Update the task's state to COMPLETED. Print 'COMPLETED <task_id>'.",
        "On 'CLUSTER_STATS', count the total registered nodes and the number of tasks currently in the RUNNING state.",
        "Sum up free_cpu and free_ram across all nodes. Print 'NODES <n> RUNNING <r> CPU_FREE <c> RAM_FREE <m>'."
],
      diagram: `TASK LIFECYCLE                               NODE CAPACITY STATE                   QUEUED JOBS
COMPLETE t1 (cpu=4, ram=4096)                 ┌─────────────────────────────┐
       │                                      │ [worker-1] Total: 4c / 4GB  │
       ▼                                      │ ┌─────────────────────────┐ │
[RUNNING] ──► [COMPLETED]                     │ │ t1 allocated (4c, 4GB)  │ │ ──► Freed: 4c / 4GB
       │                                      │ └─────────────────────────┘ │
       └─────────────────────────────────────►│ Available: 4c / 4096MB      │ ──► Unblocks [t2]
                                              └─────────────────────────────┘     SCHEDULED t2 -> worker-1`,
      learningLoop: {
        bottleneck: "Schedulers are dynamic: workloads finish and return resources. Resource leaks during deallocation permanently paralyze nodes.",
        whatYouUnderstand: [
          "Transitions: PENDING -> RUNNING -> COMPLETED.",
          "Atomic subtraction of allocated resources upon task completion.",
          "Cluster utilization statistics reporting.",
        ],
        productionParity: "Pod termination lifecycle and Kubelet status updates.",
        outcomeSummary: "You implement atomic deallocation and cluster utilization telemetry.",
      },
      operations: [
        { cmd: "COMPLETE <task_id>", desc: "Marks running task finished, frees node resources. Returns 'COMPLETED <task_id>' or 'NOT_FOUND'." },
        { cmd: "CLUSTER_STATS", desc: "Returns 'NODES <count> RUNNING <count> CPU_FREE <cores> RAM_FREE <mb>'." },
      ],
      examples: [
        {
          title: "Complete Task Frees Node",
          input: "ADD_NODE n1 4 4096\nSUBMIT_P t1 10 4 4096\nSCHEDULE_BEST\nSUBMIT_P t2 10 2 2048\nSCHEDULE_BEST\nCOMPLETE t1\nSCHEDULE_BEST",
          output: "OK\nQUEUED\nSCHEDULED t1 -> n1\nQUEUED\nWAITING\nCOMPLETED t1\nSCHEDULED t2 -> n1",
        },
      ],
      constraints: ["Completing non-running task returns 'NOT_FOUND'"],
      cases: [
        {
          name: "Case 1: Complete and Reuse",
          input: "ADD_NODE n1 4 4096\nSUBMIT_P t1 10 4 4096\nSCHEDULE_BEST\nCOMPLETE t1\nSTATUS t1",
          expected: "OK\nQUEUED\nSCHEDULED t1 -> n1\nCOMPLETED t1\nCOMPLETED",
        },
        {
          name: "Case 2: Complete Frees Blocked Queue",
          input: "ADD_NODE n1 2 2048\nSUBMIT_P t1 10 2 2048\nSUBMIT_P t2 10 2 2048\nSCHEDULE_BEST\nSCHEDULE_BEST\nCOMPLETE t1\nSCHEDULE_BEST",
          expected: "OK\nQUEUED\nQUEUED\nSCHEDULED t1 -> n1\nWAITING\nCOMPLETED t1\nSCHEDULED t2 -> n1",
        },
        {
          name: "Case 3: Cluster Stats Accurate",
          input: "ADD_NODE n1 4 4096\nADD_NODE n2 4 4096\nSUBMIT_P t1 10 2 1024\nSCHEDULE_BEST\nCLUSTER_STATS",
          expected: "OK\nOK\nQUEUED\nSCHEDULED t1 -> n1\nNODES 2 RUNNING 1 CPU_FREE 6 RAM_FREE 7168",
        },
        {
          name: "Case 4: Complete Unknown Task",
          input: "COMPLETE unknown-task",
          expected: "NOT_FOUND",
        },
        {
          name: "Case 5: Double Complete Fails",
          input: "ADD_NODE n1 4 4096\nSUBMIT_P t1 10 2 1024\nSCHEDULE_BEST\nCOMPLETE t1\nCOMPLETE t1",
          expected: "OK\nQUEUED\nSCHEDULED t1 -> n1\nCOMPLETED t1\nNOT_FOUND",
        },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Node Failure & Eviction",
      title: "Node Heartbeat Failure & Pod Eviction",
      difficulty: "Hard",
      tagline: "Handle node crashes. Tasks running on dead nodes must be evicted and returned to PENDING state with original priority.",
      whatAreYouBuilding: `You are going to build a fault-tolerance eviction system. Think of a shuttle bus breaking down on the runway. The gate agent marks the bus as out of service, safely pulls all the passengers off it, and puts them back at the front of the VIP line for the next available bus.

For example:
KILL_NODE n1

Your scheduler marks node n1 as dead, evicts all its running tasks back to the queue, and prints:
DEAD n1 EVICTED 1`,
      howItWorks: `When a node crashes:
1. Find the node in the registry and mark it as DEAD so it cannot receive any future tasks.
2. Identify every single task that was currently RUNNING on that specific node.
3. Change the status of those tasks from RUNNING back to PENDING.
4. Put those tasks back into the main priority queue, retaining their original high priority.
5. The next time SCHEDULE is called, the system will automatically re-assign them to healthy nodes.`,
      technicalTerms: [
        {
          "term": "Fault Tolerance",
          "definition": "The ability of a system to continue operating properly in the event of the failure of some of its components."
        },
        {
          "term": "Pod Eviction",
          "definition": "Forcefully terminating workloads running on an unhealthy machine so they can be moved elsewhere."
        },
        {
          "term": "Rescheduling",
          "definition": "Taking a task that was interrupted by a hardware failure and placing it back into the queue for a new assignment."
        }
],
      description: `In large-scale cloud environments, hardware failure is not an anomaly; it is a statistical certainty. Power supplies fail, network cables get unplugged, and kernel panics freeze servers. 

When a worker node goes dark, the scheduler must act immediately. It must identify the 'blast radius' (which tasks were running on the dead machine) and automate their recovery. By evicting the orphaned tasks back into the priority queue, the scheduler guarantees that critical workloads self-heal and migrate to healthy hardware without human intervention.`,
      implementationGuide: [
        "On 'KILL_NODE <node_id>', find the node. If it doesn't exist, print 'NOT_FOUND'.",
        "Mark the node as DEAD (or remove it from your active eligible nodes list).",
        "Loop through all tasks in the system. Find any task that is currently RUNNING on this specific node_id.",
        "For each affected task, change its state back to PENDING and push it back into your main priority queue.",
        "Count how many tasks were evicted. Print 'DEAD <node_id> EVICTED <count>'.",
        "Ensure that 'SCHEDULE_BEST' completely ignores DEAD nodes when searching for available capacity."
],
      diagram: `CRASH DETECTOR                               DEAD NODE WORKLOADS                   RE-SCHEDULING
KILL_NODE n1 (Node Failure)                  ┌─────────────────────────────┐
       │                                     │ [n1 (DEAD)]                 │
       ▼                                     │  • t1 (P90) ──► EVICTED     │ ──► Re-enqueue PENDING
DEAD n1 EVICTED 2                            │  • t2 (P10) ──► EVICTED     │     (Preserves Priority)
                                             └─────────────────────────────┘            │
                                             ┌─────────────────────────────┐            ▼
                                             │ [n2 (HEALTHY)] 4c / 4096MB  │ ◄── SCHEDULE_BEST
                                             │  • t1 (P90) -> SCHEDULED    │     (t1 takes precedence)
                                             └─────────────────────────────┘`,
      learningLoop: {
        bottleneck: "Hardware fails constantly in large clusters. If a node loses connection, its tasks must be automatically rescheduled elsewhere.",
        whatYouUnderstand: [
          "Removing node from active cluster topology.",
          "Iterating running tasks assigned to the dead node and resetting their status to PENDING.",
          "Re-inserting evicted tasks into the priority scheduling queue.",
        ],
        productionParity: "Kubernetes node eviction controller and Pod rescheduling.",
        outcomeSummary: "You master fault-tolerant failure recovery and automated rescheduling.",
      },
      operations: [
        { cmd: "KILL_NODE <node_id>", desc: "Simulates node crash. Evicts running tasks back to PENDING queue. Returns 'DEAD <node_id> EVICTED <count>' or 'NOT_FOUND'." },
      ],
      examples: [
        {
          title: "Kill Node Evicts Tasks",
          input: "ADD_NODE n1 4 4096\nADD_NODE n2 4 4096\nSUBMIT_P t1 10 2 2048\nSCHEDULE_BEST\nKILL_NODE n1\nSTATUS t1\nSCHEDULE_BEST\nSTATUS t1",
          output: "OK\nOK\nQUEUED\nSCHEDULED t1 -> n1\nDEAD n1 EVICTED 1\nPENDING\nSCHEDULED t1 -> n2\nRUNNING n2",
        },
      ],
      constraints: ["Dead nodes cannot receive future tasks"],
      cases: [
        {
          name: "Case 1: Kill Node Reschedules to Healthy Node",
          input: "ADD_NODE n1 4 4096\nADD_NODE n2 4 4096\nSUBMIT_P t1 10 2 2048\nSCHEDULE_BEST\nKILL_NODE n1\nSTATUS t1\nSCHEDULE_BEST\nSTATUS t1",
          expected: "OK\nOK\nQUEUED\nSCHEDULED t1 -> n1\nDEAD n1 EVICTED 1\nPENDING\nSCHEDULED t1 -> n2\nRUNNING n2",
        },
        {
          name: "Case 2: Kill Node With Multiple Tasks",
          input: "ADD_NODE n1 8 8192\nSUBMIT_P t1 10 2 2048\nSUBMIT_P t2 20 2 2048\nSCHEDULE_BEST\nSCHEDULE_BEST\nKILL_NODE n1",
          expected: "OK\nQUEUED\nQUEUED\nSCHEDULED t2 -> n1\nSCHEDULED t1 -> n1\nDEAD n1 EVICTED 2",
        },
        {
          name: "Case 3: Kill Empty Node",
          input: "ADD_NODE n1 4 4096\nKILL_NODE n1",
          expected: "OK\nDEAD n1 EVICTED 0",
        },
        {
          name: "Case 4: Kill Unknown Node",
          input: "KILL_NODE ghost-node",
          expected: "NOT_FOUND",
        },
        {
          name: "Case 5: Evicted Task Preserves Priority",
          input: "ADD_NODE n1 4 4096\nADD_NODE n2 4 4096\nSUBMIT_P high 90 2 2048\nSUBMIT_P low 10 2 2048\nSCHEDULE_BEST\nKILL_NODE n1\nSCHEDULE_BEST",
          expected: "OK\nOK\nQUEUED\nQUEUED\nSCHEDULED high -> n1\nDEAD n1 EVICTED 1\nSCHEDULED high -> n2",
        },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Dominant Resource Fairness",
      title: "Multi-Tenant Dominant Resource Fairness (DRF)",
      difficulty: "Hard",
      tagline: "Implement DRF across multiple tenants. Allocate to the tenant with the lowest dominant share.",
      whatAreYouBuilding: `You are going to build a Dominant Resource Fairness (DRF) allocator. Think of two groups of passengers: Group A needs lots of seats but no luggage space, Group B needs lots of luggage space but few seats. DRF perfectly balances fairness by looking at the resource they are 'dominating' the most.

For example:
SCHEDULE_DRF
USER_SHARE alice

Your scheduler picks the user who has received the lowest fair share of the cluster, and prints:
DRF_SCHEDULED alice a1 -> n1
SHARE alice 20.0%`,
      howItWorks: `When DRF scheduling runs:
1. Calculate the total CPU and RAM existing in the entire cluster.
2. For each user, sum up the CPU and RAM of all their currently RUNNING tasks.
3. Calculate their percentage of the total CPU and total RAM. Their 'dominant share' is the higher of these two percentages.
4. Find the user with the absolute lowest dominant share (the one being most starved of resources).
5. Schedule the next pending task for that specific user.`,
      technicalTerms: [
        {
          "term": "Dominant Resource Fairness (DRF)",
          "definition": "An algorithm that ensures fair multi-tenant sharing in systems where tasks require multiple different types of resources."
        },
        {
          "term": "Dominant Share",
          "definition": "The maximum of a user's percentage allocation across all resource types (e.g., if a user has 50% of CPU but 10% of RAM, their dominant share is 50%)."
        },
        {
          "term": "Max-Min Fairness",
          "definition": "Maximizing the allocation of the user who currently has the minimum (lowest) share of resources."
        }
],
      description: `Simple round-robin fairness doesn't work with multiple resources. If Alice runs tasks requiring heavy CPU and Bob runs tasks requiring heavy RAM, how do you decide who is hogging the cluster? 

The DRF algorithm (invented at UC Berkeley and used in Apache Mesos) solves this. It determines each user's 'dominant resource'—the bottleneck they are stressing the most. By always giving the next task to the user with the lowest dominant share, DRF perfectly mathematically balances the cluster, ensuring neither CPU-heavy nor RAM-heavy workloads can starve each other.`,
      implementationGuide: [
        "On 'SUBMIT_USER <user> <task> <cpu> <ram>', store the task in a queue specifically mapped to that user. Print 'QUEUED'.",
        "On 'SCHEDULE_DRF', calculate cluster_cpu (sum of all nodes' total CPU) and cluster_ram (sum of all nodes' total RAM).",
        "For every user with pending tasks, calculate their running_cpu and running_ram (sum of their tasks currently in RUNNING state).",
        "Calculate their dominant share: max(running_cpu / cluster_cpu, running_ram / cluster_ram).",
        "Find the user with the lowest dominant share. Tie-break alphabetically by username.",
        "Take that user's oldest pending task. Assign it using Best-Fit logic. Print 'DRF_SCHEDULED <user> <task_id> -> <node_id>'.",
        "On 'USER_SHARE <user>', recalculate their dominant share, multiply by 100, and print 'SHARE <user> <pct>%' formatted to 1 decimal place."
],
      diagram: `TENANT SUBMISSIONS                           DOMINANT SHARE TRACKER                DRF ARBITRATOR
Alice: SUBMIT_USER alice (2c, 100M)  ──►     ┌──────────────────────────────┐ ──► Min dominant share:
Bob:   SUBMIT_USER bob   (1c, 400M)  ──►     │ Alice: 2c/10c=20%, 100M/1G=10%│     Alice (0.0% -> 20.0%)
Cluster: 10 Cores / 1000 MB                  │ ──► Dominant Share: 20.0%    │            │
                                             ├──────────────────────────────┤            ▼
                                             │ Bob:   1c/10c=10%, 400M/1G=40%│     DRF_SCHEDULED alice
                                             │ ──► Dominant Share: 40.0%    │     Next: Bob (20% < 40%)
                                             └──────────────────────────────┘`,
      learningLoop: {
        bottleneck: "Naive priority allows one user with memory-heavy jobs to starve users with CPU-heavy jobs. DRF calculates dominant resource share for true fair-share scheduling.",
        whatYouUnderstand: [
          "Dominant share = max(allocated_cpu / total_cpu, allocated_ram / total_ram).",
          "Selecting tenant with minimum dominant share for next allocation.",
          "Multi-tenant fairness in shared computing clusters.",
        ],
        productionParity: "Dominant Resource Fairness (DRF) in Apache Mesos and Google Borg.",
        outcomeSummary: "You implement the premier distributed systems multi-resource fairness algorithm.",
      },
      operations: [
        { cmd: "SUBMIT_USER <user> <task_id> <cpu> <ram>", desc: "Submits task under a tenant/user account. Returns 'QUEUED'." },
        { cmd: "SCHEDULE_DRF", desc: "Schedules next task for tenant with lowest dominant share. Returns 'DRF_SCHEDULED <user> <task_id> -> <node_id>' or 'WAITING'." },
        { cmd: "USER_SHARE <user>", desc: "Returns 'SHARE <user> <pct>%' where pct is dominant share percentage rounded to 1 decimal place." },
      ],
      examples: [
        {
          title: "DRF Fair Allocation",
          input: "ADD_NODE n1 10 1000\nSUBMIT_USER alice t1 2 100\nSUBMIT_USER bob t2 1 400\nSCHEDULE_DRF\nSCHEDULE_DRF",
          output: "OK\nQUEUED\nQUEUED\nDRF_SCHEDULED alice t1 -> n1\nDRF_SCHEDULED bob t2 -> n1",
        },
      ],
      constraints: ["Dominant share is max(allocated_cpu / total_cluster_cpu, allocated_ram / total_cluster_ram)"],
      cases: [
        {
          name: "Case 1: Fair Interleaving",
          input: "ADD_NODE n1 10 1000\nSUBMIT_USER alice a1 1 100\nSUBMIT_USER bob b1 1 100\nSCHEDULE_DRF\nSCHEDULE_DRF",
          expected: "OK\nQUEUED\nQUEUED\nDRF_SCHEDULED alice a1 -> n1\nDRF_SCHEDULED bob b1 -> n1",
        },
        {
          name: "Case 2: Share Percentage Query",
          input: "ADD_NODE n1 10 1000\nSUBMIT_USER alice a1 2 100\nSCHEDULE_DRF\nUSER_SHARE alice",
          expected: "OK\nQUEUED\nDRF_SCHEDULED alice a1 -> n1\nSHARE alice 20.0%",
        },
        {
          name: "Case 3: Lower Share Preferred",
          input: "ADD_NODE n1 10 1000\nSUBMIT_USER alice a1 5 100\nSUBMIT_USER alice a2 1 50\nSUBMIT_USER bob b1 1 100\nSCHEDULE_DRF\nSCHEDULE_DRF",
          expected: "OK\nQUEUED\nQUEUED\nQUEUED\nDRF_SCHEDULED alice a1 -> n1\nDRF_SCHEDULED bob b1 -> n1",
        },
        {
          name: "Case 4: User With No Allocations Has 0%",
          input: "ADD_NODE n1 10 1000\nUSER_SHARE charlie",
          expected: "OK\nSHARE charlie 0.0%",
        },
        {
          name: "Case 5: DRF Full Cluster Exhaustion",
          input: "ADD_NODE n1 2 200\nSUBMIT_USER u1 t1 2 200\nSUBMIT_USER u2 t2 1 100\nSCHEDULE_DRF\nSCHEDULE_DRF",
          expected: "OK\nQUEUED\nQUEUED\nDRF_SCHEDULED u1 t1 -> n1\nWAITING",
        },
      ],
    },
  },
  starterTemplates: {
    python: `"""
Task Scheduler - Challenge 07 Starter (Python 3.12)
Implements cluster node registry, multi-resource FIFO & priority scheduling,
best-fit bin packing, task lifecycle completion, and fault tolerance.
"""
import sys

class TaskScheduler:
    def __init__(self):
        self.nodes = {}  # node_id -> {"total_cpu": int, "total_ram": int, "used_cpu": int, "used_ram": int, "dead": False}
        self.node_order = []
        self.tasks = {}  # task_id -> {"status": str, "node": str, "cpu": int, "ram": int, "priority": int, "user": str, "sub_id": int}
        self.queue = []  # list of task_id
        self.sub_counter = 0

    def add_node(self, node_id: str, cpu: int, ram: int) -> str:
        self.nodes[node_id] = {
            "total_cpu": cpu,
            "total_ram": ram,
            "used_cpu": 0,
            "used_ram": 0,
            "dead": False,
        }
        if node_id not in self.node_order:
            self.node_order.append(node_id)
        return "OK"

    def submit(self, task_id: str, cpu: int, ram: int, priority: int = 1, user: str = "default") -> str:
        self.sub_counter += 1
        self.tasks[task_id] = {
            "status": "PENDING",
            "node": None,
            "cpu": cpu,
            "ram": ram,
            "priority": priority,
            "user": user,
            "sub_id": self.sub_counter,
        }
        self.queue.append(task_id)
        return "QUEUED"

    def status(self, task_id: str) -> str:
        if task_id not in self.tasks:
            return "NOT_FOUND"
        t = self.tasks[task_id]
        if t["status"] == "RUNNING":
            return f"RUNNING {t['node']}"
        return t["status"]

    def _get_sorted_queue(self):
        # Higher priority first, then earlier sub_id
        pending = [tid for tid in self.queue if self.tasks[tid]["status"] == "PENDING"]
        pending.sort(key=lambda tid: (-self.tasks[tid]["priority"], self.tasks[tid]["sub_id"]))
        return pending

    def schedule_fifo(self) -> str:
        pending = self._get_sorted_queue()
        for tid in pending:
            t = self.tasks[tid]
            for nid in self.node_order:
                n = self.nodes[nid]
                if n["dead"]:
                    continue
                if (n["total_cpu"] - n["used_cpu"] >= t["cpu"]) and (n["total_ram"] - n["used_ram"] >= t["ram"]):
                    n["used_cpu"] += t["cpu"]
                    n["used_ram"] += t["ram"]
                    t["status"] = "RUNNING"
                    t["node"] = nid
                    self.queue.remove(tid)
                    return f"SCHEDULED {tid} -> {nid}"
        return "WAITING"

    def schedule_best(self) -> str:
        pending = self._get_sorted_queue()
        for tid in pending:
            t = self.tasks[tid]
            best_nid = None
            best_leftover = None

            active_nodes = sorted([nid for nid in self.node_order if not self.nodes[nid]["dead"]])
            for nid in active_nodes:
                n = self.nodes[nid]
                free_cpu = n["total_cpu"] - n["used_cpu"]
                free_ram = n["total_ram"] - n["used_ram"]
                if free_cpu >= t["cpu"] and free_ram >= t["ram"]:
                    leftover = (free_cpu - t["cpu"]) + (free_ram - t["ram"]) / 1024.0
                    if best_leftover is None or leftover < best_leftover:
                        best_leftover = leftover
                        best_nid = nid

            if best_nid is not None:
                n = self.nodes[best_nid]
                n["used_cpu"] += t["cpu"]
                n["used_ram"] += t["ram"]
                t["status"] = "RUNNING"
                t["node"] = best_nid
                self.queue.remove(tid)
                return f"SCHEDULED {tid} -> {best_nid}"
        return "WAITING"

    def complete(self, task_id: str) -> str:
        if task_id not in self.tasks:
            return "NOT_FOUND"
        t = self.tasks[task_id]
        if t["status"] != "RUNNING":
            return "NOT_FOUND"
        nid = t["node"]
        n = self.nodes[nid]
        n["used_cpu"] -= t["cpu"]
        n["used_ram"] -= t["ram"]
        t["status"] = "COMPLETED"
        t["node"] = None
        return f"COMPLETED {task_id}"

    def cluster_stats(self) -> str:
        active_nodes = [n for n in self.nodes.values() if not n["dead"]]
        count = len(active_nodes)
        running_tasks = sum(1 for t in self.tasks.values() if t["status"] == "RUNNING")
        cpu_free = sum(n["total_cpu"] - n["used_cpu"] for n in active_nodes)
        ram_free = sum(n["total_ram"] - n["used_ram"] for n in active_nodes)
        return f"NODES {count} RUNNING {running_tasks} CPU_FREE {cpu_free} RAM_FREE {ram_free}"

    def kill_node(self, node_id: str) -> str:
        if node_id not in self.nodes or self.nodes[node_id]["dead"]:
            return "NOT_FOUND"
        n = self.nodes[node_id]
        n["dead"] = True
        evicted = 0
        for tid, t in self.tasks.items():
            if t["status"] == "RUNNING" and t["node"] == node_id:
                t["status"] = "PENDING"
                t["node"] = None
                evicted += 1
                if tid not in self.queue:
                    self.queue.append(tid)
        n["used_cpu"] = 0
        n["used_ram"] = 0
        return f"DEAD {node_id} EVICTED {evicted}"

    def _total_cluster_resources(self):
        active = [n for n in self.nodes.values() if not n["dead"]]
        t_cpu = sum(n["total_cpu"] for n in active) or 1
        t_ram = sum(n["total_ram"] for n in active) or 1
        return t_cpu, t_ram

    def user_share(self, user: str) -> str:
        t_cpu, t_ram = self._total_cluster_resources()
        u_cpu = sum(t["cpu"] for t in self.tasks.values() if t["user"] == user and t["status"] == "RUNNING")
        u_ram = sum(t["ram"] for t in self.tasks.values() if t["user"] == user and t["status"] == "RUNNING")
        share = max(u_cpu / t_cpu, u_ram / t_ram) * 100.0
        return f"SHARE {user} {share:.1f}%"

    def schedule_drf(self) -> str:
        pending = [tid for tid in self.queue if self.tasks[tid]["status"] == "PENDING"]
        if not pending:
            return "WAITING"

        t_cpu, t_ram = self._total_cluster_resources()
        # Find user shares
        users = set(self.tasks[tid]["user"] for tid in pending)
        user_shares = {}
        for u in users:
            u_cpu = sum(t["cpu"] for t in self.tasks.values() if t["user"] == u and t["status"] == "RUNNING")
            u_ram = sum(t["ram"] for t in self.tasks.values() if t["user"] == u and t["status"] == "RUNNING")
            user_shares[u] = max(u_cpu / t_cpu, u_ram / t_ram)

        sorted_users = sorted(users, key=lambda u: (user_shares[u], u))
        for u in sorted_users:
            u_pending = [tid for tid in pending if self.tasks[tid]["user"] == u]
            for tid in u_pending:
                t = self.tasks[tid]
                # Best fit node
                best_nid = None
                best_leftover = None
                active_nodes = sorted([nid for nid in self.node_order if not self.nodes[nid]["dead"]])
                for nid in active_nodes:
                    n = self.nodes[nid]
                    free_cpu = n["total_cpu"] - n["used_cpu"]
                    free_ram = n["total_ram"] - n["used_ram"]
                    if free_cpu >= t["cpu"] and free_ram >= t["ram"]:
                        leftover = (free_cpu - t["cpu"]) + (free_ram - t["ram"]) / 1024.0
                        if best_leftover is None or leftover < best_leftover:
                            best_leftover = leftover
                            best_nid = nid
                if best_nid is not None:
                    n = self.nodes[best_nid]
                    n["used_cpu"] += t["cpu"]
                    n["used_ram"] += t["ram"]
                    t["status"] = "RUNNING"
                    t["node"] = best_nid
                    self.queue.remove(tid)
                    return f"DRF_SCHEDULED {u} {tid} -> {best_nid}"
        return "WAITING"

def main():
    scheduler = TaskScheduler()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        cmd = parts[0].upper()

        if cmd == "ADD_NODE":
            print(scheduler.add_node(parts[1], int(parts[2]), int(parts[3])))
        elif cmd == "SUBMIT":
            print(scheduler.submit(parts[1], int(parts[2]), int(parts[3])))
        elif cmd == "SUBMIT_P":
            print(scheduler.submit(parts[1], int(parts[3]), int(parts[4]), priority=int(parts[2])))
        elif cmd == "SUBMIT_USER":
            print(scheduler.submit(parts[2], int(parts[3]), int(parts[4]), user=parts[1]))
        elif cmd == "SCHEDULE":
            print(scheduler.schedule_fifo())
        elif cmd == "SCHEDULE_BEST":
            print(scheduler.schedule_best())
        elif cmd == "SCHEDULE_DRF":
            print(scheduler.schedule_drf())
        elif cmd == "STATUS":
            print(scheduler.status(parts[1]))
        elif cmd == "COMPLETE":
            print(scheduler.complete(parts[1]))
        elif cmd == "CLUSTER_STATS":
            print(scheduler.cluster_stats())
        elif cmd == "KILL_NODE":
            print(scheduler.kill_node(parts[1]))
        elif cmd == "USER_SHARE":
            print(scheduler.user_share(parts[1]))
        else:
            print("UNKNOWN_COMMAND")

if __name__ == "__main__":
    main()
`,
    cpp: `// Task Scheduler - Challenge 07 Starter (C++ 20)
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <sstream>
#include <iomanip>

struct Node {
    std::string id;
    int total_cpu;
    int total_ram;
    int used_cpu = 0;
    int used_ram = 0;
    bool dead = false;
};

struct Task {
    std::string id;
    std::string status = "PENDING";
    std::string node = "";
    int cpu = 0;
    int ram = 0;
    int priority = 1;
    std::string user = "default";
    int sub_id = 0;
};

class TaskScheduler {
    std::unordered_map<std::string, Node> nodes;
    std::vector<std::string> node_order;
    std::unordered_map<std::string, Task> tasks;
    std::vector<std::string> queue;
    int sub_counter = 0;

public:
    std::string add_node(const std::string& id, int cpu, int ram) {
        nodes[id] = Node{id, cpu, ram, 0, 0, false};
        if (std::find(node_order.begin(), node_order.end(), id) == node_order.end()) {
            node_order.push_back(id);
        }
        return "OK";
    }

    std::string submit(const std::string& id, int cpu, int ram, int priority = 1, const std::string& user = "default") {
        sub_counter++;
        tasks[id] = Task{id, "PENDING", "", cpu, ram, priority, user, sub_counter};
        queue.push_back(id);
        return "QUEUED";
    }

    std::string status(const std::string& id) {
        if (tasks.find(id) == tasks.end()) return "NOT_FOUND";
        const auto& t = tasks[id];
        if (t.status == "RUNNING") return "RUNNING " + t.node;
        return t.status;
    }

    std::vector<std::string> get_sorted_queue() {
        std::vector<std::string> pending;
        for (const auto& tid : queue) {
            if (tasks[tid].status == "PENDING") pending.push_back(tid);
        }
        std::sort(pending.begin(), pending.end(), [this](const std::string& a, const std::string& b) {
            if (tasks[a].priority != tasks[b].priority) return tasks[a].priority > tasks[b].priority;
            return tasks[a].sub_id < tasks[b].sub_id;
        });
        return pending;
    }

    std::string schedule_fifo() {
        auto pending = get_sorted_queue();
        for (const auto& tid : pending) {
            auto& t = tasks[tid];
            for (const auto& nid : node_order) {
                auto& n = nodes[nid];
                if (n.dead) continue;
                if ((n.total_cpu - n.used_cpu >= t.cpu) && (n.total_ram - n.used_ram >= t.ram)) {
                    n.used_cpu += t.cpu;
                    n.used_ram += t.ram;
                    t.status = "RUNNING";
                    t.node = nid;
                    queue.erase(std::remove(queue.begin(), queue.end(), tid), queue.end());
                    return "SCHEDULED " + tid + " -> " + nid;
                }
            }
        }
        return "WAITING";
    }

    std::string schedule_best() {
        auto pending = get_sorted_queue();
        for (const auto& tid : pending) {
            auto& t = tasks[tid];
            std::string best_nid = "";
            double best_leftover = 1e18;

            std::vector<std::string> active_nodes;
            for (const auto& nid : node_order) {
                if (!nodes[nid].dead) active_nodes.push_back(nid);
            }
            std::sort(active_nodes.begin(), active_nodes.end());

            for (const auto& nid : active_nodes) {
                auto& n = nodes[nid];
                int free_cpu = n.total_cpu - n.used_cpu;
                int free_ram = n.total_ram - n.used_ram;
                if (free_cpu >= t.cpu && free_ram >= t.ram) {
                    double leftover = (free_cpu - t.cpu) + (free_ram - t.ram) / 1024.0;
                    if (best_nid.empty() || leftover < best_leftover) {
                        best_leftover = leftover;
                        best_nid = nid;
                    }
                }
            }

            if (!best_nid.empty()) {
                auto& n = nodes[best_nid];
                n.used_cpu += t.cpu;
                n.used_ram += t.ram;
                t.status = "RUNNING";
                t.node = best_nid;
                queue.erase(std::remove(queue.begin(), queue.end(), tid), queue.end());
                return "SCHEDULED " + tid + " -> " + best_nid;
            }
        }
        return "WAITING";
    }

    std::string complete(const std::string& id) {
        if (tasks.find(id) == tasks.end()) return "NOT_FOUND";
        auto& t = tasks[id];
        if (t.status != "RUNNING") return "NOT_FOUND";
        auto& n = nodes[t.node];
        n.used_cpu -= t.cpu;
        n.used_ram -= t.ram;
        t.status = "COMPLETED";
        t.node = "";
        return "COMPLETED " + id;
    }

    std::string cluster_stats() {
        int count = 0, running = 0, free_cpu = 0, free_ram = 0;
        for (const auto& pair : nodes) {
            if (!pair.second.dead) {
                count++;
                free_cpu += (pair.second.total_cpu - pair.second.used_cpu);
                free_ram += (pair.second.total_ram - pair.second.used_ram);
            }
        }
        for (const auto& pair : tasks) {
            if (pair.second.status == "RUNNING") running++;
        }
        return "NODES " + std::to_string(count) + " RUNNING " + std::to_string(running) +
               " CPU_FREE " + std::to_string(free_cpu) + " RAM_FREE " + std::to_string(free_ram);
    }

    std::string kill_node(const std::string& id) {
        if (nodes.find(id) == nodes.end() || nodes[id].dead) return "NOT_FOUND";
        nodes[id].dead = true;
        int evicted = 0;
        for (auto& pair : tasks) {
            if (pair.second.status == "RUNNING" && pair.second.node == id) {
                pair.second.status = "PENDING";
                pair.second.node = "";
                evicted++;
                if (std::find(queue.begin(), queue.end(), pair.first) == queue.end()) {
                    queue.push_back(pair.first);
                }
            }
        }
        nodes[id].used_cpu = 0;
        nodes[id].used_ram = 0;
        return "DEAD " + id + " EVICTED " + std::to_string(evicted);
    }

    std::pair<int, int> get_total_cluster_resources() {
        int t_cpu = 0, t_ram = 0;
        for (const auto& pair : nodes) {
            if (!pair.second.dead) {
                t_cpu += pair.second.total_cpu;
                t_ram += pair.second.total_ram;
            }
        }
        return {std::max(1, t_cpu), std::max(1, t_ram)};
    }

    std::string user_share(const std::string& user) {
        auto [t_cpu, t_ram] = get_total_cluster_resources();
        int u_cpu = 0, u_ram = 0;
        for (const auto& pair : tasks) {
            if (pair.second.user == user && pair.second.status == "RUNNING") {
                u_cpu += pair.second.cpu;
                u_ram += pair.second.ram;
            }
        }
        double share = std::max((double)u_cpu / t_cpu, (double)u_ram / t_ram) * 100.0;
        std::ostringstream ss;
        ss << std::fixed << std::setprecision(1) << share;
        return "SHARE " + user + " " + ss.str() + "%";
    }

    std::string schedule_drf() {
        std::vector<std::string> pending;
        for (const auto& tid : queue) {
            if (tasks[tid].status == "PENDING") pending.push_back(tid);
        }
        if (pending.empty()) return "WAITING";

        auto [t_cpu, t_ram] = get_total_cluster_resources();
        std::vector<std::string> users;
        for (const auto& tid : pending) {
            const auto& u = tasks[tid].user;
            if (std::find(users.begin(), users.end(), u) == users.end()) users.push_back(u);
        }

        std::sort(users.begin(), users.end(), [this, t_cpu, t_ram](const std::string& a, const std::string& b) {
            int a_cpu = 0, a_ram = 0, b_cpu = 0, b_ram = 0;
            for (const auto& pair : tasks) {
                if (pair.second.user == a && pair.second.status == "RUNNING") {
                    a_cpu += pair.second.cpu; a_ram += pair.second.ram;
                }
                if (pair.second.user == b && pair.second.status == "RUNNING") {
                    b_cpu += pair.second.cpu; b_ram += pair.second.ram;
                }
            }
            double a_share = std::max((double)a_cpu / t_cpu, (double)a_ram / t_ram);
            double b_share = std::max((double)b_cpu / t_cpu, (double)b_ram / t_ram);
            if (a_share != b_share) return a_share < b_share;
            return a < b;
        });

        for (const auto& u : users) {
            for (const auto& tid : pending) {
                if (tasks[tid].user != u) continue;
                auto& t = tasks[tid];

                std::string best_nid = "";
                double best_leftover = 1e18;
                std::vector<std::string> active_nodes;
                for (const auto& nid : node_order) {
                    if (!nodes[nid].dead) active_nodes.push_back(nid);
                }
                std::sort(active_nodes.begin(), active_nodes.end());

                for (const auto& nid : active_nodes) {
                    auto& n = nodes[nid];
                    int free_cpu = n.total_cpu - n.used_cpu;
                    int free_ram = n.total_ram - n.used_ram;
                    if (free_cpu >= t.cpu && free_ram >= t.ram) {
                        double leftover = (free_cpu - t.cpu) + (free_ram - t.ram) / 1024.0;
                        if (best_nid.empty() || leftover < best_leftover) {
                            best_leftover = leftover;
                            best_nid = nid;
                        }
                    }
                }

                if (!best_nid.empty()) {
                    auto& n = nodes[best_nid];
                    n.used_cpu += t.cpu;
                    n.used_ram += t.ram;
                    t.status = "RUNNING";
                    t.node = best_nid;
                    queue.erase(std::remove(queue.begin(), queue.end(), tid), queue.end());
                    return "DRF_SCHEDULED " + u + " " + tid + " -> " + best_nid;
                }
            }
        }
        return "WAITING";
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    TaskScheduler scheduler;
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;

        if (cmd == "ADD_NODE") {
            std::string id; int cpu, ram;
            iss >> id >> cpu >> ram;
            std::cout << scheduler.add_node(id, cpu, ram) << "\\n";
        } else if (cmd == "SUBMIT") {
            std::string id; int cpu, ram;
            iss >> id >> cpu >> ram;
            std::cout << scheduler.submit(id, cpu, ram) << "\\n";
        } else if (cmd == "SUBMIT_P") {
            std::string id; int prio, cpu, ram;
            iss >> id >> prio >> cpu >> ram;
            std::cout << scheduler.submit(id, cpu, ram, prio) << "\\n";
        } else if (cmd == "SUBMIT_USER") {
            std::string user, id; int cpu, ram;
            iss >> user >> id >> cpu >> ram;
            std::cout << scheduler.submit(id, cpu, ram, 1, user) << "\\n";
        } else if (cmd == "SCHEDULE") {
            std::cout << scheduler.schedule_fifo() << "\\n";
        } else if (cmd == "SCHEDULE_BEST") {
            std::cout << scheduler.schedule_best() << "\\n";
        } else if (cmd == "SCHEDULE_DRF") {
            std::cout << scheduler.schedule_drf() << "\\n";
        } else if (cmd == "STATUS") {
            std::string id; iss >> id;
            std::cout << scheduler.status(id) << "\\n";
        } else if (cmd == "COMPLETE") {
            std::string id; iss >> id;
            std::cout << scheduler.complete(id) << "\\n";
        } else if (cmd == "CLUSTER_STATS") {
            std::cout << scheduler.cluster_stats() << "\\n";
        } else if (cmd == "KILL_NODE") {
            std::string id; iss >> id;
            std::cout << scheduler.kill_node(id) << "\\n";
        } else if (cmd == "USER_SHARE") {
            std::string user; iss >> user;
            std::cout << scheduler.user_share(user) << "\\n";
        }
    }
    return 0;
}
`,
  },
};
