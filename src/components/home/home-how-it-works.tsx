"use client";

import React, { useState, useEffect } from "react";
import { Database, Network, Activity, Zap, Sparkles, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Visual Widget 1: Key-Value / Storage Intuition with Cute Scanning Loop     */
/* -------------------------------------------------------------------------- */
function StorageIntuitionWidget() {
  const [activeSlot, setActiveSlot] = useState(1);

  // Cute automatic cycling through slots every 2.4s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlot((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const slots = [
    { key: "session:402", val: "token_abc", status: "HIT", latency: "0.02ms" },
    { key: "user:109", val: "profile_data", status: "HIT", latency: "0.01ms" },
    { key: "cache:rate", val: "limit_60/m", status: "HIT", latency: "0.03ms" },
  ];

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden group/widget">
      {/* Playful Floating Sparkle Particle */}
      <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#09C899]/10 rounded-full blur-xl pointer-events-none animate-pulse" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#09C899]/10 text-[#0AA793] inline-flex items-center justify-center animate-bounce">
            <Database className="w-3.5 h-3.5" />
          </span>
          <span>In-Memory Storage Slot</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#09C899]/15 text-[#0AA793] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-ping" />
          <span>O(1) Direct Lookup</span>
        </span>
      </div>

      <div className="py-3 space-y-2 relative z-10">
        {slots.map((slot, idx) => {
          const isSelected = activeSlot === idx;
          return (
            <div
              key={slot.key}
              onClick={() => setActiveSlot(idx)}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all duration-300 cursor-pointer flex items-center justify-between relative overflow-hidden ${
                isSelected
                  ? "bg-[#09C899]/10 border-[#09C899]/50 shadow-xs scale-[1.02] -translate-y-0.5"
                  : "bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/70 text-slate-600 scale-100"
              }`}
            >
              {/* Cute sliding pointer indicator */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#09C899] rounded-r animate-pulse" />
              )}

              <div className="flex items-center gap-2 pl-1">
                <div className="relative flex items-center justify-center">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isSelected ? "bg-[#09C899]" : "bg-slate-300"
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute w-4 h-4 rounded-full bg-[#09C899]/40 animate-ping" />
                  )}
                </div>
                <span className={`font-semibold transition-colors ${isSelected ? "text-slate-950 font-bold" : "text-slate-700"}`}>
                  {slot.key}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-normal transition-colors ${isSelected ? "text-[#0AA793] font-semibold" : "text-slate-500"}`}>
                  {slot.latency}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-all duration-300 ${
                    isSelected
                      ? "bg-[#09C899] text-white shadow-2xs scale-105"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  <span>{slot.status}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono relative z-10">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FBAE0C] animate-spin" style={{ animationDuration: "6s" }} />
          <span>Resolved in memory</span>
        </span>
        <span className="text-[#0AA793] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09C899]" />
          <span>Zero hash collision</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Widget 2: Multi-Node Consensus with Cute Animated Heartbeat Packets */
/* -------------------------------------------------------------------------- */
function ClusterIntuitionWidget() {
  const [pulseKey, setPulseKey] = useState(0);

  // Cute heartbeat pulse every 2s
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseKey((k) => k + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nodes = [
    { role: "Leader", id: "Node A", isLeader: true, emoji: "👑", state: "Active" },
    { role: "Follower", id: "Node B", isLeader: false, emoji: "⚡", state: "Synced" },
    { role: "Follower", id: "Node C", isLeader: false, emoji: "⚡", state: "Synced" },
  ];

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-1 -left-1 w-12 h-12 bg-[#099BE9]/10 rounded-full blur-xl pointer-events-none animate-pulse" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#099BE9]/10 text-[#099BE9] inline-flex items-center justify-center animate-pulse">
            <Network className="w-3.5 h-3.5" />
          </span>
          <span>Distributed Consensus</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#099BE9]/15 text-[#099BE9] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9] animate-ping" />
          <span>Quorum 3/3</span>
        </span>
      </div>

      {/* Interactive Cluster Nodes with Cute Connecting Pulse Lines */}
      <div className="py-3 relative">
        {/* Animated Connecting SVG Data Waves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="msg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#099BE9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#09C899" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Path from Node A (left) to Node B (center) */}
          <line
            x1="22%"
            y1="42%"
            x2="48%"
            y2="42%"
            stroke="#099BE9"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeOpacity="0.4"
          />
          {/* Path from Node B (center) to Node C (right) */}
          <line
            x1="52%"
            y1="42%"
            x2="78%"
            y2="42%"
            stroke="#099BE9"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeOpacity="0.4"
          />
          {/* Cute Traveling Heartbeat Packets */}
          <circle r="3" fill="#099BE9" opacity="0.9">
            <animate
              key={`p1-${pulseKey}`}
              attributeName="cx"
              from="22%"
              to="50%"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="42%;38%;42%"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="3" fill="#09C899" opacity="0.9">
            <animate
              key={`p2-${pulseKey}`}
              attributeName="cx"
              from="50%"
              to="78%"
              dur="1.2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="42%;46%;42%"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* 3 Cute Node Cards */}
        <div className="grid grid-cols-3 gap-2 relative z-10">
          {nodes.map((n, idx) => (
            <div
              key={n.id}
              className={`p-2.5 rounded-xl border text-center transition-all duration-300 flex flex-col items-center justify-between gap-1.5 ${
                n.isLeader
                  ? "bg-[#099BE9]/10 border-[#099BE9]/40 shadow-xs hover:scale-105"
                  : "bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/70 hover:scale-105"
              }`}
            >
              {/* Cute Node Mascot Avatar */}
              <div className="relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-transform ${
                    n.isLeader
                      ? "bg-[#099BE9] text-white shadow-xs animate-bounce"
                      : "bg-slate-200 text-slate-700"
                  }`}
                  style={{ animationDuration: n.isLeader ? "2s" : "0s" }}
                >
                  {n.isLeader ? "1" : idx + 1}
                </div>
                <span className="absolute -top-1 -right-1 text-[10px]">
                  {n.emoji}
                </span>
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
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9] animate-pulse" />
          <span>Heartbeat synced</span>
        </span>
        <span className="text-[#099BE9] font-bold flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Zero log divergence</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Widget 3: Bare-Metal Performance Gauge with Live Wagging Needle     */
/* -------------------------------------------------------------------------- */
function BenchmarkIntuitionWidget() {
  const [opsCount, setOpsCount] = useState(156240);

  // Cute fluctuating throughput counter
  useEffect(() => {
    const timer = setInterval(() => {
      setOpsCount((prev) => 156000 + Math.floor(Math.sin(Date.now() / 800) * 2400));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs select-none relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#8647E2]/10 rounded-full blur-xl pointer-events-none animate-pulse" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-700">
          <span className="p-1 rounded-md bg-[#8647E2]/10 text-[#8647E2] inline-flex items-center justify-center animate-pulse">
            <Activity className="w-3.5 h-3.5" />
          </span>
          <span>Physical Limits</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8647E2]/15 text-[#8647E2] font-bold">
          <Zap className="w-3 h-3 text-[#FBAE0C] fill-[#FBAE0C] animate-bounce" />
          <span>Bare-Metal</span>
        </span>
      </div>

      {/* Speed Dial / Progress Display with Live Cute Oscillation */}
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
            {/* Animated Gauge Arc */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#09C899"
              strokeWidth="6"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset="48"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Central Live Counter with cute bounce */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-slate-950 font-mono tracking-tight transition-all">
              {Math.round(opsCount / 1000)}K
            </span>
            <span className="text-[10px] font-mono text-[#0AA793] font-bold uppercase flex items-center gap-0.5">
              <span>ops/sec</span>
              <span className="inline-block animate-pulse">⚡</span>
            </span>
          </div>
        </div>

        {/* Latency & Test Pass Bar with Animated ECG Wave */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">p99 Latency</span>
            <span className="font-bold text-[#0AA793]">0.18 ms</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">Test Suite</span>
            <span className="font-bold text-slate-900 inline-flex items-center gap-1">
              <Check className="w-3 h-3 text-[#09C899] stroke-[3]" />
              <span>100% Pass</span>
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8647E2] animate-ping" />
          <span>Global Leaderboard</span>
        </span>
        <span className="text-[#8647E2] font-bold flex items-center gap-0.5">
          <span>Top 2%</span>
          <span className="text-[10px]">🏆</span>
        </span>
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

              {/* Center: Visual Intuition Widget with cute animations */}
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
