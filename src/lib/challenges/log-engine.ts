// src/lib/challenges/log-engine.ts
import { ChallengeData } from "./types";

export const logEngineChallenge: ChallengeData = {
  slug: "log-engine",
  number: "10",
  title: "Streaming Log Analytics Engine",
  subtitle: "From line-delimited byte tokenization to streaming aggregators, rolling window error rates, Count-Min Sketches, and quantiles.",
  badge: "PERFORMANCE ENGINEERING CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "ClickHouse, Loki, Vector",
  whatStudentsBuild: "Streaming log processor & analytics engine",
  mainSkill: "Streaming, parsing, aggregation",
  signatureQuestion: "Can your system process the stream faster than it arrives?",
  overview:
    "In this engineering challenge, you construct a high-throughput streaming log analytics engine from first principles — inspired by core concepts found in systems like ClickHouse, Loki, and Vector. Rather than relying on heavyweight regex libraries or external databases, you engineer the raw stream processing pipeline: zero-copy byte tokenization, status family histogram counters, circular ring-buffer sliding windows, Count-Min Sketches for bounded-memory heavy hitters, and streaming quantile estimators.",
  whyItMatters:
    "Modern cloud platforms generate gigabytes of log lines every minute. A slow parser stalls the observability pipeline and consumes thousands of CPU cores. Building a streaming log aggregator teaches you cache-friendly data structures, probabilistic algorithms, and zero-allocation parsing.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a high-speed log aggregation engine capable of ingesting 200,000+ log lines/sec, maintaining rolling error rates, tracking top endpoints with bounded memory, and reporting p99 latency in sub-millisecond time.",
  philosophy: "Encounter real observability and streaming telemetry problems: zero-copy stream tokenization, bounded-memory frequency sketches, circular ring-buffer windowing, and quantile approximation.",
  architectureDiagram: `                     LOG STREAM PIPELINE
                             │
            ┌────────────────┴────────────────┐
            │                                 │
     Ingest Stream                     Query Engine
            │                                 │
  Zero-Copy Tokenizer                Metrics & Aggregates
            │                                 │
            └────────────────┬────────────────┘
                             │
                   Streaming Aggregator
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Histograms      Top-K Heavy    Percentiles
        [2xx/4xx/5xx]    [Endpoints]   [p50/p95/p99]`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Streaming log line tokenizer", mainConcept: "Single-pass forward byte scanning, zero-allocation token extraction" },
    { level: 2, whatWeBuild: "Status code family histogram", mainConcept: "Direct array-indexed counters (2xx, 3xx, 4xx, 5xx), O(1) bucketing" },
    { level: 3, whatWeBuild: "Rolling window error rate", mainConcept: "Circular ring buffer time buckets, bounded-memory sliding error rates" },
    { level: 4, whatWeBuild: "Top-K frequent endpoint sketch", mainConcept: "Count-Min Sketch / HeavyKeeper, bounded-memory frequency estimation" },
    { level: 5, whatWeBuild: "Percentile latency estimator", mainConcept: "HdrHistogram / T-Digest streaming approximation of p50, p95, and p99" },
    { level: 6, whatWeBuild: "High-throughput burst pipeline", mainConcept: "SIMD line scanning, lockless batch flushing, >200,000 lines/sec" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Streaming Log Tokenizer",
      focus: "Zero-Copy Byte Parsing",
      description: "Extracts ISO timestamps, log levels, HTTP status codes, and latency in a single forward pass.",
      realWorldTech: "Vectorized log parsers, FluentBit",
    },
    {
      number: 2,
      name: "Status Code Histogram",
      focus: "Fast Array-Indexed Counters",
      description: "Maintains status code distribution across 2xx, 3xx, 4xx, and 5xx families using direct indexing.",
      realWorldTech: "Prometheus CounterVec",
    },
    {
      number: 3,
      name: "Rolling Window Error Rate",
      focus: "Circular Ring Buffer Buckets",
      description: "Tracks error percentages over moving time windows without unbounded memory growth.",
      realWorldTech: "Datadog rolling monitors",
    },
    {
      number: 4,
      name: "Top-K Frequent Item Sketch",
      focus: "Space-Saving / Count-Min Sketch",
      description: "Identifies top requested endpoints in bounded memory using probabilistic sketching.",
      realWorldTech: "Heavykeeper / Space-Saving algorithms",
    },
    {
      number: 5,
      name: "Percentile Latency Estimator",
      focus: "HdrHistogram / T-Digest",
      description: "Computes p50, p95, and p99 response times dynamically across streaming durations.",
      realWorldTech: "HdrHistogram and Prometheus Summary metrics",
    },
    {
      number: 6,
      name: "High-Throughput Burst Pipeline",
      focus: "SIMD Line Scanning & Batch Flushes",
      description: "Processes multi-gigabyte log streams at hardware wire speed without buffer stalls.",
      realWorldTech: "ClickHouse log ingestion, Grafana Loki",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Streaming Log Parser",
      title: "Basic Structured Log Line Ingestion",
      difficulty: "Easy",
      tagline: "Parse structured log lines (timestamp, status, latency_ms, endpoint) and track total line count.",
      whatAreYouBuilding: `You are going to build an automated front desk logbook for a busy hospital. Every time a patient is seen, the desk records the outcome code (status), how many minutes they waited (latency), and which department they visited (endpoint).

For example:
INGEST 200 15 /api/health

records a successful visit (200) that took 15ms in the health department. Your program should say 'OK'.
When asked COUNT, it tells you exactly how many patients have been logged so far.`,
      howItWorks: `When a new log entry comes in:
1. You read the line and chop it into pieces based on the spaces.
2. The pieces are the command (INGEST), the status (200), the latency (15), and the endpoint (/api/health).
3. You increase a running tally of total logs seen.
4. If asked to 'COUNT', you just return that tally. You don't need to save the actual log line yet!`,
      technicalTerms: [
        {
          "term": "Zero-copy Tokenization",
          "definition": "Extracting information from a line of text without creating new chunks of memory for each piece."
        },
        {
          "term": "O(1) Time Complexity",
          "definition": "An operation that takes the same amount of time to run regardless of how much data you have (like reading a single counter)."
        },
        {
          "term": "Delimiter Scanning",
          "definition": "Reading through a string and splitting it wherever a specific character (like a space) appears."
        }
      ],
      description: `In observability pipelines, speed is everything. Regex matching on millions of log lines consumes massive CPU cycles and causes memory allocation spikes. By scanning for spaces (delimiters) in a single forward pass, you can process logs incredibly fast. This level teaches you the foundation of high-performance text parsing without relying on heavy regular expressions.`,
      implementationGuide: [
        "Create an integer variable to keep track of the total number of ingested lines, starting at 0.",
        "Implement 'INGEST <status> <latency_ms> <endpoint>': For now, you don't even need to save the data. Just increment your total count and return 'OK'.",
        "Implement 'COUNT': Return the current value of your total count variable."
      ],
      diagram: `STRUCTURED LOG INGESTION (Case 1):
INGEST 200 15 /api/users ──► Records status=200, latency=15, endpoint=/api/users ──► OK
COUNT                    ──► Total logs recorded                                 ──► 1`,
      importantChallenge: {
        title: "Regex vs Single-Pass Scanning",
        description:
          "Using regular expressions to parse high-velocity log streams causes catastrophic regex backtracking and memory allocation spikes. Systems-grade log processors scan for space delimiters in a single forward pass without allocating string arrays for every line.",
        codeOrFormat: "INGEST <STATUS> <LATENCY_MS> <ENDPOINT> ──► single forward pass delimiter scan",
      },
      endGoalDemonstration: `INGEST 200 15 /api/health
OK
INGEST 500 89 /api/checkout
OK
COUNT
2`,
      nextLevelTeaser:
        "In Level 2, we introduce status code distribution profiling, categorizing requests into 2xx, 3xx, 4xx, and 5xx families using fast array index mapping.",
      learningLoop: {
        bottleneck: "Regex matching on millions of log lines consumes massive CPU cycles. Single-pass delimiter scanning is orders of magnitude faster.",
        whatYouUnderstand: [
          "Delimited log line format: INGEST <STATUS> <LATENCY_MS> <ENDPOINT>.",
          "Extracting tokens without intermediate allocations.",
          "Tracking total ingested lines in O(1) time.",
        ],
        productionParity: "Logstash and FluentBit raw stream tokenizers.",
        outcomeSummary: "You implement single-pass stream ingestion and fast token extraction.",
      },
      operations: [
        { cmd: "INGEST <status> <latency_ms> <endpoint>", desc: "Ingests single log line. Returns 'OK'." },
        { cmd: "COUNT", desc: "Returns total number of ingested log lines." },
      ],
      examples: [
        { title: "Ingest and Count", input: "INGEST 200 15 /api/users\nCOUNT", output: "OK\n1" },
      ],
      constraints: ["Strict forward stream ingestion", "Count increments on each INGEST"],
      cases: [
        { name: "Case 1: Single Log Ingestion", input: "INGEST 200 15 /api/users\nCOUNT", expected: "OK\n1" },
        { name: "Case 2: Multiple Logs Ingestion", input: "INGEST 200 10 /home\nINGEST 404 2 /missing\nCOUNT", expected: "OK\nOK\n2" },
        { name: "Case 3: Ingest with Query String", input: "INGEST 500 120 /checkout?step=1\nCOUNT", expected: "OK\n1" },
        { name: "Case 4: Zero Initial Count", input: "COUNT", expected: "0" },
        { name: "Case 5: High-Frequency Ingest Count", input: "INGEST 200 1 /a\nINGEST 200 1 /b\nINGEST 200 1 /c\nCOUNT", expected: "OK\nOK\nOK\n3" },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Status Code Distribution",
      title: "Status Code Breakdown",
      difficulty: "Medium",
      tagline: "Categorize log lines into status families (2xx, 3xx, 4xx, 5xx) and track exact status code counts.",
      whatAreYouBuilding: `Now the hospital wants to categorize patient outcomes. 2xx codes mean treated normally, 4xx means the patient went to the wrong department, and 5xx means a critical emergency. 

For example:
INGEST 500 80 /c

records an emergency. If someone asks STATUS_COUNT 500, you return the exact count of 500s. If they ask FAMILY_COUNT 5XX, you return the total of all 500-level codes combined.`,
      howItWorks: `When a new log entry comes in:
1. Extract the status code (like 503).
2. Increment a specific counter just for that exact code (503).
3. Determine its "family" by looking at the first digit (503 starts with 5, so it's in the 5XX family).
4. Increment a separate counter for that family.
5. When asked for counts, just look up the numbers in your counters.`,
      technicalTerms: [
        {
          "term": "Histogram",
          "definition": "A way to group data into different buckets (like 2XX, 4XX) to see the distribution of events."
        },
        {
          "term": "Direct Array Indexing",
          "definition": "Using a number (like a status code) directly as the location in an array to find its count instantly."
        },
        {
          "term": "HTTP Status Codes",
          "definition": "Standard numbers indicating the outcome of a request (e.g., 200 OK, 404 Not Found, 500 Server Error)."
        }
      ],
      description: `Production monitors must alert engineers immediately when 5xx (Server Errors) spike. If you had to scan through millions of saved log lines to count errors, the system would freeze. By updating categorized counters (histograms) at the exact moment the log arrives, queries for error counts resolve instantly in O(1) time.`,
      implementationGuide: [
        "Create two new dictionaries (or arrays): one to track exact status codes, and one to track families ('2XX', '3XX', '4XX', '5XX').",
        "Inside your INGEST logic, after extracting the status code, increment its count in the exact-status dictionary.",
        "Calculate the family string (e.g., divide by 100, then append 'XX') and increment that family's count.",
        "Implement 'STATUS_COUNT <status_code>': Return the exact count for that code, or 0 if it hasn't been seen.",
        "Implement 'FAMILY_COUNT <family>': Return the total for that family string, or 0."
      ],
      diagram: `METRIC FILTERING & STATUS CODES (Case 1):
INGEST 200 10 /a         ──► Ingests 200 OK log ──► OK
INGEST 200 12 /b         ──► Ingests 200 OK log ──► OK
STATUS_COUNT 200         ──► Filter count status == 200 ──► 2

Case 2: "FAMILY_COUNT 5XX" ──► Aggregates 500, 503 error logs`,
      learningLoop: {
        bottleneck: "Production monitors must alert when 5xx errors spike. Status code counters must resolve in O(1) time.",
        whatYouUnderstand: [
          "Categorizing status codes (2xx Success, 4xx Client Error, 5xx Server Error).",
          "O(1) array/hash counting by HTTP status code.",
          "METRICS STATUS <code_or_family> query contracts.",
        ],
        productionParity: "Prometheus http_requests_total{status='200'}.",
        outcomeSummary: "You maintain status code histograms and report exact error counts.",
      },
      operations: [
        { cmd: "INGEST <status> <latency_ms> <endpoint>", desc: "Ingests single log line. Returns 'OK'." },
        { cmd: "STATUS_COUNT <status_code>", desc: "Returns count of lines matching exact status code." },
        { cmd: "FAMILY_COUNT <family>", desc: "Returns count for family: 2XX, 4XX, 5XX." },
      ],
      examples: [
        { title: "Status Metrics", input: "INGEST 200 10 /a\nINGEST 200 12 /b\nINGEST 500 80 /c\nSTATUS_COUNT 200\nFAMILY_COUNT 5XX", output: "OK\nOK\nOK\n2\n1" },
      ],
      constraints: ["Exact integer match on status code", "Case-insensitive family: 2XX, 4XX, 5XX"],
      cases: [
        { name: "Case 1: Status Code Count", input: "INGEST 200 10 /a\nINGEST 200 12 /b\nSTATUS_COUNT 200", expected: "OK\nOK\n2" },
        { name: "Case 2: 5XX Server Error Count", input: "INGEST 500 100 /api\nINGEST 503 200 /api\nFAMILY_COUNT 5XX", expected: "OK\nOK\n2" },
        { name: "Case 3: 4XX Client Error Count", input: "INGEST 404 5 /bad\nFAMILY_COUNT 4XX", expected: "OK\n1" },
        { name: "Case 4: Absent Status Code Count", input: "STATUS_COUNT 404", expected: "0" },
        { name: "Case 5: Mixed Family Tracking", input: "INGEST 200 5 /ok\nINGEST 403 1 /auth\nFAMILY_COUNT 2XX\nFAMILY_COUNT 4XX", expected: "OK\nOK\n1\n1" },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Error Rate Calculation",
      title: "Real-Time Error Rate Calculation",
      difficulty: "Hard",
      tagline: "Calculate real-time error percentage: (5XX errors / Total requests) with 2 decimal places.",
      whatAreYouBuilding: `The hospital wants a live "emergency rate" dashboard showing what percentage of total patients today are critical emergencies (5xx codes). 

For example:
If you've seen 4 patients total, and 1 of them was a 500-level emergency, then ERROR_RATE should return '25.00%'.`,
      howItWorks: `1. You already have a counter for total patients (total).
2. You already have a counter for 5XX emergencies.
3. When 'ERROR_RATE' is called, you divide the 5XX count by the total count.
4. Multiply by 100 to get a percentage, and format it exactly to two decimal places.
5. If no patients have been seen yet (total is 0), you must return '0.00%' instead of crashing the program by dividing by zero.`,
      technicalTerms: [
        {
          "term": "Error Rate",
          "definition": "The percentage of total events that resulted in a failure or error (Count of Errors / Total Count * 100)."
        },
        {
          "term": "Division by Zero",
          "definition": "A mathematical error that crashes programs when they try to divide a number by 0. Always check if the total is 0 first!"
        },
        {
          "term": "Floating-point Formatting",
          "definition": "Converting a decimal number into a string with a specific number of digits after the decimal point."
        }
      ],
      description: `Service Level Objectives (SLOs) are critical in production systems. Engineers need to know the exact percentage of failing requests in real-time. Calculating error ratios dynamically from running counters is much more efficient than querying a database. You must handle edge cases like cold starts (zero requests) safely.`,
      implementationGuide: [
        "Implement 'ERROR_RATE'. First, check if your total ingested count is 0. If it is, return '0.00%'.",
        "If total > 0, calculate: (family_counts['5XX'] / total) * 100.0.",
        "Format the resulting float to exactly 2 decimal places and append a '%' sign.",
        "In Python, you can use an f-string: f'{rate:.2f}%'."
      ],
      diagram: `ERROR RATE COMPUTATION (Case 1):
INGEST 200 10 /ok        ──► Ingests success (Total: 1, Errors: 0) ──► OK
ERROR_RATE               ──► (Errors 0 / Total 1) * 100            ──► 0.00%

Case 2:
1 Success (200) + 1 Error (500) ──► ERROR_RATE ──► 50.00%`,
      learningLoop: {
        bottleneck: "Service Level Objectives (SLOs) require calculating error ratios dynamically without scanning historical data.",
        whatYouUnderstand: [
          "Error rate formula: (Count(5xx) / Total) * 100.",
          "Preventing division by zero on cold starts.",
          "Floating-point formatting with exact 2 decimal precision.",
        ],
        productionParity: "Google SRE Error Budget tracking and Prometheus alert rules.",
        outcomeSummary: "You calculate real-time error percentages and detect outage thresholds.",
      },
      operations: [
        { cmd: "INGEST <status> <latency_ms> <endpoint>", desc: "Ingests single log line. Returns 'OK'." },
        { cmd: "ERROR_RATE", desc: "Returns 5XX error percentage formatted to 2 decimals (e.g. '0.00%' or '25.00%')." },
      ],
      examples: [
        { title: "25% Error Rate", input: "INGEST 200 10 /ok\nINGEST 200 10 /ok\nINGEST 200 10 /ok\nINGEST 500 50 /fail\nERROR_RATE", output: "OK\nOK\nOK\nOK\n25.00%" },
      ],
      constraints: ["Format exactly 'X.XX%'", "Return 0.00% if no logs ingested"],
      cases: [
        { name: "Case 1: 0% Errors", input: "INGEST 200 10 /ok\nERROR_RATE", expected: "OK\n0.00%" },
        { name: "Case 2: 50% Errors", input: "INGEST 200 10 /ok\nINGEST 500 20 /bad\nERROR_RATE", expected: "OK\nOK\n50.00%" },
        { name: "Case 3: Empty Error Rate", input: "ERROR_RATE", expected: "0.00%" },
        { name: "Case 4: 100% Outage", input: "INGEST 503 10 /err\nERROR_RATE", expected: "OK\n100.00%" },
        { name: "Case 5: 4XX Not Counted as Server Error", input: "INGEST 404 5 /notfound\nERROR_RATE", expected: "OK\n0.00%" },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Top-K Heavy Hitters",
      title: "Top-K Frequent Endpoints",
      difficulty: "Hard",
      tagline: "Track the top K most frequently requested endpoints in bounded memory.",
      whatAreYouBuilding: `The hospital administrators want to know which departments are the busiest. They ask you to produce a list of the top K most visited departments, sorted from most to least busy.
      
For example:
TOP_ENDPOINTS 2

might return: /emergency /xray.
If two departments have the exact same number of visits, sort them alphabetically.`,
      howItWorks: `1. You need a dictionary to track the visit count for every unique endpoint (department).
2. When 'INGEST' is called, extract the endpoint and increment its count in the dictionary.
3. When 'TOP_ENDPOINTS <k>' is called, gather all the endpoints and their counts.
4. Sort them first by the count (highest first). If counts are equal, sort alphabetically (A to Z).
5. Extract just the names of the top K endpoints, join them with spaces, and return the string. If there are no endpoints, return 'EMPTY'.`,
      technicalTerms: [
        {
          "term": "Heavy Hitters",
          "definition": "The most frequent items in a dataset (like the most visited URLs in a web server log)."
        },
        {
          "term": "Lexicographical Order",
          "definition": "Sorting text alphabetically (like in a dictionary) to break ties deterministically."
        },
        {
          "term": "Bounded Memory",
          "definition": "Keeping the memory usage of a program within strict limits, even if the input stream is infinite."
        }
      ],
      description: `Tracking the most requested endpoints is essential for detecting abuse, DDoS attacks, or just identifying which services need scaling. In a real system handling billions of logs, storing every unique URL would cause a memory explosion, so specialized algorithms (like Count-Min Sketch or HeavyKeeper) are used to approximate this in bounded memory. For this level, we use a hash map and a custom sort.`,
      implementationGuide: [
        "Create a dictionary to map endpoint strings to their integer counts.",
        "Update this dictionary in your INGEST method.",
        "Implement 'TOP_ENDPOINTS <k>': First, if the dictionary is empty, return 'EMPTY'.",
        "Extract the items and sort them. Sort primarily by count (descending), and secondarily by endpoint name (ascending/alphabetical).",
        "Take the first K endpoint names from the sorted list, join them with a single space, and return them."
      ],
      diagram: `CARDINALITY & TOP ENDPOINTS (Case 1):
INGEST 200 10 /users     ──► /users count = 1 ──► OK
INGEST 200 10 /users     ──► /users count = 2 ──► OK
INGEST 200 10 /home      ──► /home count = 1  ──► OK
TOP_ENDPOINTS 2          ──► Sorts frequency desc
OUTPUT:
OK
OK
OK
/users /home`,
      learningLoop: {
        bottleneck: "Storing every unique URL in a hash map causes memory explosion under random URL fuzzing attacks. Heavy-hitter algorithms bound memory.",
        whatYouUnderstand: [
          "Tracking endpoint request frequencies.",
          "Sorting and extracting top K elements.",
          "Handling ties deterministically by lexicographical order.",
        ],
        productionParity: "Space-Saving algorithm in Redis TOPK and Cloudflare bot detection.",
        outcomeSummary: "You identify heavy-hitter endpoints and protect memory bounds.",
      },
      operations: [
        { cmd: "INGEST <status> <latency_ms> <endpoint>", desc: "Ingests single log line. Returns 'OK'." },
        { cmd: "TOP_ENDPOINTS <k>", desc: "Returns space-separated top K endpoints sorted by frequency descending." },
      ],
      examples: [
        { title: "Top 2 Endpoints", input: "INGEST 200 10 /users\nINGEST 200 10 /users\nINGEST 200 10 /home\nTOP_ENDPOINTS 2", output: "OK\nOK\nOK\n/users /home" },
      ],
      constraints: ["Sort by count desc, then path asc", "Return empty string if no endpoints"],
      cases: [
        { name: "Case 1: Top 2 Endpoints", input: "INGEST 200 10 /users\nINGEST 200 10 /users\nINGEST 200 10 /home\nTOP_ENDPOINTS 2", expected: "OK\nOK\nOK\n/users /home" },
        { name: "Case 2: Top 1 Dominant Endpoint", input: "INGEST 200 10 /api\nINGEST 200 10 /api\nINGEST 200 10 /b\nTOP_ENDPOINTS 1", expected: "OK\nOK\nOK\n/api" },
        { name: "Case 3: Empty Top Endpoints", input: "TOP_ENDPOINTS 5", expected: "EMPTY" },
        { name: "Case 4: K Exceeds Distinct Endpoints", input: "INGEST 200 10 /a\nTOP_ENDPOINTS 3", expected: "OK\n/a" },
        { name: "Case 5: Equal Counts Alphabetical", input: "INGEST 200 10 /beta\nINGEST 200 10 /alpha\nTOP_ENDPOINTS 2", expected: "OK\nOK\n/alpha /beta" },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Percentile Latency",
      title: "Latency Percentiles (p50 & p99)",
      difficulty: "Hard",
      tagline: "Calculate p50 (median) and p99 (tail latency) across all ingested request durations.",
      whatAreYouBuilding: `The hospital wants to measure patient wait times. But the "average" wait time is misleading if most wait 5 minutes, but one person waits 5 hours. Instead, they want to know the median (p50) and the worst-case tail latency (p99).
      
For example:
LATENCY P99

tells you that 99% of patients waited less than this amount of time.`,
      howItWorks: `1. Store every latency number you see during 'INGEST' in a list.
2. When 'LATENCY <P50|P95|P99>' is called, sort that list of latencies from smallest to largest.
3. To find the percentile (e.g., 0.99 for P99), multiply 0.99 by the total number of items to get an index.
4. Go to that exact index in the sorted list and return the number you find there.
5. If the list is empty, return '0ms'.`,
      technicalTerms: [
        {
          "term": "Percentile",
          "definition": "A measure indicating the value below which a given percentage of observations fall (e.g., p99 means 99% of requests are faster than this)."
        },
        {
          "term": "Tail Latency",
          "definition": "The response time of the absolute slowest requests (like p99 or p99.9), often revealing hidden system bottlenecks."
        },
        {
          "term": "Median (p50)",
          "definition": "The exact middle value in a sorted list. Half the items are faster, half are slower."
        }
      ],
      description: `Averages hide severe latency spikes. If 99 requests take 1ms and 1 request takes 5000ms, the average is ~50ms, which looks fine! But that one user had a terrible 5-second delay. By tracking p50, p95, and p99, systems engineers can detect these tail latency spikes and ensure every user gets a fast response.`,
      implementationGuide: [
        "Create a list (array) to store every latency integer you see in 'INGEST'.",
        "Implement 'LATENCY <P50|P95|P99>'. Check if the list is empty; if so, return '0ms'.",
        "Sort the list from smallest to largest (or copy it and sort the copy).",
        "Calculate the index: max(0, ceil(percentile * length) - 1), where percentile is 0.50, 0.95, or 0.99.",
        "Return the latency at that index, formatted as '<val>ms'."
      ],
      diagram: `LATENCY HISTOGRAM & PERCENTILES (Case 1):
INGEST 200 10 /a         ──► Latency: 10ms ──► OK
INGEST 200 20 /b         ──► Latency: 20ms ──► OK
INGEST 200 30 /c         ──► Latency: 30ms ──► OK
LATENCY P50              ──► Median (50th percentile) latency ──► 20ms

Case 2: "LATENCY P99" ──► Identifies tail outliers (e.g. 500ms)`,
      learningLoop: {
        bottleneck: "Averages hide severe latency spikes. If 1 in 100 requests takes 5000ms, average latency is fine but p99 is catastrophic.",
        whatYouUnderstand: [
          "Why percentiles are the gold standard of systems engineering.",
          "Sorting and rank selection: index = ceil(p * N) - 1.",
          "Handling small sample sizes vs large streaming datasets.",
        ],
        productionParity: "HdrHistogram in Cassandra/Elasticsearch and Prometheus histograms.",
        outcomeSummary: "You compute p50, p95, and p99 latency to capture tail performance.",
      },
      operations: [
        { cmd: "INGEST <status> <latency_ms> <endpoint>", desc: "Ingests single log line. Returns 'OK'." },
        { cmd: "LATENCY <P50|P95|P99>", desc: "Returns the requested percentile latency in milliseconds." },
      ],
      examples: [
        { title: "P50 Latency", input: "INGEST 200 10 /a\nINGEST 200 20 /b\nINGEST 200 30 /c\nLATENCY P50", output: "OK\nOK\nOK\n20ms" },
      ],
      constraints: ["Return '<val>ms'", "Return '0ms' if no logs ingested"],
      cases: [
        { name: "Case 1: P50 Median", input: "INGEST 200 10 /a\nINGEST 200 20 /b\nINGEST 200 30 /c\nLATENCY P50", expected: "OK\nOK\nOK\n20ms" },
        { name: "Case 2: P99 Tail Latency", input: "INGEST 200 5 /a\nINGEST 200 10 /b\nINGEST 200 500 /c\nLATENCY P99", expected: "OK\nOK\nOK\n500ms" },
        { name: "Case 3: Single Item Percentile", input: "INGEST 200 42 /a\nLATENCY P99", expected: "OK\n42ms" },
        { name: "Case 4: Empty Latency Query", input: "LATENCY P50", expected: "0ms" },
        { name: "Case 5: Multiple Percentiles", input: "INGEST 200 10 /a\nINGEST 200 20 /b\nINGEST 200 30 /c\nLATENCY P50\nLATENCY P99", expected: "OK\nOK\nOK\n20ms\n30ms" },
      ],
    },
    6: {
      level: 6,
      shortTitle: "High-Throughput Burst",
      title: "Batch Ingestion & System Telemetry",
      difficulty: "Hard",
      tagline: "Sustain 100,000+ lines/sec. Report comprehensive engine telemetry under continuous ingestion.",
      whatAreYouBuilding: `The hospital wants a master control screen that summarizes all the vital stats at a glance: total patients, total emergencies, and the worst-case wait time. 
And at midnight, they want a way to wipe the slate clean for the next day without restarting the computer.

For example:
STATS

Returns: TOTAL: 100 ERRORS: 2 P99: 45ms STATUS: HEALTHY
And RESET clears all memory.`,
      howItWorks: `1. For 'STATS', you just gather the metrics you've already built: the total count, the count of 5XX family errors, and the P99 latency.
2. Format them all into one exact string.
3. For 'RESET', you must clear all your dictionaries, arrays, and set your counters back to 0, exactly as if the program just started.`,
      technicalTerms: [
        {
          "term": "Telemetry",
          "definition": "The automated collection and transmission of data from remote sources (like your log engine) to a centralized monitoring system."
        },
        {
          "term": "Memory Footprint",
          "definition": "The amount of main memory (RAM) that a program uses or references while running."
        },
        {
          "term": "Health Check",
          "definition": "A quick summary endpoint used by load balancers and orchestrators to verify a service is running properly."
        }
      ],
      description: `In a production environment, logging systems must process hundreds of thousands of lines per second endlessly. If your system leaks memory or slows down over time, it will crash the server it's meant to monitor. By exposing a comprehensive telemetry endpoint and a clean reset mechanism, you prove your engine can sustain high throughput while keeping its memory footprint stable.`,
      implementationGuide: [
        "Implement 'STATS': Get the current total count. Get the count of '5XX' from your family counts. Get the P99 latency using your Level 5 logic.",
        "Format and return the string: 'TOTAL: <n> ERRORS: <e> P99: <p> STATUS: HEALTHY'.",
        "Implement 'RESET': Re-initialize your total counter to 0. Clear or replace your status dictionary, family dictionary, endpoints dictionary, and latency array with empty ones.",
        "Return 'OK' for RESET."
      ],
      diagram: `SYSTEM DASHBOARD & HEALTH STATS (Case 1):
INGEST 200 10 /ok        ──► Records log entry ──► OK
STATS                    ──► Aggregates total, error count, p99, and health
OUTPUT:
OK
TOTAL: 1 ERRORS: 0 P99: 10ms STATUS: HEALTHY`,
      learningLoop: {
        bottleneck: "Streaming millions of lines causes CPU cache thrashing. Batching and pre-allocated buffers maintain peak throughput.",
        whatYouUnderstand: [
          "Batch processing semantics and memory footprint stabilization.",
          "RESET command contract for multi-stage benchmarks.",
          "Comprehensive engine health instrumentation.",
        ],
        productionParity: "ClickHouse vectorized batch execution and Vector agent.",
        outcomeSummary: "You master high-speed stream aggregation with zero memory growth.",
      },
      operations: [
        { cmd: "INGEST <status> <latency_ms> <endpoint>", desc: "Ingests single log line. Returns 'OK'." },
        { cmd: "COUNT", desc: "Returns total number of ingested log lines." },
        { cmd: "STATS", desc: "Returns 'TOTAL: <n> ERRORS: <e> P99: <p> STATUS: HEALTHY'." },
        { cmd: "RESET", desc: "Wipes all aggregated metrics and resets engine. Returns 'OK'." },
      ],
      examples: [
        { title: "Engine Stats", input: "INGEST 200 10 /ok\nSTATS", output: "OK\nTOTAL: 1 ERRORS: 0 P99: 10ms STATUS: HEALTHY" },
      ],
      constraints: ["Sub-millisecond STATS latency", "RESET completely restores fresh state"],
      cases: [
        { name: "Case 1: Engine STATS", input: "INGEST 200 10 /ok\nSTATS", expected: "OK\nTOTAL: 1 ERRORS: 0 P99: 10ms STATUS: HEALTHY", check: (act) => act.includes("TOTAL: 1") && act.includes("HEALTHY") },
        { name: "Case 2: RESET Command", input: "INGEST 200 10 /ok\nRESET\nCOUNT", expected: "OK\nOK\n0" },
        { name: "Case 3: Stats with 5XX Errors", input: "INGEST 500 50 /fail\nSTATS", expected: "ERRORS: 1", check: (act) => act.includes("ERRORS: 1") },
        { name: "Case 4: Sustained Batch Ingestion", input: "INGEST 200 1 /a\nINGEST 200 2 /b\nINGEST 200 3 /c\nCOUNT", expected: "OK\nOK\nOK\n3" },
        { name: "Case 5: Post-Reset Clean Ingest", input: "RESET\nINGEST 200 10 /new\nCOUNT", expected: "OK\nOK\n1" },
      ],
    },
  },
  starterTemplates: {
    python: `"""
ALGO Challenge 06: Build a Log Engine (Python 3.12)
Inspired by Observability Systems (Prometheus & Datadog)
Supporting Levels 1 - 6
"""
import sys
import math

class LogEngine:
    def __init__(self):
        self.reset()

    def reset(self):
        self.total = 0
        self.status_counts = {}
        self.family_counts = {"2XX": 0, "3XX": 0, "4XX": 0, "5XX": 0}
        self.endpoints = {}
        self.latencies = []

    def ingest(self, status: int, latency: int, endpoint: str):
        self.total += 1
        self.status_counts[status] = self.status_counts.get(status, 0) + 1
        fam = f"{status // 100}XX"
        if fam in self.family_counts:
            self.family_counts[fam] += 1
        self.endpoints[endpoint] = self.endpoints.get(endpoint, 0) + 1
        self.latencies.append(latency)

    def error_rate(self) -> str:
        if self.total == 0:
            return "0.00%"
        rate = (self.family_counts.get("5XX", 0) / self.total) * 100
        return f"{rate:.2f}%"

    def top_endpoints(self, k: int) -> str:
        if not self.endpoints:
            return "EMPTY"
        sorted_ep = sorted(self.endpoints.keys(), key=lambda ep: (-self.endpoints[ep], ep))
        return " ".join(sorted_ep[:k])

    def latency_percentile(self, p: float) -> str:
        if not self.latencies:
            return "0ms"
        sorted_lat = sorted(self.latencies)
        idx = max(0, math.ceil(p * len(sorted_lat)) - 1)
        return f"{sorted_lat[idx]}ms"

    def stats(self) -> str:
        p99 = self.latency_percentile(0.99)
        errs = self.family_counts.get("5XX", 0)
        return f"TOTAL: {self.total} ERRORS: {errs} P99: {p99} STATUS: HEALTHY"

def main():
    engine = LogEngine()
    for line in sys.stdin:
        line = line.strip()
        if not line or line == "EXIT":
            break
        parts = line.split(" ")
        cmd = parts[0]

        if cmd == "INGEST" and len(parts) >= 4:
            engine.ingest(int(parts[1]), int(parts[2]), parts[3])
            print("OK")
        elif cmd == "COUNT":
            print(engine.total)
        elif cmd == "STATUS_COUNT" and len(parts) >= 2:
            print(engine.status_counts.get(int(parts[1]), 0))
        elif cmd == "FAMILY_COUNT" and len(parts) >= 2:
            fam = parts[1].upper()
            print(engine.family_counts.get(fam, 0))
        elif cmd == "ERROR_RATE":
            print(engine.error_rate())
        elif cmd == "TOP_ENDPOINTS" and len(parts) >= 2:
            print(engine.top_endpoints(int(parts[1])))
        elif cmd == "LATENCY" and len(parts) >= 2:
            p_map = {"P50": 0.50, "P95": 0.95, "P99": 0.99}
            p = p_map.get(parts[1].upper(), 0.50)
            print(engine.latency_percentile(p))
        elif cmd == "STATS":
            print(engine.stats())
        elif cmd == "RESET":
            engine.reset()
            print("OK")

if __name__ == "__main__":
    main()
`,
    cpp: `// ALGO Challenge 06: Build a Log Engine (C++20)
// Inspired by Observability Systems
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <sstream>
#include <iomanip>
#include <cmath>

struct LogEngine {
    int total = 0;
    std::unordered_map<int, int> status_counts;
    std::unordered_map<std::string, int> family_counts;
    std::unordered_map<std::string, int> endpoints;
    std::vector<int> latencies;

    void reset() {
        total = 0;
        status_counts.clear();
        family_counts.clear();
        endpoints.clear();
        latencies.clear();
    }

    void ingest(int status, int latency, const std::string& ep) {
        total++;
        status_counts[status]++;
        std::string fam = std::to_string(status / 100) + "XX";
        family_counts[fam]++;
        endpoints[ep]++;
        latencies.push_back(latency);
    }

    std::string error_rate() {
        if (total == 0) return "0.00%";
        double rate = ((double)family_counts["5XX"] / total) * 100.0;
        std::ostringstream ss;
        ss << std::fixed << std::setprecision(2) << rate << "%";
        return ss.str();
    }

    std::string top_endpoints(int k) {
        if (endpoints.empty()) return "EMPTY";
        std::vector<std::pair<std::string, int>> vec(endpoints.begin(), endpoints.end());
        std::sort(vec.begin(), vec.end(), [](const auto& a, const auto& b) {
            if (a.second != b.second) return a.second > b.second;
            return a.first < b.first;
        });
        std::string out;
        for (int i = 0; i < std::min(k, (int)vec.size()); ++i) {
            if (!out.empty()) out += " ";
            out += vec[i].first;
        }
        return out;
    }

    std::string latency_percentile(double p) {
        if (latencies.empty()) return "0ms";
        std::vector<int> sorted = latencies;
        std::sort(sorted.begin(), sorted.end());
        int idx = std::max(0, (int)std::ceil(p * sorted.size()) - 1);
        return std::to_string(sorted[idx]) + "ms";
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    LogEngine engine;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty() || line == "EXIT") break;
        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "INGEST") {
            int status, latency;
            std::string ep;
            ss >> status >> latency >> ep;
            engine.ingest(status, latency, ep);
            std::cout << "OK\\n";
        } else if (cmd == "COUNT") {
            std::cout << engine.total << "\\n";
        } else if (cmd == "STATUS_COUNT") {
            int st;
            ss >> st;
            std::cout << engine.status_counts[st] << "\\n";
        } else if (cmd == "FAMILY_COUNT") {
            std::string fam;
            ss >> fam;
            std::cout << engine.family_counts[fam] << "\\n";
        } else if (cmd == "ERROR_RATE") {
            std::cout << engine.error_rate() << "\\n";
        } else if (cmd == "TOP_ENDPOINTS") {
            int k;
            ss >> k;
            std::cout << engine.top_endpoints(k) << "\\n";
        } else if (cmd == "LATENCY") {
            std::string p_str;
            ss >> p_str;
            double p = (p_str == "P99") ? 0.99 : (p_str == "P95" ? 0.95 : 0.50);
            std::cout << engine.latency_percentile(p) << "\\n";
        } else if (cmd == "STATS") {
            std::cout << "TOTAL: " << engine.total << " ERRORS: " << engine.family_counts["5XX"]
                      << " P99: " << engine.latency_percentile(0.99) << " STATUS: HEALTHY\\n";
        } else if (cmd == "RESET") {
            engine.reset();
            std::cout << "OK\\n";
        }
    }
    return 0;
}
`,
  },
};
