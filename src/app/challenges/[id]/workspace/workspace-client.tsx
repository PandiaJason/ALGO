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

  const sampleCases = [
    {
      name: "Case 1: Basic SET & GET",
      input: "SET alpha 42\nGET alpha",
      expected: "OK\n42",
    },
    {
      name: "Case 2: Missing Key",
      input: "GET non_existent_key",
      expected: "NULL",
    },
    {
      name: "Case 3: EXISTS Check",
      input: "SET beta 100\nEXISTS beta\nEXISTS gamma",
      expected: "OK\nTRUE\nFALSE",
    },
    {
      name: "Case 4: Overwrite Key",
      input: "SET score 10\nSET score 20\nGET score",
      expected: "OK\nOK\n20",
    },
    {
      name: "Case 5: DELETE & Re-query",
      input: "SET delta 999\nDELETE delta\nGET delta",
      expected: "OK\nOK\nNULL",
    },
  ];

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
              Level {selectedLevel}
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
                <div>
                  <h1 className="text-xl font-bold text-slate-900 mb-2">
                    {challenge.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Medium
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      Systems Engineering
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      In-Memory Database
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Reconstruct a high-performance in-memory key-value database inspired by Redis.
                    Your engine reads commands from standard input, executes operations against
                    internal data structures, and prints outputs to standard output.
                  </p>
                </div>

                {/* Operations Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Supported Operations</h3>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 shadow-2xs">
                    <div className="p-3 border-b border-slate-200 flex items-start gap-3 bg-white">
                      <code className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-blue-700 text-xs shrink-0 font-medium">SET key value</code>
                      <span className="text-slate-600">Stores key-value pair. Returns <code className="text-emerald-700 font-semibold font-mono">OK</code>.</span>
                    </div>
                    <div className="p-3 border-b border-slate-200 flex items-start gap-3 bg-white">
                      <code className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-blue-700 text-xs shrink-0 font-medium">GET key</code>
                      <span className="text-slate-600">Retrieves value. Returns <code className="text-slate-800 font-mono">NULL</code> if missing.</span>
                    </div>
                    <div className="p-3 border-b border-slate-200 flex items-start gap-3 bg-white">
                      <code className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-blue-700 text-xs shrink-0 font-medium">DELETE key</code>
                      <span className="text-slate-600">Deletes key. Returns <code className="text-emerald-700 font-semibold font-mono">OK</code> if deleted, or <code className="text-rose-700 font-semibold font-mono">NOT_FOUND</code>.</span>
                    </div>
                    <div className="p-3 flex items-start gap-3 bg-white">
                      <code className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 font-mono text-blue-700 text-xs shrink-0 font-medium">EXISTS key</code>
                      <span className="text-slate-600">Checks key existence. Returns <code className="text-emerald-700 font-semibold font-mono">TRUE</code> or <code className="text-slate-500 font-mono">FALSE</code>.</span>
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">Examples</h3>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wide">Example 1: SET & GET</div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                      <div className="text-slate-400 font-semibold">Input:</div>
                      <div className="text-slate-900 font-medium">SET alpha 42</div>
                      <div className="text-slate-900 font-medium">GET alpha</div>
                      <div className="text-slate-400 font-semibold mt-2 pt-1 border-t border-slate-100">Output:</div>
                      <div className="text-emerald-700 font-semibold">OK</div>
                      <div className="text-emerald-700 font-semibold">42</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wide">Example 2: Missing Key</div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                      <div className="text-slate-400 font-semibold">Input:</div>
                      <div className="text-slate-900 font-medium">GET non_existent_key</div>
                      <div className="text-slate-400 font-semibold mt-2 pt-1 border-t border-slate-100">Output:</div>
                      <div className="text-emerald-700 font-semibold">NULL</div>
                    </div>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900">Constraints & Environment</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs">
                    <li>Execution Sandbox: Isolated Docker container (<code className="text-slate-800 font-mono">algo-runner</code>)</li>
                    <li>Resource Limits: <code className="text-slate-800 font-mono">256MB RAM</code>, <code className="text-slate-800 font-mono">1.0 CPU</code>, strict timeout</li>
                    <li>Baseline Throughput: <code className="text-blue-600 font-mono font-semibold">100,000 ops/sec</code></li>
                    <li>Languages Supported: Python 3.12, C++ 20 (GCC -O3)</li>
                  </ul>
                </div>
              </div>
            )}

            {leftTab === "missions" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">Progressive Engineering Missions</h2>
                <div className="space-y-3">
                  {version.levels.map((lvl) => (
                    <div
                      key={lvl.level}
                      onClick={() => setSelectedLevel(lvl.level)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        selectedLevel === lvl.level
                          ? "bg-blue-50/70 border-blue-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          Mission {lvl.level}: {lvl.title}
                        </span>
                        {selectedLevel === lvl.level ? (
                          <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            Active Level
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">
                            Click to Select
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs leading-normal">
                        {lvl.description}
                      </p>
                    </div>
                  ))}
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
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="bg-white text-slate-800 text-xs font-mono font-medium rounded-md px-2.5 py-1 border border-slate-300 shadow-2xs focus:outline-none cursor-pointer"
              >
                {version.levels.map((lvl) => (
                  <option key={lvl.level} value={lvl.level}>
                    L{lvl.level}: {lvl.title}
                  </option>
                ))}
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
                      <div className="text-[11px] text-slate-500 font-sans font-semibold">Standard Input:</div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500 resize-none shadow-2xs"
                      />
                    </div>
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
