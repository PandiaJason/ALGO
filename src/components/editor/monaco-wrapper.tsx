"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-slate-50 flex items-center justify-center text-xs text-slate-400 gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-[#2d7cf6]" />
      <span>Loading ALGO Monaco Editor...</span>
    </div>
  ),
});

interface MonacoWrapperProps {
  value: string;
  language: string;
  onChange: (val: string | undefined) => void;
  readOnly?: boolean;
  theme?: "vs-dark" | "vs";
}

export function MonacoWrapper({
  value,
  language,
  onChange,
  readOnly = false,
  theme = "vs",
}: MonacoWrapperProps) {
  return (
    <div className={`w-full h-full min-h-[350px] overflow-hidden ${theme === "vs-dark" ? "bg-[#1e1e1e]" : "bg-white"}`}>
      <Editor
        height="100%"
        language={language === "cpp" ? "cpp" : "python"}
        value={value}
        onChange={onChange}
        theme={theme}
        options={{
          fontSize: 13,
          fontFamily: "'SF Mono', Menlo, Monaco, Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly,
          tabSize: 4,
          lineNumbersMinChars: 3,
          renderLineHighlight: "all",
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}
