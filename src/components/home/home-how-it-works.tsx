"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/* Challenge 03: Git Version Control Engine (Core Systems)                    */
/* Large Pure Abstract Topology: Merkle DAG Branch Divergence & Merge.        */
/* Zero Text: Bold geometric nodes and animated traveling signals.           */
/* -------------------------------------------------------------------------- */
function GitDagDiagram() {
  return (
    <div className="w-full rounded-2xl bg-slate-50/60 border border-slate-200/80 p-4 sm:p-5 shadow-2xs select-none relative overflow-hidden flex items-center justify-center">
      <div className="w-full h-48 sm:h-52 relative flex items-center justify-center">
        <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
          {/* Main branch horizontal baseline */}
          <line x1="20" y1="110" x2="280" y2="110" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5 5" />

          {/* Feature branch curve diverging from c1 (85, 110) to c2 (160, 42) to merge c3 (235, 110) */}
          <path
            id="git-feat-path"
            d="M 85 110 C 110 110, 130 42, 160 42 C 190 42, 210 110, 235 110"
            fill="none"
            stroke="#8647E2"
            strokeWidth="3"
            strokeDasharray="5 5"
          />

          {/* Commit Nodes on Main */}
          {/* Commit c0 */}
          <circle cx="28" cy="110" r="13" fill="#FFFFFF" stroke="#09C899" strokeWidth="3.5" />
          <circle cx="28" cy="110" r="5" fill="#09C899" />

          {/* Commit c1 (Branch Divergence Point) */}
          <circle cx="85" cy="110" r="13" fill="#FFFFFF" stroke="#09C899" strokeWidth="3.5" />
          <circle cx="85" cy="110" r="5" fill="#09C899" />

          {/* Commit c2 on Feature Branch */}
          <circle cx="160" cy="42" r="14" fill="#FFFFFF" stroke="#8647E2" strokeWidth="3.5" />
          <circle cx="160" cy="42" r="5.5" fill="#8647E2" />

          {/* Merge Commit c3 (Convergence Point) */}
          <circle cx="235" cy="110" r="22" fill="#099BE9" opacity="0.16" />
          <circle cx="235" cy="110" r="14" fill="#FFFFFF" stroke="#099BE9" strokeWidth="3.5" />
          <circle cx="235" cy="110" r="7" fill="#099BE9" opacity="0.4" />
          <circle cx="235" cy="110" r="4" fill="#099BE9" />

          {/* Branch Tip Marker on Main */}
          <circle cx="278" cy="110" r="6" fill="#09C899" opacity="0.45" />

          {/* Traveling Commit Signal along Feature Branch */}
          <circle r="6" fill="#8647E2">
            <animateMotion
              path="M 85 110 C 110 110, 130 42, 160 42 C 190 42, 210 110, 235 110"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Traveling Signal along Main Branch */}
          <circle r="6" fill="#09C899">
            <animate attributeName="cx" from="85" to="235" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="cy" from="110" to="110" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Challenge 11: Distributed Rate Limiter (Distributed Systems)               */
/* Large Pure Abstract Token Bucket: Inflow refill, queue reservoir, gates.   */
/* Zero Text: Bold reservoir geometry, animated fluid fill, signal flows.     */
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
    <div className="w-full rounded-2xl bg-slate-50/60 border border-slate-200/80 p-4 sm:p-5 shadow-2xs select-none relative overflow-hidden flex items-center justify-center">
      <div className="w-full h-48 sm:h-52 relative flex items-center justify-center">
        <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
          {/* Top Refill Stream into Bucket */}
          <line x1="150" y1="4" x2="150" y2="40" stroke="#099BE9" strokeWidth="2.5" strokeDasharray="4 4" />
          {/* Falling Token Pulse */}
          <circle r="5" fill="#099BE9">
            <animate attributeName="cx" from="150" to="150" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="cy" from="8" to="46" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Central Bucket Reservoir */}
          <path
            d="M 110 40 L 122 132 L 178 132 L 190 40"
            fill="none"
            stroke="#099BE9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Bucket Dynamic Fill Level */}
          <rect
            x={150 - (50 + tokens * 1.5) / 2}
            y={132 - tokens * 17}
            width={50 + tokens * 1.5}
            height={tokens * 17}
            rx="4"
            fill="#099BE9"
            opacity="0.28"
            className="transition-all duration-300"
          />

          {/* Left Ingress: Requests arriving */}
          <rect x="8" y="72" width="64" height="36" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="40" cy="90" r="5.5" fill="#94A3B8" />

          {/* Ingress Arrow to Bucket */}
          <line x1="72" y1="90" x2="114" y2="90" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />
          {/* Request Pulse arriving */}
          <circle r="5" fill="#8647E2">
            <animate attributeName="cx" from="72" to="114" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="cy" from="90" to="90" dur="1.4s" repeatCount="indefinite" />
          </circle>

          {/* Right Egress: Allowed Requests passing through gate */}
          <line x1="186" y1="90" x2="228" y2="90" stroke="#09C899" strokeWidth="2.5" strokeDasharray="4 4" />
          <rect x="228" y="72" width="64" height="36" rx="8" fill="#09C899" opacity="0.12" stroke="#09C899" strokeWidth="2" />
          <circle cx="260" cy="90" r="5.5" fill="#09C899" />

          {/* Allowed Request Pulse exiting */}
          <circle r="5" fill="#09C899">
            <animate attributeName="cx" from="186" to="228" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="cy" from="90" to="90" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
          </circle>

          {/* Bottom Backpressure Throttling Link */}
          <path
            d="M 150 134 C 150 156, 40 156, 40 108"
            fill="none"
            stroke="#FBAE0C"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle r="3.5" fill="#FBAE0C">
            <animateMotion
              path="M 150 134 C 150 156, 40 156, 40 108"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Challenge 20: Model Context Protocol (MCP) Runtime (AI Systems)            */
