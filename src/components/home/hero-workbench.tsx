"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Play,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Activity,
  Code2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroWorkbench() {
  const [activeTab, setActiveTab] = useState<"result" | "code">("result");
  const [language, setLanguage] = useState<"python" | "cpp">("python");
  const [activeCase, setActiveCase] = useState<number>(1);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 500);
  };

  const copyCode = () => {
    const code = language === "python" ? pythonCode : cppCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testCases = [
    {
      id: 1,
      name: "Case 1: Core Hash",
      detail: "SET / GET / DEL O(1) latency",
      input: 'set("user:101", "Jason") -> get("user:101")',
      output: '"Jason"',
      expected: '"Jason"',
      time: "0.08 ms",
    },
    {
      id: 2,
      name: "Case 2: TTL Expiry",
      detail: "Active & passive key expiration",
      input: 'set("session_token", "xyz", ttl_ms=50) -> sleep(60ms) -> get("session_token")',
      output: "None (expired)",
      expected: "None (expired)",
      time: "0.11 ms",
    },
    {
      id: 3,
      name: "Case 3: WAL Recovery",
      detail: "Crash replay from append-only log",
      input: 'append_wal("SET a 1") -> crash_engine() -> recover_wal() -> get("a")',
      output: '"1"',
      expected: '"1"',
      time: "0.24 ms",
    },
    {
      id: 4,
      name: "Case 4: Stress Workload",
      detail: "100K ops @ 16 concurrent workers",
      input: "100,000 ops (80% GET, 20% SET) under 256MB cap",
      output: "101,170 ops/sec (p99: 0.12ms)",
      expected: "> 100,000 ops/sec",
      time: "0.98 s",
    },
  ];

  const currentCase = testCases.find((c) => c.id === activeCase) || testCases[0];

  const pythonCode = `class KeyValueStore:
    def __init__(self):
        self.store = {}          # O(1) hash map
        self.wal_path = "wal.log"

    def set(self, key: str, value: str, ttl_ms: int = None) -> bool:
        expire_at = (time.monotonic() + ttl_ms/1000.0) if ttl_ms else None
        self.store[key] = (value, expire_at)
        return True

    def get(self, key: str) -> str | None:
        entry = self.store.get(key)
        if not entry:
            return None
        val, expire_at = entry
        if expire_at and time.monotonic() > expire_at:
            del self.store[key]
            return None
        return val`;

  const cppCode = `class KeyValueStore {
    std::unordered_map<std::string, Entry> store_;
    mutable std::shared_mutex rw_mutex_;
public:
    void set(const std::string& key, std::string val, std::optional<int64_t> ttl_ms) {
        std::unique_lock lock(rw_mutex_);
        auto exp = ttl_ms ? std::make_optional(std::chrono::steady_clock::now() + std::chrono::milliseconds(*ttl_ms)) : std::nullopt;
        store_[key] = {std::move(val), exp};
    }
    std::optional<std::string> get(const std::string& key) {
        std::shared_lock lock(rw_mutex_);
        auto it = store_.find(key);
        if (it == store_.end()) return std::nullopt;
        return it->second.value;
    }
};`;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden text-left font-sans">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-[#f8fafc]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-800 font-mono">
            Module 01: Key-Value Engine
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Sandbox: algo-runner (Isolated)
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-md text-xs font-medium">
          <button
            onClick={() => setActiveTab("result")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "result"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Test Result
            </span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "code"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-600" />
              Code
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "result" ? (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Status Header: LeetCode Accepted banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-emerald-600 tracking-tight flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Accepted
              </span>
              <span className="text-xs text-slate-400 font-mono">•</span>
              <span className="text-xs font-medium text-slate-600 font-mono">
                10/10 testcases passed
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="h-7 text-xs gap-1.5 border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
              >
                <Play className={`w-3 h-3 text-emerald-600 ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </Button>
              <Link href="/challenges/kv-store/workspace">
                <Button size="sm" variant="primary" className="h-7 text-xs gap-1 px-3">
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Minimal LeetCode Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200/70">
              <div className="text-[11px] text-slate-500">Throughput</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                101,170 <span className="text-[10px] font-normal text-slate-500">ops/s</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                Beats 98.4%
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200/70">
              <div className="text-[11px] text-slate-500">p99 Latency</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                0.12 <span className="text-[10px] font-normal text-slate-500">ms</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                Ultra-low jitter
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200/70">
              <div className="text-[11px] text-slate-500">Memory RSS</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                4.2 <span className="text-[10px] font-normal text-slate-500">MB</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                Zero leak
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200/70">
              <div className="text-[11px] text-slate-500">Sandbox Quota</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                256 <span className="text-[10px] font-normal text-slate-500">MB / 1 CPU</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Isolated cgroup
              </div>
            </div>
          </div>

          {/* Testcase Tabs (LeetCode style Case 1, Case 2, Case 3) */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto">
              {testCases.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => setActiveCase(tc.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeCase === tc.id
                      ? "bg-slate-900 text-white font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  Case {tc.id}
                </button>
              ))}
            </div>

            {/* Testcase Details Box */}
            <div className="p-3 rounded-lg border border-slate-200/90 bg-[#fafafa] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>{currentCase.detail}</span>
                <span>Time: {currentCase.time}</span>
              </div>
              <div>
                <span className="text-slate-400">Input: </span>
                <span className="text-slate-800">{currentCase.input}</span>
              </div>
              <div>
                <span className="text-slate-400">Output: </span>
                <span className="text-emerald-700 font-semibold">{currentCase.output}</span>
              </div>
              <div>
                <span className="text-slate-400">Expected: </span>
                <span className="text-slate-700">{currentCase.expected}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Source Code Tab */
        <div>
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage("python")}
                className={`px-2 py-0.5 rounded text-xs ${
                  language === "python"
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Python 3.12
              </button>
              <button
                onClick={() => setLanguage("cpp")}
                className={`px-2 py-0.5 rounded text-xs ${
                  language === "cpp"
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                C++20
              </button>
            </div>

            <button
              onClick={copyCode}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-800 bg-white overflow-x-auto max-h-[300px] leading-relaxed select-text">
            <code>{language === "python" ? pythonCode : cppCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
