import React from "react";

export function LeetCodeTablet() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      {/* Outer isometric tablet frame */}
      <div
        className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100/80 transition-transform hover:scale-[1.02] duration-300"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Top 4 Color Blocks */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          <div className="h-14 sm:h-16 rounded-xl bg-gradient-to-br from-[#19B2E9] to-[#117BEB] flex flex-col justify-end p-2 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-white/90">GET</span>
            <span className="text-xs font-bold text-white leading-none">80K</span>
          </div>
          <div className="h-14 sm:h-16 rounded-xl bg-gradient-to-br from-[#1AD1A1] to-[#08988F] flex flex-col justify-end p-2 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-white/90">SET</span>
            <span className="text-xs font-bold text-white leading-none">20K</span>
          </div>
          <div className="h-14 sm:h-16 rounded-xl bg-gradient-to-br from-[#F9C242] to-[#F7803C] flex flex-col justify-end p-2 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-white/90">TTL</span>
            <span className="text-xs font-bold text-white leading-none">0.1ms</span>
          </div>
          <div className="h-14 sm:h-16 rounded-xl bg-gradient-to-br from-[#FF5C77] to-[#E63956] flex flex-col justify-end p-2 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-white/90">WAL</span>
            <span className="text-xs font-bold text-white leading-none">100%</span>
          </div>
        </div>

        {/* Middle Content Split: Table on left, Donut Chart on right */}
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Left: Table with colored status dots */}
          <div className="col-span-7 space-y-2.5">
            <div className="flex items-center gap-2 py-1 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <div className="h-2 w-20 bg-slate-200 rounded-full" />
              <div className="h-2 w-8 bg-slate-100 rounded-full ml-auto" />
            </div>
            <div className="flex items-center gap-2 py-1 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <div className="h-2 w-24 bg-slate-200 rounded-full" />
              <div className="h-2 w-10 bg-slate-100 rounded-full ml-auto" />
            </div>
            <div className="flex items-center gap-2 py-1 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="h-2 w-16 bg-slate-200 rounded-full" />
              <div className="h-2 w-6 bg-slate-100 rounded-full ml-auto" />
            </div>
            <div className="flex items-center gap-2 py-1 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="h-2 w-28 bg-slate-200 rounded-full" />
              <div className="h-2 w-12 bg-slate-100 rounded-full ml-auto" />
            </div>
            <div className="flex items-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <div className="h-2 w-20 bg-slate-200 rounded-full" />
              <div className="h-2 w-8 bg-slate-100 rounded-full ml-auto" />
            </div>
          </div>

          {/* Right: Pie/Donut Chart */}
          <div className="col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 1: Cyan (80% GET) */}
                <path
                  className="text-[#19B2E9]"
                  strokeDasharray="75, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 2: Green (20% SET) */}
                <path
                  className="text-[#1AD1A1]"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-75"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-400 font-medium">OPS/S</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 font-mono">101K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>ALGO RUNNER • DOCKER ISOLATED</span>
          <span className="text-emerald-600 font-medium">● 100% ACCURACY</span>
        </div>
      </div>
    </div>
  );
}
