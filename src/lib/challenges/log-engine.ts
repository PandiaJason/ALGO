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
      diagram: `RAW LOG INPUT                                  INGESTION ENGINE        OUTPUT
2026-09-07T12:00:00Z 200 12 /api/v1/checkout  ──► parse line tokens ──► OK
2026-09-07T12:00:01Z 500 45 /api/v1/payment   ──► parse line tokens ──► OK
STATS                                         ──► inspect counter   ──► TOTAL: 2`,
      importantChallenge: {
        title: "Regex vs Single-Pass Scanning",
        description:
          "Using regular expressions to parse high-velocity log streams causes catastrophic regex backtracking and memory allocation spikes. Systems-grade log processors scan for space delimiters in a single forward pass without allocating string arrays for every line.",
        codeOrFormat: "<TIMESTAMP> <STATUS> <LATENCY_MS> <ENDPOINT> ──► single forward pass delimiter scan",
      },
      endGoalDemonstration: `LOG 2026-09-07T12:00:00Z 200 15 /api/health
OK
LOG 2026-09-07T12:00:01Z 500 89 /api/checkout
OK
STATS
TOTAL: 2`,
      nextLevelTeaser:
        "In Level 2, we introduce status code distribution profiling, categorizing requests into 2xx, 3xx, 4xx, and 5xx families using fast array index mapping.",
      learningLoop: {
        bottleneck: "Regex matching on millions of log lines consumes massive CPU cycles. Single-pass delimiter scanning is orders of magnitude faster.",
        whatYouUnderstand: [
          "Delimited log line format: <TIMESTAMP> <STATUS> <LATENCY_MS> <ENDPOINT>.",
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
      diagram: `STREAM INGESTION              STATUS HISTOGRAM BUCKETS              OUTPUT
INGEST 200 10 /a       ──► status[200]++, family["2XX"]++    ──► OK
INGEST 500 80 /c       ──► status[500]++, family["5XX"]++    ──► OK
STATUS_COUNT 200       ──► lookup exact status: 200          ──► 1
FAMILY_COUNT 5XX       ──► lookup status family: 5XX         ──► 1

Status Code Histogram:
┌────────┬──────┬────────────────────────────┐
│ Family │ Code │ Count                      │
├────────┼──────┼────────────────────────────┤
│  2XX   │ 200  │ ████████████████ (2)       │
│  4XX   │ 404  │ ░░░░░░░░░░░░░░░░ (0)       │
│  5XX   │ 500  │ ████████ (1)               │
└────────┴──────┴────────────────────────────┘`,
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
      diagram: `STREAM INGESTION              SLO ERROR RATE CALCULATOR             OUTPUT
INGEST 200 ... x3      ──► total=3, 5xx=0                    ──► OK
INGEST 500 ... x1      ──► total=4, 5xx=1                    ──► OK
ERROR_RATE             ──► (5xx_count / total) * 100         ──► 25.00%

Error Rate Ratio:
Total Requests = 4  [ 200 | 200 | 200 | 500 ]
                                         ▲
                                         │ 1 Server Error (5XX)
Calculation: (1 / 4) * 100 = 25.00%`,
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
      diagram: `ENDPOINT INGESTION            FREQUENCY MAP & HEAVY HITTERS         TOP-K EXTRACTION
INGEST ... /users (x2) ──► endpoints["/users"] = 2           ──► OK
INGEST ... /home  (x1) ──► endpoints["/home"]  = 1           ──► OK
TOP_ENDPOINTS 2        ──► Sort by count DESC, name ASC      ──► /users /home

Heavy Hitters Ranking:
Rank 1: /users  [Count: 2] ──► Top 1
Rank 2: /home   [Count: 1] ──► Top 2
Rank 3: /about  [Count: 0]`,
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
      diagram: `REQUEST DURATIONS             ORDERED LATENCY BUFFER                PERCENTILE RANK
Durations: [10ms, 20ms, 30ms] ──► sorted = [10, 20, 30]
LATENCY P50                   ──► index = ceil(0.50 * 3) - 1 = 1    ──► 20ms
LATENCY P99                   ──► index = ceil(0.99 * 3) - 1 = 2    ──► 30ms

Percentile Cumulative Distribution:
Sorted: [ 10ms , 20ms , 30ms ]
                 ▲      ▲
                 │      │
            p50 (Median)│
                        p99 (Tail Latency SLA)`,
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
      diagram: `CONTINUOUS INGEST STREAM      TELEMETRY AGGREGATOR ENGINE           DASHBOARD STATS
INGEST 200 10 /ok      ──► Single-pass counter update        ──► OK
STATS                  ──► Real-time metric snapshot         ──► TOTAL: 1 ERRORS: 0
                                                                 P99: 10ms STATUS: HEALTHY
RESET                  ──► O(1) buffer reset                 ──► OK

Engine Architecture:
Raw Log Stream ──► Ingestion Filter ──► In-Memory Ring Buffer
                                    ──► P50/P99 Rank Selector ──► STATS
                                    ──► Error Rate Calculator`,
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
