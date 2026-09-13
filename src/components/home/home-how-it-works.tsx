"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/* Challenge 03: Git Version Control Engine (Core Systems)                    */
/* Pure Abstract Topology: Merkle DAG Branch Divergence & Merge Convergence.  */
/* Zero Text: Clean geometric nodes and animated traveling signals.          */
/* -------------------------------------------------------------------------- */
function GitDagDiagram() {
  return (
    <div className="w-full rounded-2xl bg-slate-50/60 border border-slate-200/80 p-5 shadow-2xs select-none relative overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-[260px] h-32 relative">
        <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
          {/* Main branch horizontal baseline */}
          <line x1="20" y1="84" x2="240" y2="84" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />

          {/* Feature branch curve diverging from c1 (75, 84) to c2 (135, 34) to merge c3 (195, 84) */}
          <path
            d="M 75 84 C 95 84, 110 34, 135 34 C 160 34, 175 84, 195 84"
            fill="none"
            stroke="#8647E2"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Commit Nodes on Main */}
          {/* Commit c0 */}
          <circle cx="26" cy="84" r="9" fill="#FFFFFF" stroke="#09C899" strokeWidth="2.5" />
          <circle cx="26" cy="84" r="3.5" fill="#09C899" />

          {/* Commit c1 (Branch Divergence Point) */}
          <circle cx="75" cy="84" r="9" fill="#FFFFFF" stroke="#09C899" strokeWidth="2.5" />
          <circle cx="75" cy="84" r="3.5" fill="#09C899" />

          {/* Commit c2 on Feature Branch */}
          <circle cx="135" cy="34" r="9" fill="#FFFFFF" stroke="#8647E2" strokeWidth="2.5" />
          <circle cx="135" cy="34" r="3.5" fill="#8647E2" />

          {/* Merge Commit c3 (Convergence Point) */}
          <circle cx="195" cy="84" r="14" fill="#099BE9" opacity="0.15" />
          <circle cx="195" cy="84" r="9" fill="#FFFFFF" stroke="#099BE9" strokeWidth="2.5" />
          <circle cx="195" cy="84" r="3.5" fill="#099BE9" />

          {/* Branch Tip Marker on Main */}
          <circle cx="236" cy="84" r="5" fill="#09C899" opacity="0.4" />

          {/* Traveling Commit Signal along Feature Branch */}
          <circle r="4" fill="#8647E2">
            <animateMotion
              path="M 75 84 C 95 84, 110 34, 135 34 C 160 34, 175 84, 195 84"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Traveling Signal along Main Branch */}
          <circle r="4" fill="#09C899">
            <animate attributeName="cx" from="75" to="195" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="cy" from="84" to="84" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Challenge 11: Distributed Rate Limiter (Distributed Systems)               */
