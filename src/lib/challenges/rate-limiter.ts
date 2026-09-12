// src/lib/challenges/rate-limiter.ts
import { ChallengeData } from "./types";

export const rateLimiterChallenge: ChallengeData = {
  slug: "rate-limiter",
  number: "11",
  title: "Concurrent Rate Limiter & Traffic Shaper",
  subtitle: "From fixed windows and sliding token buckets to atomic CAS rate enforcement and distributed sync extensions.",
  badge: "SYSTEM DESIGN CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "Envoy, Cloudflare-style gateways",
  whatStudentsBuild: "Concurrent rate limiter & traffic shaper",
  mainSkill: "Algorithms, time, concurrency",
  signatureQuestion: "Can you enforce the limit without becoming the bottleneck?",
  overview:
    "In this engineering challenge, you construct a high-performance concurrent rate limiter and traffic shaper from first principles — inspired by traffic-control systems in Envoy and Cloudflare-style API gateways. You build raw fixed-window epoch counters, memory-efficient sliding-window logs, continuous-refill token buckets, leaky bucket queue shapers, lockless atomic CAS state updates, and distributed sync extensions.",
  whyItMatters:
    "Rate limiters protect infrastructure from denial-of-service attacks, bad bots, and cascading database failure. A flawed rate limiter either throttles legitimate paying enterprise customers during peak events or fails to protect backend services from thundering herds.",
  finalOutcome:
    "Upon completing all 6 levels, you have engineered a production-grade rate limiting engine supporting fixed and sliding window algorithms, high-burst token buckets, smooth traffic shaping, multi-tenant tiers, and atomic CAS safety.",
  philosophy: "Encounter real traffic shaping problems: boundary burst spikes, continuous lazy token refill, lockless atomic CAS synchronization, and multi-tenant quota tiers.",
  architectureDiagram: `                  INCOMING HTTP REQUEST
                            │
               ┌────────────┴────────────┐
               │  Identity Key (IP/User) │
               └────────────┬────────────┘
                            │
                     Refill Clock
                            │
                  ┌─────────▼─────────┐
                  │   Token Bucket    │
                  │ [ • • • • • ]     │ Max: Burst
                  └─────────┬─────────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
       Tokens Available             Bucket Empty
             │                             │
        200 ALLOW                    429 RATE_LIMITED`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Fixed-window epoch rate limiter", mainConcept: "Epoch-based time bucketing, monotonic counter increments, retry-after calculation" },
    { level: 2, whatWeBuild: "Sliding-window timestamp log", mainConcept: "Microsecond timestamp deque, sliding window eviction, eliminating 2x boundary spikes" },
    { level: 3, whatWeBuild: "Continuous-refill token bucket", mainConcept: "Lazy token refill based on delta time, sustained rate limit with burst buffer" },
    { level: 4, whatWeBuild: "Leaky bucket traffic shaper", mainConcept: "Bounded FIFO queue buffering, constant outbound discharge frequency" },
    { level: 5, whatWeBuild: "Multi-tenant tiered quotas", mainConcept: "Customer tier resolution (Free/Pro/Enterprise), dynamic capacity limits and burst multipliers" },
    { level: 6, whatWeBuild: "Atomic CAS concurrency engine", mainConcept: "Lock-free compare-and-swap simulations, race condition elimination under high parallelism" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Fixed-Window Counter",
      focus: "Epoch-Based Time Bucketing",
      description: "Segments time into discrete interval buckets, incrementing counters and rejecting requests that exceed threshold.",
      realWorldTech: "Redis INCR + EXPIRE fixed window pattern",
    },
    {
      number: 2,
      name: "Sliding Window Log",
      focus: "Microsecond Timestamp Deque",
      description: "Records precise request timestamps in a sorted deque to eliminate the 2x burst boundary vulnerability of fixed windows.",
      realWorldTech: "Cloudflare sliding window log, Redis ZADD/ZREMRANGEBYSCORE",
    },
    {
      number: 3,
      name: "Token Bucket Algorithm",
      focus: "Continuous Rate Refill & Burst Buffer",
      description: "Refills tokens lazily based on elapsed delta time, allowing burst traffic while enforcing sustained average throughput.",
      realWorldTech: "Stripe API rate limiter, AWS API Gateway token bucket",
    },
    {
      number: 4,
      name: "Leaky Bucket Traffic Shaper",
      focus: "Constant Outbound Dispatch Rate",
      description: "Buffers inbound request spikes in a bounded FIFO queue and discharges them at a smooth, constant frequency.",
      realWorldTech: "Nginx limit_req zone, Linux tc queuing disciplines",
    },
    {
      number: 5,
      name: "Multi-Tenant Tiered Quotas",
      focus: "Dynamic Tier SLA Enforcement",
      description: "Maps API keys to customer tiers (Free, Pro, Enterprise) with dynamic quotas, burst allowances, and priority bypass.",
      realWorldTech: "GitHub REST API rate limiting (5,000/hr auth vs 60/hr unauth)",
    },
    {
      number: 6,
      name: "Atomic CAS & Concurrency Engine",
      focus: "Lock-Free Race Condition Elimination",
      description: "Simulates atomic compare-and-swap operations to prevent limit overshoots under concurrent distributed traffic.",
      realWorldTech: "Redis Lua evalsha atomic scripts, Envoy global rate limiter (gRPC)",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Fixed Window Counter",
      title: "Fixed-Window Epoch Rate Limiter",
      difficulty: "Easy",
      tagline: "Track request counts per fixed time window. Allow requests under capacity and reject those exceeding the threshold.",
      whatAreYouBuilding: `You are going to build a fixed-window rate limiter. Think of it as a nightclub bouncer who only lets 10 people in every minute. When the minute is up, the count starts fresh.

For example:
CONFIG 2 10
REQUEST alice 1000

Your rate limiter should check if Alice has exceeded the limit of 2 requests in the current 10-second window and print:
ALLOWED 1`,
      howItWorks: `When a request arrives:
1. Determine the current "epoch" or time window by dividing the timestamp by the window size.
2. If this is a new window, reset the client's request counter to 0.
3. Check if the counter is below the limit.
4. If it is, increment the counter and allow the request.
5. If it is not, reject the request and calculate exactly when the next window starts so the client knows when to retry.`,
      technicalTerms: [
        {
          "term": "Fixed Window",
          "definition": "A set period of time (like 10 seconds) during which requests are counted."
        },
        {
          "term": "Epoch",
          "definition": "A discrete block of time calculated by dividing the current timestamp by the window size."
        },
        {
          "term": "Retry After",
          "definition": "The exact number of milliseconds a client must wait until the next time window begins."
        }
],
      description: `Every API needs protection from being overwhelmed by too many requests. In Level 1, you build the simplest rate limiting algorithm: the fixed window. It divides time into rigid blocks (like 0-10 seconds, 10-20 seconds) and maintains a counter for each client.

This approach is extremely memory efficient because you only need to store a single integer (the count) and a timestamp (the current epoch) per user. However, as we will see in the next level, it has a fatal flaw at the boundaries of the windows.`,
      implementationGuide: [
        "Initialize a dictionary to map each client ID to their current epoch and request count.",
        "On 'CONFIG <limit> <window_sec>', save the global limit and window size (converted to milliseconds).",
        "On 'REQUEST <client_id> <timestamp_ms>', calculate the epoch using floor(timestamp / window).",
        "If the epoch is newer than the saved epoch for the client, reset their counter.",
        "If the counter is below the limit, increment it and print 'ALLOWED <remaining>'.",
        "If the counter is at the limit, calculate the start time of the next epoch and print 'REJECTED <retry_after_ms>'."
],
      diagram: `FIXED WINDOW RATE LIMITER (Case 1):
CONFIG 3 5             ──► 3 requests allowed per 5 second window ──► OK
REQUEST alice 1000     ──► Window [0..5000ms]: count 1/3 (rem: 2)  ──► ALLOWED 2
REQUEST alice 2000     ──► Window [0..5000ms]: count 2/3 (rem: 1)  ──► ALLOWED 1
REQUEST alice 3000     ──► Window [0..5000ms]: count 3/3 (rem: 0)  ──► ALLOWED 0`,
      importantChallenge: {
        title: "Window Edge Boundary Spikes",
        description:
          "Fixed windows count requests within discrete time slices (e.g., [0s, 10s]). If a client sends their full quota at 9.9s and another quota at 10.1s, they successfully deliver 2x their rate limit in 0.2 seconds without triggering rejection. This boundary vulnerability is why sliding logs and token buckets are used in production.",
        codeOrFormat: "epoch = floor(timestamp_ms / (window_sec * 1000))\nretry_after = ((epoch + 1) * window_sec * 1000) - timestamp_ms",
      },
      endGoalDemonstration: `CONFIG 2 10
OK
REQUEST alice 1000
ALLOWED 1
REQUEST alice 2000
ALLOWED 0
REQUEST alice 3000
REJECTED 7000
REQUEST alice 10500
ALLOWED 1`,
      nextLevelTeaser:
        "In Level 2, we introduce Sliding Window Logs using timestamp queues to eradicate the 2x burst vulnerability at interval boundaries.",
      learningLoop: {
        bottleneck: "Unbounded API requests can take down application servers. Fixed windows partition time into predictable intervals.",
        whatYouUnderstand: [
          "Computing window epoch = floor(timestamp_ms / (window_sec * 1000)).",
          "Resetting counter when client enters a new epoch.",
          "Calculating precise retry_after_ms to inform throttled clients.",
        ],
        productionParity: "The classic Redis INCR with TTL fixed-window limiter.",
        outcomeSummary: "You implement epoch-based time partitioning and deterministic quota enforcement.",
      },
      operations: [
        { cmd: "CONFIG <limit> <window_sec>", desc: "Sets global limit and window in seconds. Returns 'OK'." },
        { cmd: "REQUEST <client_id> <timestamp_ms>", desc: "Evaluates request. Returns 'ALLOWED <remaining>' or 'REJECTED <retry_after_ms>'." },
        { cmd: "RESET <client_id>", desc: "Resets client's counter. Returns 'OK'." },
      ],
      examples: [
        {
          title: "Under Limit Requests Allowed",
          input: "CONFIG 3 5\nREQUEST alice 1000\nREQUEST alice 2000\nREQUEST alice 3000",
          output: "OK\nALLOWED 2\nALLOWED 1\nALLOWED 0",
        },
      ],
      constraints: ["window_sec is positive integer", "timestamp_ms is positive integer millisecond"],
      cases: [
        {
          name: "Case 1: Under Limit Requests Allowed",
          input: "CONFIG 3 5\nREQUEST alice 1000\nREQUEST alice 2000\nREQUEST alice 3000",
          expected: "OK\nALLOWED 2\nALLOWED 1\nALLOWED 0",
        },
        {
          name: "Case 2: Exceeding Limit Rejected with Retry Time",
          input: "CONFIG 2 5\nREQUEST bob 1000\nREQUEST bob 2000\nREQUEST bob 3000",
          expected: "OK\nALLOWED 1\nALLOWED 0\nREJECTED 2000",
        },
        {
          name: "Case 3: Epoch Reset Allows New Requests",
          input: "CONFIG 1 2\nREQUEST c1 500\nREQUEST c1 1500\nREQUEST c1 2100",
          expected: "OK\nALLOWED 0\nREJECTED 500\nALLOWED 0",
        },
        {
          name: "Case 4: Independent Client Counters",
          input: "CONFIG 1 5\nREQUEST client-a 1000\nREQUEST client-b 1000\nREQUEST client-a 2000",
          expected: "OK\nALLOWED 0\nALLOWED 0\nREJECTED 3000",
        },
        {
          name: "Case 5: Manual Client Reset",
          input: "CONFIG 1 10\nREQUEST c1 1000\nREQUEST c1 2000\nRESET c1\nREQUEST c1 3000",
          expected: "OK\nALLOWED 0\nREJECTED 8000\nOK\nALLOWED 0",
        },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Sliding Window Log",
      title: "Sliding Window Timestamp Log",
      difficulty: "Medium",
      tagline: "Prevent 2x edge bursts. Store timestamps in a sliding window log and evict timestamps outside the active window.",
      whatAreYouBuilding: `You are going to build a sliding window rate limiter. Think of it as a bouncer who uses a rolling 60-second count. Instead of resetting at the top of the minute, they look at exactly the last 60 seconds from right now.

For example:
REQUEST_SLIDING c1 5500

Your rate limiter will look at all requests from c1 between 500ms and 5500ms. If the count exceeds the limit, it prints:
REJECTED 3500`,
      howItWorks: `When a request arrives:
1. Look up the list of timestamps for previous requests from this client.
2. Remove any timestamps that are older than the current timestamp minus the window size (they have "slid" out of the window).
3. Count the remaining timestamps.
4. If the count is below the limit, add the new timestamp and allow the request.
5. If the count is at the limit, reject the request. The client must wait until the oldest timestamp in the window slides out.`,
      technicalTerms: [
        {
          "term": "Sliding Window",
          "definition": "A continuously moving time frame that looks backwards from the exact moment a request arrives."
        },
        {
          "term": "Timestamp Deque",
          "definition": "A double-ended queue used to efficiently store and remove request timestamps."
        },
        {
          "term": "Eviction",
          "definition": "The process of removing old request timestamps that fall outside the active window."
        }
],
      description: `Fixed windows have a 'boundary spike' vulnerability. If a user sends their full quota at 9.9 seconds, the window resets at 10.0 seconds, allowing them to send another full quota at 10.1 seconds—doubling their allowed rate in a fraction of a second.

The sliding window log fixes this by keeping a precise record of every request timestamp. By dynamically evicting timestamps older than the rolling window, it perfectly enforces the rate limit at all times. The trade-off is higher memory usage, as you must store a list of timestamps per user.`,
      implementationGuide: [
        "Use a dictionary mapping each client ID to an array (or deque) of request timestamps.",
        "On 'REQUEST_SLIDING <client_id> <timestamp_ms>', find the client's timestamp array.",
        "Filter the array to remove any timestamps less than or equal to (timestamp_ms - window_ms).",
        "If the array length is less than the limit, append the new timestamp and print 'ALLOWED <remaining>'.",
        "If the array is full, do not append. Calculate retry_after as (oldest_timestamp + window_ms - current_timestamp) and print 'REJECTED <retry_after>'."
],
      diagram: `SLIDING LOG ALGORITHM (Case 1):
CONFIG_SLIDING 2 5           ──► Max 2 requests per sliding 5s window ──► OK
REQUEST_SLIDING c1 4000      ──► Timestamps in window: [4000] (rem: 1)──► ALLOWED 1
REQUEST_SLIDING c1 4500      ──► Timestamps: [4000, 4500] (rem: 0)   ──► ALLOWED 0
REQUEST_SLIDING c1 5500      ──► Window [500..5500]: [4000, 4500] full!──► REJECTED 3500`,
      learningLoop: {
        bottleneck: "Fixed windows suffer from boundary spikes: sending the full quota at 00:09 and another at 00:10 yields 2x throughput in 1 second.",
        whatYouUnderstand: [
          "Sliding window: Rolling interval [timestamp - window_ms, timestamp].",
          "Evicting timestamps older than the sliding threshold.",
          "Computing accurate retry_after based on the earliest timestamp in the log.",
        ],
        productionParity: "Redis ZSET sliding log used by Cloudflare and Datadog.",
        outcomeSummary: "You eliminate burst edge vulnerabilities using sliding window logs.",
      },
      operations: [
        { cmd: "CONFIG_SLIDING <limit> <window_sec>", desc: "Configures sliding window log. Returns 'OK'." },
        { cmd: "REQUEST_SLIDING <client_id> <timestamp_ms>", desc: "Evaluates request using sliding window. Returns 'ALLOWED <remaining>' or 'REJECTED <retry_after_ms>'." },
      ],
      examples: [
        {
          title: "Sliding Window Rejects Boundary Spike",
          input: "CONFIG_SLIDING 2 5\nREQUEST_SLIDING c1 4000\nREQUEST_SLIDING c1 4500\nREQUEST_SLIDING c1 5500",
          output: "OK\nALLOWED 1\nALLOWED 0\nREJECTED 3500",
        },
      ],
      constraints: ["Timestamps within a client are monotonically non-decreasing"],
      cases: [
        {
          name: "Case 1: Sliding Window Rejects Boundary Spike",
          input: "CONFIG_SLIDING 2 5\nREQUEST_SLIDING c1 4000\nREQUEST_SLIDING c1 4500\nREQUEST_SLIDING c1 5500",
          expected: "OK\nALLOWED 1\nALLOWED 0\nREJECTED 3500",
        },
        {
          name: "Case 2: Old Requests Slide Out",
          input: "CONFIG_SLIDING 2 5\nREQUEST_SLIDING c1 1000\nREQUEST_SLIDING c1 2000\nREQUEST_SLIDING c1 6500",
          expected: "OK\nALLOWED 1\nALLOWED 0\nALLOWED 0",
        },
        {
          name: "Case 3: Successive Slides",
          input: "CONFIG_SLIDING 2 2\nREQUEST_SLIDING c1 1000\nREQUEST_SLIDING c1 1500\nREQUEST_SLIDING c1 3100\nREQUEST_SLIDING c1 3600",
          expected: "OK\nALLOWED 1\nALLOWED 0\nALLOWED 0\nALLOWED 0",
        },
        {
          name: "Case 4: Multi Client Sliding Isolation",
          input: "CONFIG_SLIDING 1 5\nREQUEST_SLIDING u1 1000\nREQUEST_SLIDING u2 1000\nREQUEST_SLIDING u1 2000\nREQUEST_SLIDING u2 6500",
          expected: "OK\nALLOWED 0\nALLOWED 0\nREJECTED 4000\nALLOWED 0",
        },
        {
          name: "Case 5: Exact Boundary Timestamp",
          input: "CONFIG_SLIDING 1 5\nREQUEST_SLIDING c1 1000\nREQUEST_SLIDING c1 6000",
          expected: "OK\nALLOWED 0\nALLOWED 0",
        },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Token Bucket Engine",
      title: "Continuous Refill Token Bucket",
      difficulty: "Medium",
      tagline: "Refill tokens lazily based on elapsed time. Allow short bursts up to bucket capacity while enforcing average rate.",
      whatAreYouBuilding: `You are going to build a token bucket rate limiter. Think of it like arcade tokens that refill over time. You can spend them all at once (a burst) but then you have to wait for them to slowly refill.

For example:
ACQUIRE c1 3 1000

Your rate limiter checks if the bucket has at least 3 tokens. If it does, it removes them and prints:
ALLOWED 2`,
      howItWorks: `When a request arrives:
1. Calculate how much time has passed since the client last acquired tokens.
2. Refill the bucket based on that elapsed time and the refill rate, capping it at the maximum capacity.
3. Check if the bucket has enough tokens to satisfy the requested amount.
4. If it does, subtract the tokens and allow the request.
5. If it does not, reject the request without deducting any tokens.`,
      technicalTerms: [
        {
          "term": "Token Bucket",
          "definition": "An algorithm that allows traffic bursts up to a maximum capacity while enforcing a steady long-term rate."
        },
        {
          "term": "Lazy Refill",
          "definition": "Calculating and adding new tokens only at the exact moment a request arrives, rather than using a continuous background timer."
        },
        {
          "term": "Burst Capability",
          "definition": "The ability to process a sudden spike of requests all at once, limited by the bucket's total capacity."
        }
],
      description: `Sliding windows use too much memory for high-volume systems because they store every single request timestamp. Token buckets solve this by only tracking two numbers per user: the current token count and the last refill timestamp.

By refilling tokens lazily (calculating the refill only when a new request arrives based on elapsed time), the token bucket is incredibly fast and memory-efficient. It also allows for 'bursts'—a user who hasn't made requests in a while can spend their accumulated tokens all at once, which is great for modern web applications.`,
      implementationGuide: [
        "Store the capacity and refill_rate from 'CONFIG_BUCKET'.",
        "Initialize a dictionary mapping client IDs to an object tracking {tokens, last_refill_ms}.",
        "On 'ACQUIRE', first calculate elapsed seconds since last_refill_ms: (current_time - last_time) / 1000.",
        "Refill tokens: current_tokens = min(capacity, current_tokens + (elapsed * refill_rate)). Update last_refill_ms to the current time.",
        "If current_tokens >= requested_tokens, subtract them and print 'ALLOWED <floor(remaining)>'.",
        "If not, leave the token count untouched and print 'REJECTED'."
],
      diagram: `TOKEN BUCKET REFILL PIPELINE (Case 1):
CONFIG_BUCKET c1 10 2  ──► Capacity: 10, Refill Rate: 2 tokens/sec ──► OK
ACQUIRE c1 10 1000     ──► Consumes all 10 tokens (0 remain)        ──► ALLOWED 0
ACQUIRE c1 1 1000      ──► Bucket empty! (0 tokens available)       ──► REJECTED`,
      learningLoop: {
        bottleneck: "Sliding window logs consume O(N) memory per client. Token buckets track only two scalar numbers: tokens available and last refill time.",
        whatYouUnderstand: [
          "Lazy refill: tokens = min(capacity, current_tokens + elapsed_sec * rate).",
          "Deducting acquired tokens atomically.",
          "Burst capability: allowing spikes up to capacity when bucket is full.",
        ],
        productionParity: "Stripe and AWS API Gateway token bucket implementation.",
        outcomeSummary: "You implement the most memory-efficient and burst-tolerant rate limiter in systems engineering.",
      },
      operations: [
        { cmd: "CONFIG_BUCKET <client_id> <capacity> <refill_rate_per_sec>", desc: "Initializes token bucket (starts full). Returns 'OK'." },
        { cmd: "ACQUIRE <client_id> <tokens> <timestamp_ms>", desc: "Attempts to consume tokens. Returns 'ALLOWED <tokens_remaining>' or 'REJECTED'." },
      ],
      examples: [
        {
          title: "Full Capacity Burst",
          input: "CONFIG_BUCKET c1 10 2\nACQUIRE c1 10 1000\nACQUIRE c1 1 1000",
          output: "OK\nALLOWED 0\nREJECTED",
        },
      ],
      constraints: ["Capacity and refill rate are positive integers", "Tokens remaining printed as integer floor"],
      cases: [
        {
          name: "Case 1: Full Capacity Burst",
          input: "CONFIG_BUCKET c1 10 2\nACQUIRE c1 10 1000\nACQUIRE c1 1 1000",
          expected: "OK\nALLOWED 0\nREJECTED",
        },
        {
          name: "Case 2: Linear Refill Over Time",
          input: "CONFIG_BUCKET c1 5 2\nACQUIRE c1 5 1000\nACQUIRE c1 2 2000",
          expected: "OK\nALLOWED 0\nALLOWED 0",
        },
        {
          name: "Case 3: Refill Capped at Capacity",
          input: "CONFIG_BUCKET c1 3 1\nACQUIRE c1 1 1000\nACQUIRE c1 3 10000",
          expected: "OK\nALLOWED 2\nALLOWED 0",
        },
        {
          name: "Case 4: Multi-Token Spend",
          input: "CONFIG_BUCKET c1 10 1\nACQUIRE c1 4 1000\nACQUIRE c1 4 1000\nACQUIRE c1 4 1000",
          expected: "OK\nALLOWED 6\nALLOWED 2\nREJECTED",
        },
        {
          name: "Case 5: Unconfigured Client Rejected",
          input: "ACQUIRE unknown 1 1000",
          expected: "REJECTED",
        },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Traffic Shaper (Leaky Bucket)",
      title: "Smooth Outbound Traffic Shaping",
      difficulty: "Medium",
      tagline: "Smooth bursty inbound spikes into a constant outbound flow. Buffer requests up to queue capacity and drop overflows.",
      whatAreYouBuilding: `You are going to build a leaky bucket traffic shaper. Think of it as a funnel. Water (requests) can pour in at any speed, but it drips out the bottom at a steady, constant rate. If the funnel fills up, water spills over (requests drop).

For example:
ENQUEUE r1 1000

Your rate limiter adds the request to the funnel. Later, when you process the queue:
LEAK 2000
It prints the requests that steadily dripped out:
PROCESSED r1`,
      howItWorks: `When a request is enqueued:
1. Check if the queue buffer is full. If it is, immediately drop the request.
2. If there's space, add the request to the back of the queue.

When a leak is triggered:
1. Calculate how much time has passed since the last leak.
2. Determine how many requests should have 'dripped' out based on the leak rate.
3. Remove that many requests from the front of the queue and process them.`,
      technicalTerms: [
        {
          "term": "Traffic Shaping",
          "definition": "Controlling the exact outbound flow rate of requests to protect downstream services from spikes."
        },
        {
          "term": "Leaky Bucket",
          "definition": "An algorithm that queues bursty inbound traffic and dispatches it at a strict, constant frequency."
        },
        {
          "term": "FIFO Queue",
          "definition": "A First-In-First-Out buffer where requests wait their turn to be processed."
        }
],
      description: `While token buckets protect your API from individual users, they still allow 'bursts' that can overwhelm backend databases if many users burst simultaneously. 

The leaky bucket (or traffic shaper) solves this by acting as a shock absorber. It queues inbound spikes in a bounded buffer and trickles them out to the backend at a perfectly constant, safe rate. This guarantees that your downstream services never receive more traffic than they can handle.`,
      implementationGuide: [
        "Maintain a global FIFO queue (array) for incoming request IDs and track the last_leak_ms.",
        "On 'ENQUEUE', if the queue length equals capacity, print 'DROPPED'. Otherwise, push the request and print 'QUEUED <len>'.",
        "On 'LEAK', calculate elapsed seconds since last_leak_ms.",
        "Calculate num_to_leak = floor(elapsed_seconds * leak_rate).",
        "Shift up to num_to_leak items from the front of the queue. Update last_leak_ms by advancing it exactly by (num_to_leak / leak_rate) seconds.",
        "Print 'PROCESSED <ids...>' or 'IDLE' if nothing was leaked."
],
      diagram: `LEAKY BUCKET BUFFERING (Case 1):
CONFIG_LEAKY 3 1       ──► Queue size: 3, Leak rate: 1 req/sec ──► OK
ENQUEUE r1 1000        ──► Enqueues r1 (queue len: 1)          ──► QUEUED 1
ENQUEUE r2 1000        ──► Enqueues r2 (queue len: 2)          ──► QUEUED 2
ENQUEUE r3 1000        ──► Enqueues r3 (queue len: 3)          ──► QUEUED 3
ENQUEUE r4 1000        ──► Queue full! Dropped                 ──► DROPPED
LEAK 2000              ──► Leaks 1 request from queue          ──► PROCESSED r1`,
      learningLoop: {
        bottleneck: "Token buckets permit burst spikes to hit downstream services. Leaky buckets shape traffic into an exact, steady dispatch frequency.",
        whatYouUnderstand: [
          "Queuing inbound requests in a bounded buffer.",
          "Leaking items at a constant rate = elapsed_sec * leak_rate.",
          "Dropping requests immediately when buffer exceeds maximum capacity.",
        ],
        productionParity: "Nginx limit_req nodelay/burst traffic shaper.",
        outcomeSummary: "You implement traffic smoothing and buffer overflow protection.",
      },
      operations: [
        { cmd: "CONFIG_LEAKY <capacity> <leak_rate_per_sec>", desc: "Sets leaky queue capacity and leak rate. Returns 'OK'." },
        { cmd: "ENQUEUE <request_id> <timestamp_ms>", desc: "Enqueues request. Returns 'QUEUED <queue_len>' or 'DROPPED'." },
        { cmd: "LEAK <timestamp_ms>", desc: "Drains processed requests up to timestamp. Returns 'PROCESSED <ids...>' or 'IDLE'." },
      ],
      examples: [
        {
          title: "Buffer and Leak Steady Rate",
          input: "CONFIG_LEAKY 3 1\nENQUEUE r1 1000\nENQUEUE r2 1000\nENQUEUE r3 1000\nENQUEUE r4 1000\nLEAK 2000",
          output: "OK\nQUEUED 1\nQUEUED 2\nQUEUED 3\nDROPPED\nPROCESSED r1",
        },
      ],
      constraints: ["Capacity is maximum items that can wait in queue", "If the queue is empty and last_leak_ms is 0, initialize last_leak_ms to the timestamp of the first ENQUEUE or LEAK."],
      cases: [
        {
          name: "Case 1: Buffer and Leak Steady Rate",
          input: "CONFIG_LEAKY 3 1\nENQUEUE r1 1000\nENQUEUE r2 1000\nENQUEUE r3 1000\nENQUEUE r4 1000\nLEAK 2000",
          expected: "OK\nQUEUED 1\nQUEUED 2\nQUEUED 3\nDROPPED\nPROCESSED r1",
        },
        {
          name: "Case 2: Complete Drain Over Time",
          input: "CONFIG_LEAKY 5 2\nENQUEUE a 1000\nENQUEUE b 1000\nLEAK 2000",
          expected: "OK\nQUEUED 1\nQUEUED 2\nPROCESSED a b",
        },
        {
          name: "Case 3: Idle Drain",
          input: "CONFIG_LEAKY 5 1\nLEAK 1000",
          expected: "OK\nIDLE",
        },
        {
          name: "Case 4: Refilling Dropped Capacity After Drain",
          input: "CONFIG_LEAKY 1 1\nENQUEUE r1 1000\nENQUEUE r2 1000\nLEAK 2000\nENQUEUE r3 2000",
          expected: "OK\nQUEUED 1\nDROPPED\nPROCESSED r1\nQUEUED 1",
        },
        {
          name: "Case 5: Multi-Second Drain Rate",
          input: "CONFIG_LEAKY 10 3\nENQUEUE r1 1000\nENQUEUE r2 1000\nENQUEUE r3 1000\nENQUEUE r4 1000\nLEAK 3000",
          expected: "OK\nQUEUED 1\nQUEUED 2\nQUEUED 3\nQUEUED 4\nPROCESSED r1 r2 r3 r4",
        },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Multi-Tenant Tier Quotas",
      title: "Multi-Tenant Tiered Quotas & SLA Enforcement",
      difficulty: "Hard",
      tagline: "Assign clients to subscription tiers (FREE, PRO, ENTERPRISE) with independent quotas and burst allowances.",
      whatAreYouBuilding: `You are going to build a multi-tenant rate limiter with VIP lines. Think of it as having different rules for Free, Pro, and Enterprise users. Free users might get 10 requests, while Pro gets 100.

For example:
ASSIGN_TIER bob PRO
REQUEST_TIER bob 1000

Your rate limiter checks Bob's specific Pro tier rules and prints:
ALLOWED PRO 4`,
      howItWorks: `When configuring the system:
1. Register different tiers (like FREE, PRO) with specific limits and window sizes.
2. Assign specific client IDs to these tiers.

When a request arrives:
1. Look up the client's assigned tier. If they have none, default to the FREE tier.
2. Look up the rules (limit and window) for that tier.
3. Apply standard rate limiting logic using those specific rules.
4. Track usage completely independently for every client.`,
      technicalTerms: [
        {
          "term": "Multi-tenant",
          "definition": "An architecture where a single instance of software serves multiple distinct customer groups."
        },
        {
          "term": "SLA Enforcement",
          "definition": "Service Level Agreement. Ensuring paying customers get the higher capacity they paid for."
        },
        {
          "term": "Quota Isolation",
          "definition": "Ensuring one user exhausting their limit does not affect the limits of other users."
        }
],
      description: `Hardcoding a single rate limit is fine for internal microservices, but public APIs require monetization strategies. Free trial users cannot be given the same capacity as paying enterprise customers.

In this level, you build a multi-tenant quota manager that maps client identities to specific tier policies dynamically. It requires managing separate state tracking for thousands of independent clients while applying different mathematical thresholds based on their assigned plans.`,
      implementationGuide: [
        "Maintain a dictionary of tier definitions mapping tier names to {limit, window_sec}.",
        "Maintain a dictionary mapping client IDs to their assigned tier name.",
        "Maintain a separate dictionary for rate limiting state (e.g., epoch and count) keyed by client ID.",
        "On 'REQUEST_TIER', resolve the client's tier (defaulting to FREE if unassigned). If FREE doesn't exist, reject.",
        "Use the resolved tier's limit and window to evaluate the request using the fixed-window logic from Level 1.",
        "Print 'ALLOWED <tier> <remaining>' or 'REJECTED <tier>'."
],
      diagram: `TIERED MULTI-TENANT QUOTAS (Case 1):
ADD_TIER FREE 1 10     ──► Free: 1 req / 10s       ──► OK
ADD_TIER PRO 5 10      ──► Pro: 5 req / 10s        ──► OK
ASSIGN_TIER alice FREE ──► alice mapped to FREE    ──► OK
ASSIGN_TIER bob PRO    ──► bob mapped to PRO       ──► OK
REQUEST_TIER alice 1000──► alice 1/1 consumed      ──► ALLOWED FREE 0
REQUEST_TIER alice 2000──► alice limit exceeded    ──► REJECTED FREE
REQUEST_TIER bob 1000  ──► bob 1/5 consumed        ──► ALLOWED PRO 4
REQUEST_TIER bob 2000  ──► bob 2/5 consumed        ──► ALLOWED PRO 3`,
      learningLoop: {
        bottleneck: "Hardcoding one limit treats free trial users and paying enterprise customers identically. Tiered limiting enforces monetization SLAs.",
        whatYouUnderstand: [
          "Dynamic tier configuration (rate limits per time window).",
          "Mapping client identity to tier policies with default fallbacks.",
          "Independent tenant quota state tracking.",
        ],
        productionParity: "GitHub API authentication tiers and Stripe customer plans.",
        outcomeSummary: "You implement multi-tenant customer tier management and differentiated rate limiting.",
      },
      operations: [
        { cmd: "ADD_TIER <tier> <limit> <window_sec>", desc: "Registers tier policy. Returns 'OK'." },
        { cmd: "ASSIGN_TIER <client_id> <tier>", desc: "Assigns client to tier. Returns 'OK' or 'NOT_FOUND'." },
        { cmd: "REQUEST_TIER <client_id> <timestamp_ms>", desc: "Evaluates request under client's tier. Returns 'ALLOWED <tier> <remaining>' or 'REJECTED <tier>'." },
      ],
      examples: [
        {
          title: "Multi-Tier Quota Enforcement",
          input: "ADD_TIER FREE 1 10\nADD_TIER PRO 5 10\nASSIGN_TIER alice FREE\nASSIGN_TIER bob PRO\nREQUEST_TIER alice 1000\nREQUEST_TIER alice 2000\nREQUEST_TIER bob 1000\nREQUEST_TIER bob 2000",
          output: "OK\nOK\nOK\nOK\nALLOWED FREE 0\nREJECTED FREE\nALLOWED PRO 4\nALLOWED PRO 3",
        },
      ],
      constraints: ["Unassigned clients default to FREE tier if FREE exists, else rejected"],
      cases: [
        {
          name: "Case 1: Multi-Tier Quota Enforcement",
          input: "ADD_TIER FREE 1 10\nADD_TIER PRO 5 10\nASSIGN_TIER alice FREE\nASSIGN_TIER bob PRO\nREQUEST_TIER alice 1000\nREQUEST_TIER alice 2000\nREQUEST_TIER bob 1000\nREQUEST_TIER bob 2000",
          expected: "OK\nOK\nOK\nOK\nALLOWED FREE 0\nREJECTED FREE\nALLOWED PRO 4\nALLOWED PRO 3",
        },
        {
          name: "Case 2: Assigning Nonexistent Tier",
          input: "ASSIGN_TIER charlie VIP",
          expected: "NOT_FOUND",
        },
        {
          name: "Case 3: Default to FREE Tier",
          input: "ADD_TIER FREE 2 10\nREQUEST_TIER anon 1000\nREQUEST_TIER anon 2000\nREQUEST_TIER anon 3000",
          expected: "OK\nALLOWED FREE 1\nALLOWED FREE 0\nREJECTED FREE",
        },
        {
          name: "Case 4: Upgrading Client Tier Mid-Stream",
          input: "ADD_TIER FREE 1 10\nADD_TIER PRO 5 10\nASSIGN_TIER user1 FREE\nREQUEST_TIER user1 1000\nREQUEST_TIER user1 2000\nASSIGN_TIER user1 PRO\nREQUEST_TIER user1 3000",
          expected: "OK\nOK\nOK\nALLOWED FREE 0\nREJECTED FREE\nOK\nALLOWED PRO 4",
        },
        {
          name: "Case 5: No Tiers Defined",
          input: "REQUEST_TIER user1 1000",
          expected: "REJECTED NONE",
        },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Rate Limiting Telemetry",
      title: "Rate Limiting Telemetry & State Tracking",
      difficulty: "Hard",
      tagline: "Track rate limiter telemetry and state without overshooting limits. (Note: this is sequential state tracking in standard I/O, not a multi-threaded system).",
      whatAreYouBuilding: `You are going to build a rate limiter that tracks strict operational telemetry. Think of it as the bouncer keeping a precise ledger of exactly how many people were allowed in, how many were turned away, and how many spots are left, without ever miscounting.

For example:
CLIENT_STATS c1

Your system prints out the exact historical record:
STATS c1 ALLOWED 1 REJECTED 1 TOKENS 2`,
      howItWorks: `When a request arrives:
1. Perform the standard token bucket logic to check if tokens are available.
2. If allowed, deduct the tokens AND increment an 'allowed' telemetry counter for that client.
3. If rejected, do not deduct tokens, but increment a 'rejected' telemetry counter.
4. When stats are requested, return the full ledger of these counters along with the current token balance.`,
      technicalTerms: [
        {
          "term": "Telemetry",
          "definition": "Automated collection of data and metrics (like allow/reject counts) for monitoring system health."
        },
        {
          "term": "Atomic Update",
          "definition": "Ensuring that checking the limit, deducting tokens, and updating metrics happen together safely."
        },
        {
          "term": "Zero-overshoot",
          "definition": "A strict guarantee that the system never allows more requests than the limit permits."
        }
],
      description: `In production, it is not enough to just drop traffic; you must monitor it. If a legitimate customer is being rejected due to a misconfigured limit, engineers need exact metrics (allowed vs rejected counts) to diagnose the issue.

This level simulates tracking complete state telemetry atomically alongside the rate limiting decision. In real distributed systems (like Redis), these multi-step operations (check tokens, deduct, increment metrics) are bundled into atomic Lua scripts to prevent race conditions when thousands of requests hit simultaneously.`,
      implementationGuide: [
        "Extend the client state dictionary to track {tokens, last_refill_ms, allowed_count, rejected_count}.",
        "On 'ATOMIC_ACQUIRE', run the token bucket refill logic from Level 3.",
        "If there are enough tokens, deduct them, increment allowed_count, and print 'ALLOWED <remaining>'.",
        "If not enough tokens, increment rejected_count and print 'RATE_LIMITED'.",
        "On 'CLIENT_STATS', recalculate the current tokens (lazy refill) to show the most up-to-date balance.",
        "Print 'STATS <client> ALLOWED <allowed_count> REJECTED <rejected_count> TOKENS <current_tokens>'"
],
      diagram: `ATOMIC CONCURRENCY TRACKING (Case 1):
CONFIG_BUCKET c1 5 1        ──► Capacity: 5, Rate: 1/sec ──► OK
ATOMIC_ACQUIRE c1 3 1000    ──► Atomically takes 3 (rem: 2) ──► ALLOWED 2
ATOMIC_ACQUIRE c1 3 1000    ──► Needs 3, only 2 left!    ──► RATE_LIMITED
CLIENT_STATS c1             ──► Client Telemetry
OUTPUT:
OK
ALLOWED 2
RATE_LIMITED
STATS c1 ALLOWED 1 REJECTED 1 TOKENS 2`,
      learningLoop: {
        bottleneck: "In distributed clusters, tracking exact allocations avoids race conditions. Even sequentially, you must ensure strict bounds.",
        whatYouUnderstand: [
          "Tracking complete state per client.",
          "Zero-overshoot guarantees.",
          "Client rate telemetry: Total allowed, total rejected, current tokens.",
        ],
        productionParity: "Redis Lua evalsha script pattern in Envoy and Stripe.",
        outcomeSummary: "You master state tracking and operational telemetry for rate limiters.",
      },
      operations: [
        { cmd: "ATOMIC_ACQUIRE <client_id> <tokens> <timestamp_ms>", desc: "Executes atomic acquire. Returns 'ALLOWED <remaining>' or 'RATE_LIMITED'." },
        { cmd: "CLIENT_STATS <client_id>", desc: "Returns 'STATS <client_id> ALLOWED <n> REJECTED <n> TOKENS <n>'." },
      ],
      examples: [
        {
          title: "Atomic Acquire Updates Stats",
          input: "CONFIG_BUCKET c1 5 1\nATOMIC_ACQUIRE c1 3 1000\nATOMIC_ACQUIRE c1 3 1000\nCLIENT_STATS c1",
          output: "OK\nALLOWED 2\nRATE_LIMITED\nSTATS c1 ALLOWED 1 REJECTED 1 TOKENS 2",
        },
      ],
      constraints: ["All acquisitions must update client telemetry counters"],
      cases: [
        {
          name: "Case 1: Atomic Acquire Updates Stats",
          input: "CONFIG_BUCKET c1 5 1\nATOMIC_ACQUIRE c1 3 1000\nATOMIC_ACQUIRE c1 3 1000\nCLIENT_STATS c1",
          expected: "OK\nALLOWED 2\nRATE_LIMITED\nSTATS c1 ALLOWED 1 REJECTED 1 TOKENS 2",
        },
        {
          name: "Case 2: Multiple Allowed Acquires",
          input: "CONFIG_BUCKET c1 10 1\nATOMIC_ACQUIRE c1 2 1000\nATOMIC_ACQUIRE c1 3 1000\nCLIENT_STATS c1",
          expected: "OK\nALLOWED 8\nALLOWED 5\nSTATS c1 ALLOWED 2 REJECTED 0 TOKENS 5",
        },
        {
          name: "Case 3: Stats of Unknown Client",
          input: "CLIENT_STATS ghost",
          expected: "STATS ghost ALLOWED 0 REJECTED 0 TOKENS 0",
        },
        {
          name: "Case 4: Interleaved Burst Rejections",
          input: "CONFIG_BUCKET c1 2 1\nATOMIC_ACQUIRE c1 2 1000\nATOMIC_ACQUIRE c1 1 1000\nATOMIC_ACQUIRE c1 1 1000\nCLIENT_STATS c1",
          expected: "OK\nALLOWED 0\nRATE_LIMITED\nRATE_LIMITED\nSTATS c1 ALLOWED 1 REJECTED 2 TOKENS 0",
        },
        {
          name: "Case 5: Refill Reflects in Stats",
          input: "CONFIG_BUCKET c1 5 2\nATOMIC_ACQUIRE c1 5 1000\nATOMIC_ACQUIRE c1 1 2000\nCLIENT_STATS c1",
          expected: "OK\nALLOWED 0\nALLOWED 1\nSTATS c1 ALLOWED 2 REJECTED 0 TOKENS 1",
        },
      ],
    },
  },
  starterTemplates: {
    python: `"""
Rate Limiter - Challenge 08 Starter (Python 3.12)
Implements fixed window counters, sliding window logs, token buckets,
leaky bucket shapers, multi-tenant tiers, and atomic rate telemetry.
"""
import sys
import math
from collections import deque

class RateLimiter:
    def __init__(self):
        # Level 1: Fixed window
        self.fw_limit = 0
        self.fw_window_ms = 0
        self.fw_clients = {}  # client -> {"epoch": int, "count": int}

        # Level 2: Sliding window
        self.sw_limit = 0
        self.sw_window_ms = 0
        self.sw_clients = {}  # client -> deque of timestamps

        # Level 3: Token bucket
        self.tb_buckets = {}  # client -> {"cap": int, "rate": float, "tokens": float, "last_ms": int, "allowed": int, "rejected": int}

        # Level 4: Leaky bucket
        self.lb_cap = 0
        self.lb_rate = 0.0
        self.lb_queue = deque()  # deque of (req_id, arrival_ms)
        self.lb_last_leak_ms = 0

        # Level 5: Tiers
        self.tiers = {}  # tier_name -> {"limit": int, "window_ms": int}
        self.client_tiers = {}  # client -> tier_name
        self.tier_clients = {}  # client -> {"epoch": int, "count": int}

    # Level 1: Fixed Window
    def config_fixed(self, limit: int, window_sec: int) -> str:
        self.fw_limit = limit
        self.fw_window_ms = window_sec * 1000
        return "OK"

    def request_fixed(self, client: str, timestamp_ms: int) -> str:
        epoch = timestamp_ms // self.fw_window_ms
        data = self.fw_clients.get(client, {"epoch": epoch, "count": 0})
        if data["epoch"] != epoch:
            data = {"epoch": epoch, "count": 0}

        if data["count"] < self.fw_limit:
            data["count"] += 1
            self.fw_clients[client] = data
            remaining = self.fw_limit - data["count"]
            return f"ALLOWED {remaining}"
        else:
            self.fw_clients[client] = data
            retry_after = (epoch + 1) * self.fw_window_ms - timestamp_ms
            return f"REJECTED {retry_after}"

    def reset_fixed(self, client: str) -> str:
        if client in self.fw_clients:
            del self.fw_clients[client]
        return "OK"

    # Level 2: Sliding Window Log
    def config_sliding(self, limit: int, window_sec: int) -> str:
        self.sw_limit = limit
        self.sw_window_ms = window_sec * 1000
        return "OK"

    def request_sliding(self, client: str, timestamp_ms: int) -> str:
        if client not in self.sw_clients:
            self.sw_clients[client] = deque()
        log = self.sw_clients[client]

        # Evict older than timestamp_ms - sw_window_ms
        threshold = timestamp_ms - self.sw_window_ms
        while log and log[0] <= threshold:
            log.popleft()

        if len(log) < self.sw_limit:
            log.append(timestamp_ms)
            remaining = self.sw_limit - len(log)
            return f"ALLOWED {remaining}"
        else:
            oldest = log[0]
            retry_after = (oldest + self.sw_window_ms) - timestamp_ms
            return f"REJECTED {retry_after}"

    # Level 3 & 6: Token Bucket & Atomic
    def config_bucket(self, client: str, capacity: int, refill_rate_per_sec: int) -> str:
        self.tb_buckets[client] = {
            "cap": capacity,
            "rate": float(refill_rate_per_sec),
            "tokens": float(capacity),
            "last_ms": None,
            "allowed": 0,
            "rejected": 0,
        }
        return "OK"

    def _refill(self, b: dict, timestamp_ms: int):
        if b["last_ms"] is None:
            b["last_ms"] = timestamp_ms
            return
        delta_sec = (timestamp_ms - b["last_ms"]) / 1000.0
        if delta_sec > 0:
            b["tokens"] = min(float(b["cap"]), b["tokens"] + delta_sec * b["rate"])
            b["last_ms"] = timestamp_ms

    def acquire(self, client: str, tokens: int, timestamp_ms: int) -> str:
        if client not in self.tb_buckets:
            return "REJECTED"
        b = self.tb_buckets[client]
        self._refill(b, timestamp_ms)

        if b["tokens"] >= tokens:
            b["tokens"] -= tokens
            return f"ALLOWED {int(math.floor(b['tokens']))}"
        return "REJECTED"

    def atomic_acquire(self, client: str, tokens: int, timestamp_ms: int) -> str:
        if client not in self.tb_buckets:
            return "RATE_LIMITED"
        b = self.tb_buckets[client]
        self._refill(b, timestamp_ms)

        if b["tokens"] >= tokens:
            b["tokens"] -= tokens
            b["allowed"] += 1
            return f"ALLOWED {int(math.floor(b['tokens']))}"
        else:
            b["rejected"] += 1
            return "RATE_LIMITED"

    def client_stats(self, client: str) -> str:
        if client not in self.tb_buckets:
            return f"STATS {client} ALLOWED 0 REJECTED 0 TOKENS 0"
        b = self.tb_buckets[client]
        return f"STATS {client} ALLOWED {b['allowed']} REJECTED {b['rejected']} TOKENS {int(math.floor(b['tokens']))}"

    # Level 4: Leaky Bucket
    def config_leaky(self, capacity: int, leak_rate_per_sec: int) -> str:
        self.lb_cap = capacity
        self.lb_rate = float(leak_rate_per_sec)
        self.lb_queue.clear()
        self.lb_last_leak_ms = 0
        return "OK"

    def enqueue_leaky(self, req_id: str, timestamp_ms: int) -> str:
        if len(self.lb_queue) < self.lb_cap:
            if not self.lb_queue and self.lb_last_leak_ms == 0:
                self.lb_last_leak_ms = timestamp_ms
            self.lb_queue.append((req_id, timestamp_ms))
            return f"QUEUED {len(self.lb_queue)}"
        return "DROPPED"

    def leak(self, timestamp_ms: int) -> str:
        if not self.lb_queue:
            self.lb_last_leak_ms = timestamp_ms
            return "IDLE"
        if self.lb_last_leak_ms == 0:
            self.lb_last_leak_ms = timestamp_ms

        delta_sec = (timestamp_ms - self.lb_last_leak_ms) / 1000.0
        can_leak = int(delta_sec * self.lb_rate)
        if can_leak <= 0:
            return "IDLE"

        leaked = []
        for _ in range(min(can_leak, len(self.lb_queue))):
            req_id, _ = self.lb_queue.popleft()
            leaked.append(req_id)

        self.lb_last_leak_ms = timestamp_ms
        if leaked:
            return "PROCESSED " + " ".join(leaked)
        return "IDLE"

    # Level 5: Tiers
    def add_tier(self, tier: str, limit: int, window_sec: int) -> str:
        self.tiers[tier] = {"limit": limit, "window_ms": window_sec * 1000}
        return "OK"

    def assign_tier(self, client: str, tier: str) -> str:
        if tier not in self.tiers:
            return "NOT_FOUND"
        self.client_tiers[client] = tier
        if client in self.tier_clients:
            del self.tier_clients[client]
        return "OK"

    def request_tier(self, client: str, timestamp_ms: int) -> str:
        tier_name = self.client_tiers.get(client)
        if not tier_name:
            if "FREE" in self.tiers:
                tier_name = "FREE"
            else:
                return "REJECTED NONE"

        tier_cfg = self.tiers[tier_name]
        epoch = timestamp_ms // tier_cfg["window_ms"]
        data = self.tier_clients.get(client, {"epoch": epoch, "count": 0})
        if data["epoch"] != epoch:
            data = {"epoch": epoch, "count": 0}

        if data["count"] < tier_cfg["limit"]:
            data["count"] += 1
            self.tier_clients[client] = data
            remaining = tier_cfg["limit"] - data["count"]
            return f"ALLOWED {tier_name} {remaining}"
        else:
            self.tier_clients[client] = data
            return f"REJECTED {tier_name}"

def main():
    rl = RateLimiter()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        cmd = parts[0].upper()

        if cmd == "CONFIG":
            print(rl.config_fixed(int(parts[1]), int(parts[2])))
        elif cmd == "REQUEST":
            print(rl.request_fixed(parts[1], int(parts[2])))
        elif cmd == "RESET":
            print(rl.reset_fixed(parts[1]))
        elif cmd == "CONFIG_SLIDING":
            print(rl.config_sliding(int(parts[1]), int(parts[2])))
        elif cmd == "REQUEST_SLIDING":
            print(rl.request_sliding(parts[1], int(parts[2])))
        elif cmd == "CONFIG_BUCKET":
            print(rl.config_bucket(parts[1], int(parts[2]), int(parts[3])))
        elif cmd == "ACQUIRE":
            print(rl.acquire(parts[1], int(parts[2]), int(parts[3])))
        elif cmd == "CONFIG_LEAKY":
            print(rl.config_leaky(int(parts[1]), int(parts[2])))
        elif cmd == "ENQUEUE":
            print(rl.enqueue_leaky(parts[1], int(parts[2])))
        elif cmd == "LEAK":
            print(rl.leak(int(parts[1])))
        elif cmd == "ADD_TIER":
            print(rl.add_tier(parts[1], int(parts[2]), int(parts[3])))
        elif cmd == "ASSIGN_TIER":
            print(rl.assign_tier(parts[1], parts[2]))
        elif cmd == "REQUEST_TIER":
            print(rl.request_tier(parts[1], int(parts[2])))
        elif cmd == "ATOMIC_ACQUIRE":
            print(rl.atomic_acquire(parts[1], int(parts[2]), int(parts[3])))
        elif cmd == "CLIENT_STATS":
            print(rl.client_stats(parts[1]))
        else:
            print("UNKNOWN_COMMAND")

if __name__ == "__main__":
    main()
`,
    cpp: `// Rate Limiter - Challenge 08 Starter (C++ 20)
#include <iostream>
#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <sstream>
#include <cmath>
#include <algorithm>

struct FixedClient {
    long long epoch = 0;
    int count = 0;
};

struct TokenBucket {
    int cap = 0;
    double rate = 0;
    double tokens = 0;
    long long last_ms = -1;
    int allowed = 0;
    int rejected = 0;
};

struct TierConfig {
    int limit = 0;
    long long window_ms = 0;
};

class RateLimiter {
    // Level 1: Fixed
    int fw_limit = 0;
    long long fw_window_ms = 0;
    std::unordered_map<std::string, FixedClient> fw_clients;

    // Level 2: Sliding
    int sw_limit = 0;
    long long sw_window_ms = 0;
    std::unordered_map<std::string, std::deque<long long>> sw_clients;

    // Level 3 & 6: Token Bucket
    std::unordered_map<std::string, TokenBucket> tb_buckets;

    // Level 4: Leaky Bucket
    int lb_cap = 0;
    double lb_rate = 0;
    std::deque<std::pair<std::string, long long>> lb_queue;
    long long lb_last_leak_ms = 0;

    // Level 5: Tiers
    std::unordered_map<std::string, TierConfig> tiers;
    std::unordered_map<std::string, std::string> client_tiers;
    std::unordered_map<std::string, FixedClient> tier_clients;

public:
    // Level 1
    std::string config_fixed(int limit, int window_sec) {
        fw_limit = limit;
        fw_window_ms = (long long)window_sec * 1000;
        return "OK";
    }

    std::string request_fixed(const std::string& client, long long timestamp_ms) {
        long long epoch = timestamp_ms / fw_window_ms;
        auto& data = fw_clients[client];
        if (data.epoch != epoch) {
            data.epoch = epoch;
            data.count = 0;
        }
        if (data.count < fw_limit) {
            data.count++;
            int remaining = fw_limit - data.count;
            return "ALLOWED " + std::to_string(remaining);
        } else {
            long long retry_after = (epoch + 1) * fw_window_ms - timestamp_ms;
            return "REJECTED " + std::to_string(retry_after);
        }
    }

    std::string reset_fixed(const std::string& client) {
        fw_clients.erase(client);
        return "OK";
    }

    // Level 2
    std::string config_sliding(int limit, int window_sec) {
        sw_limit = limit;
        sw_window_ms = (long long)window_sec * 1000;
        return "OK";
    }

    std::string request_sliding(const std::string& client, long long timestamp_ms) {
        auto& log = sw_clients[client];
        long long threshold = timestamp_ms - sw_window_ms;
        while (!log.empty() && log.front() <= threshold) {
            log.pop_front();
        }
        if ((int)log.size() < sw_limit) {
            log.push_back(timestamp_ms);
            int remaining = sw_limit - (int)log.size();
            return "ALLOWED " + std::to_string(remaining);
        } else {
            long long oldest = log.front();
            long long retry_after = (oldest + sw_window_ms) - timestamp_ms;
            return "REJECTED " + std::to_string(retry_after);
        }
    }

    // Level 3 & 6
    std::string config_bucket(const std::string& client, int capacity, int refill_rate) {
        tb_buckets[client] = TokenBucket{capacity, (double)refill_rate, (double)capacity, -1, 0, 0};
        return "OK";
    }

    void refill_bucket(TokenBucket& b, long long timestamp_ms) {
        if (b.last_ms < 0) {
            b.last_ms = timestamp_ms;
            return;
        }
        double delta_sec = (timestamp_ms - b.last_ms) / 1000.0;
        if (delta_sec > 0) {
            b.tokens = std::min((double)b.cap, b.tokens + delta_sec * b.rate);
            b.last_ms = timestamp_ms;
        }
    }

    std::string acquire(const std::string& client, int tokens, long long timestamp_ms) {
        if (tb_buckets.find(client) == tb_buckets.end()) return "REJECTED";
        auto& b = tb_buckets[client];
        refill_bucket(b, timestamp_ms);
        if (b.tokens >= tokens) {
            b.tokens -= tokens;
            return "ALLOWED " + std::to_string((int)std::floor(b.tokens));
        }
        return "REJECTED";
    }

    std::string atomic_acquire(const std::string& client, int tokens, long long timestamp_ms) {
        if (tb_buckets.find(client) == tb_buckets.end()) return "RATE_LIMITED";
        auto& b = tb_buckets[client];
        refill_bucket(b, timestamp_ms);
        if (b.tokens >= tokens) {
            b.tokens -= tokens;
            b.allowed++;
            return "ALLOWED " + std::to_string((int)std::floor(b.tokens));
        } else {
            b.rejected++;
            return "RATE_LIMITED";
        }
    }

    std::string client_stats(const std::string& client) {
        if (tb_buckets.find(client) == tb_buckets.end()) {
            return "STATS " + client + " ALLOWED 0 REJECTED 0 TOKENS 0";
        }
        const auto& b = tb_buckets[client];
        return "STATS " + client + " ALLOWED " + std::to_string(b.allowed) +
               " REJECTED " + std::to_string(b.rejected) + " TOKENS " + std::to_string((int)std::floor(b.tokens));
    }

    // Level 4
    std::string config_leaky(int capacity, int leak_rate) {
        lb_cap = capacity;
        lb_rate = (double)leak_rate;
        lb_queue.clear();
        lb_last_leak_ms = 0;
        return "OK";
    }

    std::string enqueue_leaky(const std::string& req_id, long long timestamp_ms) {
        if ((int)lb_queue.size() < lb_cap) {
            if (lb_queue.empty() && lb_last_leak_ms == 0) lb_last_leak_ms = timestamp_ms;
            lb_queue.push_back({req_id, timestamp_ms});
            return "QUEUED " + std::to_string(lb_queue.size());
        }
        return "DROPPED";
    }

    std::string leak(long long timestamp_ms) {
        if (lb_queue.empty()) {
            lb_last_leak_ms = timestamp_ms;
            return "IDLE";
        }
        if (lb_last_leak_ms == 0) lb_last_leak_ms = timestamp_ms;
        double delta_sec = (timestamp_ms - lb_last_leak_ms) / 1000.0;
        int can_leak = (int)(delta_sec * lb_rate);
        if (can_leak <= 0) return "IDLE";

        std::string result = "PROCESSED";
        int to_drain = std::min(can_leak, (int)lb_queue.size());
        for (int i = 0; i < to_drain; i++) {
            result += " " + lb_queue.front().first;
            lb_queue.pop_front();
        }
        lb_last_leak_ms = timestamp_ms;
        return result;
    }

    // Level 5
    std::string add_tier(const std::string& tier, int limit, int window_sec) {
        tiers[tier] = TierConfig{limit, (long long)window_sec * 1000};
        return "OK";
    }

    std::string assign_tier(const std::string& client, const std::string& tier) {
        if (tiers.find(tier) == tiers.end()) return "NOT_FOUND";
        client_tiers[client] = tier;
        tier_clients.erase(client);
        return "OK";
    }

    std::string request_tier(const std::string& client, long long timestamp_ms) {
        std::string tier_name = "";
        if (client_tiers.find(client) != client_tiers.end()) {
            tier_name = client_tiers[client];
        } else if (tiers.find("FREE") != tiers.end()) {
            tier_name = "FREE";
        } else {
            return "REJECTED NONE";
        }

        const auto& cfg = tiers[tier_name];
        long long epoch = timestamp_ms / cfg.window_ms;
        auto& data = tier_clients[client];
        if (data.epoch != epoch) {
            data.epoch = epoch;
            data.count = 0;
        }

        if (data.count < cfg.limit) {
            data.count++;
            int remaining = cfg.limit - data.count;
            return "ALLOWED " + tier_name + " " + std::to_string(remaining);
        } else {
            return "REJECTED " + tier_name;
        }
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    RateLimiter rl;
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;

        if (cmd == "CONFIG") {
            int lim, win; iss >> lim >> win;
            std::cout << rl.config_fixed(lim, win) << "\\n";
        } else if (cmd == "REQUEST") {
            std::string c; long long ts; iss >> c >> ts;
            std::cout << rl.request_fixed(c, ts) << "\\n";
        } else if (cmd == "RESET") {
            std::string c; iss >> c;
            std::cout << rl.reset_fixed(c) << "\\n";
        } else if (cmd == "CONFIG_SLIDING") {
            int lim, win; iss >> lim >> win;
            std::cout << rl.config_sliding(lim, win) << "\\n";
        } else if (cmd == "REQUEST_SLIDING") {
            std::string c; long long ts; iss >> c >> ts;
            std::cout << rl.request_sliding(c, ts) << "\\n";
        } else if (cmd == "CONFIG_BUCKET") {
            std::string c; int cap, rate; iss >> c >> cap >> rate;
            std::cout << rl.config_bucket(c, cap, rate) << "\\n";
        } else if (cmd == "ACQUIRE") {
            std::string c; int tok; long long ts; iss >> c >> tok >> ts;
            std::cout << rl.acquire(c, tok, ts) << "\\n";
        } else if (cmd == "CONFIG_LEAKY") {
            int cap, rate; iss >> cap >> rate;
            std::cout << rl.config_leaky(cap, rate) << "\\n";
        } else if (cmd == "ENQUEUE") {
            std::string r; long long ts; iss >> r >> ts;
            std::cout << rl.enqueue_leaky(r, ts) << "\\n";
        } else if (cmd == "LEAK") {
            long long ts; iss >> ts;
            std::cout << rl.leak(ts) << "\\n";
        } else if (cmd == "ADD_TIER") {
            std::string t; int lim, win; iss >> t >> lim >> win;
            std::cout << rl.add_tier(t, lim, win) << "\\n";
        } else if (cmd == "ASSIGN_TIER") {
            std::string c, t; iss >> c >> t;
            std::cout << rl.assign_tier(c, t) << "\\n";
        } else if (cmd == "REQUEST_TIER") {
            std::string c; long long ts; iss >> c >> ts;
            std::cout << rl.request_tier(c, ts) << "\\n";
        } else if (cmd == "ATOMIC_ACQUIRE") {
            std::string c; int tok; long long ts; iss >> c >> tok >> ts;
            std::cout << rl.atomic_acquire(c, tok, ts) << "\\n";
        } else if (cmd == "CLIENT_STATS") {
            std::string c; iss >> c;
            std::cout << rl.client_stats(c) << "\\n";
        }
    }
    return 0;
}
`,
  },
};
