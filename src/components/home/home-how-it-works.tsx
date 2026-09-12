"use client";

import React, { useState, useEffect } from "react";
import { Layers, Share2, Activity, ArrowRight, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Visual Widget 1: Circular Ring Buffer & Memory State (Systems Thinking)    */
/* Demonstrates: Cyclic memory allocation, pointer offsets, cache eviction    */
/* -------------------------------------------------------------------------- */
function RingBufferStateWidget() {
  const [headIndex, setHeadIndex] = useState(2);
  const totalSlots = 8;

  // Advance pointer in a closed cyclic feedback loop
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadIndex((prev) => (prev + 1) % totalSlots);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Compute coordinates for 8 circular slots
  const radius = 42;
  const centerX = 64;
  const centerY = 58;

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#09C899]/10 text-[#0AA793] inline-flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span>Cyclic Ring Buffer</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-ping" />
          <span>O(1) Bounded State</span>
        </span>
      </div>

      {/* Abstract Circular Memory Diagram */}
      <div className="py-3 flex items-center justify-between gap-4">
        {/* Left: SVG Ring Buffer */}
        <div className="relative w-32 h-28 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 128 116" className="w-full h-full">
            {/* Guide circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              fill="none"
            />

            {/* Render 8 slots */}
            {Array.from({ length: totalSlots }).map((_, i) => {
              const angle = (i * (360 / totalSlots) - 90) * (Math.PI / 180);
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              const isHead = headIndex === i;
              const isTail = (headIndex + 4) % totalSlots === i;

              return (
                <g key={i}>
                  {/* Slot Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHead ? 8 : 6}
                    className="transition-all duration-500 ease-out"
                    fill={isHead ? "#09C899" : isTail ? "#FBAE0C" : "#F8FAFC"}
                    stroke={isHead ? "#0AA793" : isTail ? "#F78424" : "#CBD5E1"}
                    strokeWidth={isHead ? 2 : 1.5}
                  />
                  {/* Active slot center dot */}
                  {isHead && (
                    <circle cx={x} cy={y} r={3} fill="#FFFFFF" />
                  )}
                </g>
              );
            })}

            {/* Dynamic Pointer Arrow Line from Center to Head Slot */}
            {(() => {
              const angle = (headIndex * (360 / totalSlots) - 90) * (Math.PI / 180);
              const targetX = centerX + (radius - 12) * Math.cos(angle);
              const targetY = centerY + (radius - 12) * Math.sin(angle);
              return (
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={targetX}
                  y2={targetY}
                  stroke="#0AA793"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              );
            })()}

            {/* Center Pivot Hub */}
            <circle cx={centerX} cy={centerY} r={5} fill="#0AA793" />
            <circle cx={centerX} cy={centerY} r={2} fill="#FFFFFF" />
          </svg>
        </div>

        {/* Right: State Stream Indicators */}
        <div className="flex-1 space-y-2 font-mono text-[11px]">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span>Write Head</span>
              <span className="font-bold text-[#0AA793]">Slot 0{headIndex}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#09C899] h-full transition-all duration-500"
                style={{ width: `${((headIndex + 1) / totalSlots) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="text-slate-500">Eviction Loop</span>
            <span className="font-bold text-slate-900">Zero Overrun</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Offset Indexing</span>
        <span className="text-[#0AA793] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Cache-line aligned</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Widget 2: Topological Consensus & State Convergence (Systems)       */
/* Demonstrates: Broadcast quorum, causal order, network convergence          */
/* -------------------------------------------------------------------------- */
function ConsensusTopologyWidget() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => (p + 1) % 4);
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#099BE9]/10 text-[#099BE9] inline-flex items-center justify-center">
            <Share2 className="w-3.5 h-3.5" />
          </span>
          <span>State Convergence</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#099BE9]/15 text-[#099BE9] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9] animate-ping" />
          <span>Consensus Lock</span>
        </span>
      </div>

      {/* Abstract Triangular Graph Topology */}
      <div className="py-3 flex items-center justify-center">
        <div className="w-full max-w-[220px] h-28 relative">
          <svg viewBox="0 0 220 112" className="w-full h-full overflow-visible">
            {/* Edges Connecting Nodes */}
            <line x1="110" y1="20" x2="40" y2="86" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="110" y1="20" x2="180" y2="86" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="40" y1="86" x2="180" y2="86" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Radiating Concurrency Wave from Primary Node */}
            <circle cx="110" cy="20" r="14" fill="none" stroke="#099BE9" strokeWidth="1" opacity="0.3">
              <animate attributeName="r" from="10" to="34" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* Traveling Data Packets on Edges */}
            {/* Edge 1: Top to Left */}
            <circle r="3" fill="#099BE9">
              <animate attributeName="cx" from="110" to="40" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="cy" from="20" to="86" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* Edge 2: Top to Right */}
            <circle r="3" fill="#09C899">
              <animate attributeName="cx" from="110" to="180" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
              <animate attributeName="cy" from="20" to="86" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
            </circle>

            {/* Return Edge: Left to Right Sync */}
            <circle r="2.5" fill="#8647E2">
              <animate attributeName="cx" from="40" to="180" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
              <animate attributeName="cy" values="86;84;86" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
            </circle>

            {/* Primary Node (Top) */}
            <g>
              <circle cx="110" cy="20" r="10" fill="#099BE9" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="110" cy="20" r="3.5" fill="#FFFFFF" />
            </g>

            {/* Replica Node A (Bottom Left) */}
            <g>
              <circle cx="40" cy="86" r="9" fill="#09C899" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="40" cy="86" r="3" fill="#FFFFFF" />
            </g>

            {/* Replica Node B (Bottom Right) */}
            <g>
              <circle cx="180" cy="86" r="9" fill="#8647E2" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="180" cy="86" r="3" fill="#FFFFFF" />
            </g>

            {/* Labels in SVG */}
            <text x="110" y="38" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-700">Leader (t=4)</text>
            <text x="40" y="104" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">Replica 1</text>
            <text x="180" y="104" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">Replica 2</text>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Quorum Round</span>
        <span className="text-[#099BE9] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9]" />
          <span>Synchronized State</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Widget 3: Pipeline Flow & Little's Law Throughput (Systems)         */
/* Demonstrates: Bounded queues, backpressure, physical hardware limits       */
/* -------------------------------------------------------------------------- */
function PipelineFlowWidget() {
  const [throughput, setThroughput] = useState(156400);

  useEffect(() => {
    const timer = setInterval(() => {
      setThroughput(156000 + Math.floor(Math.sin(Date.now() / 900) * 2200));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#8647E2]/10 text-[#8647E2] inline-flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </span>
          <span>Pipeline & Latency</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8647E2]/15 text-[#8647E2] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2] animate-ping" />
          <span>Continuous Drain</span>
        </span>
      </div>

      {/* Abstract Flow Pipeline Architecture */}
      <div className="py-3 space-y-3">
        {/* Pipeline Queue Stream SVG */}
        <div className="w-full h-10 bg-slate-50 rounded-xl border border-slate-200/80 p-1 flex items-center relative overflow-hidden">
          {/* Moving Flow Gradient Stream */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-[#099BE9] via-[#09C899] to-[#8647E2]" />

          {/* Abstract Packets Flowing Left to Right */}
          <div className="w-full flex items-center justify-between px-2 relative z-10">
            <span className="text-[10px] font-mono font-semibold text-slate-500">IN</span>

            {/* SVG Packet Stream */}
            <svg className="flex-1 h-5 mx-2 overflow-visible">
              {/* Channel Line */}
              <line x1="0" y1="10" x2="100%" y2="10" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />

              {/* Packet 1 */}
              <rect width="14" height="8" rx="2" y="6" fill="#099BE9">
                <animate attributeName="x" from="0%" to="100%" dur="2s" repeatCount="indefinite" />
              </rect>

              {/* Packet 2 */}
              <rect width="14" height="8" rx="2" y="6" fill="#09C899">
                <animate attributeName="x" from="0%" to="100%" dur="2s" begin="0.65s" repeatCount="indefinite" />
              </rect>

              {/* Packet 3 */}
              <rect width="14" height="8" rx="2" y="6" fill="#8647E2">
                <animate attributeName="x" from="0%" to="100%" dur="2s" begin="1.3s" repeatCount="indefinite" />
              </rect>
            </svg>

            <span className="text-[10px] font-mono font-semibold text-slate-500">OUT</span>
          </div>
        </div>

        {/* Live Systems Telemetry Bar */}
        <div className="grid grid-cols-2 gap-2 font-mono text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 block">Measured Rate</span>
            <span className="text-sm font-bold text-slate-900">
              {Math.round(throughput / 1000)}K <span className="text-[10px] text-[#0AA793]">ops/s</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 block">Tail p99</span>
            <span className="text-sm font-bold text-[#8647E2]">0.18 ms</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Hardware Bus</span>
        <span className="text-[#8647E2] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2]" />
          <span>Zero Backpressure</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Section: Clean Brilliant.org-Style Learning Cards                     */
/* Uses ALGO's 4 Brand Colors:                                                */
/* Blue (#099BE9), Green (#09C899), Purple (#8647E2), Orange (#FBAE0C)        */
/* NO EMOJIS — PURE ABSTRACT SYSTEMS THINKING ANIMATIONS                      */
/* -------------------------------------------------------------------------- */
export function HomeHowItWorks() {
  const cards = [
    {
      num: "01",
      badge: "MEMORY & FEEDBACK",
      color: "#09C899", // ALGO Green
      badgeStyle: "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30",
      title: "Concepts that click",
      description:
        "Understand state machines and memory cycles through hands-on construction. Trace pointer offsets, ring buffers, and cache evictions from first principles.",
      widget: <RingBufferStateWidget />,
    },
    {
      num: "02",
      badge: "TOPOLOGY & CONSENSUS",
      color: "#099BE9", // ALGO Blue
      badgeStyle: "text-[#099BE9] bg-[#099BE9]/10 border-[#099BE9]/30",
      title: "Guided progression",
      description:
        "Evolve from single-process commands to multi-node topologies. Model message passing, quorum convergence, and partition tolerance across 6 progressive tiers.",
      widget: <ConsensusTopologyWidget />,
    },
    {
      num: "03",
      badge: "FLOW & CONSTRAINTS",
      color: "#8647E2", // ALGO Purple
      badgeStyle: "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30",
      title: "Real physical limits",
      description:
        "Test implementations against hardware bottlenecks. Measure queue backpressure, cache-miss penalties, and microsecond tail latencies under real load.",
      widget: <PipelineFlowWidget />,
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
            <span>How ALGO Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Master systems by building them.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Visual, first-principles systems engineering. Learn how real databases, caches, and distributed networks operate from the ground up.
          </p>
        </div>

        {/* 3 Brilliant-Style Visual Cards */}
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

              {/* Center: Abstract Systems Thinking Animation */}
              <div className="pt-1">{card.widget}</div>

              {/* Bottom: Title & Friendly Description */}
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
