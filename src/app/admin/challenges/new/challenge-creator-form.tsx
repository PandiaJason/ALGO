"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  FileCode,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface TestCase {
  name: string;
  input: string;
  expected: string;
}

export function ChallengeCreatorForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"spec" | "code" | "tests" | "bench">("spec");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("Build an LRU Cache");
  const [slug, setSlug] = useState("lru-cache");
  const [tagline, setTagline] = useState("Implement high-speed O(1) eviction with doubly-linked lists and hash tables.");
  const [description, setDescription] = useState(
    "Reconstruct a high-performance Least Recently Used (LRU) Cache from first principles.\nBuild the foundational data structures supporting O(1) get and put operations with strict memory bounds and automated benchmark validation."
  );
  const [difficulty, setDifficulty] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");

  const [pythonTemplate, setPythonTemplate] = useState(`import sys

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        # Hint: Use an ordered dict or doubly linked list + hash map for O(1)

    def get(self, key: str) -> str:
        if key not in self.cache:
            return "NULL"
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: str, value: str) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            # Evict oldest key
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = value

def main():
    cache = None
    for line in sys.stdin:
        parts = line.strip().split()
        if not parts:
            continue
        cmd = parts[0].upper()
        if cmd == "INIT":
            cache = LRUCache(int(parts[1]))
            print("OK")
        elif cmd == "PUT":
            cache.put(parts[1], parts[2])
            print("OK")
        elif cmd == "GET":
            print(cache.get(parts[1]))
        elif cmd == "EXIT":
            break

if __name__ == "__main__":
    main()
`);

  const [cppTemplate, setCppTemplate] = useState(`#include <iostream>
#include <string>
#include <unordered_map>
#include <list>

using namespace std;

class LRUCache {
private:
    int capacity;
    list<pair<string, string>> items;
    unordered_map<string, list<pair<string, string>>::iterator> cache;

public:
    LRUCache(int cap) : capacity(cap) {}

    string get(const string& key) {
        auto it = cache.find(key);
        if (it == cache.end()) return "NULL";
        items.splice(items.begin(), items, it->second);
        return it->second->second;
    }

    void put(const string& key, const string& value) {
        auto it = cache.find(key);
        if (it != cache.end()) {
            items.splice(items.begin(), items, it->second);
            it->second->second = value;
            return;
        }
        if (items.size() >= (size_t)capacity) {
            auto oldest = items.back();
            cache.erase(oldest.first);
            items.pop_back();
        }
        items.emplace_front(key, value);
        cache[key] = items.begin();
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    LRUCache* cache = nullptr;
    string cmd;

    while (cin >> cmd) {
        if (cmd == "INIT") {
            int cap;
            cin >> cap;
            delete cache;
            cache = new LRUCache(cap);
            cout << "OK\\n";
        } else if (cmd == "PUT") {
            string k, v;
            cin >> k >> v;
            cache->put(k, v);
            cout << "OK\\n";
        } else if (cmd == "GET") {
            string k;
            cin >> k;
            cout << cache->get(k) << "\\n";
        } else if (cmd == "EXIT") {
            break;
        }
    }

    delete cache;
    return 0;
}
`);

  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      name: "Case 1: Capacity & Basic Put/Get",
      input: "INIT 2\nPUT a 1\nPUT b 2\nGET a\nGET b",
      expected: "OK\nOK\nOK\n1\n2",
    },
    {
      name: "Case 2: Eviction on Overfill",
      input: "INIT 2\nPUT a 1\nPUT b 2\nPUT c 3\nGET a\nGET b\nGET c",
      expected: "OK\nOK\nOK\nOK\nNULL\n2\n3",
    },
    {
      name: "Case 3: Recency Access Prevents Eviction",
      input: "INIT 2\nPUT a 1\nPUT b 2\nGET a\nPUT c 3\nGET a\nGET b\nGET c",
      expected: "OK\nOK\nOK\n1\nOK\n1\nNULL\n3",
    },
    {
      name: "Case 4: Update Existing Key Value",
      input: "INIT 2\nPUT a 100\nPUT a 200\nGET a",
      expected: "OK\nOK\nOK\n200",
    },
    {
      name: "Case 5: Missing Key Access",
      input: "INIT 5\nGET missing_key",
      expected: "OK\nNULL",
    },
  ]);

  const [cpuLimit, setCpuLimit] = useState("1.00");
  const [memoryLimitMb, setMemoryLimitMb] = useState(256);
  const [timeoutSeconds, setTimeoutSeconds] = useState(60);
  const [baselineThroughput, setBaselineThroughput] = useState(85000);

  // 1-Click Preset Loaders
  const loadPreset = (type: "lru" | "rate_limiter") => {
    if (type === "lru") {
      setTitle("Build an LRU Cache");
      setSlug("lru-cache");
      setTagline("Implement high-speed O(1) eviction with doubly-linked lists and hash tables.");
      setDescription("Reconstruct a high-performance Least Recently Used (LRU) Cache from first principles.");
      setDifficulty("INTERMEDIATE");
      setBaselineThroughput(85000);
    } else if (type === "rate_limiter") {
      setTitle("Token Bucket Rate Limiter");
      setSlug("token-bucket-rate-limiter");
      setTagline("Design an in-memory token bucket rate limiter for high-concurrency API protection.");
      setDescription("Build an in-memory token bucket rate limiter supporting millisecond token refills, burst capacity, and sub-microsecond allowance checks.");
      setDifficulty("ADVANCED");
      setBaselineThroughput(110000);
      setTestCases([
        {
          name: "Case 1: Capacity & Initial Allowance",
          input: "INIT 5 1\nALLOW\nALLOW\nALLOW",
          expected: "OK\nTRUE\nTRUE\nTRUE",
        },
        {
          name: "Case 2: Exhaustion Rejection",
          input: "INIT 2 1\nALLOW\nALLOW\nALLOW",
          expected: "OK\nTRUE\nTRUE\nFALSE",
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title,
      slug: slug.toLowerCase().trim(),
      tagline,
      description,
      difficulty,
      status,
      supportedLanguages: ["python", "cpp"],
      spec: {
        overview: description,
        whatYouLearn: [
          "O(1) dictionary and composite data structure design",
          "Cache eviction algorithms and locality optimization",
          "Stress testing against high-throughput adversarial workloads",
        ],
        apiSpecification: [
          { command: "INIT capacity", returns: "OK", description: "Initializes the data structure." },
          { command: "PUT key value", returns: "OK", description: "Inserts or updates an entry." },
          { command: "GET key", returns: "value | NULL", description: "Fetches an entry." },
        ],
      },
      levels: [
        {
          level: 1,
          title: "Core Mechanics & Correctness",
          description: "Implement fundamental operations with 100% test pass rate.",
        },
      ],
      starterTemplates: {
        python: pythonTemplate,
        cpp: cppTemplate,
      },
      testDefinitions: testCases,
      benchmarkConfig: {
        cpuLimit,
        memoryLimitMb,
        timeoutSeconds,
        iterations: 5,
        warmupIterations: 2,
        baselineThroughput,
      },
    };

    try {
      const res = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create challenge");
      }

      setSuccess(`Challenge "${data.challenge.title}" created and published successfully!`);
      setTimeout(() => {
        router.push("/admin/challenges");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preset Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-semibold text-slate-800">Quick Templates:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadPreset("lru")}
            className="text-xs font-mono h-7 px-2.5"
          >
            LRU Cache
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadPreset("rate_limiter")}
            className="text-xs font-mono h-7 px-2.5"
          >
            Rate Limiter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/challenges">
            <Button type="button" variant="ghost" size="sm" className="text-xs">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="text-xs font-semibold bg-[#2d7cf6] hover:bg-[#256cd8] text-white gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Create & Publish Challenge</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("spec")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            activeTab === "spec" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Identity & Spec</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            activeTab === "code" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>2. Starter Code Templates</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tests")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            activeTab === "tests" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>3. Test Cases ({testCases.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bench")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            activeTab === "bench" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>4. Benchmark Quotas</span>
        </button>
      </div>

      {/* Tab 1: Identity & Spec */}
      {activeTab === "spec" && (
        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 bg-slate-50/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 bg-slate-50/50 text-xs font-mono focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2 rounded border border-slate-200 bg-slate-50/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-2 rounded border border-slate-200 bg-slate-50/50 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="EXPERT">EXPERT</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Publishing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 rounded border border-slate-200 bg-slate-50/50 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PUBLISHED">PUBLISHED (Live on Platform)</option>
                  <option value="DRAFT">DRAFT (Hidden from Public)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Description & Objective</label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded border border-slate-200 bg-slate-50/50 text-xs font-mono leading-relaxed focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Starter Code Templates */}
      {activeTab === "code" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-2.5 px-4 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
              <span className="font-mono font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                <span>solution.py (Python 3.12)</span>
              </span>
              <Badge variant="blue" className="text-[10px]">PYTHON</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                rows={18}
                value={pythonTemplate}
                onChange={(e) => setPythonTemplate(e.target.value)}
                className="w-full p-4 bg-[#0d1117] text-[#e6edf3] font-mono text-xs leading-relaxed focus:outline-none"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="py-2.5 px-4 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
              <span className="font-mono font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-teal-600" />
                <span>solution.cpp (C++20, g++ -O3)</span>
              </span>
              <Badge variant="success" className="text-[10px]">C++20</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                rows={18}
                value={cppTemplate}
                onChange={(e) => setCppTemplate(e.target.value)}
                className="w-full p-4 bg-[#0d1117] text-[#e6edf3] font-mono text-xs leading-relaxed focus:outline-none"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Test Cases */}
      {activeTab === "tests" && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-3 px-4 bg-slate-50/50 border-b border-slate-200 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-800 font-mono uppercase">
              Automated Validation Suite
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setTestCases([
                  ...testCases,
                  {
                    name: `Case ${testCases.length + 1}: Additional Check`,
                    input: "INPUT_COMMAND",
                    expected: "EXPECTED_OUTPUT",
                  },
                ])
              }
              className="text-xs gap-1 h-7"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Test Case</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {testCases.map((tc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={tc.name}
                    onChange={(e) => {
                      const updated = [...testCases];
                      updated[idx].name = e.target.value;
                      setTestCases(updated);
                    }}
                    className="font-bold text-slate-800 text-xs bg-white border border-slate-200 px-2 py-1 rounded w-72"
                  />
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTestCases(testCases.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">STANDARD INPUT (stdin)</label>
                    <textarea
                      rows={3}
                      value={tc.input}
                      onChange={(e) => {
                        const updated = [...testCases];
                        updated[idx].input = e.target.value;
                        setTestCases(updated);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">EXPECTED OUTPUT (stdout)</label>
                    <textarea
                      rows={3}
                      value={tc.expected}
                      onChange={(e) => {
                        const updated = [...testCases];
                        updated[idx].expected = e.target.value;
                        setTestCases(updated);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Benchmark Quotas */}
      {activeTab === "bench" && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="py-3 px-4 bg-slate-50/50 border-b border-slate-200">
            <CardTitle className="text-xs font-bold text-slate-800 font-mono uppercase">
              Container cgroups Quotas & Calibration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="text-[10px] text-slate-400 block mb-1">CPU LIMIT (--cpus)</label>
                <input
                  type="text"
                  value={cpuLimit}
                  onChange={(e) => setCpuLimit(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="text-[10px] text-slate-400 block mb-1">MEMORY LIMIT (--memory)</label>
                <input
                  type="number"
                  value={memoryLimitMb}
                  onChange={(e) => setMemoryLimitMb(parseInt(e.target.value, 10))}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="text-[10px] text-slate-400 block mb-1">TIMEOUT SECONDS</label>
                <input
                  type="number"
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(parseInt(e.target.value, 10))}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="text-[10px] text-slate-400 block mb-1">BASELINE (ops/sec)</label>
                <input
                  type="number"
                  value={baselineThroughput}
                  onChange={(e) => setBaselineThroughput(parseInt(e.target.value, 10))}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold text-[#2d7cf6]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
