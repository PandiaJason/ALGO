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
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  GitBranch,
  Sparkles,
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

interface Props {
  initialChallenge: {
    id: string;
    slug: string;
    title: string;
    tagline: string | null;
    description: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    currentVersionNumber: number;
  };
  initialVersion: {
    version: number;
    spec: any;
    levels: any;
    starterTemplates: any;
    testDefinitions: any;
  } | null;
  initialFiles: Array<{
    filename: string;
    language: string;
    content: string;
  }>;
  initialBenchmarkConfig: {
    cpuLimit: string;
    memoryLimitMb: number;
    timeoutSeconds: number;
    iterations: number;
    warmupIterations: number;
    baselineMetrics?: any;
    baselineThroughput?: number | null;
  } | null;
}

export function ChallengeEditorForm({
  initialChallenge,
  initialVersion,
  initialFiles,
  initialBenchmarkConfig,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"spec" | "levels" | "code" | "tests" | "bench">("spec");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialChallenge.title);
  const [slug, setSlug] = useState(initialChallenge.slug);
  const [tagline, setTagline] = useState(initialChallenge.tagline || "");
  const [description, setDescription] = useState(initialChallenge.description);
  const [difficulty, setDifficulty] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">(
    initialChallenge.difficulty
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(initialChallenge.status);

  // Levels State
  const rawLevels = Array.isArray(initialVersion?.levels) && initialVersion.levels.length > 0
    ? initialVersion.levels.map((l: any, idx: number) => ({
        level: l.level || idx + 1,
        title: l.title || `Level ${idx + 1}`,
        difficulty: l.difficulty || (idx === 0 ? "Easy" : idx === 1 ? "Medium" : "Hard"),
        tagline: l.tagline || l.description || "",
        description: l.description || "",
        requirements: l.requirements || "",
      }))
    : [
        {
          level: 1,
          title: "Core Mechanics & Correctness",
          difficulty: "Easy" as const,
          tagline: "Implement fundamental operations with 100% test pass rate.",
          description: "Build the baseline data structures and command dispatch loops.",
          requirements: "All validation test cases must pass with zero runtime errors.",
        },
        {
          level: 2,
          title: "Efficient Lookup & Low Latency",
          difficulty: "Medium" as const,
          tagline: "Optimize operations for sub-millisecond lookups.",
          description: "Implement collision resolution, dynamic resizing, and load factor thresholding.",
          requirements: "Target O(1) operations with bounded memory overhead.",
        },
        {
          level: 3,
          title: "Concurrency & Stress Resilience",
          difficulty: "Hard" as const,
          tagline: "Scale under high-concurrency throughput benchmarks.",
          description: "Maximize throughput ops/sec and prevent race conditions or memory leaks.",
          requirements: "Achieve the baseline benchmark throughput target.",
        },
      ];

  const [levels, setLevels] = useState<ChallengeLevel[]>(rawLevels);

  const addLevel = () => {
    const nextNum = levels.length + 1;
    setLevels((prev) => [
      ...prev,
      {
        level: nextNum,
        title: `Level ${nextNum}: Advanced Optimization`,
        difficulty: nextNum <= 2 ? "Medium" : "Hard",
        tagline: "Scale data structure performance.",
        description: "Implement higher-tier algorithms and data structures.",
        requirements: "Must preserve correctness while achieving target throughput.",
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

  // Starter Code
  const pythonFile = initialFiles.find((f) => f.language === "python" || f.filename.endsWith(".py"));
  const cppFile = initialFiles.find((f) => f.language === "cpp" || f.filename.endsWith(".cpp"));

  const [pythonTemplate, setPythonTemplate] = useState(
    pythonFile?.content || initialVersion?.starterTemplates?.python || "# Python starter template\n"
  );
  const [cppTemplate, setCppTemplate] = useState(
    cppFile?.content || initialVersion?.starterTemplates?.cpp || "// C++ starter template\n"
  );

  // Test Cases
  const rawTests = initialVersion?.testDefinitions || [];
  const [testCases, setTestCases] = useState<TestCase[]>(
    Array.isArray(rawTests) && rawTests.length > 0
      ? rawTests
      : [
          {
            name: "Test Case 1",
            input: "PING\nEXIT",
            expected: "PONG",
          },
        ]
  );

  // Benchmark Config
  const [cpuLimit, setCpuLimit] = useState(initialBenchmarkConfig?.cpuLimit || "1.00");
  const [memoryLimitMb, setMemoryLimitMb] = useState(initialBenchmarkConfig?.memoryLimitMb || 256);
  const [timeoutSeconds, setTimeoutSeconds] = useState(initialBenchmarkConfig?.timeoutSeconds || 60);
  const [baselineThroughput, setBaselineThroughput] = useState(
    initialBenchmarkConfig?.baselineMetrics?.baselineThroughput ||
    initialBenchmarkConfig?.baselineThroughput ||
    85000
  );

  // Versioning option
  const [createNewVersion, setCreateNewVersion] = useState(false);

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
      createNewVersion,
      spec: {
        overview: description,
        whatYouLearn: initialVersion?.spec?.whatYouLearn || [
          "Data structure and systems design",
          "Low-level memory efficiency",
          "Adversarial workload optimization",
        ],
        apiSpecification: initialVersion?.spec?.apiSpecification || [],
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
      const res = await fetch(`/api/admin/challenges/${initialChallenge.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update challenge");
      }

      setSuccess(`Challenge "${data.challenge.title}" saved successfully (v${data.versionNumber || initialChallenge.currentVersionNumber}.0)!`);
      setTimeout(() => {
        router.push("/admin/challenges");
        router.refresh();
      }, 1200);
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Edit Challenge
              </h1>
              <Badge variant="blue" className="text-[10px]">
                v{initialChallenge.currentVersionNumber}.0
              </Badge>
              <Badge
                variant={status === "PUBLISHED" ? "success" : status === "DRAFT" ? "secondary" : "destructive"}
                className="text-[10px]"
              >
                {status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              ID: {initialChallenge.id} &bull; Slug: /{initialChallenge.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/challenges/${initialChallenge.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-slate-600">
              <ExternalLink className="w-3.5 h-3.5" />
              Preview Public
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="sm"
            className="h-8 bg-[#099BE9] hover:bg-[#1984E9] text-white gap-1.5 shadow-2xs cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Changes
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
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
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
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </div>

                {/* Version bump option */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#099BE9]" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Version Management</p>
                      <p className="text-[11px] text-slate-500">
                        Active version: v{initialChallenge.currentVersionNumber}.0. Enable to increment version number to v{initialChallenge.currentVersionNumber + 1}.0.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={createNewVersion}
                      onChange={(e) => setCreateNewVersion(e.target.checked)}
                      className="rounded border-slate-300 text-[#099BE9] focus:ring-[#099BE9]"
                    />
                    Bump to v{initialChallenge.currentVersionNumber + 1}.0
                  </label>
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
            {createNewVersion ? `Save as v${initialChallenge.currentVersionNumber + 1}.0` : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
