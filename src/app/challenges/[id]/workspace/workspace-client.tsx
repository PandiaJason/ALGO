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
  Zap,
  Terminal,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  History,
  Trophy,
  ArrowLeft,
  Sun,
  Moon,
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
  const [theme, setTheme] = useState<"vs-dark" | "vs">("vs-dark");
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
    <div className="flex flex-col h-screen bg-[#18181b] text-zinc-100 overflow-hidden font-sans">
      {/* 1. TOP NAVBAR (LeetCode Style) */}
      <header className="h-12 border-b border-zinc-800 bg-[#18181b] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <AlgoLogoIcon size={26} />
            <ArrowLeft className="w-4 h-4 ml-1" />
            <span className="text-xs font-semibold text-zinc-300 hover:text-white">Problem List</span>
          </Link>

          <span className="text-zinc-700">|</span>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100">
              {challenge.title}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Level {selectedLevel}
            </span>
          </div>
        </div>

        {/* Center: Run & Submit Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunningTests || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span>{isRunningTests ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isRunningTests}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "vs-dark" ? "vs" : "vs-dark")}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle Editor Theme"
          >
            {theme === "vs-dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user && (
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 text-xs font-mono text-zinc-300"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span>{user.username}</span>
            </Link>
          )}
        </div>
      </header>

      {/* 2. MAIN SPLIT PANE BODY */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT PANEL: Problem Description, Missions, Submissions, Leaderboard */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-zinc-800 bg-[#1e1e20] overflow-hidden">
          {/* Left Panel Tabs */}
          <div className="h-9 border-b border-zinc-800 bg-[#18181b] px-2 flex items-center gap-1 shrink-0">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                leftTab === "description"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setLeftTab("missions")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                leftTab === "missions"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Missions</span>
            </button>

            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                leftTab === "submissions"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Submissions ({pastSubmissions.length})</span>
            </button>

            <button
              onClick={() => setLeftTab("leaderboard")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                leftTab === "leaderboard"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>Leaderboard</span>
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 text-zinc-300 text-xs leading-relaxed space-y-6">
            {leftTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-white mb-2">
                    {challenge.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Medium
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-400">
                      Systems Engineering
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-400">
                      In-Memory Database
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    Reconstruct a high-performance in-memory key-value database inspired by Redis.
                    Your engine must read commands from standard input, execute operations against
                    your internal data structures, and print outputs to standard output.
                  </p>
                </div>

                {/* Operations Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Supported Operations</h3>
                  <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
                    <div className="p-3 border-b border-zinc-800 flex items-start gap-3">
                      <code className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-blue-400 text-xs shrink-0">SET key value</code>
                      <span className="text-zinc-400">Stores the key-value pair. Returns <code className="text-emerald-400">OK</code>.</span>
                    </div>
                    <div className="p-3 border-b border-zinc-800 flex items-start gap-3">
                      <code className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-blue-400 text-xs shrink-0">GET key</code>
                      <span className="text-zinc-400">Retrieves the value for key. Returns <code className="text-zinc-300">NULL</code> if missing.</span>
                    </div>
                    <div className="p-3 border-b border-zinc-800 flex items-start gap-3">
                      <code className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-blue-400 text-xs shrink-0">DELETE key</code>
                      <span className="text-zinc-400">Deletes the key. Returns <code className="text-emerald-400">OK</code> if deleted, or <code className="text-rose-400">NOT_FOUND</code>.</span>
                    </div>
                    <div className="p-3 flex items-start gap-3">
                      <code className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-blue-400 text-xs shrink-0">EXISTS key</code>
                      <span className="text-zinc-400">Checks if key exists. Returns <code className="text-emerald-400">TRUE</code> or <code className="text-zinc-400">FALSE</code>.</span>
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Examples</h3>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-[11px] font-mono text-zinc-400 font-semibold">Example 1: SET & GET</div>
                    <div className="bg-black/40 p-2.5 rounded font-mono text-xs text-zinc-200">
                      <div className="text-zinc-500 font-bold mb-1">Input:</div>
                      <div>SET alpha 42</div>
                      <div>GET alpha</div>
                      <div className="text-zinc-500 font-bold mt-2 mb-1">Output:</div>
                      <div className="text-emerald-400">OK</div>
                      <div className="text-emerald-400">42</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-[11px] font-mono text-zinc-400 font-semibold">Example 2: Missing Key</div>
                    <div className="bg-black/40 p-2.5 rounded font-mono text-xs text-zinc-200">
                      <div className="text-zinc-500 font-bold mb-1">Input:</div>
                      <div>GET non_existent_key</div>
                      <div className="text-zinc-500 font-bold mt-2 mb-1">Output:</div>
                      <div className="text-emerald-400">NULL</div>
                    </div>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <h3 className="text-sm font-semibold text-white">Constraints & Environment</h3>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
                    <li>Execution Sandbox: Isolated Docker container (<code className="text-zinc-300">algo-runner</code>)</li>
                    <li>Resource Limits: <code className="text-zinc-300">256MB RAM</code>, <code className="text-zinc-300">1.0 CPU</code>, strict timeout</li>
                    <li>Baseline Throughput: <code className="text-blue-400 font-mono">100,000 ops/sec</code></li>
                    <li>Languages Supported: Python 3.12, C++ 20 (GCC -O3)</li>
                  </ul>
                </div>
              </div>
            )}

            {leftTab === "missions" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white mb-2">Progressive Engineering Missions</h2>
                <div className="space-y-3">
                  {version.levels.map((lvl) => (
                    <div
                      key={lvl.level}
                      onClick={() => setSelectedLevel(lvl.level)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedLevel === lvl.level
                          ? "bg-blue-950/30 border-blue-500/50"
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white">
                          Mission {lvl.level}: {lvl.title}
                        </span>
                        {selectedLevel === lvl.level ? (
                          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            Active Level
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">
                            Click to Select
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-xs leading-normal">
                        {lvl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leftTab === "submissions" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white mb-2">Submission History</h2>
                {pastSubmissions.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg text-zinc-500">
                    No verified submissions yet. Click "Submit" to test your engine.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pastSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {sub.isCorrect ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-400 font-semibold text-xs">
                                <XCircle className="w-3.5 h-3.5" /> Wrong Answer
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">
                              {sub.language} • Level {sub.level}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400">
                            {sub.throughputOpsSec ? `${Number(sub.throughputOpsSec).toLocaleString()} ops/s` : "Pending"}
                            {sub.score && ` (${sub.score}x baseline)`}
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-zinc-500">
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
                <h2 className="text-sm font-semibold text-white mb-2">Verified Top Performers</h2>
                {topLeaders.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg text-zinc-500">
                    No verified records on the leaderboard yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topLeaders.map((lead) => (
                      <div
                        key={lead.rank}
                        className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              lead.rank === 1
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : lead.rank === 2
                                ? "bg-slate-400/20 text-slate-300 border border-slate-400/40"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {lead.rank}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">@{lead.username}</div>
                            <div className="text-[10px] font-mono text-zinc-400">
                              {Number(lead.throughputOpsSec).toLocaleString()} ops/sec
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-400">
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
        <div className="w-full md:w-1/2 flex flex-col bg-[#1e1e1e] overflow-hidden">
          {/* Code Editor Header */}
          <div className="h-9 border-b border-zinc-800 bg-[#18181b] px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-zinc-800 text-zinc-200 text-xs font-mono rounded px-2.5 py-1 border border-zinc-700 focus:outline-none"
              >
                <option value="python">Python 3.12</option>
                <option value="cpp">C++ 20 (g++)</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="bg-zinc-800 text-zinc-300 text-xs font-mono rounded px-2.5 py-1 border border-zinc-700 focus:outline-none"
              >
                {version.levels.map((lvl) => (
                  <option key={lvl.level} value={lvl.level}>
                    L{lvl.level}: {lvl.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleReset}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Reset to Starter Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Surface */}
          <div className="flex-1 overflow-hidden">
            <MonacoWrapper
              value={code}
              language={language}
              onChange={(val) => setCode(val || "")}
              theme={theme}
            />
          </div>

          {/* 3. LEETCODE-STYLE CONSOLE DRAWER */}
          <div className="border-t border-zinc-800 bg-[#18181b] flex flex-col shrink-0">
            {/* Console Tab Header Bar */}
            <div className="h-9 px-3 border-b border-zinc-800 flex items-center justify-between bg-[#1f1f22]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab("testcase");
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    isConsoleOpen && consoleTab === "testcase"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Testcase
                </button>

                <button
                  onClick={() => {
                    setIsConsoleOpen(true);
                    setConsoleTab("result");
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    isConsoleOpen && consoleTab === "result"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Test Result
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded hover:bg-zinc-800 transition-colors"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Console</span>
                  {isConsoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Console Drawer Body */}
            {isConsoleOpen && (
              <div className="h-56 overflow-y-auto p-4 bg-[#18181b] text-xs font-mono">
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
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors shrink-0 ${
                            selectedCaseIndex === i
                              ? "bg-zinc-800 text-white border border-zinc-700 font-semibold"
                              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-transparent"
                          }`}
                        >
                          Case {i + 1}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] text-zinc-400 font-sans font-medium">Standard Input:</div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        rows={5}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
                      />
                    </div>
                  </div>
                )}

                {consoleTab === "result" && (
                  <div className="space-y-3">
                    {isRunningTests ? (
                      <div className="flex items-center gap-2 text-blue-400 py-6">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Running tests inside isolated Docker sandbox...</span>
                      </div>
                    ) : testResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {testResult.passed === testResult.total ? (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" /> Accepted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-rose-400">
                                <XCircle className="w-4 h-4" /> Wrong Answer
                              </span>
                            )}
                            <span className="text-zinc-500 font-sans text-xs">
                              Passed {testResult.passed} / {testResult.total} testcases
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-zinc-400">
                            Docker Sandbox: OK
                          </span>
                        </div>

                        <div className="p-3 rounded bg-zinc-900 border border-zinc-800 whitespace-pre-wrap text-zinc-300 text-xs">
                          {testResult.details}
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 py-8 text-center font-sans">
                        Click "Run" to test your implementation against the test suite.
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
