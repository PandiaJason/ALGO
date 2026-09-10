"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MonacoWrapper } from "@/components/editor/monaco-wrapper";
import { AlgoLogoIcon } from "@/components/layout/algo-logo-icon";
import { DEFAULT_STARTER_TEMPLATES } from "@/lib/constants/templates";
import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "@/lib/constants/challenge-data";
import { getChallenge } from "@/lib/challenges";
import { SupportedLanguage, UNIVERSAL_STAGES } from "@/lib/challenges/types";
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
  ArrowRight,
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

function getShortParity(rawParity: string): string {
  if (!rawParity) return "Production Standard";
  if (/dict\.c/i.test(rawParity)) return "Redis dict.c";
  if (/rehashing/i.test(rawParity) || /collision/i.test(rawParity)) return "Redis Rehashing";
  if (/wal/i.test(rawParity) || /write-ahead/i.test(rawParity)) return "PostgreSQL WAL";
  if (/ttl|expire/i.test(rawParity)) return "Redis Active Expire";
  if (/concurrenthashmap|mutex|thread/i.test(rawParity)) return "Java Striped Mutex";
  if (/compaction|arena|lsm/i.test(rawParity)) return "RocksDB Compaction";
  if (/resp/i.test(rawParity)) return "Redis RESP";
  if (/event loop|epoll|kqueue|c10k/i.test(rawParity)) return "Nginx epoll Loop";
  if (/chunked|http parser/i.test(rawParity)) return "Node.js llhttp";
  if (/raft|consensus/i.test(rawParity)) return "Raft Consensus";
  if (/b-tree|btree/i.test(rawParity)) return "B-Tree Page Engine";

  const clean = rawParity
    .replace(/^The\s+(core\s+)?/i, "")
    .replace(/^architecture of\s+/i, "")
    .replace(/^persistence architecture of\s+/i, "")
    .replace(/^custom\s+/i, "")
    .split(",")[0]
    .split(" powered by")[0]
    .split(" powering")[0]
    .trim();
  return clean.length > 20 ? clean.slice(0, 18) + "…" : clean;
}

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
    
    if (challenge.slug === "kv-store" && (DEFAULT_STARTER_TEMPLATES as any)[lang]) {
      return (DEFAULT_STARTER_TEMPLATES as any)[lang];
    }

    switch (lang) {
      case "python":
        return '# This challenge currently supports Python and C++ only.\n# Please select Python or C++ from the language dropdown above.\n\n# Rust, Go, and Java templates are coming soon.\nprint("Language not yet supported for this challenge")\n';
      case "cpp":
        return '// This challenge currently supports Python and C++ only.\n// Please select Python or C++ from the language dropdown above.\n\n// Rust, Go, and Java templates are coming soon.\n#include <iostream>\n\nint main() {\n    std::cout << "Language not yet supported for this challenge\\n";\n    return 0;\n}\n';
      case "rust":
        return '// This challenge currently supports Python and C++ only.\n// Please select Python or C++ from the language dropdown above.\n\n// Rust, Go, and Java templates are coming soon.\nfn main() {\n    println!("Language not yet supported for this challenge");\n}\n';
      case "go":
        return '// This challenge currently supports Python and C++ only.\n// Please select Python or C++ from the language dropdown above.\n\n// Rust, Go, and Java templates are coming soon.\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Language not yet supported for this challenge")\n}\n';
      case "java":
        return '// This challenge currently supports Python and C++ only.\n// Please select Python or C++ from the language dropdown above.\n\n// Rust, Go, and Java templates are coming soon.\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Language not yet supported for this challenge");\n    }\n}\n';
      default:
        return "";
    }
  };

  let spec = (version.spec as any) || {};
  if (typeof spec === "string") {
    try { spec = JSON.parse(spec); } catch { spec = {}; }
  }
  const layers = (Array.isArray(spec.architecturalLayers) && spec.architecturalLayers.length > 0)
    ? spec.architecturalLayers
    : (challengeData?.architecturalLayers || (isKv ? PROJECT_SCOPE.architecturalLayers : []));
  const architectureDiagram = challengeData?.architectureDiagram || (isKv ? PROJECT_SCOPE.architectureDiagram : "");

  const searchParams = useSearchParams();
  const levelParam = Number(searchParams?.get("level"));
  const initialLevel = (levelParam >= 1 && levelParam <= 6) ? levelParam : 1;

  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
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

  const isLanguageSupported =
    challenge.slug === "kv-store" ||
    language === "python" ||
    language === "cpp" ||
    Boolean((challengeData?.starterTemplates as any)?.[language]);

  // Run quick correctness tests inside Docker sandbox
  const handleRunCode = async () => {
    if (!user) {
      router.push(`/sign-in?callbackUrl=/challenges/${challenge.slug}/workspace`);
      return;
    }
    if (!isLanguageSupported) {
      alert(`${language.toUpperCase()} support for this challenge is currently in preview / coming soon. Please select Python 3.12 or C++ 20.`);
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
    if (!isLanguageSupported) {
      alert(`${language.toUpperCase()} support for this challenge is currently in preview / coming soon. Please select Python 3.12 or C++ 20.`);
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
                  ? "solution.py"
                  : language === "cpp"
                  ? "solution.cpp"
                  : language === "rust"
                  ? "solution.rs"
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
      {/* 1. TOP NAVBAR (Dark Systems Style matching other pages) */}
      <header className="h-12 border-b border-neutral-800 bg-[#262626] px-4 flex items-center justify-between shrink-0 select-none text-white">
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <AlgoLogoIcon size={24} className="transition-transform group-hover:scale-105" />
            <span className="font-black tracking-wider text-sm text-white">
              ALGO
            </span>
            <ArrowLeft className="w-3.5 h-3.5 ml-1 text-neutral-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-semibold text-neutral-300 hover:text-white">Challenges</span>
          </Link>

          <span className="text-neutral-600">|</span>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {challenge.title}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBAE0C]/15 text-[#FBAE0C] border border-[#FBAE0C]/40">
              Level {selectedLevel}: {currentLevelInfo.shortTitle}
            </span>
          </div>
        </div>

        {/* Center: Run & Submit Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunningTests || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors disabled:opacity-50 cursor-pointer"
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/10 text-xs font-mono text-neutral-200 hover:text-white transition-colors"
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
          <div className="h-10 border-b border-slate-200 bg-slate-50/90 px-3 flex items-center gap-1.5 shrink-0 select-none">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "description"
                  ? "bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#099BE9]" />
              <span>Level Spec</span>
            </button>

            <button
              onClick={() => setLeftTab("missions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "missions"
                  ? "bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-[#0AA793]" />
              <span>All 6 Levels</span>
            </button>

            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "submissions"
                  ? "bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#8647E2]" />
              <span>Submissions ({pastSubmissions.length})</span>
            </button>

            <button
              onClick={() => setLeftTab("leaderboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                leftTab === "leaderboard"
                  ? "bg-white text-slate-900 font-bold shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#FBAE0C]" />
              <span>Leaderboard</span>
            </button>

            {(() => {
              let spec = (version.spec as any) || {};
              if (typeof spec === "string") {
                try { spec = JSON.parse(spec); } catch { spec = {}; }
              }
              const architectureDiagram = challengeData?.architectureDiagram || spec.architectureDiagram;
              return architectureDiagram ? (
                <button
                  onClick={() => setShowBlueprintModal(!showBlueprintModal)}
                  className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                    showBlueprintModal
                      ? "bg-slate-900 text-[#09C899]"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                  }`}
                  title="Toggle System Architecture Blueprint"
                >
                  <Terminal className="w-3 h-3 text-[#099BE9]" />
                  <span>Blueprint</span>
                </button>
              ) : null;
            })()}
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 text-slate-700 text-xs leading-relaxed space-y-5">
            {leftTab === "description" && (
              <div className="space-y-5">
                {(() => {
                  let spec = (version.spec as any) || {};
                  if (typeof spec === "string") {
                    try { spec = JSON.parse(spec); } catch { spec = {}; }
                  }
                  const architectureDiagram = challengeData?.architectureDiagram || spec.architectureDiagram;
                  return showBlueprintModal && architectureDiagram ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-[#099BE9]" />
                          <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                            System Architecture
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Full Topology
                          </span>
                        </div>
                        <button
                          onClick={() => setShowBlueprintModal(false)}
                          className="text-xs font-mono font-medium text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          ✕ Close
                        </button>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-800 overflow-x-auto">
                        <pre className="whitespace-pre leading-relaxed font-medium">{architectureDiagram}</pre>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* 1. Level Navigation Segmented Control (L1 - L6) */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-mono overflow-x-auto">
                    {Object.entries(levelData).map(([lvlNumStr, lvlInfo]) => {
                      const num = Number(lvlNumStr);
                      const isActive = selectedLevel === num;
                      const stageLabel = (lvlInfo as any).stage || UNIVERSAL_STAGES[num]?.label || `L${num}`;
                      return (
                        <button
                          key={num}
                          onClick={() => handleSelectLevel(num)}
                          className={`flex-1 min-w-[76px] py-1.5 px-1.5 rounded-md font-bold transition-all text-center cursor-pointer ${
                            isActive
                              ? "bg-white text-[#099BE9] shadow-2xs border border-slate-200 ring-1 ring-[#099BE9]/30"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                          }`}
                        >
                          L{num}: {stageLabel}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Level Header & Mission */}
                  <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#099BE9]/10 text-[#099BE9] font-mono font-bold text-xs">
                          Level {selectedLevel} of 6 · {UNIVERSAL_STAGES[selectedLevel]?.stage || "BUILD"}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {challenge.title}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                        currentLevelInfo.difficulty === "Easy"
                          ? "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30"
                          : currentLevelInfo.difficulty === "Medium"
                          ? "text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30"
                          : "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30"
                      }`}>
                        {currentLevelInfo.difficulty}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-950 pt-1">
                      {currentLevelInfo.title}
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {UNIVERSAL_STAGES[selectedLevel] && (
                        <span className="font-semibold text-slate-900">
                          {UNIVERSAL_STAGES[selectedLevel].question} —{" "}
                        </span>
                      )}
                      {currentLevelInfo.tagline}
                    </p>
                  </div>
                </div>

                {/* 2. Operations & Protocol Specification */}
                {Array.isArray(currentLevelInfo.operations) && currentLevelInfo.operations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono font-bold text-slate-950 uppercase tracking-wider">
                        Supported Operations
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        POSIX Stream Protocol
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs divide-y divide-slate-100">
                      {currentLevelInfo.operations.map((op: any, idx: number) => (
                        <div key={idx} className="p-2.5 flex flex-col sm:flex-row sm:items-start gap-2 hover:bg-slate-50/60 transition-colors">
                          <code className="px-1.5 py-0.5 rounded bg-[#099BE9]/10 border border-[#099BE9]/30 font-mono text-[#099BE9] text-[11px] shrink-0 font-bold">
                            {op.cmd}
                          </code>
                          <span className="text-slate-800 font-medium text-xs leading-relaxed">
                            {op.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Concrete Example Session */}
                {Array.isArray(currentLevelInfo.examples) && currentLevelInfo.examples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold text-slate-950 uppercase tracking-wider">
                      Example Protocol Session
                    </h3>
                    <div className="space-y-2">
                      {currentLevelInfo.examples.map((ex: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wide">
                            {ex.title}
                          </div>
                          <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-xs text-slate-800 space-y-1.5">
                            <div>
                              <span className="text-slate-400 font-semibold block text-[10px]">Input (stdin):</span>
                              <pre className="text-slate-900 font-medium whitespace-pre-wrap">{ex.input}</pre>
                            </div>
                            <div className="pt-1.5 border-t border-slate-100">
                              <span className="text-slate-400 font-semibold block text-[10px]">Expected Output (stdout):</span>
                              <pre className="text-[#0AA793] font-semibold whitespace-pre-wrap">{ex.output}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Critical Systems Hurdle / Watch Out */}
                {currentLevelInfo.importantChallenge && (
                  <div className="rounded-xl border border-amber-300/80 bg-amber-500/10 p-3.5 space-y-2 text-amber-950 shadow-2xs">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-700">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>The Engineering Hurdle: {currentLevelInfo.importantChallenge.title}</span>
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

                {/* 5. Durability Protocol & Constraints */}
                <div className="space-y-3 pt-1">
                  {Array.isArray(currentLevelInfo.durabilityRules) && currentLevelInfo.durabilityRules.length > 0 && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-mono font-bold text-slate-950 uppercase tracking-wider">
                        Engineering Rules &amp; Invariants
                      </h3>
                      <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-1 text-xs text-slate-800 font-medium">
                        {currentLevelInfo.durabilityRules.map((rule: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[#0AA793] font-bold font-mono">•</span>
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(currentLevelInfo.constraints) && currentLevelInfo.constraints.length > 0 && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-mono font-bold text-slate-950 uppercase tracking-wider">
                        Sandbox Constraints
                      </h3>
                      <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-1 text-xs text-slate-800 font-mono font-medium">
                        {currentLevelInfo.constraints.map((c: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[#099BE9] font-bold">•</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Optional Deep Dive Collapsibles */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  {currentLevelInfo.diagram && (
                    <details open className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs">
                      <summary className="p-2.5 font-mono font-bold text-slate-800 cursor-pointer select-none hover:bg-slate-50 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#099BE9]">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Data Flow Diagram (L{selectedLevel})</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </summary>
                      <div className="p-3.5 bg-[#141416] font-mono text-[11px] text-[#09C899] overflow-x-auto border-t border-slate-800">
                        <pre className="whitespace-pre leading-relaxed font-medium">{currentLevelInfo.diagram}</pre>
                      </div>
                    </details>
                  )}

                  {currentLevelInfo.learningLoop && (
                    <details className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs">
                      <summary className="p-2.5 font-mono font-bold text-slate-800 cursor-pointer select-none hover:bg-slate-50 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#8647E2]">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Mental Model &amp; Systems Takeaways (L{selectedLevel})</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </summary>
                      <div className="p-3 space-y-2.5 bg-slate-50/50 border-t border-slate-200 text-xs text-slate-800">
                        {currentLevelInfo.learningLoop.bottleneck && (
                          <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                            <span className="font-bold font-mono text-[10px] text-rose-700 uppercase block">The Systems Bottleneck:</span>
                            <span className="text-slate-700 font-medium">{currentLevelInfo.learningLoop.bottleneck}</span>
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
                    </details>
                  )}

                  {currentLevelInfo.endGoalDemonstration && (
                    <details className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs">
                      <summary className="p-2.5 font-mono font-bold text-slate-800 cursor-pointer select-none hover:bg-slate-50 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#0AA793]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CLI Verification Session</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </summary>
                      <div className="p-3 bg-slate-950 font-mono text-[11px] text-[#09C899] overflow-x-auto border-t border-slate-800">
                        <pre className="whitespace-pre leading-relaxed">{currentLevelInfo.endGoalDemonstration}</pre>
                      </div>
                    </details>
                  )}
                </div>

                {/* 7. Level Advancer Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                  {selectedLevel > 1 ? (
                    <button
                      onClick={() => handleSelectLevel(selectedLevel - 1)}
                      className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous: L{selectedLevel - 1}</span>
                    </button>
                  ) : <div />}

                  <span className="text-slate-500 font-semibold">Level {selectedLevel} of 6</span>

                  {selectedLevel < 6 ? (
                    <button
                      onClick={() => handleSelectLevel(selectedLevel + 1)}
                      className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Next: L{selectedLevel + 1}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : <div />}
                </div>
              </div>
            )}

            {leftTab === "missions" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                  {/* Table of Contents Header */}
                  <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#099BE9]" />
                      <span className="text-xs font-mono font-bold uppercase text-slate-900 tracking-wider">
                        Table of Contents
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                      6 Progressive Levels
                    </span>
                  </div>

                  {/* Table of Contents List */}
                  <div className="divide-y divide-slate-100">
                    {Object.entries(levelData).map(([lvlNumStr, lvlInfo]: [string, any]) => {
                      const num = Number(lvlNumStr);
                      const isActive = selectedLevel === num;
                      let spec = (version.spec as any) || {};
                      if (typeof spec === "string") {
                        try { spec = JSON.parse(spec); } catch { spec = {}; }
                      }
                      const layers = (Array.isArray(spec.architecturalLayers) && spec.architecturalLayers.length > 0)
                        ? spec.architecturalLayers
                        : (challengeData?.architecturalLayers || []);
                      const matchingLayer = layers?.[num - 1] || layers?.find((l: any) => l.number === num);
                      const rawParity = lvlInfo.learningLoop?.productionParity || matchingLayer?.realWorldTech || "Production Standard";
                      const shortParity = getShortParity(rawParity);

                      return (
                        <div
                          key={num}
                          onClick={() => {
                            handleSelectLevel(num);
                            setLeftTab("description");
                          }}
                          className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50 ${
                            isActive ? "bg-[#099BE9]/5 ring-1 ring-inset ring-[#099BE9]/30" : ""
                          }`}
                        >
                          {/* Left: Number + Title + Subtitle */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Number Badge */}
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                              isActive
                                ? "bg-[#099BE9] text-white border-[#099BE9]"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}>
                              {String(num).padStart(2, "0")}
                            </div>

                            {/* Middle Info */}
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`text-xs font-bold truncate ${isActive ? "text-[#099BE9]" : "text-slate-900"}`}>
                                  {lvlInfo.title}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold shrink-0 border ${
                                  lvlInfo.difficulty === "Easy"
                                    ? "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30"
                                    : lvlInfo.difficulty === "Medium"
                                    ? "text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30"
                                    : "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30"
                                }`}>
                                  {lvlInfo.difficulty}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                                <span>≈ {shortParity}</span>
                                {Array.isArray(lvlInfo.operations) && lvlInfo.operations.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{lvlInfo.operations.length} ops</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Action */}
                          <div className="shrink-0 self-center">
                            {isActive ? (
                              <span className="text-[10px] font-mono font-bold text-[#099BE9] bg-[#099BE9]/10 border border-[#099BE9]/30 px-2 py-0.5 rounded">
                                Active
                              </span>
                            ) : (
                              <span className="text-[11px] font-mono text-slate-400 hover:text-[#099BE9] font-medium flex items-center gap-0.5">
                                <span>Switch</span>
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                <option value="rust">Rust 1.75+{challenge.slug !== "kv-store" && !(challengeData?.starterTemplates as any)?.rust ? " (Coming Soon)" : ""}</option>
                <option value="go">Go 1.22+{challenge.slug !== "kv-store" && !(challengeData?.starterTemplates as any)?.go ? " (Coming Soon)" : ""}</option>
                <option value="java">Java 21{challenge.slug !== "kv-store" && !(challengeData?.starterTemplates as any)?.java ? " (Coming Soon)" : ""}</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => handleSelectLevel(Number(e.target.value))}
                className="bg-white text-slate-800 text-xs font-mono font-medium rounded-md px-2.5 py-1 border border-slate-300 shadow-2xs focus:outline-none cursor-pointer"
              >
                {Object.entries(levelData).map(([lvlNumStr, lvlInfo]: [string, any]) => {
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
                        <div className="text-xs text-slate-800 font-sans font-bold">Expected Output:</div>
                        <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#0AA793] font-bold whitespace-pre-wrap shadow-2xs">
                          {sampleCases[selectedCaseIndex].expected}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {consoleTab === "result" && (
                  <div className="space-y-3 font-sans">
                    {isRunningTests ? (
                      <div className="flex items-center gap-2 text-[#099BE9] py-6 font-sans font-semibold">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Running tests inside isolated Linux sandbox...</span>
                      </div>
                    ) : testResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {testResult.passed === testResult.total ? (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-[#0AA793] bg-[#09C899]/10 px-2.5 py-1 rounded-md border border-[#09C899]/30">
                                <CheckCircle2 className="w-4 h-4 text-[#0AA793]" /> Accepted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-sm font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                                <XCircle className="w-4 h-4 text-rose-600" /> Wrong Answer
                              </span>
                            )}
                            <span className="text-slate-800 font-sans text-xs font-bold">
                              Passed {testResult.passed} / {testResult.total} testcases
                            </span>
                            <span className="text-[11px] text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Level {selectedLevel}
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-[#0AA793] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#0AA793] animate-pulse" />
                            Linux Sandbox: Active
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
                                        ? "bg-[#09C899]/10 text-[#0AA793] border border-[#09C899]/30 shadow-2xs font-bold"
                                        : "bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs font-bold"
                                      : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 font-medium"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      c.passed ? "bg-[#0AA793]" : "bg-rose-500"
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
                                    <span className="text-xs font-bold text-slate-950">
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
                                    <span className="text-xs text-slate-800 font-sans font-bold">
                                      Standard Input:
                                    </span>
                                    <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 font-semibold whitespace-pre-wrap shadow-2xs">
                                      {activeCase.input}
                                    </pre>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-xs text-slate-800 font-sans font-bold">
                                      Actual Output:
                                    </span>
                                    <pre
                                      className={`p-2.5 rounded-lg text-xs font-mono whitespace-pre-wrap shadow-2xs border font-semibold ${
                                        activeCase.passed
                                          ? "bg-slate-50 border-slate-200 text-slate-900"
                                          : "bg-rose-50/60 border-rose-200 text-rose-900 font-bold"
                                      }`}
                                    >
                                      {activeCase.actual || "(No output produced)"}
                                    </pre>
                                    {activeCase.error && (
                                      <div className="text-[11px] text-rose-700 font-mono font-semibold bg-rose-50 p-2 rounded border border-rose-200">
                                        Error: {activeCase.error}
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-xs text-slate-800 font-sans font-bold">
                                      Expected Output:
                                    </span>
                                    <pre className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#0AA793] font-bold whitespace-pre-wrap shadow-2xs">
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