/* Pure Abstract Token Bucket: Inflow refill, queue reservoir, backpressure.  */
/* Zero Text: Clean reservoir geometry, animated fluid fill, signal gates.    */
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
    <div className="w-full rounded-2xl bg-slate-50/60 border border-slate-200/80 p-5 shadow-2xs select-none relative overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-[260px] h-32 relative">
        <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
          {/* Top Refill Stream into Bucket */}
          <line x1="130" y1="4" x2="130" y2="38" stroke="#099BE9" strokeWidth="2" strokeDasharray="3 3" />
          {/* Falling Token Pulse */}
          <circle r="3.5" fill="#099BE9">
            <animate attributeName="cx" from="130" to="130" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="cy" from="10" to="44" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Central Bucket Reservoir */}
          <path
            d="M 96 38 L 104 104 L 156 104 L 164 38"
            fill="none"
            stroke="#099BE9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bucket Dynamic Fill Level */}
          <rect
            x="105"
            y={104 - tokens * 12}
            width="50"
            height={tokens * 12}
            rx="3"
            fill="#099BE9"
            opacity="0.25"
            className="transition-all duration-300"
          />

          {/* Left Ingress: Requests arriving */}
          <rect x="6" y="58" width="54" height="28" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="33" cy="72" r="4" fill="#CBD5E1" />

          {/* Ingress Arrow to Bucket */}
          <line x1="60" y1="72" x2="96" y2="72" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Request Pulse arriving */}
          <circle r="3.5" fill="#8647E2">
            <animate attributeName="cx" from="60" to="96" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="cy" from="72" to="72" dur="1.4s" repeatCount="indefinite" />
          </circle>

          {/* Right Egress: Allowed Requests passing through gate */}
          <line x1="164" y1="72" x2="200" y2="72" stroke="#09C899" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="200" y="58" width="54" height="28" rx="6" fill="#09C899" opacity="0.12" stroke="#09C899" strokeWidth="1.5" />
          <circle cx="227" cy="72" r="4" fill="#09C899" />

          {/* Allowed Request Pulse exiting */}
          <circle r="3.5" fill="#09C899">
            <animate attributeName="cx" from="164" to="200" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="cy" from="72" to="72" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
          </circle>

          {/* Bottom Backpressure Throttling Link */}
          <path
            d="M 130 106 C 130 122, 60 122, 60 86"
            fill="none"
            stroke="#FBAE0C"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle r="2.5" fill="#FBAE0C">
            <animateMotion
              path="M 130 106 C 130 122, 60 122, 60 86"
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
/* Pure Abstract Dispatch Loop: Host agent, sandboxed MCP core, tool worker.  */
/* Zero Text: Clean circuit nodes, validation pulse, bidirectional return.   */
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
    <div className="w-full rounded-2xl bg-slate-50/60 border border-slate-200/80 p-5 shadow-2xs select-none relative overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-[260px] h-32 relative">
        <svg viewBox="0 0 260 128" className="w-full h-full overflow-visible">
          {/* Host / Agent Box (Left) */}
          <rect
            x="4"
            y="42"
            width="64"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke={activeStep === 0 ? "#8647E2" : "#CBD5E1"}
            strokeWidth={activeStep === 0 ? "2" : "1.5"}
          />
          <circle cx="36" cy="64" r="5" fill={activeStep === 0 ? "#8647E2" : "#94A3B8"} />

          {/* Forward Link: Agent -> MCP Core */}
          <path
            d="M 68 64 L 98 64"
            fill="none"
            stroke="#8647E2"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Traveling RPC Request Pulse */}
          <circle r="3.5" fill="#8647E2">
            <animate attributeName="cx" from="68" to="98" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="cy" from="64" to="64" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Central MCP Runtime Sandbox Box */}
          <rect
            x="98"
            y="26"
            width="74"
            height="76"
            rx="10"
            fill="#F8FAFC"
            stroke={activeStep === 1 ? "#09C899" : "#099BE9"}
            strokeWidth="2"
          />
          <circle cx="135" cy="50" r="12" fill="#8647E2" opacity="0.12" />
          <circle cx="135" cy="50" r="6" fill="#8647E2" />
          <circle cx="135" cy="80" r="4" fill="#09C899" />

          {/* Forward Link: MCP Core -> Tool Sandbox */}
          <path
            d="M 172 64 L 196 64"
            fill="none"
            stroke="#09C899"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Traveling Exec Pulse */}
          <circle r="3.5" fill="#09C899">
            <animate attributeName="cx" from="172" to="196" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="cy" from="64" to="64" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>

          {/* Tool Sandbox Box (Right) */}
          <rect
            x="196"
            y="42"
            width="60"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke={activeStep === 2 ? "#09C899" : "#CBD5E1"}
            strokeWidth={activeStep === 2 ? "2" : "1.5"}
          />
          <circle cx="226" cy="64" r="5" fill={activeStep === 2 ? "#09C899" : "#94A3B8"} />

          {/* Return Result Link (Bottom curve back to Agent) */}
          <path
            d="M 226 86 C 226 118, 36 118, 36 86"
            fill="none"
            stroke="#099BE9"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Returning Result Packet */}
          <circle r="3.5" fill="#099BE9">
            <animateMotion
              path="M 226 86 C 226 118, 36 118, 36 86"
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
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 shadow-2xs">
            {/* ALGO 4-color dots indicator */}
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#09C899]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBAE0C]" />
            </span>
            <span>How ALGO Works</span>
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
              {/* Pure Abstract System Diagram Animation */}
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
