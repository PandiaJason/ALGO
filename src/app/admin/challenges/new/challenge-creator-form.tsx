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

export interface ChallengeLevel {
  level: number;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert";
  tagline?: string;
  description: string;
  requirements?: string;
}

export function ChallengeCreatorForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"spec" | "levels" | "code" | "tests" | "bench">("spec");
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

  // Levels State
  const [levels, setLevels] = useState<ChallengeLevel[]>([
    {
      level: 1,
      title: "O(1) Cache Eviction Mechanics",
      difficulty: "Easy",
      tagline: "Implement fundamental get and put with doubly-linked list eviction.",
      description: "Build the foundational hash map and doubly-linked list supporting O(1) recency updates.",
      requirements: "All basic capacity and eviction test cases must pass with 100% correctness.",
    },
    {
      level: 2,
      title: "Memory Density & Pointer Locality",
      difficulty: "Medium",
      tagline: "Optimize node allocation overhead and minimize cache misses.",
      description: "Reduce heap fragmentation and dynamic allocations during frequent evictions.",
      requirements: "Memory overhead must remain strictly bounded under continuous mutation.",
    },
    {
      level: 3,
      title: "Throughput Scaling under Adversarial Access",
      difficulty: "Hard",
      tagline: "Scale throughput ops/sec under skewed Zipfian access distributions.",
      description: "Maximize sustained throughput ops/sec against adversarial random workloads.",
      requirements: "Exceed the 85,000 ops/sec baseline benchmark target.",
    },
  ]);

  const addLevel = () => {
    const nextNum = levels.length + 1;
    setLevels((prev) => [
      ...prev,
      {
        level: nextNum,
        title: `Level ${nextNum}: Advanced Milestone`,
        difficulty: nextNum <= 2 ? "Medium" : "Hard",
        tagline: "Implement additional constraints.",
        description: "Expand system capabilities under higher stress.",
        requirements: "Maintain backward compatibility with all prior levels.",
      },
    ]);
  };

  const removeLevel = (index: number) => {
    if (levels.length <= 1) {
      alert("At least one level is required.");
      return;
    }
    const filtered = levels.filter((_, i) => i !== index);
    setLevels(filtered.map((lvl, idx) => ({ ...lvl, level: idx + 1 })));
  };

  const updateLevel = (index: number, field: keyof ChallengeLevel, val: any) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

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
      setLevels([
        {
          level: 1,
          title: "O(1) Cache Eviction Mechanics",
          difficulty: "Easy",
          tagline: "Implement fundamental get and put with doubly-linked list eviction.",
          description: "Build the foundational hash map and doubly-linked list supporting O(1) recency updates.",
          requirements: "All basic capacity and eviction test cases must pass with 100% correctness.",
        },
        {
          level: 2,
          title: "Memory Density & Pointer Locality",
          difficulty: "Medium",
          tagline: "Optimize node allocation overhead and minimize cache misses.",
          description: "Reduce heap fragmentation and dynamic allocations during frequent evictions.",
          requirements: "Memory overhead must remain strictly bounded under continuous mutation.",
        },
        {
          level: 3,
          title: "Throughput Scaling under Adversarial Access",
          difficulty: "Hard",
          tagline: "Scale throughput ops/sec under skewed Zipfian access distributions.",
          description: "Maximize sustained throughput ops/sec against adversarial random workloads.",
          requirements: "Exceed the 85,000 ops/sec baseline benchmark target.",
        },
      ]);
    } else if (type === "rate_limiter") {
      setTitle("Token Bucket Rate Limiter");
      setSlug("token-bucket-rate-limiter");
      setTagline("Design an in-memory token bucket rate limiter for high-concurrency API protection.");
      setDescription("Build an in-memory token bucket rate limiter supporting millisecond token refills, burst capacity, and sub-microsecond allowance checks.");
      setDifficulty("ADVANCED");
      setBaselineThroughput(110000);
      setLevels([
        {
          level: 1,
          title: "Token Refill & Allowance Check",
          difficulty: "Medium",
          tagline: "Implement continuous token accrual and discrete atomic subtractions.",
          description: "Maintain accurate token pools across arbitrary millisecond intervals.",
          requirements: "Pass all burst allocation and exhaustion test cases.",
        },
        {
          level: 2,
          title: "Lock-Free Concurrency Scaling",
          difficulty: "Hard",
          tagline: "Scale allowance checks without global mutex contention.",
          description: "Use atomic compare-and-swap (CAS) loops or fine-grained key partitioning.",
          requirements: "Zero lock contention under concurrent load.",
        },
      ]);
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

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        name: `Case ${prev.length + 1}: Custom Assertion`,
        input: "COMMAND arg1 arg2",
        expected: "EXPECTED_OUTPUT",
      },
    ]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length <= 1) {
      alert("At least one test case is required.");
      return;
    }
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, field: keyof TestCase, val: string) => {
    setTestCases((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
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
      levels: levels,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/challenges">
            <Button variant="outline" size="sm" className="h-8 gap-1 text-slate-600">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Challenge Creation Studio
            </h1>
            <p className="text-xs text-slate-500">
              Design specifications, author starter templates, build test suites, and define progressive levels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadPreset("lru")}
            className="text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#099BE9]" />
            LRU Cache Preset
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadPreset("rate_limiter")}
            className="text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0AA793]" />
            Rate Limiter Preset
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-[#09C899]/10 border border-[#09C899]/30 text-[#0AA793] rounded-md text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#09C899]" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("spec")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "spec"
              ? "border-[#099BE9] text-[#099BE9]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          1. Identity & Spec
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("levels")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "levels"
              ? "border-[#099BE9] text-[#099BE9]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FBAE0C]" />
          2. Progressive Levels ({levels.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "code"
              ? "border-[#099BE9] text-[#099BE9]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          3. Starter Templates
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tests")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "tests"
              ? "border-[#099BE9] text-[#099BE9]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          4. Test Suite ({testCases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bench")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "bench"
              ? "border-[#099BE9] text-[#099BE9]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          5. Benchmarks & Sandbox
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: Spec & Identity */}
        {activeTab === "spec" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs font-semibold text-slate-900">
                  Challenge Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Challenge Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Build an In-Memory Key-Value Store"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">URL Slug (kebab-case)</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. kv-store"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Understand Redis from first principles. Build, measure, and optimize."
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Detailed Description & Architecture Spec</label>
                  <textarea
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a multi-paragraph architecture overview explaining the system to build, engineering trade-offs, and benchmarks..."
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Difficulty Tier</label>
                    <select
                      value={difficulty}
                      onChange={(e: any) => setDifficulty(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                      <option value="EXPERT">EXPERT</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Publication Status</label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible in Public Catalog)</option>
                      <option value="DRAFT">DRAFT (Hidden from Public)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Progressive Levels */}
        {activeTab === "levels" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-slate-900">Progressive Challenge Levels</h2>
                <p className="text-[11px] text-slate-500">
                  Configure the progressive roadmap, milestones, and requirements students work through.
                </p>
              </div>
              <Button
                type="button"
                onClick={addLevel}
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1 cursor-pointer bg-white"
              >
                <Plus className="w-3 h-3" />
                Add Level
              </Button>
            </div>

            <div className="space-y-4">
              {levels.map((lvl, idx) => (
                <Card key={idx} className="border border-slate-200 shadow-2xs">
                  <CardHeader className="py-2.5 px-4 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-900 text-white font-mono text-[11px] font-bold">
                        {lvl.level}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Level {lvl.level}: {lvl.title || "Untitled Level"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLevel(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Remove level"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Level Title</label>
                        <input
                          type="text"
                          required
                          value={lvl.title}
                          onChange={(e) => updateLevel(idx, "title", e.target.value)}
                          placeholder="e.g. Core Mechanics & Correctness"
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Difficulty Tier</label>
                        <select
                          value={lvl.difficulty || "Medium"}
                          onChange={(e: any) => updateLevel(idx, "difficulty", e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Tagline / Brief Summary</label>
                      <input
                        type="text"
                        value={lvl.tagline || ""}
                        onChange={(e) => updateLevel(idx, "tagline", e.target.value)}
                        placeholder="e.g. Implement fundamental operations with 100% test pass rate."
                        className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Goal & Description</label>
                        <textarea
                          rows={3}
                          value={lvl.description}
                          onChange={(e) => updateLevel(idx, "description", e.target.value)}
                          placeholder="Describe what the student needs to construct in this level..."
                          className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Requirements & Constraints</label>
                        <textarea
                          rows={3}
                          value={lvl.requirements || ""}
                          onChange={(e) => updateLevel(idx, "requirements", e.target.value)}
                          placeholder="Specific architectural constraints, memory bounds, or command semantics..."
                          className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white font-mono"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Starter Code Templates */}
        {activeTab === "code" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#099BE9]" />
                  Python 3.12 Starter Template (solution.py)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <textarea
                  rows={14}
                  value={pythonTemplate}
                  onChange={(e) => setPythonTemplate(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9]"
                  spellCheck={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#0AA793]" />
                  C++ 20 Starter Template (solution.cpp)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <textarea
                  rows={14}
                  value={cppTemplate}
                  onChange={(e) => setCppTemplate(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#09C899]"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 4: Test Definitions */}
        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-slate-900">Functional Test Matrix</h2>
                <p className="text-[11px] text-slate-500">
                  Submissions must pass 100% of these test cases to unlock throughput benchmarking.
                </p>
              </div>
              <Button
                type="button"
                onClick={addTestCase}
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Add Test Case
              </Button>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <Card key={idx} className="border border-slate-200">
                  <CardHeader className="py-2 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                    <input
                      type="text"
                      value={tc.name}
                      onChange={(e) => updateTestCase(idx, "name", e.target.value)}
                      className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-[#099BE9] px-1 rounded font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Remove test case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-500 uppercase">Standard Input (stdin)</label>
                      <textarea
                        rows={4}
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, "input", e.target.value)}
                        className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-slate-50"
                        spellCheck={false}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-500 uppercase">Expected Output (stdout)</label>
                      <textarea
                        rows={4}
                        value={tc.expected}
                        onChange={(e) => updateTestCase(idx, "expected", e.target.value)}
                        className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-slate-50"
                        spellCheck={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Benchmark Config */}
        {activeTab === "bench" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs font-semibold text-slate-900">
                  Kernel cgroup Resource Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">CPU Limit (Cores)</label>
                    <input
                      type="text"
                      value={cpuLimit}
                      onChange={(e) => setCpuLimit(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md font-mono"
                    />
                    <p className="text-[10px] text-slate-400">Strict cgroup --cpus limit for execution</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Memory Cap (MB)</label>
                    <input
                      type="number"
                      value={memoryLimitMb}
                      onChange={(e) => setMemoryLimitMb(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md font-mono"
                    />
                    <p className="text-[10px] text-slate-400">cgroup --memory cap; process killed on OOM</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Timeout (Seconds)</label>
                    <input
                      type="number"
                      value={timeoutSeconds}
                      onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md font-mono"
                    />
                    <p className="text-[10px] text-slate-400">Hard timeout before terminating container</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Baseline Throughput Target (ops/sec)</label>
                    <input
                      type="number"
                      value={baselineThroughput}
                      onChange={(e) => setBaselineThroughput(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md font-mono"
                    />
                    <p className="text-[10px] text-slate-400">100% score reference benchmark throughput</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer save button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Link href="/admin/challenges">
            <Button type="button" variant="outline" size="sm" className="text-xs">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="bg-[#099BE9] hover:bg-[#1984E9] text-white gap-1.5 cursor-pointer shadow-2xs"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Publish Challenge
          </Button>
        </div>
      </form>
    </div>
  );
}
