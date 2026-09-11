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
      whatAreYouBuilding: `You are going to build a basic round-robin load balancer. Think of it as a receptionist at a doctor's office directing patients to available doctors by simply taking turns: Patient 1 goes to Doctor A, Patient 2 goes to Doctor B, Patient 3 goes to Doctor A.

For example:
ADD_BACKEND web-1
ADD_BACKEND web-2
ROUTE req-1

Your load balancer will select the next server in line and print:
FORWARD -> web-1`,
      howItWorks: `When a request arrives:
1. Check if there are any registered backend servers.
2. Pick the server at the current 'index'.
3. Increment the index by 1 so the next request goes to the next server.
4. If the index reaches the end of the server list, wrap it back around to 0.
5. Forward the request to the selected server.`,
      technicalTerms: [
        {
          "term": "Load Balancing",
          "definition": "Distributing incoming network traffic across multiple servers to ensure no single server bears too much demand."
        },
        {
          "term": "Round-Robin",
          "definition": "A simple algorithm that selects items in a cyclical sequence, taking turns one by one."
        },
        {
          "term": "Modulo Arithmetic",
          "definition": "Using the remainder of division (e.g., index % size) to keep a counter continuously wrapping around within a fixed range."
        }
],
      description: `Directing all users to a single server is a recipe for disaster; if that server crashes, the entire application goes offline. The foundational solution is the Round-Robin Load Balancer, which spreads the load horizontally across a pool of worker nodes.

While round-robin guarantees that every server receives an equal number of requests over time, it assumes all servers have the exact same hardware capacity and that all requests take the same amount of time to process—assumptions we will challenge in the coming levels.`,
      implementationGuide: [
        "Maintain a list (array) of registered backend server IDs and an integer tracking the current index.",
        "On 'ADD_BACKEND <server_id>', append the server to the list and print 'OK'.",
        "On 'LIST_BACKENDS', print 'BACKENDS ' followed by the server IDs joined by spaces.",
        "On 'ROUTE <req_id>', if the list is empty, print 'NO_BACKENDS'.",
        "Otherwise, select the server at current_index. Print 'FORWARD -> <server_id>'.",
        "Update current_index to (current_index + 1) % length of the server list."
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
      whatAreYouBuilding: `You are going to build a smooth weighted round-robin load balancer. Think of the receptionist directing patients again, but Doctor A is an experienced senior doctor (weight 4) and Doctor B is an intern (weight 1). The receptionist sends more patients to the senior doctor, but interleaves them smoothly so the senior doctor isn't overwhelmed with a giant burst all at once.

For example:
ADD_WEIGHTED doc-a 4
ADD_WEIGHTED doc-b 1
ROUTE_WEIGHTED req-1

Your load balancer will select based on weights and print:
FORWARD -> doc-a`,
      howItWorks: `When a request arrives:
1. For every server, add its 'effective weight' to its 'current weight'.
2. Look at all the servers and pick the one that now has the highest 'current weight'.
3. Take that winning server and subtract the total weight of ALL servers from its 'current weight'.
4. Forward the request to the winning server.
5. This exact mathematical process (used by Nginx) guarantees a perfectly smooth interleaved sequence.`,
      technicalTerms: [
        {
          "term": "Weighted Load Balancing",
          "definition": "Assigning a capacity score (weight) to servers so more powerful machines receive a proportionally higher amount of traffic."
        },
        {
          "term": "Smooth Interleaving",
          "definition": "Spreading out the requests mathematically so you don't send 10 in a row to Server A and then 1 to Server B."
        },
        {
          "term": "Total Weight",
          "definition": "The sum of the effective weights of all currently available servers."
        }
],
      description: `If you upgrade your database, you might have one massive 32-core server and one older 8-core server. Standard round-robin would crush the small server by giving it 50% of the traffic. 

Assigning weights solves this, but a naive implementation (A, A, A, A, B) creates sudden bursts of traffic that can temporarily overwhelm even a large server. Nginx's elegant 'current_weight' algorithm solves this by mathematically interleaving the distribution (A, A, B, A, A), ensuring traffic flows smoothly regardless of the weight ratios.`,
      implementationGuide: [
        "Maintain a list of server objects tracking {id, weight, current_weight}.",
        "On 'ADD_WEIGHTED', add the server with its given weight and initialize current_weight to 0. Print 'OK'.",
        "On 'ROUTE_WEIGHTED', if no servers exist, print 'NO_BACKENDS'.",
        "Loop through all servers and add their static weight to their current_weight.",
        "Find the server with the maximum current_weight. This is your selected server.",
        "Subtract the total sum of all servers' weights from the selected server's current_weight.",
        "Print 'FORWARD -> <selected_server_id>'."
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
      whatAreYouBuilding: `You are going to build a least-connections load balancer. Think of the receptionist looking into the waiting rooms. Doctor A has 5 patients waiting, Doctor B has 0. Even if Doctor A is usually faster, the receptionist will send the next patient to Doctor B because their room is empty.

For example:
ROUTE_LEAST_CONN r1

Your load balancer checks which server has the fewest active (in-flight) requests and prints:
FORWARD -> s2`,
      howItWorks: `When a request arrives:
1. Check the number of active requests currently being processed by each server.
2. Select the server with the absolute lowest number of active requests.
3. If there is a tie, break it by selecting the server whose ID comes first alphabetically.
4. Increment that server's active request count and forward the request.
5. When a request finishes, decrement the active count for that server so it can receive new requests again.`,
      technicalTerms: [
        {
          "term": "Least Connections",
          "definition": "A dynamic routing algorithm that sends traffic to the server currently handling the fewest active requests."
        },
        {
          "term": "In-Flight Request",
          "definition": "A request that has been sent to a backend server but has not yet finished or returned a response."
        },
        {
          "term": "Tie-Breaking",
          "definition": "A deterministic rule (like alphabetical order) used to pick a winner when multiple servers have the exact same score."
        }
],
      description: `Round-robin algorithms (even weighted ones) are 'static'—they don't know what's actually happening on the servers. If a specific API request requires compiling a heavy report that takes 10 seconds, the server handling it will get bogged down, but round-robin will blindly keep sending it more traffic.

The Least-Connections algorithm is 'dynamic'. By tracking exactly how many requests are currently in-flight on each node, it acts as a self-healing system: if a server slows down, its active connection count rises, and the load balancer automatically routes traffic to faster, idle nodes instead.`,
      implementationGuide: [
        "Maintain a list of server objects tracking {id, active_conns}.",
        "On 'ROUTE_LEAST_CONN', find the server with the lowest active_conns. On a tie, choose the one with the alphabetically smallest id.",
        "Increment the selected server's active_conns by 1 and print 'FORWARD -> <server_id>'.",
        "On 'TRACK_START <server_id> <req_id>', simply increment that server's active_conns by 1 and print 'OK'.",
        "On 'TRACK_END <server_id> <req_id>', decrement that server's active_conns by 1 (don't let it go below 0) and print 'OK'.",
        "On 'ACTIVE_CONNS', print 'CONNS ' followed by 'id:count' for all servers in alphabetical order."
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
      whatAreYouBuilding: `You are going to build a circuit breaker for your load balancer. Think of the receptionist noticing that Doctor A went home sick (the server crashed). The receptionist will immediately stop sending patients to Doctor A, but will occasionally check if they have returned (probing).

For example:
FAIL s1

When a server fails too many times, the load balancer marks it as DOWN and routes traffic elsewhere:
STATUS s1 DOWN
FORWARD -> s2`,
      howItWorks: `When a request fails on a server:
1. Increment that server's consecutive failure counter.
2. If the counter reaches the threshold, mark the server's status as DOWN.
3. Exclude all DOWN servers from any routing decisions (round-robin, weighted, least-conn).

When a request succeeds on a server:
1. Reset the server's failure counter to 0.
2. Mark the server's status as UP, bringing it back into the active rotation pool.`,
      technicalTerms: [
        {
          "term": "Passive Health Check",
          "definition": "Monitoring real user traffic for errors to determine server health, rather than sending separate ping requests."
        },
        {
          "term": "Circuit Breaker",
          "definition": "A pattern that temporarily halts traffic to a failing system to prevent cascading failures and allow it to recover."
        },
        {
          "term": "Failover",
          "definition": "Automatically switching traffic from a failed component to a working backup component."
        }
],
      description: `In distributed systems, hardware fails constantly. If your load balancer keeps sending 25% of your users to a dead server, 25% of your users will see 502 Bad Gateway errors. 

A Circuit Breaker monitors the success and failure of real traffic. When a node crosses a consecutive failure threshold, the breaker 'trips', marking the node as DOWN and instantly removing it from the routing pool. This ensures user traffic is only sent to healthy nodes while the dead node is investigated or rebooted.`,
      implementationGuide: [
        "Extend the server object to track {status: 'UP', failures: 0}.",
        "On 'SET_FAIL_THRESHOLD <count>', store the global threshold and print 'OK'.",
        "On 'FAIL <server_id>', increment its failures. If failures >= threshold, set status to 'DOWN'. Print 'STATUS <server_id> <UP|DOWN>'.",
        "On 'SUCCESS <server_id>', reset failures to 0, set status to 'UP', and print 'STATUS <server_id> UP'.",
        "Update ALL routing commands (ROUTE, ROUTE_WEIGHTED, ROUTE_LEAST_CONN) to strictly filter out any servers where status is 'DOWN'.",
        "If filtering leaves zero eligible servers, print 'NO_BACKENDS'."
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
      whatAreYouBuilding: `You are going to build a consistent hashing ring. Think of a scenario where patients want to see the same doctor every time for continuity of care. You mathematically map the patient's ID to a specific doctor on a 'ring', so they always get the same one.

For example:
ROUTE_KEY user:100

Your load balancer hashes the key and finds the nearest server on the ring:
HASH_FORWARD -> cache-1`,
      howItWorks: `When a server is added:
1. Create multiple 'virtual nodes' for it (e.g., c1#0, c1#1, c1#2).
2. Hash the name of each virtual node to get a 32-bit number.
3. Place these numbers on a sorted ring.

When a request arrives:
1. Hash the cache key (e.g., 'user:100') to get a 32-bit number.
2. Search clockwise around the ring for the first virtual node that has a hash greater than or equal to the key's hash.
3. Route the request to the server that owns that virtual node.`,
      technicalTerms: [
        {
          "term": "Consistent Hashing",
          "definition": "A distribution scheme that minimizes the number of keys that must be remapped when a server is added or removed."
        },
        {
          "term": "Hash Ring",
          "definition": "A circular numerical space (e.g., 0 to 2^32-1) where both servers and data keys are assigned positions."
        },
        {
          "term": "Virtual Node",
          "definition": "Assigning multiple positions on the ring to a single physical server to ensure more even data distribution."
        }
],
      description: `When routing traffic to a caching layer (like Memcached or Redis), round-robin is terrible because it scatters requests for the same user across all servers, leading to zero cache hits. You need 'session affinity'—always sending the same key to the same server.

Standard modulo hashing ('hash(key) % N') works until a server crashes, changing N and shuffling 99% of your keys to different servers, causing a massive cache miss storm. Consistent hashing solves this by placing servers on a circular ring. When a node dies, only its specific slice of the ring is remapped to the next neighbor, keeping the rest of the cluster's cache perfectly intact.`,
      implementationGuide: [
        "Maintain a sorted array (the ring) of objects tracking {hash_value, server_id}.",
        "On 'ADD_RING_NODE <id> <vnodes>', loop i from 0 to vnodes-1. Hash the string '<id>#<i>' using the 32-bit FNV-1a algorithm.",
        "Insert these virtual node hashes into the sorted ring array and print 'OK'.",
        "On 'ROUTE_KEY <key>', if the ring is empty, print 'NO_BACKENDS'.",
        "Otherwise, hash the key using FNV-1a. Find the first virtual node in the sorted ring where node.hash >= key.hash (clockwise search).",
        "If no node hash is greater, wrap around and pick the first node in the array (index 0). Print 'HASH_FORWARD -> <server_id>'."
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
      whatAreYouBuilding: `You are going to build a graceful connection drainer. Think of the receptionist telling Doctor A to go home, but letting them finish with their current patient first. The receptionist stops sending new patients, but waits for the room to empty before officially clocking the doctor out.

For example:
DRAIN s1

Your load balancer stops routing to s1 but keeps tracking its active requests until they hit zero:
DRAINING s1 ACTIVE 1
STATE REMOVED ACTIVE 0`,
      howItWorks: `When a drain is requested:
1. Change the server's status to DRAINING.
2. Immediately exclude it from all new routing decisions.
3. Wait and monitor as its active in-flight requests slowly complete and decrement.
4. Once the active request count reaches 0, officially transition the server to REMOVED.
5. If the server already had 0 active requests when the drain started, mark it REMOVED instantly.`,
      technicalTerms: [
        {
          "term": "Connection Draining",
          "definition": "The process of refusing new connections to a server while allowing existing, in-flight connections to complete naturally."
        },
        {
          "term": "Graceful Shutdown",
          "definition": "Terminating a software process safely without instantly severing active user transactions."
        },
        {
          "term": "Rolling Deployment",
          "definition": "Updating a cluster of servers one by one, draining and replacing them sequentially to avoid downtime."
        }
],
      description: `When you need to deploy a new version of your application, you cannot just kill the running servers—any users mid-checkout will see a broken error page. 

Connection draining (or graceful shutdown) solves this. The load balancer marks the node as DRAINING, cutting off new traffic, but keeps the connection open for existing requests to finish processing. Once the node's active connection count naturally hits zero, it is safe to terminate. This enables true zero-downtime rolling deployments in production.`,
      implementationGuide: [
        "Extend your server status tracking to include 'DRAINING' and 'REMOVED'.",
        "On 'DRAIN <server_id>', check its active_conns. If active_conns > 0, set status to 'DRAINING' and print 'DRAINING <server_id> ACTIVE <conns>'.",
        "If active_conns == 0, set status to 'REMOVED' and print 'REMOVED <server_id>'.",
        "Update 'TRACK_END' logic: if a server is in 'DRAINING' status and its active_conns reaches 0 after the decrement, automatically change its status to 'REMOVED'.",
        "Ensure your routing logic from all previous levels strictly ignores servers that are 'DRAINING' or 'REMOVED'.",
        "On 'SERVER_STATUS <server_id>', print 'STATE <status> ACTIVE <conns>' or 'NOT_FOUND'."
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
