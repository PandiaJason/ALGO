"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MonacoWrapper } from "@/components/editor/monaco-wrapper";
import { AlgoLogoIcon } from "@/components/layout/algo-logo-icon";
import { DEFAULT_STARTER_TEMPLATES } from "@/lib/constants/templates";
import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "@/lib/constants/challenge-data";
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
  BookOpen,
  Lightbulb,
  Layers,
  Cpu,
  Zap,
  Database,
  Sparkles,
  ShieldCheck,
  Compass,
  Info,
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
  const getInitialCode = (lang: "python" | "cpp") => {
    const dbTemplate =
      lang === "python"
        ? version.starterTemplates?.python
        : version.starterTemplates?.cpp;
    if (dbTemplate && dbTemplate.includes("SAVE") && dbTemplate.includes("stats")) {
      return dbTemplate;
    }
    return DEFAULT_STARTER_TEMPLATES[lang];
  };

  const [language, setLanguage] = useState<"python" | "cpp">("python");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [code, setCode] = useState<string>(() => getInitialCode("python"));
  const [leftTab, setLeftTab] = useState<"description" | "missions" | "submissions" | "leaderboard">("description");

  // Console drawer state
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result">("testcase");
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedResultCaseIndex, setSelectedResultCaseIndex] = useState(0);
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
    cases?: Array<{
      name: string;
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      error?: string;
    }>;
  } | null>(null);

  const [isScopeExpanded, setIsScopeExpanded] = useState(true);
  const levelData = LEVEL_DEFINITIONS;

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
    setCode(getInitialCode(newLang));
  };

  const handleReset = () => {
    if (confirm("Reset editor to original starter template?")) {
      setCode(getInitialCode(language));
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
          cases: [],
        });
      } else {
        setTestResult({
          passed: data.passed,
          total: data.total,
          details: data.details,
          output: data.output || "Tests complete.",
          cases: data.cases || [],
        });
        setSelectedResultCaseIndex(0);
      }
    } catch (err: any) {
      setTestResult({
        passed: 0,
        total: 5,
        details: err.message,
        output: "Network error calling test runner",
        cases: [],
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
      {/* Signature 4-Color Brand Accent Bar */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#099BE9] via-[#09C899] via-[#8647E2] to-[#F78424] shrink-0" />
      {/* 1. TOP NAVBAR (LeetCode Light Style) */}
      <header className="h-12 border-b border-slate-200/90 bg-white px-4 flex items-center justify-between shrink-0 select-none shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <AlgoLogoIcon size={24} className="transition-transform group-hover:scale-105" />
            <span className="font-black tracking-wider text-sm text-slate-900">
              ALGO
            </span>
            <ArrowLeft className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-700 transition-colors" />
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
                {/* Project Scope & Engineering Capstone Architecture Banner */}
                <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/40 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                        {PROJECT_SCOPE.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {PROJECT_SCOPE.title}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsScopeExpanded(!isScopeExpanded)}
                      className="text-xs font-mono text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span>{isScopeExpanded ? "Collapse Scope" : "Explore Full System Scope"}</span>
                      {isScopeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {PROJECT_SCOPE.overview}
                  </p>

                  {isScopeExpanded && (
                    <div className="space-y-3 pt-2 border-t border-blue-100 animate-in fade-in duration-200">
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          The 6 Architectural Engine Layers
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {PROJECT_SCOPE.architecturalLayers.map((layer) => (
                            <div
                              key={layer.number}
                              onClick={() => handleSelectLevel(layer.number)}
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                selectedLevel === layer.number
                                  ? "bg-white border-blue-400 shadow-2xs ring-1 ring-blue-300"
                                  : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-slate-900">
                                <span>Layer {layer.number}: {layer.name}</span>
                                <span className="text-[10px] font-mono text-blue-600">L{layer.number}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">{layer.focus}</div>
                              <p className="text-[11px] text-slate-600 mt-1 leading-snug">{layer.description}</p>
                              <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                                <Database className="w-3 h-3 text-slate-400" />
                                <span>Parity: {layer.realWorldTech}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capstone Outcome Callout */}
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Final System Outcome & Target Benchmark</span>
                        </div>
                        <p className="text-emerald-900/90 leading-relaxed">
                          {PROJECT_SCOPE.finalOutcome}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

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

                {/* 🎓 The Learning Loop & Mental Model Section */}
                <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/50 via-slate-50 to-blue-50/30 p-4 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        <Lightbulb className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                          The Learning Loop (Level {selectedLevel})
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          What you understand & master upon completing this level
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                      Mental Model L{selectedLevel}
                    </span>
                  </div>

                  {/* Core Bottleneck */}
                  <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1">
                    <div className="font-bold font-mono text-[10px] text-amber-800 uppercase flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-600" />
                      <span>The Real-World Engineering Bottleneck</span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      {currentLevelInfo.learningLoop.bottleneck}
                    </p>
                  </div>

                  {/* What You Understand (Key Takeaways) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
                      Key Concepts You Understand & Master:
                    </span>
                    <div className="space-y-1.5">
                      {currentLevelInfo.learningLoop.whatYouUnderstand.map((concept, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-white border border-slate-200/80 text-xs text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-World Production Parity & Summary */}
                  <div className="pt-2 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Database className="w-3.5 h-3.5 text-purple-600" />
                      <span className="font-semibold text-slate-700">Production Parity:</span>
                      <span>{currentLevelInfo.learningLoop.productionParity}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
                    <span className="font-bold font-mono text-[10px] text-blue-700 uppercase mr-1.5">Takeaway:</span>
                    {currentLevelInfo.learningLoop.outcomeSummary}
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

                        {/* Learning Loop Outcome Summary */}
                        <div className="mb-2.5 p-2 rounded-md bg-purple-50/60 border border-purple-200/60 text-[11px] text-purple-950 space-y-1">
                          <div className="font-bold flex items-center gap-1 text-[10px] font-mono uppercase text-purple-700">
                            <Lightbulb className="w-3 h-3" />
                            <span>What You Understand & Master</span>
                          </div>
                          <p className="leading-snug text-slate-700">
                            {lvlInfo.learningLoop.outcomeSummary}
                          </p>
                        </div>

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
                  <div className="space-y-3 font-sans">
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
                            <span className="text-slate-600 font-sans text-xs font-semibold">
                              Passed {testResult.passed} / {testResult.total} testcases
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Level {selectedLevel}
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Docker Sandbox: Active
                          </span>
                        </div>

                        {testResult.cases && testResult.cases.length > 0 ? (
                          <div className="space-y-3">
                            {/* Case selector tabs */}
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                              {testResult.cases.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSelectedResultCaseIndex(i)}
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                                    selectedResultCaseIndex === i
                                      ? c.passed
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-semibold"
                                        : "bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs font-semibold"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      c.passed ? "bg-emerald-500" : "bg-rose-500"
                                    }`}
                                  />
                                  Case {i + 1}
                                </button>
                              ))}
                            </div>

                            {/* Active case breakdown */}
                            {(() => {
                              const activeCase =
                                testResult.cases[selectedResultCaseIndex] ||
                                testResult.cases[0];
                              if (!activeCase) return null;
                              return (
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-800">
                                      {activeCase.name}
                                    </span>
                                    <span
                                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                        activeCase.passed
                                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                          : "text-rose-700 bg-rose-50 border border-rose-200"
                                      }`}
                                    >
                                      {activeCase.passed ? "✓ Passed" : "✗ Failed"}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[11px] text-slate-500 font-sans font-semibold">
                                      Standard Input:
                                    </span>
                                    <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 whitespace-pre-wrap shadow-2xs">
                                      {activeCase.input}
                                    </pre>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[11px] text-slate-500 font-sans font-semibold">
                                      Actual Output:
                                    </span>
                                    <pre
                                      className={`p-2.5 rounded-lg text-xs font-mono whitespace-pre-wrap shadow-2xs border ${
                                        activeCase.passed
                                          ? "bg-slate-50 border-slate-200 text-slate-800"
                                          : "bg-rose-50/60 border-rose-200 text-rose-800 font-medium"
                                      }`}
                                    >
                                      {activeCase.actual || "(No output produced)"}
                                    </pre>
                                    {activeCase.error && (
                                      <div className="text-[11px] text-rose-600 font-mono bg-rose-50 p-2 rounded border border-rose-200">
                                        Error: {activeCase.error}
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[11px] text-slate-500 font-sans font-semibold">
                                      Expected Output:
                                    </span>
                                    <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-emerald-700 font-semibold whitespace-pre-wrap shadow-2xs">
                                      {activeCase.expected}
                                    </pre>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Collapsible raw log */}
                            <details className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
                              <summary className="cursor-pointer font-medium hover:text-slate-700 py-1">
                                View Raw Sandbox Execution Log
                              </summary>
                              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] whitespace-pre-wrap mt-1">
                                {testResult.details}
                              </pre>
                            </details>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 whitespace-pre-wrap text-slate-800 text-xs shadow-2xs">
                            {testResult.details}
                          </div>
                        )}
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
