"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MonacoWrapper } from "@/components/editor/monaco-wrapper";
import { AlgoLogoIcon } from "@/components/layout/algo-logo-icon";
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  History,
  Trophy,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";

interface Props {
  challenge: {
    id: string;
    slug: string;
    title: string;
    description: string;
    difficulty: string;
  };
  version: {
    id: string;
    starterTemplates: {
      python: string;
      cpp: string;
    };
    levels: Array<{
      level: number;
      title: string;
      description: string;
    }>;
  };
  user: {
    id: string;
    username: string;
  } | null;
  pastSubmissions: Array<{
    id: string;
    status: string;
    language: string;
    level: number;
    submittedAt: string;
    throughputOpsSec?: string;
    score?: string;
    latencyP99Ms?: string;
    memoryBytes?: number;
    isCorrect?: boolean;
  }>;
  topLeaders: Array<{
    rank: number;
    score: string;
    throughputOpsSec: string;
    username: string;
    name: string | null;
  }>;
}

export function WorkspaceClient({
  challenge,
  version,
  user,
  pastSubmissions = [],
  topLeaders = [],
}: Props) {
  const router = useRouter();
  const [language, setLanguage] = useState<"python" | "cpp">("python");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [code, setCode] = useState<string>(version.starterTemplates.python || "");
  const [leftTab, setLeftTab] = useState<"description" | "missions" | "submissions" | "leaderboard">("description");

  // Console drawer state
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result">("testcase");
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState("SET alpha 42\nGET alpha\nEXISTS alpha\nDELETE alpha\nGET alpha");
  const [copied, setCopied] = useState(false);

  // Execution states
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    passed: number;
    total: number;
    details: string;
    output: string;
  } | null>(null);

  const levelData: Record<
    number,
    {
      level: number;
      shortTitle: string;
      title: string;
      difficulty: "Easy" | "Medium" | "Hard";
      tagline: string;
      operations: Array<{ cmd: string; desc: string }>;
      durabilityRules?: string[];
      examples: Array<{ title: string; input: string; output: string }>;
      constraints: string[];
      cases: Array<{ name: string; input: string; expected: string }>;
    }
  > = {
    1: {
      level: 1,
      shortTitle: "In-Memory Store",
      title: "Basic In-Memory Store",
      difficulty: "Easy",
      tagline:
        "Implement fundamental SET, GET, DELETE, and EXISTS operations with direct O(1) in-memory hash resolution.",
      operations: [
        { cmd: "SET key value", desc: "Stores key-value pair in memory. Overwrites existing value if present. Returns OK." },
        { cmd: "GET key", desc: "Retrieves value associated with key. Returns the string value or NULL if missing." },
        { cmd: "DELETE key", desc: "Deletes key from memory. Returns OK if deleted, or NOT_FOUND if missing." },
        { cmd: "EXISTS key", desc: "Checks key existence in store. Returns TRUE if present, or FALSE if missing." },
      ],
      durabilityRules: [
        "In-Memory Resolution: Store all keys and values in heap memory with average O(1) time complexity.",
        "Arbitrary Strings: Keys and values are arbitrary UTF-8 strings. Values may contain spaces or symbols.",
        "Idempotent Behavior: Missing keys must consistently return NULL for GET and NOT_FOUND for DELETE.",
      ],
      examples: [
        {
          title: "Example 1: SET & GET",
          input: "SET alpha 42\nGET alpha",
          output: "OK\n42",
        },
        {
          title: "Example 2: Missing Key",
          input: "GET non_existent_key",
          output: "NULL",
        },
        {
          title: "Example 3: Overwrite & DELETE",
          input: "SET score 10\nSET score 20\nGET score\nDELETE score\nGET score",
          output: "OK\nOK\n20\nOK\nNULL",
        },
      ],
      constraints: [
        "Time Complexity: O(1) average lookup and insertion.",
        "Memory Sandbox: 256MB RAM hard limit inside Docker container.",
        "String Encoding: Valid UTF-8 string encoding across all inputs.",
        "Execution Sandbox: Isolated non-root Docker runner with zero network access.",
      ],
      cases: [
        { name: "Case 1: Basic SET & GET", input: "SET alpha 42\nGET alpha", expected: "OK\n42" },
        { name: "Case 2: Missing Key", input: "GET non_existent_key", expected: "NULL" },
        { name: "Case 3: EXISTS Check", input: "SET beta 100\nEXISTS beta\nEXISTS gamma", expected: "OK\nTRUE\nFALSE" },
        { name: "Case 4: Overwrite Key", input: "SET score 10\nSET score 20\nGET score", expected: "OK\nOK\n20" },
        { name: "Case 5: DELETE & Re-query", input: "SET delta 999\nDELETE delta\nGET delta", expected: "OK\nOK\nNULL" },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Hash Table & Collision",
      title: "Efficient Lookup & Collision Resolution",
      difficulty: "Medium",
      tagline:
        "Build a custom internal hash table with 64-bit hashing, collision chaining / open addressing, and dynamic load factor threshold rehashing.",
      operations: [
        { cmd: "SET key value", desc: "Hashes key, computes bucket index, resolves collisions, and resizes if load factor > 0.75. Returns OK." },
        { cmd: "GET key", desc: "Probes collision chain / bucket to retrieve value. Returns value or NULL." },
        { cmd: "DELETE key", desc: "Removes entry and marks tombstone or unlinks node. Returns OK or NOT_FOUND." },
        { cmd: "EXISTS key", desc: "Probes bucket to verify existence. Returns TRUE or FALSE." },
        { cmd: "STATS", desc: "Returns internal hash table metrics: BUCKETS: <n> ELEMENTS: <m> LOAD: <load_factor>." },
      ],
      durabilityRules: [
        "Deterministic Hashing: Implement uniform 64-bit hashing (MurmurHash3 / FNV-1a) across all bucket slots.",
        "Collision Resolution: Implement separate chaining (linked list / bucket vector) or open addressing (linear probing).",
        "Dynamic Rehashing: When (elements / buckets) > 0.75, double bucket capacity and rehash all active entries.",
        "Tombstone Management: On deletion in open addressing, mark slot as tombstone to preserve search probe continuity.",
      ],
      examples: [
        {
          title: "Example 1: Collision Resolution",
          input: "SET k1 val1\nSET k2 val2\nGET k1\nGET k2",
          output: "OK\nOK\nval1\nval2",
        },
        {
          title: "Example 2: Table Expansion & STATS",
          input: "SET user:1 jason\nSET user:2 alex\nSET user:3 sam\nSTATS",
          output: "OK\nOK\nOK\nBUCKETS: 8 ELEMENTS: 3 LOAD: 0.38",
        },
      ],
      constraints: [
        "Maximum Load Factor: 0.75 threshold before dynamic rehashing.",
        "Initial Buckets: Start with at least 8 or 16 buckets.",
        "Amortized Complexity: O(1) insert, lookup, and delete.",
        "Memory Allocation: Zero memory leaks during rehashing or node deletion.",
      ],
      cases: [
        { name: "Case 1: Sequential Inserts", input: "SET a 1\nSET b 2\nGET a\nGET b", expected: "OK\nOK\n1\n2" },
        { name: "Case 2: Overwrite in Same Bucket", input: "SET key 10\nSET key 20\nGET key", expected: "OK\nOK\n20" },
        { name: "Case 3: DELETE with Probe Continuity", input: "SET x 1\nSET y 2\nDELETE x\nGET y", expected: "OK\nOK\nOK\n2" },
        { name: "Case 4: STATS Verification", input: "SET k1 1\nSTATS", expected: "OK\nBUCKETS: 8 ELEMENTS: 1 LOAD: 0.13" },
        { name: "Case 5: Non-existent Probing", input: "SET a 1\nGET z", expected: "OK\nNULL" },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Persistence & WAL",
      title: "Durable Persistence & Write-Ahead Log (WAL)",
      difficulty: "Medium",
      tagline:
        "Implement append-only write-ahead logging (WAL) and crash recovery replay. Ensure zero data loss across simulated process restarts.",
      operations: [
        { cmd: "SET / GET / DELETE / EXISTS", desc: "All Level 1 & 2 operations. Every mutation is synchronously flushed to wal.log before returning OK." },
        { cmd: "SAVE", desc: "Forces an immediate synchronous snapshot dump of in-memory keys to disk (dump.rdb). Returns OK." },
        { cmd: "RESTORE", desc: "Restores dataset from disk snapshot. Returns OK or NOT_FOUND if snapshot missing." },
        { cmd: "FLUSHALL", desc: "Clears all in-memory keys and truncates wal.log to 0 bytes. Returns OK." },
      ],
      durabilityRules: [
        "Write-Ahead Logging: Every mutating command (SET, DELETE, FLUSHALL) must append to ./data/wal.log before in-memory state is altered.",
        "Crash Recovery Replay: On engine boot (__init__), open wal.log and replay mutations chronologically to restore full state.",
        "Snapshot Serialization: SAVE creates an atomic point-in-time snapshot dump using temporary file rename.",
        "Tolerant Log Parser: Gracefully ignore truncated or corrupt trailing log lines without crashing or aborting initialization.",
      ],
      examples: [
        {
          title: "Example 1: Crash Recovery from WAL",
          input: "SET user:1 jason\nSET user:2 alex\n# Simulate engine restart\nGET user:1\nGET user:2",
          output: "OK\nOK\njason\nalex",
        },
        {
          title: "Example 2: Snapshot & Restore",
          input: "SET key1 value1\nSAVE\nFLUSHALL\nGET key1\nRESTORE\nGET key1",
          output: "OK\nOK\nOK\nNULL\nOK\nvalue1",
        },
      ],
      constraints: [
        "WAL Log File: ./data/wal.log.",
        "Sync Guarantee: Flush file buffers (fdatasync/flush) on each mutation.",
        "Crash Safety: Must survive SIGKILL and recover exact state.",
        "Replay Overhead: Must complete recovery under 50ms for 10,000 log entries.",
      ],
      cases: [
        { name: "Case 1: WAL Mutation Persistence", input: "SET user:1 jason\nGET user:1", expected: "OK\njason" },
        { name: "Case 2: SAVE Snapshot", input: "SET snapshot_key saved_data\nSAVE\nGET snapshot_key", expected: "OK\nOK\nsaved_data" },
        { name: "Case 3: FLUSHALL Reset", input: "SET tmp 123\nFLUSHALL\nGET tmp", expected: "OK\nOK\nNULL" },
        { name: "Case 4: Overwrite Durability", input: "SET count 1\nSET count 2\nGET count", expected: "OK\nOK\n2" },
        { name: "Case 5: DELETE Persistence", input: "SET active 1\nDELETE active\nGET active", expected: "OK\nOK\nNULL" },
      ],
    },
    4: {
      level: 4,
      shortTitle: "TTL & Expiration",
      title: "TTL & Key Expiration",
      difficulty: "Hard",
      tagline:
        "Implement millisecond-precision key expiration with dual-mode passive eviction on read and active background sweeping.",
      operations: [
        { cmd: "EXPIRE key ttl_ms", desc: "Sets time-to-live in milliseconds on key. Returns OK, or NOT_FOUND if key does not exist." },
        { cmd: "TTL key", desc: "Returns remaining lifetime in milliseconds, -1 if key has no TTL, or -2 if key does not exist." },
        { cmd: "PERSIST key", desc: "Removes expiration timer from key, making it permanent. Returns OK or NOT_FOUND." },
        { cmd: "GET key", desc: "Checks expiration timestamp. If current_time >= expire_at, deletes key and returns NULL." },
      ],
      durabilityRules: [
        "Passive Eviction (Lazy): Every read operation (GET, EXISTS, TTL) evaluates expiration. If expired, remove key immediately.",
        "Active Eviction Sweep: Periodically sample keys with TTL to evict expired keys that are never queried, preventing memory leaks.",
        "Overwrite Semantics: A SET command on an existing key without EXPIRE clears any previously set TTL (resets TTL to -1).",
        "Monotonic Clock: Use monotonic time (time.monotonic() in Python or steady_clock in C++) to prevent NTP/wall-clock drift issues.",
      ],
      examples: [
        {
          title: "Example 1: TTL Expiration",
          input: "SET token xyz\nEXPIRE token 50\n# sleep 60ms\nGET token\nTTL token",
          output: "OK\nOK\nNULL\n-2",
        },
        {
          title: "Example 2: PERSIST Command",
          input: "SET session 123\nEXPIRE session 60000\nTTL session\nPERSIST session\nTTL session",
          output: "OK\nOK\n>0\nOK\n-1",
        },
      ],
      constraints: [
        "Time Precision: Millisecond resolution (ttl_ms >= 1).",
        "TTL Return Codes: Positive integer (ms remaining), -1 (no expiration), -2 (key does not exist).",
        "Memory Cleanup: Bound expired keys memory under heavy workloads.",
        "Clock Monotonicity: Use steady/monotonic system time sources.",
      ],
      cases: [
        { name: "Case 1: EXPIRE & Query", input: "SET auth 99\nEXPIRE auth 5000\nGET auth", expected: "OK\nOK\n99" },
        { name: "Case 2: TTL Check", input: "SET perm 42\nTTL perm\nTTL not_there", expected: "OK\n-1\n-2" },
        { name: "Case 3: PERSIST Clears Expiration", input: "SET token abc\nEXPIRE token 10000\nPERSIST token\nTTL token", expected: "OK\nOK\nOK\n-1" },
        { name: "Case 4: Overwrite Clears TTL", input: "SET a 1\nEXPIRE a 1000\nSET a 2\nTTL a", expected: "OK\nOK\nOK\n-1" },
        { name: "Case 5: DELETE Expired Key", input: "SET b 1\nDELETE b\nTTL b", expected: "OK\nOK\n-2" },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Concurrency",
      title: "Concurrency & Thread-Safe Operations",
      difficulty: "Hard",
      tagline:
        "Scale across 16+ parallel client threads. Implement striped locking (sharded mutexes) or read-write locks to maximize concurrent throughput.",
      operations: [
        { cmd: "All Level 1-4 Operations", desc: "Fully thread-safe under concurrent multi-threaded execution without data races." },
        { cmd: "PING [msg]", desc: "Server health check. Returns PONG or echoed string." },
        { cmd: "MGET key1 key2 ...", desc: "Atomically retrieves multiple keys in a single consistent snapshot. Returns space-separated values." },
        { cmd: "MSET k1 v1 k2 v2 ...", desc: "Atomically stores multiple key-value pairs without interleaving partial writes. Returns OK." },
      ],
      durabilityRules: [
        "Striped Locking: Partition keyspace into 32 or 64 independent mutex shards to eliminate global lock bottleneck.",
        "Reader-Writer Locks: Allow concurrent simultaneous readers while acquiring exclusive locks only for mutations.",
        "Deadlock Avoidance: For multi-key operations (MGET, MSET), always acquire locks in sorted order of shard index.",
        "Thread Safety: Zero race conditions under 16 concurrent worker threads (verified via ThreadSanitizer).",
      ],
      examples: [
        {
          title: "Example 1: PING & Multi-Key Read",
          input: "PING\nSET k1 10\nSET k2 20\nMGET k1 k2 k3",
          output: "PONG\nOK\nOK\n10 20 NULL",
        },
        {
          title: "Example 2: Atomic Multi-Set",
          input: "MSET a 1 b 2 c 3\nGET a\nGET b\nGET c",
          output: "OK\n1\n2\n3",
        },
      ],
      constraints: [
        "Parallel Clients: Support 16+ concurrent threads without race conditions.",
        "Lock Striping Factor: At least 16 independent mutex partitions.",
        "Deadlock Free: Multi-key lock ordering must guarantee zero deadlocks.",
        "Correctness Gate: 100% test pass rate required under concurrent stress.",
      ],
      cases: [
        { name: "Case 1: PING Healthcheck", input: "PING\nPING hello", expected: "PONG\nhello" },
        { name: "Case 2: MSET Batch", input: "MSET alpha 1 beta 2 gamma 3\nGET alpha\nGET beta", expected: "OK\n1\n2" },
        { name: "Case 3: MGET Multi-Key Fetch", input: "SET x 10\nSET y 20\nMGET x y z", expected: "OK\nOK\n10 20 NULL" },
        { name: "Case 4: Concurrent Overwrite Consistency", input: "SET score 5\nSET score 10\nGET score", expected: "OK\nOK\n10" },
        { name: "Case 5: MSET with Existing Key Overwrite", input: "SET a 1\nMSET a 99 b 100\nGET a\nGET b", expected: "OK\nOK\n99\n100" },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Peak Perf & Memory",
      title: "Extreme Optimization & Memory Compaction",
      difficulty: "Hard",
      tagline:
        "Push hardware limits. Exceed 100,000 ops/sec with sub-0.20ms p99 latency under a strict 256MB memory cap using custom memory pooling and WAL compaction.",
      operations: [
        { cmd: "All Prior Operations", desc: "Executed with zero-copy I/O parsing, SIMD string comparisons, and cache-line aligned layouts." },
        { cmd: "COMPACT", desc: "Rewrites Write-Ahead Log by discarding superseded mutations and defragmenting memory. Returns OK." },
        { cmd: "MEMSTATS", desc: "Returns detailed memory metrics: ALLOCATED_BYTES: <n> PEAK_BYTES: <m> FRAGMENTATION_RATIO: <r>." },
      ],
      durabilityRules: [
        "Custom Memory Arena: Allocate memory in fixed-size slab pools to eliminate malloc/free heap fragmentation.",
        "Cache-Line Packing: Align hot data structures (hash node headers, key pointers) to 64-byte CPU cache lines.",
        "Zero-Copy Parsing: Parse incoming protocol buffers directly without allocating intermediate strings.",
        "Online WAL Compaction: Atomically replace bloated log files with clean point-in-time state snapshots.",
      ],
      examples: [
        {
          title: "Example 1: Log Compaction & Memory Stats",
          input: "SET key 1\nSET key 2\nSET key 3\nCOMPACT\nMEMSTATS\nGET key",
          output: "OK\nOK\nOK\nOK\nALLOCATED_BYTES: 1048 PEAK_BYTES: 2048 FRAGMENTATION_RATIO: 1.02\n3",
        },
        {
          title: "Example 2: High-Throughput Burst",
          input: "SET burst:1 val\nSET burst:2 val\nGET burst:1\nDELETE burst:2\nEXISTS burst:2",
          output: "OK\nOK\nval\nOK\nFALSE",
        },
      ],
      constraints: [
        "Throughput Benchmark: > 100,000 ops/sec sustained.",
        "p99 Latency Cap: < 0.20 ms under heavy load.",
        "Memory Quota: Hard 256MB cgroup enforcement.",
        "Durability: Full WAL crash recovery fidelity preserved after compaction.",
      ],
      cases: [
        { name: "Case 1: COMPACT Log Compaction", input: "SET user:1 old\nSET user:1 new\nCOMPACT\nGET user:1", expected: "OK\nOK\nOK\nnew" },
        { name: "Case 2: MEMSTATS Resource Breakdown", input: "SET sample test\nMEMSTATS", expected: "OK\nALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00" },
        { name: "Case 3: High-Frequency Insertion", input: "SET a 1\nSET b 2\nSET c 3\nGET b", expected: "OK\nOK\nOK\n2" },
        { name: "Case 4: Cache-Line Aligned Retrieval", input: "SET metric 99.9\nGET metric", expected: "OK\n99.9" },
        { name: "Case 5: Full Cycle Verification", input: "SET k v\nEXISTS k\nDELETE k\nEXISTS k", expected: "OK\nTRUE\nOK\nFALSE" },
      ],
    },
  };

  const handleSelectLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    const targetLevel = levelData[lvl] || levelData[1];
    setSelectedCaseIndex(0);
    setCustomInput(targetLevel.cases[0]?.input || "");
  };

  const currentLevelInfo = levelData[selectedLevel] || levelData[1];
  const sampleCases = currentLevelInfo.cases;


  const handleLanguageChange = (newLang: "python" | "cpp") => {
    setLanguage(newLang);
    setCode(
      newLang === "python"
        ? version.starterTemplates.python
        : version.starterTemplates.cpp
    );
  };

  const handleReset = () => {
    if (confirm("Reset editor to original starter template?")) {
      setCode(
        language === "python"
          ? version.starterTemplates.python
          : version.starterTemplates.cpp
      );
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Run quick correctness tests inside Docker sandbox
  const handleRunCode = async () => {
    if (!user) {
      router.push(`/sign-in?callbackUrl=/challenges/${challenge.slug}/workspace`);
      return;
    }
    setIsRunningTests(true);
    setIsConsoleOpen(true);
    setConsoleTab("result");

    try {
      const res = await fetch(`/api/challenges/${challenge.id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          level: selectedLevel,
          code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTestResult({
          passed: 0,
          total: 5,
          details: data.error || "Test runner failure",
          output: data.error || "Execution failed",
        });
      } else {
        setTestResult({
          passed: data.passed,
          total: data.total,
          details: data.details,
          output: data.output || "Tests complete.",
        });
      }
    } catch (err: any) {
      setTestResult({
        passed: 0,
        total: 5,
        details: err.message,
        output: "Network error calling test runner",
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // Submit official submission for benchmarking & leaderboard ranking
  const handleSubmit = async () => {
    if (!user) {
      router.push(`/sign-in?callbackUrl=/challenges/${challenge.slug}/workspace`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/challenges/${challenge.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeVersionId: version.id,
          language,
          level: selectedLevel,
          files: [
            {
              filename: language === "python" ? "store.py" : "store.cpp",
              content: code,
            },
          ],
        }),
      });

      const data = await res.json();
      if (res.ok && data.submissionId) {
        router.push(`/submissions/${data.submissionId}`);
      } else {
        alert(data.error || "Submission failed");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900 overflow-hidden font-sans">
      {/* 1. TOP NAVBAR (LeetCode Light Style) */}
      <header className="h-12 border-b border-slate-200/90 bg-white px-4 flex items-center justify-between shrink-0 select-none shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <AlgoLogoIcon size={26} />
            <ArrowLeft className="w-4 h-4 ml-1" />
            <span className="text-xs font-semibold text-slate-700 hover:text-slate-950">Problem List</span>
          </Link>

          <span className="text-slate-200">|</span>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {challenge.title}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
              Level {selectedLevel}: {currentLevelInfo.shortTitle}
            </span>
          </div>
        </div>

        {/* Center: Run & Submit Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunningTests || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>{isRunningTests ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isRunningTests}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-xs font-mono text-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold">{user.username}</span>
            </Link>
          )}
        </div>
      </header>

      {/* 2. MAIN SPLIT PANE BODY */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
        {/* LEFT PANEL: Problem Description, Missions, Submissions, Leaderboard */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          {/* Left Panel Tabs */}
          <div className="h-10 border-b border-slate-200 bg-slate-50/90 px-3 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "description"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setLeftTab("missions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "missions"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-600" />
              <span>Missions</span>
            </button>

            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "submissions"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5 text-emerald-600" />
              <span>Submissions ({pastSubmissions.length})</span>
            </button>

            <button
              onClick={() => setLeftTab("leaderboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "leaderboard"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>Leaderboard</span>
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 text-slate-700 text-xs leading-relaxed space-y-6">
            {leftTab === "description" && (
              <div className="space-y-6">
                {/* Header with Title & Level Selector Pills */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {challenge.title}
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold font-mono border ${
                      currentLevelInfo.difficulty === "Easy"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : currentLevelInfo.difficulty === "Medium"
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : "text-rose-700 bg-rose-50 border-rose-200"
                    }`}>
                      {currentLevelInfo.difficulty}
                    </span>
                  </div>

                  {/* Level Switcher Pills (LeetCode Sub-Topic Style) */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-mono">
                    {Object.entries(levelData).map(([lvlNumStr, lvlInfo]) => {
                      const num = Number(lvlNumStr);
                      const isActive = selectedLevel === num;
                      return (
                        <button
                          key={num}
                          onClick={() => handleSelectLevel(num)}
                          className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                            isActive
                              ? "bg-white text-slate-900 font-bold shadow-2xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                          }`}
                        >
                          L{num}: {lvlInfo.shortTitle}
                        </button>
                      );
                    })}
                  </div>

                  {/* Level Mission Banner */}
                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/70 text-blue-900 text-xs font-medium space-y-1">
                    <div className="font-bold flex items-center gap-1.5 font-mono text-[11px] text-blue-700 uppercase">
                      <span>Level {selectedLevel}: {currentLevelInfo.title}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {currentLevelInfo.tagline}
                    </p>
                  </div>
                </div>

                {/* Operations Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Supported Operations (Level {selectedLevel})
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Standard I/O protocol
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs divide-y divide-slate-100">
                    {currentLevelInfo.operations.map((op, idx) => (
                      <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-start gap-2 hover:bg-slate-50/60 transition-colors">
                        <code className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-blue-700 text-xs shrink-0 font-medium">
                          {op.cmd}
                        </code>
                        <span className="text-slate-600 text-xs leading-relaxed">
                          {op.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Durability / Engineering Protocol (for Level 2 & 3) */}
                {currentLevelInfo.durabilityRules && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Engineering & Durability Protocol
                    </h3>
                    <div className="p-4 rounded-lg bg-[#fafafa] border border-slate-200 space-y-2">
                      {currentLevelInfo.durabilityRules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-emerald-600 font-bold font-mono">•</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concrete Examples */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">Examples</h3>

                  {currentLevelInfo.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                      <div className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wide">
                        {ex.title}
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                        <div>
                          <div className="text-slate-400 font-semibold mb-0.5">Input:</div>
                          <pre className="text-slate-900 font-medium whitespace-pre-wrap">{ex.input}</pre>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-slate-400 font-semibold mb-0.5">Output:</div>
                          <pre className="text-emerald-700 font-semibold whitespace-pre-wrap">{ex.output}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints & Sandbox Limits */}
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900">Constraints & Evaluation</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs">
                    {currentLevelInfo.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {leftTab === "missions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Progressive Engineering Missions (Levels 1 – 6)
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400">
                    6 Progressive Milestones
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(levelData).map(([lvlNumStr, lvlInfo]) => {
                    const num = Number(lvlNumStr);
                    const isActive = selectedLevel === num;
                    return (
                      <div
                        key={num}
                        onClick={() => handleSelectLevel(num)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isActive
                            ? "bg-blue-50/70 border-blue-300 shadow-2xs ring-1 ring-blue-300"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              Mission {num}: {lvlInfo.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              lvlInfo.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : lvlInfo.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}>
                              {lvlInfo.difficulty}
                            </span>
                          </div>
                          {isActive ? (
                            <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                              Active Mission
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 hover:text-slate-700 font-medium">
                              Select L{num} →
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed mb-2.5">
                          {lvlInfo.tagline}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold mr-1">
                            Operations:
                          </span>
                          {lvlInfo.operations.map((op, idx) => (
                            <code
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200"
                            >
                              {op.cmd.split(" ")[0]}
                            </code>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {leftTab === "submissions" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">Submission History</h2>
                {pastSubmissions.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg text-slate-400">
                    No verified submissions yet. Click "Submit" to test your engine.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pastSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {sub.isCorrect ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-700 font-bold text-xs">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Wrong Answer
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              {sub.language} • Level {sub.level}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-600">
                            {sub.throughputOpsSec ? `${Number(sub.throughputOpsSec).toLocaleString()} ops/s` : "Pending"}
                            {sub.score && ` (${sub.score}x baseline)`}
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-slate-400 font-mono">
                          {new Date(sub.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftTab === "leaderboard" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">Verified Top Performers</h2>
                {topLeaders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg text-slate-400">
                    No verified records on the leaderboard yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topLeaders.map((lead) => (
                      <div
                        key={lead.rank}
                        className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              lead.rank === 1
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : lead.rank === 2
                                ? "bg-slate-200 text-slate-700 border border-slate-300"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {lead.rank}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">@{lead.username}</div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {Number(lead.throughputOpsSec).toLocaleString()} ops/sec
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-700">
                          {lead.score}x
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor (Top) + LeetCode Console Drawer (Bottom) */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-hidden">
          {/* Code Editor Header */}
          <div className="h-10 border-b border-slate-200 bg-slate-50/90 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-white text-slate-800 text-xs font-mono font-medium rounded-md px-2.5 py-1 border border-slate-300 shadow-2xs focus:outline-none cursor-pointer"
              >
                <option value="python">Python 3.12</option>
                <option value="cpp">C++ 20 (g++)</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => handleSelectLevel(Number(e.target.value))}
                className="bg-white text-slate-800 text-xs font-mono font-medium rounded-md px-2.5 py-1 border border-slate-300 shadow-2xs focus:outline-none cursor-pointer"
              >
                {Object.entries(levelData).map(([lvlNumStr, lvlInfo]) => {
                  const num = Number(lvlNumStr);
                  return (
                    <option key={num} value={num}>
                      L{num}: {lvlInfo.title}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Reset to Starter Template"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Surface (Pure Light Mode vs theme) */}
          <div className="flex-1 overflow-hidden bg-white">
            <MonacoWrapper
              value={code}
              language={language}
              onChange={(val) => setCode(val || "")}
              theme="vs"
            />
          </div>

          {/* 3. LEETCODE-STYLE CONSOLE DRAWER (LIGHT MODE) */}
          <div className="border-t border-slate-200 bg-white flex flex-col shrink-0">
            {/* Console Tab Header Bar */}
            <div className="h-9 px-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab("testcase");
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isConsoleOpen && consoleTab === "testcase"
                      ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Testcase
                </button>

                <button
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab("result");
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isConsoleOpen && consoleTab === "result"
                      ? "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Test Result
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded hover:bg-slate-200 transition-colors cursor-pointer font-medium"
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Console</span>
                  {isConsoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Console Drawer Body */}
            {isConsoleOpen && (
              <div className="h-56 overflow-y-auto p-4 bg-white text-xs font-mono">
                {consoleTab === "testcase" && (
                  <div className="space-y-3">
                    {/* Case Buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {sampleCases.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedCaseIndex(i);
                            setCustomInput(c.input);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                            selectedCaseIndex === i
                              ? "bg-slate-900 text-white font-semibold shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                          }`}
                        >
                          Case {i + 1}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-sans font-semibold">Standard Input:</span>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">
                          {sampleCases[selectedCaseIndex]?.name}
                        </span>
                      </div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 resize-none shadow-2xs"
                      />
                    </div>

                    {sampleCases[selectedCaseIndex]?.expected && (
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-sans font-semibold">Expected Output:</div>
                        <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-emerald-700 font-semibold whitespace-pre-wrap">
                          {sampleCases[selectedCaseIndex].expected}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {consoleTab === "result" && (
                  <div className="space-y-3">
                    {isRunningTests ? (
                      <div className="flex items-center gap-2 text-blue-600 py-6 font-sans">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Running tests inside isolated Docker sandbox...</span>
                      </div>
                    ) : testResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {testResult.passed === testResult.total ? (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Accepted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                                <XCircle className="w-4 h-4 text-rose-600" /> Wrong Answer
                              </span>
                            )}
                            <span className="text-slate-500 font-sans text-xs font-medium">
                              Passed {testResult.passed} / {testResult.total} testcases
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-slate-400">
                            Docker Sandbox: Active
                          </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 whitespace-pre-wrap text-slate-800 text-xs shadow-2xs">
                          {testResult.details}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 py-8 text-center font-sans">
                        Click "Run" to test your implementation against the automated test suite.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
