"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Layers,
  Code2,
  Sparkles,
  ChevronRight,
  Eye,
  ListFilter,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Operation {
  cmd: string;
  desc: string;
}

interface Gotcha {
  title: string;
  description: string;
  codeOrFormat?: string;
}

interface LearningLoop {
  bottleneck?: string;
  solution?: string;
  tradeoff?: string;
  metric?: string;
}

interface LevelItem {
  level: number;
  title: string;
  shortTitle?: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  tagline?: string;
  operations?: Operation[];
  diagram?: string;
  importantChallenge?: Gotcha;
  description?: string;
  requirements?: string;
  learningLoop?: LearningLoop;
  verificationSession?: string;
  nextLevelPreview?: string;
}

interface ChallengeLevelExplorerProps {
  levels: LevelItem[];
  challengeSlug: string;
}

export function ChallengeLevelExplorer({
  levels,
  challengeSlug,
}: ChallengeLevelExplorerProps) {
  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(levels[0]?.level || 1);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "diagram" | "gotcha" | "terminal">("overview");
  const [viewMode, setViewMode] = useState<"focus" | "all">("focus");

  const currentLevel = levels.find((l) => l.level === selectedLevelNum) || levels[0];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30";
      case "Medium":
        return "text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30";
      case "Hard":
      default:
        return "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#099BE9]" />
            <span>Progressive 6-Level Roadmap</span>
          </h2>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Select a level to explore its architectural bottleneck, data flow, and operations.
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setViewMode("focus")}
            className={`px-3 py-1 rounded-md transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
              viewMode === "focus"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#099BE9]" />
            <span>Focus Mode</span>
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-3 py-1 rounded-md transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
              viewMode === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-slate-500" />
            <span>View All</span>
          </button>
        </div>
      </div>

      {/* Level Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {levels.map((lvl) => {
          const isSelected = selectedLevelNum === lvl.level;
          return (
            <button
              key={lvl.level}
              onClick={() => {
                setSelectedLevelNum(lvl.level);
                setViewMode("focus");
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isSelected && viewMode === "focus"
                  ? "bg-white border-[#099BE9] shadow-md ring-2 ring-[#099BE9]/20"
                  : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isSelected && viewMode === "focus"
                    ? "bg-[#099BE9] text-white"
                    : "bg-slate-200 text-slate-800 group-hover:bg-slate-300"
                }`}>
                  L{lvl.level}
                </span>
                <span className={`text-[9px] font-mono font-semibold px-1 rounded border ${getDifficultyBadge(lvl.difficulty)}`}>
                  {lvl.difficulty}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                {lvl.shortTitle || lvl.title}
              </div>
              <div className="text-[10px] text-slate-700 font-medium line-clamp-1 mt-0.5">
                {lvl.tagline || `Level ${lvl.level}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* FOCUS MODE: 1 Clean, High-Readability Interactive Deck                    */}
      {/* ========================================================================= */}
      {viewMode === "focus" && currentLevel && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in-50 duration-150">
          {/* Deck Header Bar */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold shadow-2xs">
                  {currentLevel.level}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Level {currentLevel.level}: {currentLevel.title}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getDifficultyBadge(currentLevel.difficulty)}`}>
                  {currentLevel.difficulty}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {currentLevel.tagline}
              </p>
            </div>

            <Link href={`/challenges/${challengeSlug}/workspace`}>
              <Button size="sm" variant="primary" className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs shrink-0 cursor-pointer">
                <span>Open Level {currentLevel.level} in IDE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="px-5 sm:px-6 pt-3 border-b border-slate-200 bg-[#fbfcfd] flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <button
              onClick={() => setActiveSubTab("overview")}
              className={`pb-2.5 px-2 border-b-2 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeSubTab === "overview"
                  ? "border-[#099BE9] text-[#099BE9]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Overview &amp; Commands</span>
            </button>

            {currentLevel.diagram && (
              <button
                onClick={() => setActiveSubTab("diagram")}
                className={`pb-2.5 px-2 border-b-2 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeSubTab === "diagram"
                    ? "border-[#099BE9] text-[#099BE9]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Process Flow Diagram</span>
              </button>
            )}

            {currentLevel.importantChallenge && (
              <button
                onClick={() => setActiveSubTab("gotcha")}
                className={`pb-2.5 px-2 border-b-2 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeSubTab === "gotcha"
                    ? "border-amber-500 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>The Critical Gotcha</span>
              </button>
            )}

            {currentLevel.verificationSession && (
              <button
                onClick={() => setActiveSubTab("terminal")}
                className={`pb-2.5 px-2 border-b-2 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeSubTab === "terminal"
                    ? "border-[#09C899] text-[#0AA793]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" />
                <span>CLI Verification</span>
              </button>
            )}
          </div>

          {/* Sub-Tab Content Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* 1. OVERVIEW & COMMANDS */}
            {activeSubTab === "overview" && (
              <div className="space-y-5">
                {/* Level Mission Callout */}
                {currentLevel.description && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    <span className="font-bold text-slate-900 block mb-1 uppercase font-mono text-[11px] tracking-wider">
                      Mission Objective:
                    </span>
                    {currentLevel.description}
                  </div>
                )}

                {/* Supported Operations */}
                {Array.isArray(currentLevel.operations) && currentLevel.operations.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-[#099BE9]" />
                      <span>Supported Operations &amp; Syntax ({currentLevel.operations.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentLevel.operations.map((op, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs space-y-1 transition-colors"
                        >
                          <code className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold inline-block">
                            {op.cmd}
                          </code>
                          <p className="text-xs text-slate-700 font-sans leading-snug font-medium">
                            {op.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Requirements / Invariants */}
                {currentLevel.requirements && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-slate-800 space-y-1.5">
                    <div className="font-bold font-mono text-[11px] text-emerald-800 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Architectural Invariants</span>
                    </div>
                    <p className="font-mono text-slate-700 leading-relaxed">
                      {currentLevel.requirements}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. PROCESS FLOW DIAGRAM */}
            {activeSubTab === "diagram" && currentLevel.diagram && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                  <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#099BE9]" />
                    Data Flow &amp; State Transitions
                  </span>
                  <span className="text-[11px] text-slate-400">Input ──► Engine ──► Output</span>
                </div>
                <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 shadow-inner">
                  <pre className="whitespace-pre leading-relaxed text-[#09C899] font-medium">{currentLevel.diagram}</pre>
                </div>
              </div>
            )}

            {/* 3. THE CRITICAL GOTCHA */}
            {activeSubTab === "gotcha" && currentLevel.importantChallenge && (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-3 text-amber-950 shadow-2xs">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Watch Out: {currentLevel.importantChallenge.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {currentLevel.importantChallenge.description}
                  </p>
                  {currentLevel.importantChallenge.codeOrFormat && (
                    <div className="bg-slate-900 text-amber-300 p-3 rounded-lg font-mono text-xs overflow-x-auto border border-amber-500/30">
                      <pre className="whitespace-pre leading-relaxed">{currentLevel.importantChallenge.codeOrFormat}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. TERMINAL VERIFICATION SESSION */}
            {activeSubTab === "terminal" && currentLevel.verificationSession && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                  <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" />
                    Expected Terminal Session
                  </span>
                  <span className="text-[11px] text-slate-400">Deterministic Output Contract</span>
                </div>
                <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 shadow-inner">
                  <pre className="whitespace-pre leading-relaxed text-slate-200 font-mono">{currentLevel.verificationSession}</pre>
                </div>
              </div>
            )}

            {/* Next Level Teaser footer */}
            {currentLevel.nextLevelPreview && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Next Bottleneck:</span>
                  <span className="text-slate-600 truncate max-w-md">{currentLevel.nextLevelPreview}</span>
                </span>
                {levels.find((l) => l.level === currentLevel.level + 1) && (
                  <button
                    onClick={() => {
                      setSelectedLevelNum(currentLevel.level + 1);
                      setActiveSubTab("overview");
                    }}
                    className="text-[#099BE9] hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Inspect L{currentLevel.level + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ALL LEVELS VIEW: Accordion/Stacked overview for macro comparison           */}
      {/* ========================================================================= */}
      {viewMode === "all" && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                    {lvl.level}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Level {lvl.level}: {lvl.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getDifficultyBadge(lvl.difficulty)}`}>
                        {lvl.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      {lvl.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedLevelNum(lvl.level);
                      setViewMode("focus");
                      setActiveSubTab("overview");
                    }}
                    className="text-xs font-mono text-slate-700 hover:text-slate-900 font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200/70 transition-colors cursor-pointer"
                  >
                    Focus Mode
                  </button>
                  <Link
                    href={`/challenges/${challengeSlug}/workspace`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#099BE9] hover:text-[#1984E9] font-bold"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Operations row */}
              {Array.isArray(lvl.operations) && lvl.operations.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider mr-1">
                    Ops:
                  </span>
                  {lvl.operations.map((op, idx) => (
                    <code
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200 font-semibold"
                      title={op.desc}
                    >
                      {op.cmd}
                    </code>
                  ))}
                </div>
              )}

              {/* Gotcha if present */}
              {lvl.importantChallenge && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 font-mono text-[11px] block">
                      Gotcha: {lvl.importantChallenge.title}
                    </span>
                    <span className="text-slate-700 leading-snug">{lvl.importantChallenge.description}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
