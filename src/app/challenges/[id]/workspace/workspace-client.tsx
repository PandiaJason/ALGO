"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MonacoWrapper } from "@/components/editor/monaco-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Send,
  RotateCcw,
  FileCode,
} from "lucide-react";

interface Props {
  challenge: {
    id: string;
    slug: string;
    title: string;
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
}

export function WorkspaceClient({ challenge, version, user }: Props) {
  const router = useRouter();
  const [language, setLanguage] = useState<"python" | "cpp">("python");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [code, setCode] = useState<string>(
    version.starterTemplates.python || ""
  );
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");
  const [output, setOutput] = useState<string>("Ready. Write your code and click 'Run Tests' or 'Submit & Benchmark'.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    passed: number;
    total: number;
    details: string;
  } | null>(null);

  const handleLanguageChange = (newLang: "python" | "cpp") => {
    setLanguage(newLang);
    setCode(
      newLang === "python"
        ? version.starterTemplates.python
        : version.starterTemplates.cpp
    );
    setOutput(`Switched language to ${newLang.toUpperCase()}. Starter code loaded.`);
  };

  const handleReset = () => {
    if (confirm("Reset editor to original starter template?")) {
      setCode(
        language === "python"
          ? version.starterTemplates.python
          : version.starterTemplates.cpp
      );
      setOutput("Reset code to starter template.");
    }
  };

  // Run quick client/server correctness tests
  const handleTest = async () => {
    if (!user) {
      router.push(`/sign-in?callbackUrl=/challenges/${challenge.slug}/workspace`);
      return;
    }
    setIsSubmitting(true);
    setActiveTab("tests");
    setOutput("Running correctness test harness in sandbox...");

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
        setOutput(`Test execution failed: ${data.error || "Unknown error"}`);
        setTestResult(null);
      } else {
        setTestResult({
          passed: data.passed,
          total: data.total,
          details: data.details,
        });
        setOutput(data.output || "Tests complete.");
      }
    } catch (err: any) {
      setOutput(`Error connecting to test harness: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit official submission for benchmarking & leaderboard ranking
  const handleSubmit = async () => {
    if (!user) {
      router.push(`/sign-in?callbackUrl=/challenges/${challenge.slug}/workspace`);
      return;
    }

    setIsSubmitting(true);
    setOutput("Submitting code to ALGO evaluation queue...");

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
      if (!res.ok) {
        setOutput(`Submission rejected: ${data.error || "Validation failure"}`);
        setIsSubmitting(false);
      } else {
        // Successfully queued! Redirect to live result page
        router.push(`/submissions/${data.submissionId}`);
      }
    } catch (err: any) {
      setOutput(`Submission failed: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const filename = language === "python" ? "store.py" : "store.cpp";

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-50/50">
      {/* Workspace Top Toolbar */}
      <div className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-900">
            {challenge.title}
          </span>
          <span className="text-slate-300">/</span>

          {/* Level Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400">LEVEL</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="text-xs font-mono font-medium border border-slate-200 rounded px-2 py-1 bg-white text-slate-850 focus:outline-none"
            >
              {version.levels.map((lvl) => (
                <option key={lvl.level} value={lvl.level}>
                  {lvl.level}: {lvl.title}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 ml-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as any)}
              className="text-xs font-mono font-medium border border-slate-200 rounded px-2 py-1 bg-white text-slate-850 focus:outline-none"
            >
              <option value="python">Python 3.12</option>
              <option value="cpp">C++ 20 (GCC)</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs h-8 text-slate-500 hover:text-slate-900 gap-1"
            title="Reset to starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isSubmitting}
            className="text-xs h-8 gap-1.5 font-medium border-slate-200"
          >
            <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
            <span>Test Code</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs h-8 gap-1.5 font-semibold shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>Submit & Benchmark</span>
          </Button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Code Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-white">
          {/* File Tab Header */}
          <div className="h-9 border-b border-slate-200/80 bg-slate-50/70 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-t bg-white border-t border-x border-slate-200 text-xs font-mono text-slate-850 font-medium">
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                <span>{filename}</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {language === "python" ? "PEP 8 • Python 3" : "C++20 • -O3"}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden relative">
            <MonacoWrapper
              value={code}
              language={language}
              onChange={(val) => setCode(val || "")}
            />
          </div>
        </div>

        {/* Right: Output & Test Panel */}
        <div className="w-full md:w-96 flex flex-col shrink-0 bg-white border-t md:border-t-0 border-slate-200">
          {/* Panel Header */}
          <div className="h-9 border-b border-slate-200/85 px-3 flex items-center gap-2 shrink-0 bg-slate-50/70">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === "output"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Console Output
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === "tests"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Test Harness
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-700 bg-white">
            {activeTab === "output" && (
              <pre className="whitespace-pre-wrap leading-relaxed text-slate-800 text-[11px]">
                {output}
              </pre>
            )}

            {activeTab === "tests" && (
              <div className="space-y-4 font-sans">
                {testResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Test Pass Rate</div>
                        <div className="text-lg font-bold text-slate-900 font-mono">
                          {testResult.passed} / {testResult.total}
                        </div>
                      </div>
                      <Badge
                        variant={testResult.passed === testResult.total ? "success" : "destructive"}
                        className="font-mono text-xs"
                      >
                        {testResult.passed === testResult.total ? "100% PASS" : "TESTS FAILED"}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700">Detailed Results:</div>
                      <pre className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap">
                        {testResult.details}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No tests executed yet. Click &quot;Test Code&quot; to validate your implementation.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel Footer Advice */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Notice:</span> Correctness is required before your throughput enters the official leaderboard.
          </div>
        </div>
      </div>
    </div>
  );
}
