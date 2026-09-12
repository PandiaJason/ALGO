"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GitBranch, ShieldCheck, Cpu, ArrowRight, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Challenge 03: Git Version Control Engine (Core Systems)                    */
/* Systems Thinking: Content-addressed Directed Acyclic Graph (DAG) & Branch  */
/* Convergence. Shows immutable causal history without duplicates.            */
/* -------------------------------------------------------------------------- */
function GitDagDiagram() {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#09C899]/10 text-[#0AA793] inline-flex items-center justify-center">
            <GitBranch className="w-3.5 h-3.5" />
          </span>
          <span>Causal History DAG</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-ping" />
          <span>Immutable DAG</span>
        </span>
      </div>

      {/* SVG Canvas: Clean Minimal DAG with Branching & Merge Convergence */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[260px] h-32 relative">
          <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
            {/* Main branch horizontal baseline */}
            <line x1="26" y1="84" x2="228" y2="84" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="246" y="87" textAnchor="end" className="text-[9px] font-mono font-bold fill-[#0AA793]">main</text>

            {/* Feature branch curve diverging from c1 (75, 84) to c2 (135, 34) to merge c3 (195, 84) */}
            <path
              id="git-feat-path"
              d="M 75 84 C 95 84, 110 34, 135 34 C 160 34, 175 84, 195 84"
              fill="none"
              stroke="#8647E2"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="135" y="20" textAnchor="middle" className="text-[8px] font-mono font-bold fill-[#8647E2]">
              feat/branch
            </text>

            {/* Commit Nodes on Main */}
            {/* Commit c0 */}
            <circle cx="26" cy="84" r="8" fill="#FFFFFF" stroke="#09C899" strokeWidth="2" />
            <text x="26" y="87" textAnchor="middle" className="text-[8px] font-mono font-bold fill-slate-700">c0</text>

            {/* Commit c1 (Branch Divergence Point) */}
            <circle cx="75" cy="84" r="8" fill="#FFFFFF" stroke="#09C899" strokeWidth="2" />
            <text x="75" y="87" textAnchor="middle" className="text-[8px] font-mono font-bold fill-slate-700">c1</text>

            {/* Commit c2 on Feature Branch */}
            <circle cx="135" cy="34" r="8" fill="#FFFFFF" stroke="#8647E2" strokeWidth="2" />
            <text x="135" y="37" textAnchor="middle" className="text-[8px] font-mono font-bold fill-[#8647E2]">c2</text>

            {/* Merge Commit c3 (Convergence Point) */}
            <circle cx="195" cy="84" r="11" fill="#099BE9" opacity="0.15" />
            <circle cx="195" cy="84" r="8" fill="#FFFFFF" stroke="#099BE9" strokeWidth="2" />
            <text x="195" y="87" textAnchor="middle" className="text-[6.5px] font-mono font-black fill-[#099BE9]">MERGE</text>

            {/* HEAD Pointer Pill */}
            <g transform="translate(182, 102)">
              <rect x="0" y="0" width="26" height="13" rx="3" fill="#FBAE0C" />
              <text x="13" y="9.5" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white">HEAD</text>
            </g>

            {/* Traveling Commit Signal along Feature Branch */}
            <circle r="3" fill="#8647E2">
              <animateMotion
                path="M 75 84 C 95 84, 110 34, 135 34 C 160 34, 175 84, 195 84"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Traveling Signal along Main Branch */}
            <circle r="3" fill="#09C899">
              <animate attributeName="cx" from="75" to="195" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="cy" from="84" to="84" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Causal History</span>
        <span className="text-[#0AA793] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Zero Duplicate Blobs</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Challenge 11: Distributed Rate Limiter (Distributed Systems)               */
/* Systems Thinking: Token Bucket Stock & Flow with Backpressure Feedback.    */
/* Constant inflow refills the bucket; incoming requests drain tokens.        */
/* -------------------------------------------------------------------------- */
function RateLimiterDiagram() {
  const [tokens, setTokens] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#099BE9]/10 text-[#099BE9] inline-flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span>Token Bucket Dynamics</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#099BE9]/15 text-[#099BE9] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9] animate-ping" />
          <span>Refill +10k/s</span>
        </span>
      </div>

      {/* SVG Canvas: Clean Token Bucket Reservoir with Pass/Throttle Gate */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[260px] h-32 relative">
          <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
            {/* Top Refill Stream into Bucket */}
            <line x1="130" y1="4" x2="130" y2="38" stroke="#099BE9" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="130" y="12" textAnchor="middle" className="text-[7px] font-mono font-bold fill-[#099BE9]">
              REFILL (+r)
            </text>
            {/* Falling Token Pulse */}
            <circle r="2.5" fill="#099BE9">
              <animate attributeName="cx" from="130" to="130" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="cy" from="14" to="44" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* Central Bucket Reservoir */}
            <path
              d="M 96 38 L 104 104 L 156 104 L 164 38"
              fill="none"
              stroke="#099BE9"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Bucket Dynamic Fill Level */}
            <rect
              x="105"
              y={102 - tokens * 11}
              width="50"
              height={tokens * 11}
              rx="3"
              fill="#099BE9"
              opacity="0.16"
              className="transition-all duration-300"
            />
            <text x="130" y="82" textAnchor="middle" className="text-[9px] font-mono font-black fill-slate-800">
              {tokens} / 5
            </text>
            <text x="130" y="94" textAnchor="middle" className="text-[6.5px] font-mono fill-slate-500">
              TOKENS
            </text>

            {/* Left Ingress: Requests arriving */}
            <rect x="4" y="60" width="58" height="24" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <text x="33" y="75" textAnchor="middle" className="text-[8px] font-mono font-bold fill-slate-800">
              REQ IN
            </text>

            {/* Ingress Arrow to Bucket */}
            <line x1="62" y1="72" x2="96" y2="72" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* Request Pulse arriving */}
            <circle r="3" fill="#8647E2">
              <animate attributeName="cx" from="62" to="96" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="cy" from="72" to="72" dur="1.4s" repeatCount="indefinite" />
            </circle>

            {/* Right Egress: Allowed Requests passing through gate */}
            <line x1="164" y1="72" x2="200" y2="72" stroke="#09C899" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="200" y="60" width="56" height="24" rx="5" fill="#09C899" opacity="0.12" stroke="#09C899" strokeWidth="1" />
            <text x="228" y="75" textAnchor="middle" className="text-[8px] font-mono font-bold fill-[#0AA793]">
              200 OK
            </text>

            {/* Allowed Request Pulse exiting */}
            <circle r="3" fill="#09C899">
              <animate attributeName="cx" from="164" to="200" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
              <animate attributeName="cy" from="72" to="72" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
            </circle>

            {/* Bottom Backpressure Throttling Notice */}
            <path
              d="M 130 106 C 130 120, 62 120, 62 84"
              fill="none"
              stroke="#FBAE0C"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <text x="110" y="122" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#F78424]">
              Empty -&gt; 429 Throttle
            </text>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Decision Speed</span>
        <span className="text-[#099BE9] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Sub-20µs Evaluation</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Challenge 20: Model Context Protocol (MCP) Runtime (AI Systems)            */