/* Large Pure Abstract Dispatch Loop: Host agent, sandboxed MCP core, tool.   */
/* Zero Text: Bold circuit nodes, validation pulse, bidirectional return.     */
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
    <div className="w-full rounded-2xl bg-slate-50/60 border border-slate-200/80 p-4 sm:p-5 shadow-2xs select-none relative overflow-hidden flex items-center justify-center">
      <div className="w-full h-48 sm:h-52 relative flex items-center justify-center">
        <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
          {/* Host / Agent Box (Left) */}
          <rect
            x="8"
            y="54"
            width="72"
            height="52"
            rx="10"
            fill="#FFFFFF"
            stroke={activeStep === 0 ? "#8647E2" : "#CBD5E1"}
            strokeWidth={activeStep === 0 ? "2.5" : "2"}
          />
          <circle cx="44" cy="80" r="6.5" fill={activeStep === 0 ? "#8647E2" : "#94A3B8"} />

          {/* Forward Link: Agent -> MCP Core */}
          <path
            d="M 80 80 L 110 80"
            fill="none"
            stroke="#8647E2"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          {/* Traveling RPC Request Pulse */}
          <circle r="5" fill="#8647E2">
            <animate attributeName="cx" from="80" to="110" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cy" from="80" to="80" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Central MCP Runtime Sandbox Box */}
          <rect
            x="110"
            y="30"
            width="80"
            height="100"
            rx="14"
            fill="#F8FAFC"
            stroke={activeStep === 1 ? "#09C899" : "#099BE9"}
            strokeWidth="2.5"
          />
          <circle cx="150" cy="64" r="16" fill="#8647E2" opacity="0.14" />
          <circle cx="150" cy="64" r="8" fill="#8647E2" />
          <circle cx="150" cy="104" r="5.5" fill="#09C899" />

          {/* Forward Link: MCP Core -> Tool Sandbox */}
          <path
            d="M 190 80 L 220 80"
            fill="none"
            stroke="#09C899"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          {/* Traveling Exec Pulse */}
          <circle r="5" fill="#09C899">
            <animate attributeName="cx" from="190" to="220" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="cy" from="80" to="80" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>

          {/* Tool Sandbox Box (Right) */}
          <rect
            x="220"
            y="54"
            width="72"
            height="52"
            rx="10"
            fill="#FFFFFF"
            stroke={activeStep === 2 ? "#09C899" : "#CBD5E1"}
            strokeWidth={activeStep === 2 ? "2.5" : "2"}
          />
          <circle cx="256" cy="80" r="6.5" fill={activeStep === 2 ? "#09C899" : "#94A3B8"} />

          {/* Return Result Link (Bottom curve back to Agent) */}
          <path
            d="M 256 106 C 256 150, 44 150, 44 106"
            fill="none"
            stroke="#099BE9"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          {/* Returning Result Packet */}
          <circle r="4.5" fill="#099BE9">
            <animateMotion
              path="M 256 106 C 256 150, 44 150, 44 106"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Section: 3 Systems Thinking Challenge Cards                           */
/* Git DAG, Distributed Rate Limiter, MCP Runtime                             */
/* -------------------------------------------------------------------------- */
export function HomeHowItWorks() {
  const cards = [
    {
      slug: "git",
      color: "#09C899", // ALGO Green
      title: "Git Version Control Engine",
      description:
        "Content-addressed object database and Directed Acyclic Graph (DAG)",
      widget: <GitDagDiagram />,
    },
    {
      slug: "rate-limiter",
      color: "#099BE9", // ALGO Blue
      title: "Distributed Rate Limiter",
      description:
        "Low-overhead token bucket and sliding window rate limiter",
      widget: <RateLimiterDiagram />,
    },
    {
      slug: "mcp-runtime",
      color: "#8647E2", // ALGO Purple
      title: "Model Context Protocol (MCP) Runtime",
      description:
        "Type-safe JSON-RPC 2.0 tool execution runtime with schema validation and isolation",
      widget: <McpRuntimeDiagram />,
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50/90 border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-xs transition-all duration-300 select-none">
            {/* ALGO 4-color dots capsule */}
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-200/60 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#099BE9] shadow-[0_0_6px_rgba(9,155,233,0.5)]" />
              <span className="w-2 h-2 rounded-full bg-[#09C899] shadow-[0_0_6px_rgba(9,200,153,0.5)]" />
              <span className="w-2 h-2 rounded-full bg-[#8647E2] shadow-[0_0_6px_rgba(134,71,226,0.5)]" />
              <span className="w-2 h-2 rounded-full bg-[#FBAE0C] shadow-[0_0_6px_rgba(251,174,12,0.5)]" />
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-slate-800">
              How ALGO Works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            AI can write the code.
            <span className="block text-[#09C899] mt-1.5">
              ALGO teaches you to understand the system.
            </span>
          </h2>
          <div className="pt-2">
            <p className="text-sm sm:text-base text-slate-700 font-semibold leading-snug">
              Code is becoming cheaper to produce.{" "}
              <span className="text-slate-950 font-black">
                Understanding systems is not.
              </span>
            </p>
          </div>
        </div>

        {/* 3 Pure Abstract Systems Cards for Git, Rate Limiter, and MCP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.slug}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 group cursor-default"
            >
              {/* Pure Abstract System Diagram Animation - Expanded Canvas */}
              <div>{card.widget}</div>

              {/* Bottom: Title & Description */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
