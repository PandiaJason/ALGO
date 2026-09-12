"use client";

import React, { useState, useEffect } from "react";
import { GitCommit, Activity, RefreshCw, Layers, ArrowRight, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Diagram 1: Causal Loop Diagram (CLD) — Balancing (B) & Reinforcing (R)     */
/* Foundational Systems Thinking: Feedback polarities and self-stabilization  */
/* -------------------------------------------------------------------------- */
function CausalLoopDiagram() {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#09C899]/10 text-[#0AA793] inline-flex items-center justify-center">
            <RefreshCw className="w-3.5 h-3.5" />
          </span>
          <span>Causal Loop Diagram</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-ping" />
          <span>Balancing Feedback</span>
        </span>
      </div>

      {/* SVG: Causal Loop Diagram with Interlocking B & R Feedback Loops */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[260px] h-32 relative">
          <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
            <defs>
              <marker
                id="arrow-head"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#94A3B8" />
              </marker>
              <marker
                id="arrow-green"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#09C899" />
              </marker>
            </defs>

            {/* Variable Nodes */}
            {/* Top: System Load */}
            <rect x="92" y="6" width="76" height="22" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x="130" y="21" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800">System Load</text>

            {/* Bottom Left: Ingress Throttle */}
            <rect x="6" y="96" width="94" height="22" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x="53" y="111" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800">Throttle Rate</text>

            {/* Bottom Right: Queue Buffer */}
            <rect x="160" y="96" width="94" height="22" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x="207" y="111" textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800">Buffer Depth</text>

            {/* Causal Feedback Loop 1: Balancing Loop Path (Left) */}
            <path
              id="cld-path-b"
              d="M 100 28 C 60 46, 30 68, 45 96 C 60 110, 85 85, 115 28"
              fill="none"
              stroke="#09C899"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            {/* Causal Feedback Loop 2: Reinforcing Path (Right) */}
            <path
              id="cld-path-r"
              d="M 160 28 C 190 46, 225 68, 215 96 C 195 110, 175 80, 145 28"
              fill="none"
              stroke="#FBAE0C"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Traveling Signal Pulse along Balancing Loop */}
            <circle r="3" fill="#09C899">
              <animateMotion
                path="M 100 28 C 60 46, 30 68, 45 96 C 60 110, 85 85, 115 28"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Traveling Signal Pulse along Reinforcing Loop */}
            <circle r="3" fill="#FBAE0C">
              <animateMotion
                path="M 160 28 C 190 46, 225 68, 215 96 C 195 110, 175 80, 145 28"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Center Badges: (B) Balancing Loop Symbol */}
            <g transform="translate(74, 54)">
              <circle cx="12" cy="12" r="12" fill="#09C899" opacity="0.12" />
              <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#09C899" strokeWidth="1" />
              <text x="12" y="16" textAnchor="middle" className="text-[10px] font-mono font-black fill-[#0AA793]">B</text>
            </g>

            {/* Center Badges: (R) Reinforcing Loop Symbol */}
            <g transform="translate(150, 54)">
              <circle cx="12" cy="12" r="12" fill="#FBAE0C" opacity="0.12" />
              <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#FBAE0C" strokeWidth="1" />
              <text x="12" y="16" textAnchor="middle" className="text-[10px] font-mono font-black fill-[#F78424]">R</text>
            </g>

            {/* Polarities */}
            <text x="36" y="58" className="text-[9px] font-mono font-bold fill-[#0AA793]">( - )</text>
            <text x="214" y="58" className="text-[9px] font-mono font-bold fill-[#F78424]">( + )</text>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Negative Feedback</span>
        <span className="text-[#0AA793] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Homeostatic Equilibrium</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Diagram 2: Stock & Flow Diagram — Accumulation, Rates & Backpressure      */
