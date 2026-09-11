// src/lib/challenges/load-balancer.ts
import { ChallengeData } from "./types";

export const loadBalancerChallenge: ChallengeData = {
  slug: "load-balancer",
  number: "12",
  title: "Dynamic Layer-7 Load Balancer",
  subtitle: "From weighted round-robin and active connection tracking to circuit breaker failover and consistent ring hashing.",
  badge: "DISTRIBUTED NETWORKING CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "HAProxy, Nginx, Envoy",
  whatStudentsBuild: "Layer-7 reverse proxy & dynamic load balancer",
  mainSkill: "Load balancing algorithms, routing, health checking",
  signatureQuestion: "Can your load balancer survive a failing server?",
  overview:
    "In this engineering challenge, you construct an enterprise-grade Layer-7 reverse proxy and load balancer from first principles — inspired by the routing and resilience architectures of HAProxy, Nginx, and Envoy. You build smooth weighted round-robin dispatchers, dynamic least-connections trackers, passive failure circuit breakers, Ketama consistent hash rings with virtual nodes, and zero-downtime connection draining.",
  whyItMatters:
    "Load balancers represent the single entry point for modern web architectures. A poorly balanced system causes hot-spot server collapses, dropped web transactions during rolling deployments, and total outage during backend node failures.",
  finalOutcome:
    "Upon completing all 6 levels, you have engineered a production load balancer supporting weighted round-robin, least-connections dynamic routing, circuit breaker health checks, consistent hash session affinity, and graceful connection draining.",
  philosophy: "Encounter real load balancing problems: traffic hot-spotting, least-connections tracking, circuit breaking with failure thresholds, and session affinity under pool mutation.",
  architectureDiagram: `                     CLIENT INGRESS
                            │
               ┌────────────┴────────────┐
               │   Smooth Weighted RR    │
               └────────────┬────────────┘
                            │
                   Virtual Hash Ring
                 (100 vnodes per host)
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    Backend A           Backend B           Backend C
   (Healthy 🟢)        (Healthy 🟢)        (Dead 🔴)
                            │
                            ▼
                    Circuit Breaker`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Cyclic round-robin dispatcher", mainConcept: "Deterministic backend rotation, pointer wraparound modulo arithmetic, empty pool protection" },
    { level: 2, whatWeBuild: "Smooth weighted round-robin", mainConcept: "Nginx current_weight interleaved algorithm, capacity-proportional traffic dispersal" },
    { level: 3, whatWeBuild: "Least-connections dynamic routing", mainConcept: "In-flight connection counters, concurrency balancing across active servers" },
    { level: 4, whatWeBuild: "Active & passive health checking", mainConcept: "Consecutive failure threshold, dead node circuit breaking, recovery probing" },
    { level: 5, whatWeBuild: "Consistent hashing ring", mainConcept: "Ketama 32-bit virtual node ring, session affinity, minimal key remapping on node mutation" },
    { level: 6, whatWeBuild: "Zero-downtime connection draining", mainConcept: "Graceful server deregistration, inflight transaction draining without dropped requests" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Round-Robin Dispatcher",
      focus: "Cyclic Request Distribution",
      description: "Dispatches incoming requests uniformly across a list of healthy upstream backends in deterministic order.",
      realWorldTech: "Nginx upstream round-robin default module",
    },
    {
      number: 2,
      name: "Smooth Weighted Round-Robin",
      focus: "Capacity-Proportional Interleaving",
      description: "Implements Nginx's smooth weighted round-robin algorithm to prevent burst clusters on high-capacity nodes.",
      realWorldTech: "Nginx ngx_http_upstream_round_robin (current_weight += weight)",
    },
    {
      number: 3,
      name: "Least-Connections Routing",
      focus: "Dynamic Active Connection Balancing",
      description: "Tracks active in-flight connections per server and routes new requests to the least-burdened server.",
      realWorldTech: "HAProxy balance leastconn, AWS ALB least outstanding requests",
    },
    {
      number: 4,
      name: "Active & Passive Health Checking",
      focus: "Circuit Breaking & Dead Node Eviction",
      description: "Tracks consecutive response failures, trips backends to DOWN state, and probes for recovery without dropping user traffic.",
      realWorldTech: "Envoy outlier detection, Nginx max_fails/fail_timeout",
    },
    {
      number: 5,
      name: "Consistent Hashing Ring",
      focus: "Cache-Friendly Virtual Node Ring",
      description: "Maps requests and backends to a 32-bit circular hash ring with virtual nodes, minimizing cache churn during node changes.",
      realWorldTech: "Ketama consistent hashing, Cassandra token ring",
    },
    {
      number: 6,
      name: "Zero-Downtime Connection Draining",
      focus: "Graceful Deployment De-registration",
      description: "Prevents new requests while allowing in-flight connections to gracefully complete before server removal.",
      realWorldTech: "AWS ALB deregistration delay, HAProxy set server agent drain",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Round-Robin Dispatcher",
      title: "Basic Round-Robin Dispatcher",
      difficulty: "Easy",
      tagline: "Distribute incoming requests uniformly across registered backends in cyclical order.",
      description: `In Level 1 (Basic Round-Robin Dispatcher), you engineer the core mechanisms for Dynamic Layer-7 Load Balancer.

Distribute incoming requests uniformly across registered backends in cyclical order.

Core Engineering Problem: Direct client-to-server connections overwhelm single nodes. Round-robin spreads load across horizontal workers.

Key Mechanisms Implemented:
• Tracking registered server list.
• Cyclic pointer increment: index = (index + 1) % N.
• Handling empty backend pools gracefully.

You implement cyclical dispatch and backend pool management.`,
      implementationGuide: [
        "Read input commands line-by-line from standard input and parse arguments.",
        "Implement 'ADD_BACKEND <server_id>': Registers an active backend. Returns 'OK'.",
        "Implement 'ROUTE <req_id>': Routes request to next backend. Returns 'FORWARD -> <server_id>' or 'NO_BACKENDS'.",
        "Implement 'LIST_BACKENDS': Returns 'BACKENDS <id1> <id2>...' in registration order.",
        "Enforce system constraints: Server IDs and Request IDs are alphanumeric strings.",
        "Format output according to the specification and flush standard output."
],
      diagram: `CLIENT REQUEST                            LOAD BALANCER                   ROUTED TARGET
ADD_BACKEND s1                ──► register server in pool  ──► OK
ADD_BACKEND s2                ──► register server in pool  ──► OK
ROUTE r1                      ──► (0 % 2) -> select s1     ──► FORWARD -> s1
ROUTE r2                      ──► (1 % 2) -> select s2     ──► FORWARD -> s2
ROUTE r3                      ──► (2 % 2) -> select s1     ──► FORWARD -> s1`,
      importantChallenge: {
        title: "Stateful Cycling & Dynamic Pool Mutation",
        description:
          "A round-robin router must maintain a monotonic sequence index while gracefully handling dynamic backend registration and deregistration. If backends are added or removed mid-stream, indexing must never cause out-of-bounds panics or skip servers unexpectedly.",
        codeOrFormat: "target_index = current_index % pool.size()\ncurrent_index = (current_index + 1) % pool.size()",
      },
      endGoalDemonstration: `ADD_BACKEND web-1
OK
ADD_BACKEND web-2
OK
ROUTE req-1
FORWARD -> web-1
ROUTE req-2
FORWARD -> web-2
ROUTE req-3
FORWARD -> web-1`,
      nextLevelTeaser:
        "In Level 2, we implement Nginx's Smooth Weighted Round-Robin algorithm to interleave requests proportionally across heterogeneous backend hardware.",
      learningLoop: {
        bottleneck: "Direct client-to-server connections overwhelm single nodes. Round-robin spreads load across horizontal workers.",
        whatYouUnderstand: [
          "Tracking registered server list.",
          "Cyclic pointer increment: index = (index + 1) % N.",
          "Handling empty backend pools gracefully.",
        ],
        productionParity: "The fundamental upstream distribution mechanism of Nginx and DNS round-robin.",
        outcomeSummary: "You implement cyclical dispatch and backend pool management.",
      },
      operations: [
        { cmd: "ADD_BACKEND <server_id>", desc: "Registers an active backend. Returns 'OK'." },
        { cmd: "ROUTE <req_id>", desc: "Routes request to next backend. Returns 'FORWARD -> <server_id>' or 'NO_BACKENDS'." },
        { cmd: "LIST_BACKENDS", desc: "Returns 'BACKENDS <id1> <id2>...' in registration order." },
      ],
      examples: [
        {
          title: "Round Robin Cycling",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE r1\nROUTE r2\nROUTE r3",
          output: "OK\nOK\nFORWARD -> s1\nFORWARD -> s2\nFORWARD -> s1",
        },
      ],
      constraints: ["Server IDs and Request IDs are alphanumeric strings"],
      cases: [
        {
          name: "Case 1: Two Server Alternation",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE r1\nROUTE r2\nROUTE r3",
          expected: "OK\nOK\nFORWARD -> s1\nFORWARD -> s2\nFORWARD -> s1",
        },
        {
          name: "Case 2: Three Server Cycling",
          input: "ADD_BACKEND a\nADD_BACKEND b\nADD_BACKEND c\nROUTE 1\nROUTE 2\nROUTE 3\nROUTE 4",
          expected: "OK\nOK\nOK\nFORWARD -> a\nFORWARD -> b\nFORWARD -> c\nFORWARD -> a",
        },
        {
          name: "Case 3: Route With No Backends",
          input: "ROUTE r1",
          expected: "NO_BACKENDS",
        },
        {
          name: "Case 4: List Backends Order",
          input: "ADD_BACKEND web-1\nADD_BACKEND web-2\nLIST_BACKENDS",
          expected: "OK\nOK\nBACKENDS web-1 web-2",
        },
        {
          name: "Case 5: Single Backend Loop",
          input: "ADD_BACKEND solo\nROUTE 1\nROUTE 2",
          expected: "OK\nFORWARD -> solo\nFORWARD -> solo",
        },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Smooth Weighted Round-Robin",
      title: "Smooth Weighted Round-Robin (Nginx Algorithm)",
      difficulty: "Medium",
      tagline: "Interleave requests smoothly according to server weights using Nginx's current_weight algorithm.",
      description: `In Level 2 (Smooth Weighted Round-Robin (Nginx Algorithm)), you engineer the core mechanisms for Dynamic Layer-7 Load Balancer.

Interleave requests smoothly according to server weights using Nginx's current_weight algorithm.

Core Engineering Problem: Naive weighted round-robin sends 10 consecutive requests to server A (weight 10) then 1 to B (weight 1). This causes CPU spikes on A. Smooth weighted distributes them evenly: A, A, A, B, A, A...

Key Mechanisms Implemented:
• For each route: For all servers: current_weight += effective_weight.
• Select server with highest current_weight.
• Subtract total_weight from the selected server's current_weight.

You implement smooth interleaved weighted balancing.`,
      implementationGuide: [
        "Read input commands line-by-line from standard input and parse arguments.",
        "Implement 'ADD_WEIGHTED <server_id> <weight>': Registers backend with integer weight. Returns 'OK'.",
        "Implement 'ROUTE_WEIGHTED <req_id>': Dispatches request using smooth weighted algorithm. Returns 'FORWARD -> <server_id>'.",
        "Enforce system constraints: Weights are positive integers; When a backend is added via ADD_WEIGHTED, its current_weight is initialized to 0..",
        "Format output according to the specification and flush standard output."
],
      diagram: `INCOMING REQUEST                          NGINX SMOOTH WEIGHT ENGINE             SELECTED UPSTREAM
ROUTE_WEIGHTED 1 ──┐                      ┌──────────────────────────────┐
ROUTE_WEIGHTED 2 ──┼────────────────────► │ Weights: a=4, b=2, c=1 (Σ=7)  │ ──► FORWARD -> a
ROUTE_WEIGHTED 3 ──┤                      │ cur_w += eff_w; pick max;   │ ──► FORWARD -> b
                   │                      │ cur_w[max] -= total_weight  │ ──► FORWARD -> a
                   ▼                      └──────────────────────────────┘
Sequence: a -> b -> a -> a -> c -> b -> a (Smooth interleaving without burst clumps)`,
      learningLoop: {
        bottleneck: "Naive weighted round-robin sends 10 consecutive requests to server A (weight 10) then 1 to B (weight 1). This causes CPU spikes on A. Smooth weighted distributes them evenly: A, A, A, B, A, A...",
        whatYouUnderstand: [
          "For each route: For all servers: current_weight += effective_weight.",
          "Select server with highest current_weight.",
          "Subtract total_weight from the selected server's current_weight.",
        ],
        productionParity: "Nginx's exact C algorithm for upstream weighted load balancing.",
        outcomeSummary: "You implement smooth interleaved weighted balancing.",
      },
      operations: [
        { cmd: "ADD_WEIGHTED <server_id> <weight>", desc: "Registers backend with integer weight. Returns 'OK'." },
        { cmd: "ROUTE_WEIGHTED <req_id>", desc: "Dispatches request using smooth weighted algorithm. Returns 'FORWARD -> <server_id>'." },
      ],
      examples: [
        {
          title: "Smooth Weighted Interleaving",
          input: "ADD_WEIGHTED a 4\nADD_WEIGHTED b 2\nADD_WEIGHTED c 1\nROUTE_WEIGHTED 1\nROUTE_WEIGHTED 2\nROUTE_WEIGHTED 3\nROUTE_WEIGHTED 4\nROUTE_WEIGHTED 5\nROUTE_WEIGHTED 6\nROUTE_WEIGHTED 7",
          output: "OK\nOK\nOK\nFORWARD -> a\nFORWARD -> b\nFORWARD -> a\nFORWARD -> a\nFORWARD -> c\nFORWARD -> b\nFORWARD -> a",
        },
      ],
      constraints: ["Weights are positive integers", "When a backend is added via ADD_WEIGHTED, its current_weight is initialized to 0."],
      cases: [
        {
          name: "Case 1: Ratio 4:2:1 Smooth Distribution",
          input: "ADD_WEIGHTED a 4\nADD_WEIGHTED b 2\nADD_WEIGHTED c 1\nROUTE_WEIGHTED 1\nROUTE_WEIGHTED 2\nROUTE_WEIGHTED 3\nROUTE_WEIGHTED 4\nROUTE_WEIGHTED 5\nROUTE_WEIGHTED 6\nROUTE_WEIGHTED 7",
          expected: "OK\nOK\nOK\nFORWARD -> a\nFORWARD -> b\nFORWARD -> a\nFORWARD -> a\nFORWARD -> c\nFORWARD -> b\nFORWARD -> a",
        },
        {
          name: "Case 2: Equal Weights Degrades to Round Robin",
          input: "ADD_WEIGHTED s1 1\nADD_WEIGHTED s2 1\nROUTE_WEIGHTED 1\nROUTE_WEIGHTED 2\nROUTE_WEIGHTED 3",
          expected: "OK\nOK\nFORWARD -> s1\nFORWARD -> s2\nFORWARD -> s1",
        },
        {
          name: "Case 3: Heavy Weight Ratio 3:1",
          input: "ADD_WEIGHTED heavy 3\nADD_WEIGHTED light 1\nROUTE_WEIGHTED 1\nROUTE_WEIGHTED 2\nROUTE_WEIGHTED 3\nROUTE_WEIGHTED 4",
          expected: "OK\nOK\nFORWARD -> heavy\nFORWARD -> heavy\nFORWARD -> light\nFORWARD -> heavy",
        },
        {
          name: "Case 4: Single Weighted Server",
          input: "ADD_WEIGHTED solo 5\nROUTE_WEIGHTED 1",
          expected: "OK\nFORWARD -> solo",
        },
        {
          name: "Case 5: Route Weighted No Backends",
          input: "ROUTE_WEIGHTED 1",
          expected: "NO_BACKENDS",
        },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Least Connections Router",
      title: "Dynamic Least-Connections Routing",
      difficulty: "Medium",
      tagline: "Track active in-flight requests. Route new requests to the backend with the fewest active connections.",
      description: `In Level 3 (Dynamic Least-Connections Routing), you engineer the core mechanisms for Dynamic Layer-7 Load Balancer.

Track active in-flight requests. Route new requests to the backend with the fewest active connections.

Core Engineering Problem: Round-robin fails when some requests take 10 seconds while others take 10ms. Least connections adapts dynamically to slow servers.

Key Mechanisms Implemented:
• Tracking in-flight request counter per backend.
• Selecting backend with minimum active connections.
• Tie-breaking backends alphabetically by server_id.

You implement dynamic connection-aware traffic routing.`,
      implementationGuide: [
        "Read input commands line-by-line from standard input and parse arguments.",
        "Implement 'TRACK_START <server_id> <req_id>': Increments active connection count. Returns 'OK'.",
        "Implement 'TRACK_END <server_id> <req_id>': Decrements active connection count. Returns 'OK'.",
        "Implement 'ROUTE_LEAST_CONN <req_id>': Routes to backend with fewest active conns, increments its count. Returns 'FORWARD -> <server_id>'.",
        "Enforce system constraints: Active connection count cannot drop below 0.",
        "Format output according to the specification and flush standard output."
],
      diagram: `INCOMING REQUEST                          ACTIVE CONNECTION TRACKER              ROUTING DECISION
ROUTE_LEAST_CONN r1 ──┐                   ┌──────────────────────────────┐
ROUTE_LEAST_CONN r2 ──┼─────────────────► │ [s1] Active Connections: 1   │ ──► FORWARD -> s1
ROUTE_LEAST_CONN r3 ──┤                   │ [s2] Active Connections: 0   │ ──► FORWARD -> s2
                      │                   └──────────────┬───────────────┘
                      ▼                                  │
TRACK_END s1 r1 ─────────────────────────────────────────┴──────────────► [s1] Conns: 1 -> 0
ROUTE_LEAST_CONN r4 ────────────────────────────────────────────────────► FORWARD -> s1 (least busy)`,
      learningLoop: {
        bottleneck: "Round-robin fails when some requests take 10 seconds while others take 10ms. Least connections adapts dynamically to slow servers.",
        whatYouUnderstand: [
          "Tracking in-flight request counter per backend.",
          "Selecting backend with minimum active connections.",
          "Tie-breaking backends alphabetically by server_id.",
        ],
        productionParity: "HAProxy leastconn and AWS ALB least outstanding requests.",
        outcomeSummary: "You implement dynamic connection-aware traffic routing.",
      },
      operations: [
        { cmd: "TRACK_START <server_id> <req_id>", desc: "Increments active connection count. Returns 'OK'." },
        { cmd: "TRACK_END <server_id> <req_id>", desc: "Decrements active connection count. Returns 'OK'." },
        { cmd: "ROUTE_LEAST_CONN <req_id>", desc: "Routes to backend with fewest active conns, increments its count. Returns 'FORWARD -> <server_id>'." },
        { cmd: "ACTIVE_CONNS", desc: "Returns 'CONNS <id>:<count>...'." },
      ],
      examples: [
        {
          title: "Least Conn Routing",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE_LEAST_CONN r1\nROUTE_LEAST_CONN r2\nROUTE_LEAST_CONN r3\nTRACK_END s1 r1\nROUTE_LEAST_CONN r4",
          output: "OK\nOK\nFORWARD -> s1\nFORWARD -> s2\nFORWARD -> s1\nOK\nFORWARD -> s1",
        },
      ],
      constraints: ["Active connection count cannot drop below 0"],
      cases: [
        {
          name: "Case 1: Balances Across In-Flight Requests",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE_LEAST_CONN r1\nROUTE_LEAST_CONN r2\nROUTE_LEAST_CONN r3\nTRACK_END s1 r1\nROUTE_LEAST_CONN r4",
          expected: "OK\nOK\nFORWARD -> s1\nFORWARD -> s2\nFORWARD -> s1\nOK\nFORWARD -> s1",
        },
        {
          name: "Case 2: Active Connection Inspection",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE_LEAST_CONN r1\nACTIVE_CONNS",
          expected: "OK\nOK\nFORWARD -> s1\nCONNS s1:1 s2:0",
        },
        {
          name: "Case 3: All Servers Busy Chooses Alphabetical",
          input: "ADD_BACKEND beta\nADD_BACKEND alpha\nROUTE_LEAST_CONN r1",
          expected: "OK\nOK\nFORWARD -> alpha",
        },
        {
          name: "Case 4: End Unknown Request Safe",
          input: "ADD_BACKEND s1\nTRACK_END s1 ghost",
          expected: "OK\nOK",
        },
        {
          name: "Case 5: Multiple Completions Free Server",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE_LEAST_CONN r1\nROUTE_LEAST_CONN r2\nTRACK_END s1 r1\nACTIVE_CONNS",
          expected: "OK\nOK\nFORWARD -> s1\nFORWARD -> s2\nOK\nCONNS s1:0 s2:1",
        },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Health Checks & Circuit Breaking",
      title: "Passive Health Checks & Failover",
      difficulty: "Hard",
      tagline: "Track consecutive backend errors. Trip unhealthy nodes to DOWN after exceeding threshold, rerouting traffic.",
      description: `In Level 4 (Passive Health Checks & Failover), you engineer the core mechanisms for Dynamic Layer-7 Load Balancer.

Track consecutive backend errors. Trip unhealthy nodes to DOWN after exceeding threshold, rerouting traffic.

Core Engineering Problem: Routing traffic to dead backends creates cascading 500/502 errors. Passive health checks circuit-break failing nodes automatically.

Key Mechanisms Implemented:
• Tracking consecutive failures per backend.
• Tripping server status from UP to DOWN after failure threshold.
• Excluding DOWN servers from all routing algorithms.
• Probing and restoring server status to UP upon success.

You implement circuit-breaking and fault-tolerant failover.`,
      implementationGuide: [
        "Read input commands line-by-line from standard input and parse arguments.",
        "Implement 'SET_FAIL_THRESHOLD <count>': Sets max consecutive fails before marking DOWN (default 3). Returns 'OK'.",
        "Implement 'FAIL <server_id>': Records failure. Returns 'STATUS <server_id> <UP|DOWN>'.",
        "Implement 'SUCCESS <server_id>': Records success. Resets fail count to 0, marks UP. Returns 'STATUS <server_id> UP'.",
        "Enforce system constraints: If all backends are DOWN, ROUTE returns 'NO_BACKENDS'; ALL routing strategies (ROUTE, ROUTE_WEIGHTED, ROUTE_LEAST_CONN) must exclude servers in DOWN or DRAINING state..",
        "Format output according to the specification and flush standard output."
],
      diagram: `SERVER PROBING / TRAFFIC                  CIRCUIT BREAKER STATE (Thresh=2)       TRAFFIC ROUTING
FAIL s1 (count=1)    ──► s1: UP (1/2)     ┌──────────────────────────────┐
FAIL s1 (count=2)    ──► s1: DOWN (TRIP!) │ [s1] STATUS: DOWN (Tripped)  │ ──► Excluded from pool
                                          ├──────────────────────────────┤
ROUTE r1 ────────────────────────────────►│ [s2] STATUS: UP (Healthy)    │ ──► FORWARD -> s2
                                          └──────────────────────────────┘
SUCCESS s1 (Probe)   ──► s1: UP (0/2)     ──► Restored to Pool           ──► FORWARD -> s1`,
      learningLoop: {
        bottleneck: "Routing traffic to dead backends creates cascading 500/502 errors. Passive health checks circuit-break failing nodes automatically.",
        whatYouUnderstand: [
          "Tracking consecutive failures per backend.",
          "Tripping server status from UP to DOWN after failure threshold.",
          "Excluding DOWN servers from all routing algorithms.",
          "Probing and restoring server status to UP upon success.",
        ],
        productionParity: "Envoy outlier detection and Nginx max_fails/fail_timeout.",
        outcomeSummary: "You implement circuit-breaking and fault-tolerant failover.",
      },
      operations: [
        { cmd: "SET_FAIL_THRESHOLD <count>", desc: "Sets max consecutive fails before marking DOWN (default 3). Returns 'OK'." },
        { cmd: "FAIL <server_id>", desc: "Records failure. Returns 'STATUS <server_id> <UP|DOWN>'." },
        { cmd: "SUCCESS <server_id>", desc: "Records success. Resets fail count to 0, marks UP. Returns 'STATUS <server_id> UP'." },
      ],
      examples: [
        {
          title: "Circuit Breaker Trips to DOWN",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nSET_FAIL_THRESHOLD 2\nFAIL s1\nFAIL s1\nROUTE r1\nROUTE r2",
          output: "OK\nOK\nOK\nSTATUS s1 UP\nSTATUS s1 DOWN\nFORWARD -> s2\nFORWARD -> s2",
        },
      ],
      constraints: ["If all backends are DOWN, ROUTE returns 'NO_BACKENDS'", "ALL routing strategies (ROUTE, ROUTE_WEIGHTED, ROUTE_LEAST_CONN) must exclude servers in DOWN or DRAINING state."],
      cases: [
        {
          name: "Case 1: Tripping Node Out of Pool",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nSET_FAIL_THRESHOLD 2\nFAIL s1\nFAIL s1\nROUTE r1\nROUTE r2",
          expected: "OK\nOK\nOK\nSTATUS s1 UP\nSTATUS s1 DOWN\nFORWARD -> s2\nFORWARD -> s2",
        },
        {
          name: "Case 2: Success Restores Tripped Node",
          input: "ADD_BACKEND s1\nSET_FAIL_THRESHOLD 1\nFAIL s1\nROUTE r1\nSUCCESS s1\nROUTE r2",
          expected: "OK\nOK\nSTATUS s1 DOWN\nNO_BACKENDS\nSTATUS s1 UP\nFORWARD -> s1",
        },
        {
          name: "Case 3: All Backends Down Returns NO_BACKENDS",
          input: "ADD_BACKEND s1\nSET_FAIL_THRESHOLD 1\nFAIL s1\nROUTE r1",
          expected: "OK\nOK\nSTATUS s1 DOWN\nNO_BACKENDS",
        },
        {
          name: "Case 4: Interleaved Failures Reset on Success",
          input: "ADD_BACKEND s1\nSET_FAIL_THRESHOLD 2\nFAIL s1\nSUCCESS s1\nFAIL s1",
          expected: "OK\nOK\nSTATUS s1 UP\nSTATUS s1 UP\nSTATUS s1 UP",
        },
        {
          name: "Case 5: Fail Unknown Server",
          input: "FAIL ghost",
          expected: "NOT_FOUND",
        },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Consistent Hash Ring",
      title: "Ketama Consistent Hashing Ring",
      difficulty: "Hard",
      tagline: "Implement a circular hash ring with virtual nodes for sticky session affinity and minimal cache relocation.",
      description: `In Level 5 (Ketama Consistent Hashing Ring), you engineer the core mechanisms for Dynamic Layer-7 Load Balancer.

Implement a circular hash ring with virtual nodes for sticky session affinity and minimal cache relocation.

Core Engineering Problem: Modulo routing hash(key) % N invalidates almost all cache keys when a server is added or removed. Consistent hashing remaps only K/N keys.

Key Mechanisms Implemented:
• Hashing keys to 32-bit integer space [0, 2^32 - 1] using FNV-1a.
• Placing virtual nodes: hash(server_id + '#' + vnode_idx).
• Finding first virtual node clockwise on ring whose hash >= hash(key).

You implement virtual-node consistent hashing for session and cache affinity.`,
      implementationGuide: [
        "Read input commands line-by-line from standard input and parse arguments.",
        "Implement 'ADD_RING_NODE <server_id> <vnodes>': Adds server with virtual nodes to the hash ring. Returns 'OK'.",
        "Implement 'ROUTE_KEY <cache_key>': Routes key to nearest clockwise server. Returns 'HASH_FORWARD -> <server_id>' or 'NO_BACKENDS'.",
        "Enforce system constraints: Use FNV-1a 32-bit hash algorithm: offset_basis=2166136261, prime=16777619.",
        "Format output according to the specification and flush standard output."
],
      diagram: `CACHE KEY REQUEST                         32-BIT CIRCULAR HASH RING              TARGET NODE
ROUTE_KEY user:100                        ┌──────────────────────────────┐
      │                                   │          0 / 2^32            │
      ▼                                   │        c1#0      c2#0        │
hash(user:100) = 0x4F1A... ─────────────► │    c2#1              c1#1    │ ──► HASH_FORWARD -> c1
(Clockwise binary search)                 │        c1#2      c2#2        │     (Nearest clockwise
                                          │                              │      virtual node)
ROUTE_KEY user:200 ─────────────────────► └──────────────────────────────┘ ──► HASH_FORWARD -> c2`,
      learningLoop: {
        bottleneck: "Modulo routing hash(key) % N invalidates almost all cache keys when a server is added or removed. Consistent hashing remaps only K/N keys.",
        whatYouUnderstand: [
          "Hashing keys to 32-bit integer space [0, 2^32 - 1] using FNV-1a.",
          "Placing virtual nodes: hash(server_id + '#' + vnode_idx).",
          "Finding first virtual node clockwise on ring whose hash >= hash(key).",
        ],
        productionParity: "Ketama consistent hashing used in Memcached, Nginx hash $request_uri consistent, and AWS ElastiCache.",
        outcomeSummary: "You implement virtual-node consistent hashing for session and cache affinity.",
      },
      operations: [
        { cmd: "ADD_RING_NODE <server_id> <vnodes>", desc: "Adds server with virtual nodes to the hash ring. Returns 'OK'." },
        { cmd: "ROUTE_KEY <cache_key>", desc: "Routes key to nearest clockwise server. Returns 'HASH_FORWARD -> <server_id>' or 'NO_BACKENDS'." },
      ],
      examples: [
        {
          title: "Consistent Ring Routing",
          input: "ADD_RING_NODE cache-1 3\nADD_RING_NODE cache-2 3\nROUTE_KEY user:100\nROUTE_KEY user:200",
          output: "OK\nOK\nHASH_FORWARD -> cache-1\nHASH_FORWARD -> cache-2",
        },
      ],
      constraints: ["Use FNV-1a 32-bit hash algorithm: offset_basis=2166136261, prime=16777619"],
      cases: [
        {
          name: "Case 1: Consistent Key Determinism",
          input: "ADD_RING_NODE c1 5\nADD_RING_NODE c2 5\nROUTE_KEY alpha\nROUTE_KEY alpha",
          expected: "OK\nOK\nHASH_FORWARD -> c2\nHASH_FORWARD -> c2",
        },
        {
          name: "Case 2: Key Distribution Across Nodes",
          input: "ADD_RING_NODE c1 3\nADD_RING_NODE c2 3\nROUTE_KEY k1\nROUTE_KEY k2\nROUTE_KEY k3",
          expected: "OK\nOK\nHASH_FORWARD -> c1\nHASH_FORWARD -> c2\nHASH_FORWARD -> c1",
        },
        {
          name: "Case 3: Single Node Ring Always Matches",
          input: "ADD_RING_NODE solo 3\nROUTE_KEY any-key",
          expected: "OK\nHASH_FORWARD -> solo",
        },
        {
          name: "Case 4: Empty Ring Returns NO_BACKENDS",
          input: "ROUTE_KEY missing",
          expected: "NO_BACKENDS",
        },
        {
          name: "Case 5: Wrap Around Clockwise Ring",
          input: "ADD_RING_NODE n1 1\nROUTE_KEY zzzzz",
          expected: "OK\nHASH_FORWARD -> n1",
        },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Connection Draining",
      title: "Zero-Downtime Connection Draining",
      difficulty: "Hard",
      tagline: "Drain servers gracefully during rolling deploys: accept 0 new requests, wait for active connections to finish, then remove.",
      description: `In Level 6 (Zero-Downtime Connection Draining), you engineer the core mechanisms for Dynamic Layer-7 Load Balancer.

Drain servers gracefully during rolling deploys: accept 0 new requests, wait for active connections to finish, then remove.

Core Engineering Problem: Immediately killing an upstream node aborts users mid-checkout. Connection draining waits for in-flight requests to complete before terminating.

Key Mechanisms Implemented:
• State lifecycle: UP -> DRAINING -> REMOVED.
• DRAINING servers are immediately excluded from new ROUTE calls.
• When active connections reach 0 on a DRAINING server, state transitions to REMOVED.

You master zero-downtime rolling maintenance and connection lifecycle management.`,
      implementationGuide: [
        "Read input commands line-by-line from standard input and parse arguments.",
        "Implement 'DRAIN <server_id>': Transitions server to DRAINING state. Returns 'DRAINING <server_id> ACTIVE <conns>' or 'REMOVED <server_id>'.",
        "Implement 'SERVER_STATUS <server_id>': Returns 'STATE <UP|DOWN|DRAINING|REMOVED> ACTIVE <conns>' or 'NOT_FOUND'.",
        "Enforce system constraints: Draining an idle server (active=0) transitions immediately to REMOVED.",
        "Format output according to the specification and flush standard output."
],
      diagram: `MAINTENANCE SIGNAL                        SERVER DRAIN LIFECYCLE                 NEW TRAFFIC ROUTING
DRAIN s1 (active=1)  ──► State: DRAINING  ┌──────────────────────────────┐
                                          │ [s1] DRAINING (active: 1)    │ ──► 0 new requests
ROUTE r2 ────────────────────────────────►│ [s2] UP       (active: 0)    │ ──► FORWARD -> s2
                                          └──────────────┬───────────────┘
TRACK_END s1 r1      ──► active: 1 -> 0                  │
                                                         ▼
SERVER_STATUS s1     ──► All conns done   ──► STATE REMOVED ACTIVE 0`,
      learningLoop: {
        bottleneck: "Immediately killing an upstream node aborts users mid-checkout. Connection draining waits for in-flight requests to complete before terminating.",
        whatYouUnderstand: [
          "State lifecycle: UP -> DRAINING -> REMOVED.",
          "DRAINING servers are immediately excluded from new ROUTE calls.",
          "When active connections reach 0 on a DRAINING server, state transitions to REMOVED.",
        ],
        productionParity: "AWS ALB deregistration delay and Kubernetes pod graceful termination.",
        outcomeSummary: "You master zero-downtime rolling maintenance and connection lifecycle management.",
      },
      operations: [
        { cmd: "DRAIN <server_id>", desc: "Transitions server to DRAINING state. Returns 'DRAINING <server_id> ACTIVE <conns>' or 'REMOVED <server_id>'." },
        { cmd: "SERVER_STATUS <server_id>", desc: "Returns 'STATE <UP|DOWN|DRAINING|REMOVED> ACTIVE <conns>' or 'NOT_FOUND'." },
      ],
      examples: [
        {
          title: "Drain Active Server",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE_LEAST_CONN r1\nDRAIN s1\nROUTE r2\nTRACK_END s1 r1\nSERVER_STATUS s1",
          output: "OK\nOK\nFORWARD -> s1\nDRAINING s1 ACTIVE 1\nFORWARD -> s2\nOK\nSTATE REMOVED ACTIVE 0",
        },
      ],
      constraints: ["Draining an idle server (active=0) transitions immediately to REMOVED"],
      cases: [
        {
          name: "Case 1: Drain In-Flight Then Removed",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nROUTE_LEAST_CONN r1\nDRAIN s1\nROUTE r2\nTRACK_END s1 r1\nSERVER_STATUS s1",
          expected: "OK\nOK\nFORWARD -> s1\nDRAINING s1 ACTIVE 1\nFORWARD -> s2\nOK\nSTATE REMOVED ACTIVE 0",
        },
        {
          name: "Case 2: Drain Idle Server Immediately Removed",
          input: "ADD_BACKEND s1\nDRAIN s1\nSERVER_STATUS s1",
          expected: "OK\nREMOVED s1\nSTATE REMOVED ACTIVE 0",
        },
        {
          name: "Case 3: Drain Excludes From Future Routing",
          input: "ADD_BACKEND s1\nADD_BACKEND s2\nTRACK_START s1 reqA\nDRAIN s1\nROUTE 1\nROUTE 2",
          expected: "OK\nOK\nOK\nDRAINING s1 ACTIVE 1\nFORWARD -> s2\nFORWARD -> s2",
        },
        {
          name: "Case 4: Drain Unknown Server",
          input: "DRAIN ghost",
          expected: "NOT_FOUND",
        },
        {
          name: "Case 5: Server Status Query",
          input: "ADD_BACKEND s1\nTRACK_START s1 r1\nSERVER_STATUS s1",
          expected: "OK\nOK\nSTATE UP ACTIVE 1",
        },
      ],
    },
  },
  starterTemplates: {
    python: `"""
Load Balancer - Challenge 09 Starter (Python 3.12)
Implements round-robin, smooth weighted round-robin, least connections,
passive health checks, Ketama consistent hash rings, and zero-downtime draining.
"""
import sys
import bisect

def fnv1a_32(text: str) -> int:
    h = 2166136261
    for b in text.encode("utf-8"):
        h ^= b
        h = (h * 16777619) & 0xFFFFFFFF
    return h

class LoadBalancer:
    def __init__(self):
        # Servers: id -> {"weight": int, "current_weight": int, "active_conns": int, "state": str, "fails": int}
        self.servers = {}
        self.server_order = []
        self.rr_index = 0
        self.fail_threshold = 3

        # Consistent Hash Ring: sorted list of (hash_val, server_id)
        self.ring = []

    def add_backend(self, server_id: str, weight: int = 1) -> str:
        self.servers[server_id] = {
            "weight": weight,
            "effective_weight": weight,
            "current_weight": 0,
            "active_conns": 0,
            "state": "UP",  # UP, DOWN, DRAINING, REMOVED
            "fails": 0,
        }
        if server_id not in self.server_order:
            self.server_order.append(server_id)
        return "OK"

    def list_backends(self) -> str:
        active = [sid for sid in self.server_order if self.servers[sid]["state"] == "UP"]
        return "BACKENDS " + " ".join(active)

    def route_rr(self, req_id: str) -> str:
        eligible = [sid for sid in self.server_order if self.servers[sid]["state"] == "UP"]
        if not eligible:
            return "NO_BACKENDS"
        sid = eligible[self.rr_index % len(eligible)]
        self.rr_index += 1
        return f"FORWARD -> {sid}"

    def route_weighted(self, req_id: str) -> str:
        eligible = [sid for sid in self.server_order if self.servers[sid]["state"] == "UP"]
        if not eligible:
            return "NO_BACKENDS"

        # Smooth weighted round-robin (Nginx)
        total_weight = sum(self.servers[sid]["effective_weight"] for sid in eligible)
        best_sid = None
        best_cw = None

        for sid in eligible:
            srv = self.servers[sid]
            srv["current_weight"] += srv["effective_weight"]
            if best_cw is None or srv["current_weight"] > best_cw:
                best_cw = srv["current_weight"]
                best_sid = sid

        self.servers[best_sid]["current_weight"] -= total_weight
        return f"FORWARD -> {best_sid}"

    def track_start(self, server_id: str, req_id: str) -> str:
        if server_id in self.servers:
            self.servers[server_id]["active_conns"] += 1
        return "OK"

    def track_end(self, server_id: str, req_id: str) -> str:
        if server_id in self.servers:
            srv = self.servers[server_id]
            srv["active_conns"] = max(0, srv["active_conns"] - 1)
            if srv["state"] == "DRAINING" and srv["active_conns"] == 0:
                srv["state"] = "REMOVED"
        return "OK"

    def route_least_conn(self, req_id: str) -> str:
        eligible = [sid for sid in self.server_order if self.servers[sid]["state"] == "UP"]
        if not eligible:
            return "NO_BACKENDS"

        # Tie-break: lowest active_conns, then alphabetical server_id
        eligible.sort(key=lambda sid: (self.servers[sid]["active_conns"], sid))
        best_sid = eligible[0]
        self.servers[best_sid]["active_conns"] += 1
        return f"FORWARD -> {best_sid}"

    def active_conns(self) -> str:
        parts = [f"{sid}:{self.servers[sid]['active_conns']}" for sid in self.server_order if self.servers[sid]["state"] != "REMOVED"]
        return "CONNS " + " ".join(parts)

    def set_fail_threshold(self, threshold: int) -> str:
        self.fail_threshold = threshold
        return "OK"

    def record_fail(self, server_id: str) -> str:
        if server_id not in self.servers:
            return "NOT_FOUND"
        srv = self.servers[server_id]
        srv["fails"] += 1
        if srv["fails"] >= self.fail_threshold:
            srv["state"] = "DOWN"
        return f"STATUS {server_id} {srv['state']}"

    def record_success(self, server_id: str) -> str:
        if server_id not in self.servers:
            return "NOT_FOUND"
        srv = self.servers[server_id]
        srv["fails"] = 0
        srv["state"] = "UP"
        return f"STATUS {server_id} UP"

    # Consistent Hashing
    def add_ring_node(self, server_id: str, vnodes: int) -> str:
        if server_id not in self.servers:
            self.add_backend(server_id)
        for i in range(vnodes):
            vnode_str = f"{server_id}#{i}"
            h = fnv1a_32(vnode_str)
            self.ring.append((h, server_id))
        self.ring.sort(key=lambda item: item[0])
        return "OK"

    def route_key(self, cache_key: str) -> str:
        if not self.ring:
            return "NO_BACKENDS"
        h = fnv1a_32(cache_key)
        # Binary search for first node with val >= h
        idx = bisect.bisect_left(self.ring, (h, ""))
        if idx >= len(self.ring):
            idx = 0  # Wrap around
        return f"HASH_FORWARD -> {self.ring[idx][1]}"

    # Connection Draining
    def drain(self, server_id: str) -> str:
        if server_id not in self.servers or self.servers[server_id]["state"] == "REMOVED":
            return "NOT_FOUND"
        srv = self.servers[server_id]
        if srv["active_conns"] == 0:
            srv["state"] = "REMOVED"
            return f"REMOVED {server_id}"
        else:
            srv["state"] = "DRAINING"
            return f"DRAINING {server_id} ACTIVE {srv['active_conns']}"

    def server_status(self, server_id: str) -> str:
        if server_id not in self.servers:
            return "NOT_FOUND"
        srv = self.servers[server_id]
        return f"STATE {srv['state']} ACTIVE {srv['active_conns']}"

def main():
    lb = LoadBalancer()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        cmd = parts[0].upper()

        if cmd == "ADD_BACKEND":
            print(lb.add_backend(parts[1]))
        elif cmd == "ADD_WEIGHTED":
            print(lb.add_backend(parts[1], int(parts[2])))
        elif cmd == "LIST_BACKENDS":
            print(lb.list_backends())
        elif cmd == "ROUTE":
            print(lb.route_rr(parts[1]))
        elif cmd == "ROUTE_WEIGHTED":
            print(lb.route_weighted(parts[1]))
        elif cmd == "TRACK_START":
            print(lb.track_start(parts[1], parts[2]))
        elif cmd == "TRACK_END":
            print(lb.track_end(parts[1], parts[2]))
        elif cmd == "ROUTE_LEAST_CONN":
            print(lb.route_least_conn(parts[1]))
        elif cmd == "ACTIVE_CONNS":
            print(lb.active_conns())
        elif cmd == "SET_FAIL_THRESHOLD":
            print(lb.set_fail_threshold(int(parts[1])))
        elif cmd == "FAIL":
            print(lb.record_fail(parts[1]))
        elif cmd == "SUCCESS":
            print(lb.record_success(parts[1]))
        elif cmd == "ADD_RING_NODE":
            print(lb.add_ring_node(parts[1], int(parts[2])))
        elif cmd == "ROUTE_KEY":
            print(lb.route_key(parts[1]))
        elif cmd == "DRAIN":
            print(lb.drain(parts[1]))
        elif cmd == "SERVER_STATUS":
            print(lb.server_status(parts[1]))
        else:
            print("UNKNOWN_COMMAND")

if __name__ == "__main__":
    main()
`,
    cpp: `// Load Balancer - Challenge 09 Starter (C++ 20)
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <sstream>
#include <cstdint>

uint32_t fnv1a_32(const std::string& str) {
    uint32_t hash = 2166136261u;
    for (unsigned char c : str) {
        hash ^= c;
        hash *= 16777619u;
    }
    return hash;
}

struct Server {
    std::string id;
    int weight = 1;
    int effective_weight = 1;
    int current_weight = 0;
    int active_conns = 0;
    std::string state = "UP"; // UP, DOWN, DRAINING, REMOVED
    int fails = 0;
};

class LoadBalancer {
    std::unordered_map<std::string, Server> servers;
    std::vector<std::string> server_order;
    int rr_index = 0;
    int fail_threshold = 3;
    std::vector<std::pair<uint32_t, std::string>> ring;

public:
    std::string add_backend(const std::string& id, int weight = 1) {
        servers[id] = Server{id, weight, weight, 0, 0, "UP", 0};
        if (std::find(server_order.begin(), server_order.end(), id) == server_order.end()) {
            server_order.push_back(id);
        }
        return "OK";
    }

    std::string list_backends() {
        std::string res = "BACKENDS";
        for (const auto& sid : server_order) {
            if (servers[sid].state == "UP") res += " " + sid;
        }
        return res;
    }

    std::string route_rr(const std::string& req_id) {
        std::vector<std::string> eligible;
        for (const auto& sid : server_order) {
            if (servers[sid].state == "UP") eligible.push_back(sid);
        }
        if (eligible.empty()) return "NO_BACKENDS";
        std::string sid = eligible[rr_index % eligible.size()];
        rr_index++;
        return "FORWARD -> " + sid;
    }

    std::string route_weighted(const std::string& req_id) {
        std::vector<std::string> eligible;
        for (const auto& sid : server_order) {
            if (servers[sid].state == "UP") eligible.push_back(sid);
        }
        if (eligible.empty()) return "NO_BACKENDS";

        int total_weight = 0;
        for (const auto& sid : eligible) total_weight += servers[sid].effective_weight;

        std::string best_sid = "";
        int best_cw = -1000000000;
        for (const auto& sid : eligible) {
            auto& srv = servers[sid];
            srv.current_weight += srv.effective_weight;
            if (best_sid.empty() || srv.current_weight > best_cw) {
                best_cw = srv.current_weight;
                best_sid = sid;
            }
        }
        servers[best_sid].current_weight -= total_weight;
        return "FORWARD -> " + best_sid;
    }

    std::string track_start(const std::string& sid, const std::string& req_id) {
        if (servers.find(sid) != servers.end()) servers[sid].active_conns++;
        return "OK";
    }

    std::string track_end(const std::string& sid, const std::string& req_id) {
        if (servers.find(sid) != servers.end()) {
            auto& srv = servers[sid];
            srv.active_conns = std::max(0, srv.active_conns - 1);
            if (srv.state == "DRAINING" && srv.active_conns == 0) {
                srv.state = "REMOVED";
            }
        }
        return "OK";
    }

    std::string route_least_conn(const std::string& req_id) {
        std::vector<std::string> eligible;
        for (const auto& sid : server_order) {
            if (servers[sid].state == "UP") eligible.push_back(sid);
        }
        if (eligible.empty()) return "NO_BACKENDS";

        std::sort(eligible.begin(), eligible.end(), [this](const std::string& a, const std::string& b) {
            if (servers[a].active_conns != servers[b].active_conns)
                return servers[a].active_conns < servers[b].active_conns;
            return a < b;
        });

        std::string best_sid = eligible[0];
        servers[best_sid].active_conns++;
        return "FORWARD -> " + best_sid;
    }

    std::string active_conns() {
        std::string res = "CONNS";
        for (const auto& sid : server_order) {
            if (servers[sid].state != "REMOVED") {
                res += " " + sid + ":" + std::to_string(servers[sid].active_conns);
            }
        }
        return res;
    }

    std::string set_fail_threshold(int th) {
        fail_threshold = th;
        return "OK";
    }

    std::string record_fail(const std::string& sid) {
        if (servers.find(sid) == servers.end()) return "NOT_FOUND";
        auto& srv = servers[sid];
        srv.fails++;
        if (srv.fails >= fail_threshold) srv.state = "DOWN";
        return "STATUS " + sid + " " + srv.state;
    }

    std::string record_success(const std::string& sid) {
        if (servers.find(sid) == servers.end()) return "NOT_FOUND";
        auto& srv = servers[sid];
        srv.fails = 0;
        srv.state = "UP";
        return "STATUS " + sid + " UP";
    }

    std::string add_ring_node(const std::string& sid, int vnodes) {
        if (servers.find(sid) == servers.end()) add_backend(sid);
        for (int i = 0; i < vnodes; i++) {
            std::string vnode = sid + "#" + std::to_string(i);
            uint32_t h = fnv1a_32(vnode);
            ring.push_back({h, sid});
        }
        std::sort(ring.begin(), ring.end());
        return "OK";
    }

    std::string route_key(const std::string& key) {
        if (ring.empty()) return "NO_BACKENDS";
        uint32_t h = fnv1a_32(key);
        auto it = std::lower_bound(ring.begin(), ring.end(), std::make_pair(h, std::string("")),
            [](const std::pair<uint32_t, std::string>& a, const std::pair<uint32_t, std::string>& b) {
                return a.first < b.first;
            });
        if (it == ring.end()) it = ring.begin();
        return "HASH_FORWARD -> " + it->second;
    }

    std::string drain(const std::string& sid) {
        if (servers.find(sid) == servers.end() || servers[sid].state == "REMOVED") return "NOT_FOUND";
        auto& srv = servers[sid];
        if (srv.active_conns == 0) {
            srv.state = "REMOVED";
            return "REMOVED " + sid;
        } else {
            srv.state = "DRAINING";
            return "DRAINING " + sid + " ACTIVE " + std::to_string(srv.active_conns);
        }
    }

    std::string server_status(const std::string& sid) {
        if (servers.find(sid) == servers.end()) return "NOT_FOUND";
        const auto& srv = servers[sid];
        return "STATE " + srv.state + " ACTIVE " + std::to_string(srv.active_conns);
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    LoadBalancer lb;
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;

        if (cmd == "ADD_BACKEND") {
            std::string id; iss >> id;
            std::cout << lb.add_backend(id) << "\\n";
        } else if (cmd == "ADD_WEIGHTED") {
            std::string id; int w; iss >> id >> w;
            std::cout << lb.add_backend(id, w) << "\\n";
        } else if (cmd == "LIST_BACKENDS") {
            std::cout << lb.list_backends() << "\\n";
        } else if (cmd == "ROUTE") {
            std::string req; iss >> req;
            std::cout << lb.route_rr(req) << "\\n";
        } else if (cmd == "ROUTE_WEIGHTED") {
            std::string req; iss >> req;
            std::cout << lb.route_weighted(req) << "\\n";
        } else if (cmd == "TRACK_START") {
            std::string sid, req; iss >> sid >> req;
            std::cout << lb.track_start(sid, req) << "\\n";
        } else if (cmd == "TRACK_END") {
            std::string sid, req; iss >> sid >> req;
            std::cout << lb.track_end(sid, req) << "\\n";
        } else if (cmd == "ROUTE_LEAST_CONN") {
            std::string req; iss >> req;
            std::cout << lb.route_least_conn(req) << "\\n";
        } else if (cmd == "ACTIVE_CONNS") {
            std::cout << lb.active_conns() << "\\n";
        } else if (cmd == "SET_FAIL_THRESHOLD") {
            int th; iss >> th;
            std::cout << lb.set_fail_threshold(th) << "\\n";
        } else if (cmd == "FAIL") {
            std::string sid; iss >> sid;
            std::cout << lb.record_fail(sid) << "\\n";
        } else if (cmd == "SUCCESS") {
            std::string sid; iss >> sid;
            std::cout << lb.record_success(sid) << "\\n";
        } else if (cmd == "ADD_RING_NODE") {
            std::string sid; int vn; iss >> sid >> vn;
            std::cout << lb.add_ring_node(sid, vn) << "\\n";
        } else if (cmd == "ROUTE_KEY") {
            std::string key; iss >> key;
            std::cout << lb.route_key(key) << "\\n";
        } else if (cmd == "DRAIN") {
            std::string sid; iss >> sid;
            std::cout << lb.drain(sid) << "\\n";
        } else if (cmd == "SERVER_STATUS") {
            std::string sid; iss >> sid;
            std::cout << lb.server_status(sid) << "\\n";
        }
    }
    return 0;
}
`,
  },
};
