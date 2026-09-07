"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MonacoWrapper } from "@/components/editor/monaco-wrapper";
import { AlgoLogoIcon } from "@/components/layout/algo-logo-icon";
import { DEFAULT_STARTER_TEMPLATES } from "@/lib/constants/templates";
import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "@/lib/constants/challenge-data";
import { getChallenge } from "@/lib/challenges";
import { SupportedLanguage } from "@/lib/challenges/types";
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
  ChevronRight,
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
  AlertTriangle,
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
    levels: Array<any>;
    spec?: any;
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
  const challengeData = getChallenge(challenge.slug);

  // Parse version.levels if it came in as a string
  const rawLevels = typeof version.levels === "string" 
    ? (() => { try { return JSON.parse(version.levels); } catch { return []; } })()
    : version.levels;

  const validDbLevels = Array.isArray(rawLevels) && rawLevels.length > 0 && (rawLevels[0]?.shortTitle || rawLevels[0]?.title)
    ? rawLevels
    : null;

  const dbLevelsRecord: Record<number, any> | null = validDbLevels
    ? Object.fromEntries(validDbLevels.map((l: any, idx: number) => [l.level || idx + 1, l]))
    : null;

  const isKv = challenge.slug === "kv-store";
  const levelData = (dbLevelsRecord && dbLevelsRecord[1]?.shortTitle)
    ? dbLevelsRecord
    : (challengeData?.levels || (isKv ? LEVEL_DEFINITIONS : {}));

  const getInitialCode = (lang: SupportedLanguage) => {
    let rawTemplates = version.starterTemplates;
    if (typeof rawTemplates === "string") {
      try { rawTemplates = JSON.parse(rawTemplates); } catch {}
    }
    const dbTemplate = (rawTemplates as any)?.[lang];
    if (dbTemplate && typeof dbTemplate === "string" && dbTemplate.length > 20) {
      return dbTemplate;
    }
    if ((challengeData?.starterTemplates as any)?.[lang]) {
      return (challengeData?.starterTemplates as any)[lang];
    }
    return (DEFAULT_STARTER_TEMPLATES as any)[lang] || "";
  };

  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [code, setCode] = useState<string>(() => getInitialCode("python"));
  const [leftTab, setLeftTab] = useState<"description" | "missions" | "submissions" | "leaderboard">("description");
  const [descSubTab, setDescSubTab] = useState<"spec" | "diagram" | "gotcha" | "examples">("spec");

  // Console drawer state
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result">("testcase");
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedResultCaseIndex, setSelectedResultCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState(() => {
    const l1 = levelData[1];
    return l1?.cases?.[0]?.input || (isKv ? "SET alpha 42\nGET alpha\nEXISTS alpha\nDELETE alpha\nGET alpha" : "GET /hello");
  });
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

  const handleSelectLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    const targetLevel = levelData[lvl] || levelData[1];
    setSelectedCaseIndex(0);
    setCustomInput(targetLevel?.cases?.[0]?.input || "");
  };

  const currentLevelInfo = levelData[selectedLevel] || levelData[1] || {};
  const sampleCases = currentLevelInfo?.cases || [];


  const handleLanguageChange = (newLang: SupportedLanguage) => {
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
              filename:
                language === "python"
                  ? "store.py"
                  : language === "cpp"
                  ? "store.cpp"
                  : language === "rust"
                  ? "store.rs"
                  : language === "go"
                  ? "main.go"
                  : "Solution.java",
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#FBAE0C]/10 text-[#F78424] border border-[#FBAE0C]/30">
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
            <Play className="w-3.5 h-3.5 text-[#099BE9] fill-[#099BE9]" />
            <span>{isRunningTests ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isRunningTests}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#09C899] hover:bg-[#0AA793] text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href={`/u/${user.username}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-xs font-mono text-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#099BE9] to-[#09C899] flex items-center justify-center text-[10px] text-white font-bold">
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
              <FileText className="w-3.5 h-3.5 text-[#099BE9]" />
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
              <Target className="w-3.5 h-3.5 text-[#FBAE0C]" />
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
              <History className="w-3.5 h-3.5 text-[#09C899]" />
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
              <Trophy className="w-3.5 h-3.5 text-[#8647E2]" />
              <span>Leaderboard</span>
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 text-slate-700 text-xs leading-relaxed space-y-6">
            {leftTab === "description" && (
              <div className="space-y-6">
                {/* Project Scope & Engineering Capstone Architecture Banner */}
                {(() => {
                  let spec = (version.spec as any) || {};
                  if (typeof spec === "string") {
                    try { spec = JSON.parse(spec); } catch { spec = {}; }
                  }
                  const layers = (Array.isArray(spec.architecturalLayers) && spec.architecturalLayers.length > 0)
                    ? spec.architecturalLayers
                    : (challengeData?.architecturalLayers || (isKv ? PROJECT_SCOPE.architecturalLayers : []));
                  const badge = spec.badge || challengeData?.badge || `${challenge.title.toUpperCase()} CAPSTONE`;
                  const title = challengeData?.title || spec.title || challenge.title;
                  const overview = challengeData?.overview || spec.overview || challenge.description;
                  const outcome = challengeData?.finalOutcome || spec.finalOutcome || (isKv ? PROJECT_SCOPE.finalOutcome : overview);
                  const philosophy = challengeData?.philosophy;
                  const architectureDiagram = challengeData?.architectureDiagram;
                  const levelRoadmap = challengeData?.levelRoadmap;

                  return (
                    <div className="rounded-xl border border-[#099BE9]/30 bg-gradient-to-br from-[#099BE9]/10 via-slate-50 to-[#8647E2]/10 p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#099BE9] text-white shadow-2xs">
                            {badge}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {title}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsScopeExpanded(!isScopeExpanded)}
                          className="text-xs font-mono text-[#099BE9] hover:text-[#1984E9] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <span>{isScopeExpanded ? "Collapse Scope" : "Explore Full System Scope"}</span>
                          {isScopeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {philosophy && (
                        <p className="text-[11px] font-mono text-[#8647E2] italic font-semibold">
                          &ldquo;{philosophy}&rdquo;
                        </p>
                      )}

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {overview}
                      </p>

                      {isScopeExpanded && (
                        <div className="space-y-4 pt-2 border-t border-[#099BE9]/20 animate-in fade-in duration-200">
                          {/* System Architecture ASCII Blueprint */}
                          {architectureDiagram && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-[#099BE9]" />
                                System Architecture Blueprint
                              </span>
                              <div className="rounded-lg bg-slate-950 p-3 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
                                <pre className="whitespace-pre leading-relaxed text-[#09C899] font-medium">{architectureDiagram}</pre>
                              </div>
                            </div>
                          )}

                          {/* Unified Progressive 6-Level Roadmap & Parity Table */}
                          {Array.isArray(levelRoadmap) && levelRoadmap.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[#8647E2]" />
                                Progressive 6-Level Roadmap & Systems Parity
                              </span>
                              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs shadow-2xs">
                                <div className="grid grid-cols-12 bg-slate-100 p-2 font-mono font-bold text-[10px] text-slate-600 uppercase border-b border-slate-200">
                                  <div className="col-span-2">Level</div>
                                  <div className="col-span-4">What You Build</div>
                                  <div className="col-span-4">Core Systems Concept</div>
                                  <div className="col-span-2">Parity</div>
                                </div>
                                {levelRoadmap.map((item: any, idx: number) => {
                                  const matchingLayer = layers[idx] || layers.find((l: any) => l.number === item.level);
                                  const parity = matchingLayer?.realWorldTech?.split(",")[0] || matchingLayer?.realWorldTech || "Production Standard";
                                  const isActive = selectedLevel === item.level;
                                  return (
                                    <div
                                      key={item.level}
                                      onClick={() => handleSelectLevel(item.level)}
                                      className={`grid grid-cols-12 p-2 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 transition-colors items-center ${
                                        isActive ? "bg-[#099BE9]/10 font-semibold text-slate-900 ring-1 ring-inset ring-[#099BE9]/30" : "text-slate-700"
                                      }`}
                                    >
                                      <div className="col-span-2 font-mono text-[11px] font-bold text-[#099BE9]">L{item.level}</div>
                                      <div className="col-span-4 text-slate-800 text-[11px] font-medium">{item.whatWeBuild}</div>
                                      <div className="col-span-4 text-slate-500 font-mono text-[10px] leading-tight">{item.mainConcept}</div>
                                      <div className="col-span-2 text-slate-400 font-mono text-[10px] truncate" title={matchingLayer?.realWorldTech}>
                                        {parity}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Capstone Outcome Callout */}
                          <div className="p-3 rounded-lg bg-[#09C899]/10 border border-[#09C899]/30 text-slate-900 text-xs space-y-1">
                            <div className="font-bold flex items-center gap-1.5 font-mono text-[11px] text-[#0AA793] uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" />
                              <span>Final System Outcome & Target Benchmark</span>
                            </div>
                            <p className="text-slate-800 leading-relaxed">
                              {outcome}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Header with Title & Level Selector Pills */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {challenge.title}
                    </h1>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold font-mono border ${
                      currentLevelInfo.difficulty === "Easy"
                        ? "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30"
                        : currentLevelInfo.difficulty === "Medium"
                        ? "text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30"
                        : "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30"
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
                  <div className="p-3 rounded-lg bg-[#099BE9]/10 border border-[#099BE9]/30 text-slate-900 text-xs font-medium space-y-1">
                    <div className="font-bold flex items-center gap-1.5 font-mono text-[11px] text-[#099BE9] uppercase">
                      <span>Level {selectedLevel}: {currentLevelInfo.title}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {currentLevelInfo.tagline}
                    </p>
                  </div>
                </div>

                {/* Level Detail Sub-Tabs Navigation */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-[11px] font-mono">
                  <button
                    onClick={() => setDescSubTab("spec")}
                    className={`flex-1 py-1 px-2 rounded font-semibold transition-all cursor-pointer text-center ${
                      descSubTab === "spec"
                        ? "bg-white text-slate-900 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Spec &amp; Ops
                  </button>
                  {currentLevelInfo.diagram && (
                    <button
                      onClick={() => setDescSubTab("diagram")}
                      className={`flex-1 py-1 px-2 rounded font-semibold transition-all cursor-pointer text-center ${
                        descSubTab === "diagram"
                          ? "bg-white text-slate-900 shadow-2xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Flow
                    </button>
                  )}
                  {(currentLevelInfo.importantChallenge || currentLevelInfo.learningLoop) && (
                    <button
                      onClick={() => setDescSubTab("gotcha")}
                      className={`flex-1 py-1 px-2 rounded font-semibold transition-all cursor-pointer text-center ${
                        descSubTab === "gotcha"
                          ? "bg-white text-amber-800 shadow-2xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Gotcha
                    </button>
                  )}
                  {(Array.isArray(currentLevelInfo.examples) || currentLevelInfo.endGoalDemonstration) && (
                    <button
                      onClick={() => setDescSubTab("examples")}
                      className={`flex-1 py-1 px-2 rounded font-semibold transition-all cursor-pointer text-center ${
                        descSubTab === "examples"
                          ? "bg-white text-slate-900 shadow-2xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Examples
                    </button>
                  )}
                </div>

                {/* 1. SPEC & OPERATIONS SUB-TAB */}
                {descSubTab === "spec" && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    {/* Operations Section */}
                    {Array.isArray(currentLevelInfo.operations) && currentLevelInfo.operations.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                            Supported Operations
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400">
                            POSIX Stream I/O
                          </span>
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs divide-y divide-slate-100">
                          {currentLevelInfo.operations.map((op: any, idx: number) => (
                            <div key={idx} className="p-2.5 flex flex-col sm:flex-row sm:items-start gap-2 hover:bg-slate-50/60 transition-colors">
                              <code className="px-1.5 py-0.5 rounded bg-[#099BE9]/10 border border-[#099BE9]/30 font-mono text-[#099BE9] text-[11px] shrink-0 font-bold">
                                {op.cmd}
                              </code>
                              <span className="text-slate-600 text-xs leading-snug">
                                {op.desc}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Durability / Engineering Protocol */}
                    {Array.isArray(currentLevelInfo.durabilityRules) && currentLevelInfo.durabilityRules.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                          Durability Protocol
                        </h3>
                        <div className="p-3 rounded-lg bg-[#fafafa] border border-slate-200 space-y-1.5 text-xs text-slate-700">
                          {currentLevelInfo.durabilityRules.map((rule: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#09C899] font-bold font-mono">•</span>
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints & Sandbox Limits */}
                    {Array.isArray(currentLevelInfo.constraints) && currentLevelInfo.constraints.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">Constraints</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs font-mono">
                          {currentLevelInfo.constraints.map((c: any, idx: number) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. DATA FLOW DIAGRAM SUB-TAB */}
                {descSubTab === "diagram" && currentLevelInfo.diagram && (
                  <div className="space-y-3 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5 text-[#099BE9]">
                        <Terminal className="w-3.5 h-3.5" />
                        Data Flow Blueprint
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">Input ──► Engine ──► Output</span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-slate-100 shadow-md overflow-x-auto">
                      <pre className="font-mono text-xs leading-relaxed text-[#09C899] whitespace-pre selection:bg-[#09C899]/20 font-medium">
                        {currentLevelInfo.diagram}
                      </pre>
                    </div>
                  </div>
                )}

                {/* 3. GOTCHA & MENTAL MODEL SUB-TAB */}
                {descSubTab === "gotcha" && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    {/* Critical Gotcha */}
                    {currentLevelInfo.importantChallenge && (
                      <div className="rounded-xl border border-amber-300/80 bg-amber-500/10 p-3.5 space-y-2 text-amber-950 shadow-2xs">
                        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-700">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Watch Out: {currentLevelInfo.importantChallenge.title}</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          {currentLevelInfo.importantChallenge.description}
                        </p>
                        {currentLevelInfo.importantChallenge.codeOrFormat && (
                          <div className="bg-slate-900 text-amber-300 p-2.5 rounded font-mono text-[11px] overflow-x-auto border border-amber-500/20">
                            <pre className="whitespace-pre leading-relaxed">{currentLevelInfo.importantChallenge.codeOrFormat}</pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Learning Loop & Concepts */}
                    {currentLevelInfo.learningLoop && (
                      <div className="rounded-xl border border-[#8647E2]/30 bg-gradient-to-br from-[#8647E2]/10 via-slate-50 to-[#099BE9]/10 p-3.5 space-y-3 shadow-2xs text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold font-mono text-[11px] text-[#8647E2] uppercase flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Mental Model L{selectedLevel}</span>
                          </span>
                        </div>

                        {currentLevelInfo.learningLoop.bottleneck && (
                          <div className="p-2.5 rounded bg-white border border-slate-200/80 space-y-0.5">
                            <span className="font-bold font-mono text-[10px] text-rose-700 uppercase block">The Systems Bottleneck:</span>
                            <span className="text-slate-700">{currentLevelInfo.learningLoop.bottleneck}</span>
                          </div>
                        )}

                        {Array.isArray(currentLevelInfo.learningLoop.whatYouUnderstand) && (
                          <div className="space-y-1">
                            <span className="font-bold font-mono text-[10px] text-slate-600 uppercase block">Key Takeaways:</span>
                            {currentLevelInfo.learningLoop.whatYouUnderstand.map((concept: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899] shrink-0 mt-0.5" />
                                <span>{concept}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. EXAMPLES & CLI VERIFICATION SUB-TAB */}
                {descSubTab === "examples" && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    {/* Concrete Examples */}
                    {Array.isArray(currentLevelInfo.examples) && currentLevelInfo.examples.length > 0 && (
                      <div className="space-y-3">
                        {currentLevelInfo.examples.map((ex: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wide">
                              {ex.title}
                            </div>
                            <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-xs text-slate-800 space-y-1.5">
                              <div>
                                <span className="text-slate-400 font-semibold block text-[10px]">Input:</span>
                                <pre className="text-slate-900 font-medium whitespace-pre-wrap">{ex.input}</pre>
                              </div>
                              <div className="pt-1.5 border-t border-slate-100">
                                <span className="text-slate-400 font-semibold block text-[10px]">Output:</span>
                                <pre className="text-[#0AA793] font-semibold whitespace-pre-wrap">{ex.output}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* End-of-Level Terminal Verification Session */}
                    {currentLevelInfo.endGoalDemonstration && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2 text-slate-100 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 text-[#09C899]">
                            <Terminal className="w-3.5 h-3.5" />
                            CLI Execution Session
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase">Verification Contract</span>
                        </div>
                        <div className="overflow-x-auto">
                          <pre className="whitespace-pre text-[#09C899] font-medium leading-relaxed font-mono text-xs">{currentLevelInfo.endGoalDemonstration}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Level Advancer Footer */}
                {selectedLevel < 6 && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Level {selectedLevel} of 6</span>
                    <button
                      onClick={() => {
                        handleSelectLevel(selectedLevel + 1);
                        setDescSubTab("spec");
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Next: L{selectedLevel + 1}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
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
                            ? "bg-[#099BE9]/10 border-[#099BE9]/40 shadow-2xs ring-1 ring-[#099BE9]/30"
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
                                ? "bg-[#09C899]/10 text-[#0AA793] border border-[#09C899]/30"
                                : lvlInfo.difficulty === "Medium"
                                ? "bg-[#FBAE0C]/10 text-[#F78424] border border-[#FBAE0C]/30"
                                : "bg-[#8647E2]/10 text-[#8647E2] border border-[#8647E2]/30"
                            }`}>
                              {lvlInfo.difficulty}
                            </span>
                          </div>
                          {isActive ? (
                            <span className="text-[10px] font-mono font-semibold text-[#099BE9] bg-[#099BE9]/15 px-2.5 py-0.5 rounded-full">
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
                        {lvlInfo.learningLoop?.outcomeSummary && (
                          <div className="mb-2.5 p-2 rounded-md bg-[#8647E2]/10 border border-[#8647E2]/30 text-[11px] text-slate-900 space-y-1">
                            <div className="font-bold flex items-center gap-1 text-[10px] font-mono uppercase text-[#8647E2]">
                              <Lightbulb className="w-3 h-3" />
                              <span>What You Understand & Master</span>
                            </div>
                            <p className="leading-snug text-slate-700">
                              {lvlInfo.learningLoop.outcomeSummary}
                            </p>
                          </div>
                        )}

                        {Array.isArray(lvlInfo.operations) && lvlInfo.operations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold mr-1">
                              Operations:
                            </span>
                            {lvlInfo.operations.map((op: any, idx: number) => (
                              <code
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200"
                              >
                                {typeof op.cmd === "string" ? op.cmd.split(" ")[0] : "CMD"}
                              </code>
                            ))}
                          </div>
                        )}
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
                              <span className="flex items-center gap-1 text-[#0AA793] font-bold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" /> Accepted
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
                                ? "bg-[#FBAE0C]/15 text-[#F78424] border border-[#FBAE0C]/30"
                                : lead.rank === 2
                                ? "bg-slate-200 text-slate-700 border border-slate-300"
                                : "bg-[#8647E2]/10 text-[#8647E2] border border-[#8647E2]/30"
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
                        <div className="text-xs font-mono font-bold text-[#0AA793]">
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
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-white text-slate-800 text-xs font-mono font-medium rounded-md px-2.5 py-1 border border-slate-300 shadow-2xs focus:outline-none cursor-pointer"
              >
                <option value="python">Python 3.12</option>
                <option value="cpp">C++ 20 (g++)</option>
                <option value="rust">Rust 1.75+</option>
                <option value="go">Go 1.22+</option>
                <option value="java">Java 21</option>
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
                {copied ? <Check className="w-4 h-4 text-[#09C899]" /> : <Copy className="w-4 h-4" />}
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
                      {sampleCases.map((c: any, i: number) => (
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#099BE9] resize-none shadow-2xs"
                      />
                    </div>

                    {sampleCases[selectedCaseIndex]?.expected && (
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-500 font-sans font-semibold">Expected Output:</div>
                        <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#0AA793] font-semibold whitespace-pre-wrap">
                          {sampleCases[selectedCaseIndex].expected}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {consoleTab === "result" && (
                  <div className="space-y-3 font-sans">
                    {isRunningTests ? (
                      <div className="flex items-center gap-2 text-[#099BE9] py-6 font-sans">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Running tests inside isolated Docker sandbox...</span>
                      </div>
                    ) : testResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {testResult.passed === testResult.total ? (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-[#0AA793] bg-[#09C899]/10 px-2.5 py-1 rounded-md border border-[#09C899]/30">
                                <CheckCircle2 className="w-4 h-4 text-[#09C899]" /> Accepted
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

                          <span className="text-[11px] font-mono text-[#09C899] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#09C899] animate-pulse" />
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
                                        ? "bg-[#09C899]/10 text-[#0AA793] border border-[#09C899]/30 shadow-2xs font-semibold"
                                        : "bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs font-semibold"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      c.passed ? "bg-[#09C899]" : "bg-rose-500"
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
                                          ? "text-[#0AA793] bg-[#09C899]/10 border border-[#09C899]/30"
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
                                    <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#0AA793] font-semibold whitespace-pre-wrap shadow-2xs">
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