/* Foundational Systems Thinking: Reservoirs, Inflow/Outflow, Valve Control   */
/* -------------------------------------------------------------------------- */
function StockAndFlowDiagram() {
  const [level, setLevel] = useState(52);

  // Dynamic fluctuation of the buffer stock
  useEffect(() => {
    const timer = setInterval(() => {
      setLevel((prev) => 48 + Math.floor(Math.sin(Date.now() / 900) * 12));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#099BE9]/10 text-[#099BE9] inline-flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span>Stock & Flow Diagram</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#099BE9]/15 text-[#099BE9] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9] animate-ping" />
          <span>Rate Throttling</span>
        </span>
      </div>

      {/* SVG: Canonical Stock and Flow with Valves and Feedback Link */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[260px] h-32 relative">
          <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
            <defs>
              {/* Valve Symbol Definition */}
              <g id="valve-symbol">
                <polygon points="-6,-6 6,6 6,-6 -6,6" fill="#099BE9" />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
              </g>
            </defs>

            {/* Inflow Cloud Source */}
            <circle cx="18" cy="52" r="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
            <text x="18" y="55" textAnchor="middle" className="text-[8px] font-mono fill-slate-400">Src</text>

            {/* Inflow Pipe Line */}
            <line x1="28" y1="52" x2="88" y2="52" stroke="#099BE9" strokeWidth="2.5" />

            {/* Inflow Valve (Double Triangle) */}
            <g transform="translate(56, 52)">
              <use href="#valve-symbol" />
              <text x="0" y="-10" textAnchor="middle" className="text-[8px] font-mono font-bold fill-slate-700">Inflow</text>
            </g>

            {/* Continuous Inflow Packets */}
            <circle r="3" fill="#099BE9">
              <animate attributeName="cx" from="28" to="88" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="cy" from="52" to="52" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* CENTRAL STOCK (Accumulator Box) */}
            <rect
              x="88"
              y="26"
              width="84"
              height="52"
              rx="4"
              fill="#FFFFFF"
              stroke="#099BE9"
              strokeWidth="2"
            />
            {/* Dynamic Fill Level in Stock */}
            <rect
              x="90"
              y={76 - (level * 48) / 100}
              width="80"
              height={(level * 48) / 100}
              rx="2"
              fill="#099BE9"
              opacity="0.18"
              className="transition-all duration-500"
            />
            {/* Stock Level Surface Line */}
            <line
              x1="90"
              y1={76 - (level * 48) / 100}
              x2="170"
              y2={76 - (level * 48) / 100}
              stroke="#099BE9"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              className="transition-all duration-500"
            />
            <text x="130" y="44" textAnchor="middle" className="text-[10px] font-mono font-black fill-slate-900">STOCK</text>
            <text x="130" y="58" textAnchor="middle" className="text-[9px] font-mono font-semibold fill-[#099BE9]">
              Queue [{level}%]
            </text>

            {/* Outflow Pipe Line */}
            <line x1="172" y1="52" x2="232" y2="52" stroke="#099BE9" strokeWidth="2.5" />

            {/* Outflow Valve */}
            <g transform="translate(202, 52)">
              <use href="#valve-symbol" />
              <text x="0" y="-10" textAnchor="middle" className="text-[8px] font-mono font-bold fill-slate-700">Drain</text>
            </g>

            {/* Outflow Cloud Sink */}
            <circle cx="242" cy="52" r="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
            <text x="242" y="55" textAnchor="middle" className="text-[8px] font-mono fill-slate-400">Sink</text>

            {/* Continuous Outflow Packets */}
            <circle r="3" fill="#09C899">
              <animate attributeName="cx" from="172" to="232" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="cy" from="52" to="52" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* Information Feedback Link: Stock to Inflow Valve (Backpressure) */}
            <path
              d="M 130 78 C 130 110, 56 110, 56 64"
              fill="none"
              stroke="#8647E2"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="96" y="112" textAnchor="middle" className="text-[8px] font-mono font-bold fill-[#8647E2]">
              Backpressure Throttle Link
            </text>
            {/* Feedback Signal Traveling Along Link */}
            <circle r="2" fill="#8647E2">
              <animateMotion
                path="M 130 78 C 130 110, 56 110, 56 64"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Accumulation Law</span>
        <span className="text-[#099BE9] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Inflow = Outflow Steady State</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Diagram 3: Dynamic Equilibrium & Delay Dampening (Systems Thinking)        */
/* Foundational Systems Thinking: Time delays, oscillations, state stability  */
/* -------------------------------------------------------------------------- */
function EquilibriumDelayDiagram() {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#8647E2]/10 text-[#8647E2] inline-flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </span>
          <span>Dynamic Equilibrium</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8647E2]/15 text-[#8647E2] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2] animate-ping" />
          <span>Damped Delay</span>
        </span>
      </div>

      {/* SVG: Phase Response Curve Showing Damped Convergence toward Goal State */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[260px] h-32 relative">
          <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
            {/* Axis grid lines */}
            <line x1="20" y1="110" x2="246" y2="110" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="20" y1="16" x2="20" y2="110" stroke="#CBD5E1" strokeWidth="1" />
            <text x="246" y="122" textAnchor="end" className="text-[8px] font-mono fill-slate-400">Time (t) ➔</text>
            <text x="14" y="24" textAnchor="end" className="text-[8px] font-mono fill-slate-400">State</text>

            {/* Target Goal Equilibrium Line (Dashed Green) */}
            <line x1="20" y1="56" x2="246" y2="56" stroke="#09C899" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="180" y="44" width="66" height="15" rx="3" fill="#09C899" opacity="0.1" />
            <text x="213" y="55" textAnchor="middle" className="text-[8px] font-mono font-bold fill-[#0AA793]">
              Goal Equilibrium
            </text>

            {/* Time Delay Marker Line */}
            <line x1="70" y1="16" x2="70" y2="110" stroke="#FBAE0C" strokeWidth="1" strokeDasharray="2 2" />
            <text x="70" y="14" textAnchor="middle" className="text-[8px] font-mono font-bold fill-[#F78424]">
              Delay (τ)
            </text>

            {/* Damped Convergence Wave Path */}
            {/* Starts from sudden perturbation, oscillates with damping, then locks to goal */}
            <path
              id="damping-curve"
              d="M 20 102 C 40 102, 50 16, 70 20 C 95 24, 110 82, 135 78 C 160 74, 175 48, 195 54 C 215 58, 230 56, 246 56"
              fill="none"
              stroke="#8647E2"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Traveling Tracer on the Damped Convergence Curve */}
            <circle r="4" fill="#8647E2" stroke="#FFFFFF" strokeWidth="1.5">
              <animateMotion
                path="M 20 102 C 40 102, 50 16, 70 20 C 95 24, 110 82, 135 78 C 160 74, 175 48, 195 54 C 215 58, 230 56, 246 56"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Stable Convergence Point Indicator */}
            <circle cx="246" cy="56" r="4" fill="#09C899" />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Stability Factor</span>
        <span className="text-[#8647E2] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Critically Damped (No Thrashing)</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Section: Pure Systems Thinking Diagrams                              */
/* 1. Causal Feedback Loops (CLD)                                             */
/* 2. Stock and Flow with Backpressure Link                                   */
/* 3. Equilibrium Convergence with Delay Damping                              */
/* -------------------------------------------------------------------------- */
export function HomeHowItWorks() {
  const cards = [
    {
      num: "01",
      badge: "CAUSAL FEEDBACK LOOPS",
      color: "#09C899", // ALGO Green
      badgeStyle: "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30",
      title: "Feedback loops",
      description:
        "Every distributed system is governed by feedback. Balance load through negative feedback loops, and identify runaway reinforcing loops before cascading failures strike.",
      widget: <CausalLoopDiagram />,
    },
    {
      num: "02",
      badge: "STOCKS & FLOWS",
      color: "#099BE9", // ALGO Blue
      badgeStyle: "text-[#099BE9] bg-[#099BE9]/10 border-[#099BE9]/30",
      title: "Stocks & flow rates",
      description:
        "Model queues, buffer pools, and thread states as physical accumulations. Design closed information links where stock levels throttle inflow rates through backpressure.",
      widget: <StockAndFlowDiagram />,
    },
    {
      num: "03",
      badge: "EQUILIBRIUM & DELAY",
      color: "#8647E2", // ALGO Purple
      badgeStyle: "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30",
      title: "Dynamic equilibrium",
      description:
        "Time delays between measurement and actuation cause oscillation and thrashing. Engineer critically damped systems that converge predictably to goal equilibrium.",
      widget: <EquilibriumDelayDiagram />,
    },
  ];

  return (
    <section className="w-full bg-[#FAF9F6] border-t border-b border-slate-200/80 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 shadow-2xs">
            {/* ALGO 4-color dots indicator */}
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#09C899]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBAE0C]" />
            </span>
            <span>Systems Thinking in Action</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Learn systems by modeling their dynamics.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Move beyond isolated syntax. Master feedback loops, accumulation stocks, and time-delay dynamics that define real distributed architectures.
          </p>
        </div>

        {/* 3 Pure Systems Thinking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-default"
            >
              {/* Top: Number & Eyebrow Badge with brand color */}
              <div className="flex items-center justify-between">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs text-white shadow-2xs transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: card.color }}
                >
                  {card.num}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${card.badgeStyle} transition-transform duration-300 group-hover:scale-105`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Center: Systems Thinking Diagram with Abstract Vector Motion */}
              <div className="pt-1">{card.widget}</div>

              {/* Bottom: Title & Deep Dive Description */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-950 tracking-tight transition-colors group-hover:text-[#0AA793]">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