/* Systems Thinking: Type-Safe JSON-RPC 2.0 Dispatch & Sandboxed Tool Loops.  */
/* Host dispatch validates schemas, executes sandboxed tools, returns state.  */
/* -------------------------------------------------------------------------- */
function McpRuntimeDiagram() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#8647E2]/10 text-[#8647E2] inline-flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5" />
          </span>
          <span>JSON-RPC 2.0 Dispatcher</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8647E2]/15 text-[#8647E2] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2] animate-ping" />
          <span>Tool Overhead &lt; 0.8ms</span>
        </span>
      </div>

      {/* SVG Canvas: Clean 3-Stage Pipeline (Host -> MCP Runtime -> Tool Sandbox) */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[260px] h-32 relative">
          <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
            {/* Host / Agent Box (Left) */}
            <rect
              x="4"
              y="44"
              width="64"
              height="40"
              rx="6"
              fill="#FFFFFF"
              stroke={activeStep === 0 ? "#8647E2" : "#CBD5E1"}
              strokeWidth={activeStep === 0 ? "2" : "1"}
            />
            <text x="36" y="60" textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-900">
              AGENT
            </text>
            <text x="36" y="72" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#8647E2]">
              send-rpc
            </text>

            {/* Forward Link: Agent -> MCP Core */}
            <path
              d="M 68 56 L 98 56"
              fill="none"
              stroke="#8647E2"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            {/* Traveling RPC Request Pulse */}
            <circle r="3" fill="#8647E2">
              <animate attributeName="cx" from="68" to="98" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="cy" from="56" to="56" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Central MCP Runtime Sandbox Box */}
            <rect
              x="98"
              y="28"
              width="74"
              height="72"
              rx="8"
              fill="#F8FAFC"
              stroke={activeStep === 1 ? "#09C899" : "#099BE9"}
              strokeWidth="1.5"
            />
            <rect x="106" y="36" width="58" height="15" rx="3" fill="#8647E2" opacity="0.1" />
            <text x="135" y="47" textAnchor="middle" className="text-[7.5px] font-mono font-black fill-[#8647E2]">
              MCP CORE
            </text>
            <text x="135" y="66" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-slate-700">
              Schema Check
            </text>
            <text x="135" y="78" textAnchor="middle" className="text-[6px] font-mono font-bold fill-[#0AA793]">
              VALIDATED
            </text>
            <circle cx="135" cy="88" r="3" fill="#09C899" />

            {/* Forward Link: MCP Core -> Tool Sandbox */}
            <path
              d="M 172 56 L 196 56"
              fill="none"
              stroke="#09C899"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            {/* Traveling Exec Pulse */}
            <circle r="3" fill="#09C899">
              <animate attributeName="cx" from="172" to="196" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="cy" from="56" to="56" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            </circle>

            {/* Tool Sandbox Box (Right) */}
            <rect
              x="196"
              y="44"
              width="60"
              height="40"
              rx="6"
              fill="#FFFFFF"
              stroke={activeStep === 2 ? "#09C899" : "#CBD5E1"}
              strokeWidth={activeStep === 2 ? "2" : "1"}
            />
            <text x="226" y="60" textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-900">
              TOOL
            </text>
            <text x="226" y="72" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#0AA793]">
              execute
            </text>

            {/* Return Result Link (Bottom curve back to Agent) */}
            <path
              d="M 226 84 C 226 114, 36 114, 36 84"
              fill="none"
              stroke="#099BE9"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="131" y="112" textAnchor="middle" className="text-[6.5px] font-mono font-bold fill-[#099BE9]">
              tools/call result -&gt; ACK
            </text>
            {/* Returning Result Packet */}
            <circle r="2.5" fill="#099BE9">
              <animateMotion
                path="M 226 84 C 226 114, 36 114, 36 84"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Protocol Safety</span>
        <span className="text-[#8647E2] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Zero Escape Isolation</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Section: 3 Featured ALGO Challenges with Pure Systems Diagrams        */
/* 03 Git Version Control Engine                                              */
/* 11 Distributed Rate Limiter                                                */
/* 20 Model Context Protocol (MCP) Runtime                                    */
/* -------------------------------------------------------------------------- */
export function HomeHowItWorks() {
  const cards = [
    {
      num: "03",
      slug: "git",
      badge: "GIT · MEDIUM",
      color: "#09C899", // ALGO Green
      badgeStyle: "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30",
      title: "Git Version Control Engine",
      description:
        "Content-addressed object database and Directed Acyclic Graph (DAG)",
      tech: "Git",
      difficulty: "Medium",
      metric: "Commit creation: < 2ms",
      widget: <GitDagDiagram />,
    },
    {
      num: "11",
      slug: "rate-limiter",
      badge: "TRAFFIC · MEDIUM",
      color: "#099BE9", // ALGO Blue
      badgeStyle: "text-[#099BE9] bg-[#099BE9]/10 border-[#099BE9]/30",
      title: "Distributed Rate Limiter",
      description:
        "Low-overhead token bucket and sliding window rate limiter",
      tech: "Stripe API, Cloudflare",
      difficulty: "Medium",
      metric: "Decision latency: < 0.02ms",
      widget: <RateLimiterDiagram />,
    },
    {
      num: "20",
      slug: "mcp-runtime",
      badge: "AI SYSTEMS · MEDIUM",
      color: "#8647E2", // ALGO Purple
      badgeStyle: "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30",
      title: "Model Context Protocol (MCP) Runtime",
      description:
        "Type-safe JSON-RPC 2.0 tool execution runtime with schema validation and isolation",
      tech: "Anthropic MCP, Google Sidecars",
      difficulty: "Medium",
      metric: "Tool dispatch: < 0.8ms",
      widget: <McpRuntimeDiagram />,
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
            <span>Featured System Challenges</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Learn systems by building them.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            From content-addressed DAGs to token-bucket rate limiters and sandboxed MCP tool dispatchers. Master first-principles engineering from scratch.
          </p>
        </div>

        {/* 3 Challenge Cards with Pure Systems Thinking Diagrams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.slug}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              {/* Top: Challenge Number & Category Badge */}
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

              {/* Center: Systems Thinking Animated Diagram */}
              <div className="pt-1">{card.widget}</div>

              {/* Bottom: Title, Description, Metadata & Action Button */}
              <div className="space-y-3 pt-2 border-t border-slate-100 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <Link
                    href={`/challenges/${card.slug}`}
                    className="block text-lg font-bold text-slate-950 tracking-tight transition-colors hover:text-[#0AA793]"
                  >
                    {card.title}
                  </Link>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Challenge Metadata Chips */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {card.tech}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {card.metric}
                    </span>
                  </div>

                  {/* Solve Button */}
                  <Link
                    href={`/challenges/${card.slug}/workspace`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-2xs hover:opacity-95 active:scale-98"
                    style={{ backgroundColor: card.color }}
                  >
                    <span>Solve Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
