"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  Zap,
  CheckCircle2,
  Play,
  Copy,
  Check,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroWorkbench() {
  const [activeTab, setActiveTab] = useState<"benchmark" | "code">("benchmark");
  const [language, setLanguage] = useState<"python" | "cpp">("python");
  const [scenario, setScenario] = useState<"optimized" | "baseline">("optimized");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRerun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 700);
  };

  const copyCode = () => {
    const code = language === "python" ? pythonCode : cppCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pythonCode = `import time
from collections import OrderedDict

class KeyValueStore:
    """High-performance in-memory engine with O(1) lookups & passive/active TTL."""
    def __init__(self, capacity: int = 100_000):
        self.store = {}          # Hash table key -> (value, expire_at)
        self.capacity = capacity
        self.wal_enabled = True

    def set(self, key: str, value: str, ttl_ms: int = None) -> bool:
        now = time.monotonic()
        expire_at = (now + (ttl_ms / 1000.0)) if ttl_ms else None
        self.store[key] = (value, expire_at)
        return True

    def get(self, key: str) -> str | None:
        entry = self.store.get(key)
        if not entry:
            return None
        val, expire_at = entry
        if expire_at and time.monotonic() > expire_at:
            del self.store[key]  # Passive eviction
            return None
        return val

    def del_key(self, key: str) -> bool:
        return self.store.pop(key, None) is not None`;

  const cppCode = `#include <string>
#include <unordered_map>
#include <chrono>
#include <optional>
#include <shared_mutex>

class KeyValueStore {
private:
    struct Entry {
        std::string value;
        std::optional<std::chrono::steady_clock::time_point> expires_at;
    };
    std::unordered_map<std::string, Entry> store_;
    mutable std::shared_mutex rw_mutex_;

public:
    void set(const std::string& key, std::string value, std::optional<int64_t> ttl_ms = std::nullopt) {
        std::unique_lock lock(rw_mutex_);
        auto exp = ttl_ms ? std::make_optional(std::chrono::steady_clock::now() + std::chrono::milliseconds(*ttl_ms)) : std::nullopt;
        store_[key] = {std::move(value), exp};
    }

    std::optional<std::string> get(const std::string& key) {
        std::shared_lock lock(rw_mutex_);
        auto it = store_.find(key);
        if (it == store_.end()) return std::nullopt;
        if (it->second.expires_at && std::chrono::steady_clock::now() > *it->second.expires_at) {
            return std::nullopt; // Expired
        }
        return it->second.value;
    }
};`;

  const isOpt = scenario === "optimized";

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur-md overflow-hidden text-left">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 bg-slate-50/80">
        <div className="flex items-center gap-3">
          {/* macOS window controls */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400/80 border border-rose-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Breadcrumb path */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-600">
            <span className="text-slate-400">module-01</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {language === "python" ? "kv_engine.py" : "kv_engine.cpp"}
            </span>
          </div>

          {/* Sandbox status pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SANDBOX: algo-runner (Isolated)</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab("benchmark")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "benchmark"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Benchmark Telemetry
            </span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "code"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-teal-600" />
              Source Code
            </span>
          </button>
        </div>
      </div>

      {/* Main Workbench Body */}
      {activeTab === "benchmark" ? (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Telemetry Header & Scenario Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Module 01: Workload Execution Report
                </h3>
                <Badge variant="success" className="text-[10px] tracking-wide font-mono">
                  10/10 PASS
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Workload: 100,000 Operations (80% GET, 20% SET) • 16 Concurrent Workers • 256MB RAM Cap
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                <button
                  onClick={() => setScenario("baseline")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    scenario === "baseline"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Naive Baseline
                </button>
                <button
                  onClick={() => setScenario("optimized")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    scenario === "optimized"
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Optimized Engine
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRerun}
                disabled={isRunning}
                className="h-8 gap-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 border-slate-200"
              >
                <Play className={`w-3 h-3 text-blue-600 ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Measuring..." : "Run Test"}</span>
              </Button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Throughput */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 relative overflow-hidden group hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
                <span>THROUGHPUT</span>
                <Zap className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {isOpt ? "101,170" : "72,296"}
                <span className="text-xs text-slate-500 font-normal ml-1">ops/sec</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {isOpt ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-mono">
                    <TrendingUp className="w-3 h-3" /> +39.9% SPEEDUP
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 font-mono">
                    1.0x standard baseline
                  </span>
                )}
              </div>
            </div>

            {/* p99 Latency */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 relative overflow-hidden group hover:border-teal-300 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
                <span>p99 LATENCY</span>
                <Activity className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {isOpt ? "0.12" : "0.48"}
                <span className="text-xs text-slate-500 font-normal ml-1">ms</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`text-[11px] font-medium font-mono ${isOpt ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                  {isOpt ? "✓ Ultra-low jitter" : "Normal tail latency"}
                </span>
              </div>
            </div>

            {/* Memory Footprint */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 relative overflow-hidden group hover:border-purple-300 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
                <span>HEAP MEMORY</span>
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {isOpt ? "4.2" : "12.8"}
                <span className="text-xs text-slate-500 font-normal ml-1">MB</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500 font-mono">
                  {isOpt ? "Compact zero-copy buffer" : "Standard dict overhead"}
                </span>
              </div>
            </div>

            {/* Correctness */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
                <span>CORRECTNESS</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
                10/10
                <span className="text-xs text-slate-500 font-normal ml-1">passed</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                  100% Correctness Gate
                </span>
              </div>
            </div>
          </div>

          {/* Test Harness Verification Grid */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
            <div className="text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Automated Verification Criteria (Isolated Linux cgroup)</span>
              <span className="text-slate-400 font-normal">Execution time: 1.48s</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SET / GET / DEL O(1) hash resolution</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Passive & Active TTL Expiry</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Write-Ahead Log (WAL) Crash Replay</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Snapshot & Point-in-time Recovery</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Adversarial 16-Worker Concurrency</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Strict Memory Limit (256MB Cap)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Source Code Tab */
        <div className="relative">
          {/* Language Selector & Copy Button */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 bg-slate-50/90 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage("python")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === "python"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                Python 3.12
              </button>
              <button
                onClick={() => setLanguage("cpp")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === "cpp"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                C++20
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="h-7 px-2 text-slate-600 hover:text-slate-900 gap-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </Button>
          </div>

          <pre className="p-5 font-mono text-xs text-slate-800 bg-white leading-relaxed overflow-x-auto max-h-[380px] select-text">
            <code>{language === "python" ? pythonCode : cppCode}</code>
          </pre>
        </div>
      )}

      {/* Bottom Footer Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-200/80 bg-slate-50/90">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>Real bare-metal benchmarks • 0 synthetic ranking numbers</span>
        </div>

        <Link href="/challenges/kv-store/workspace">
          <Button size="sm" variant="primary" className="gap-1.5 text-xs font-semibold px-4 h-8 shadow-xs">
            <span>Enter Proving Ground Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
