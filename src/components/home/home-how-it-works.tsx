"use client";

import React, { useState } from "react";
import { Database, Network, Activity } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Visual Widget 1: Key-Value / Storage Intuition (Brilliant style)           */
/* -------------------------------------------------------------------------- */
function StorageIntuitionWidget() {
  const [activeSlot, setActiveSlot] = useState(1);
  const slots = [
    { key: "session:402", val: "token_abc", status: "HIT", latency: "0.02ms" },
    { key: "user:109", val: "profile_data", status: "HIT", latency: "0.01ms" },
    { key: "cache:rate", val: "limit_60/m", status: "HIT", latency: "0.03ms" },
  ];

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <Database className="w-3.5 h-3.5 text-[#09C899]" />
          <span>In-Memory Storage Slot</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold">
          O(1) Direct Lookup
        </span>
      </div>

      <div className="py-3 space-y-2">
        {slots.map((slot, idx) => {
          const isSelected = activeSlot === idx;
          return (
            <div
              key={slot.key}
              onClick={() => setActiveSlot(idx)}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-[#09C899]/10 border-[#09C899]/40 shadow-xs"
                  : "bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/70 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-[#09C899]" : "bg-slate-300"
                  }`}
                />
                <span className="font-semibold text-slate-900">{slot.key}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-normal">
                  {slot.latency}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? "bg-[#09C899] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {slot.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Pointer resolved</span>
        <span className="text-[#0AA793] font-bold">Verified in memory</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Widget 2: Multi-Node Consensus / Cluster Intuition                  */
/* -------------------------------------------------------------------------- */
function ClusterIntuitionWidget() {
  const [selectedNode, setSelectedNode] = useState<number>(0);
  const nodes = [
    { role: "Leader", id: "Node A", state: "Active", isLeader: true },
    { role: "Follower", id: "Node B", state: "Synced", isLeader: false },
    { role: "Follower", id: "Node C", state: "Synced", isLeader: false },
  ];

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <Network className="w-3.5 h-3.5 text-[#099BE9]" />
          <span>Distributed Consensus</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#099BE9]/15 text-[#099BE9] font-bold">
          Quorum 3/3
        </span>
      </div>

      {/* Cluster Node Visual */}
      <div className="py-3 grid grid-cols-3 gap-2">
        {nodes.map((n, idx) => {
          const isSelected = selectedNode === idx;
          return (
            <div
              key={n.id}
              onClick={() => setSelectedNode(idx)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                isSelected
                  ? "bg-[#099BE9]/10 border-[#099BE9]/40 shadow-xs"
                  : "bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/70"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                  n.isLeader
                    ? "bg-[#099BE9] text-white shadow-xs"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {idx + 1}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">{n.id}</p>
                <p
                  className={`text-[10px] font-mono font-semibold ${
                    n.isLeader ? "text-[#099BE9]" : "text-slate-500"
                  }`}
                >
                  {n.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Log Replication</span>
        <span className="text-[#099BE9] font-bold">Zero Data Loss</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Widget 3: Bare-Metal Performance Gauge                              */
/* -------------------------------------------------------------------------- */
function BenchmarkIntuitionWidget() {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <Activity className="w-3.5 h-3.5 text-[#8647E2]" />
          <span>Physical Limits</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8647E2]/15 text-[#8647E2] font-bold">
          Bare-Metal
        </span>
      </div>

      {/* Speed Dial / Progress Display */}
      <div className="py-3 flex flex-col items-center justify-center text-center space-y-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#F1F5F9"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#09C899"
              strokeWidth="6"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset="45"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-slate-950 font-mono">
              156K
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
              ops/sec
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">p99 Latency</span>
            <span className="font-bold text-[#0AA793]">0.18 ms</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">Test Suite</span>
            <span className="font-bold text-slate-900">100% Pass</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Throughput Rank</span>
        <span className="text-[#8647E2] font-bold">Top 2% Globally</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Section: Clean Brilliant.org-Style Learning Cards                     */
/* Uses ALGO's 4 Brand Colors:                                                */
/* Blue (#099BE9), Green (#09C899), Purple (#8647E2), Orange (#FBAE0C)        */
/* -------------------------------------------------------------------------- */
export function HomeHowItWorks() {
  const cards = [
    {
      num: "01",
      badge: "VISUAL INTUITION",
      color: "#09C899", // ALGO Green
      badgeStyle: "text-[#0AA793] bg-[#09C899]/10 border-[#09C899]/30",
      title: "Concepts that click",
      description:
        "Instead of memorizing synthetic algorithms, build storage engines, write-ahead logs, and buffer pools until the underlying physical mechanics click.",
      widget: <StorageIntuitionWidget />,
    },
    {
      num: "02",
      badge: "STEP-BY-STEP EVOLUTION",
      color: "#099BE9", // ALGO Blue
      badgeStyle: "text-[#099BE9] bg-[#099BE9]/10 border-[#099BE9]/30",
      title: "Guided progression",
      description:
        "Start with simple stdin/stdout commands and level up to distributed consensus, network partitions, and fault recovery across 6 progressive tiers.",
      widget: <ClusterIntuitionWidget />,
    },
    {
      num: "03",
      badge: "PHYSICAL MEASUREMENT",
      color: "#8647E2", // ALGO Purple
      badgeStyle: "text-[#8647E2] bg-[#8647E2]/10 border-[#8647E2]/30",
      title: "Real physical limits",
      description:
        "No multiple-choice questions or artificial constraints. Stress test against physical CPU limits, memory quotas, and sudden crashes on bare metal.",
      widget: <BenchmarkIntuitionWidget />,
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
              className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              {/* Top: Number & Eyebrow Badge with brand color */}
              <div className="flex items-center justify-between">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs text-white shadow-2xs"
                  style={{ backgroundColor: card.color }}
                >
                  {card.num}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${card.badgeStyle}`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Center: Visual Intuition Widget */}
              <div className="pt-1">{card.widget}</div>

              {/* Bottom: Title & Friendly Description */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-950 tracking-tight">
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
