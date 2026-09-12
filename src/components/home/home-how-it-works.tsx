"use client";

import React from "react";

/* -------------------------------------------------------------------------- */
/* FIG 0.1: Isometric Stacked Multi-Layer Slabs with Circular Core            */
/* -------------------------------------------------------------------------- */
function LinearFig1() {
  return (
    <div className="w-full h-48 sm:h-52 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full max-w-[240px] text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top Slab Rhombus */}
        <path d="M 140 28 L 220 70 L 140 112 L 60 70 Z" />

        {/* Circular Recess / Hole on Top Face (Isometric Ellipse) */}
        <ellipse cx="140" cy="70" rx="38" ry="19" strokeOpacity="0.9" />
        <ellipse cx="140" cy="74" rx="38" ry="19" strokeOpacity="0.35" strokeDasharray="3 3" />
        <line x1="102" y1="70" x2="102" y2="74" strokeOpacity="0.5" />
        <line x1="178" y1="70" x2="178" y2="74" strokeOpacity="0.5" />

        {/* Outer Vertical Corner Edges */}
        <line x1="60" y1="70" x2="60" y2="145" />
        <line x1="140" y1="112" x2="140" y2="187" />
        <line x1="220" y1="70" x2="220" y2="145" />

        {/* Bottom Rhombus Edges */}
        <path d="M 60 145 L 140 187 L 220 145" />

        {/* Horizontal Layer Lines Across Left and Right Faces */}
        {/* Layer 1 */}
        <path d="M 60 85 L 140 127 L 220 85" strokeOpacity="0.45" />
        {/* Layer 2 */}
        <path d="M 60 100 L 140 142 L 220 100" strokeOpacity="0.45" />
        {/* Layer 3 */}
        <path d="M 60 115 L 140 157 L 220 115" strokeOpacity="0.45" />
        {/* Layer 4 */}
        <path d="M 60 130 L 140 172 L 220 130" strokeOpacity="0.45" />

        {/* Subtle Horizontal Depth Slits inside top aperture */}
        <line x1="115" y1="65" x2="165" y2="65" strokeOpacity="0.3" />
        <line x1="110" y1="70" x2="170" y2="70" strokeOpacity="0.3" />
        <line x1="115" y1="75" x2="165" y2="75" strokeOpacity="0.3" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FIG 0.2: Isometric Cluster of 4 Modular Cubes / Pedestals                  */
/* -------------------------------------------------------------------------- */
function LinearFig2() {
  return (
    <div className="w-full h-48 sm:h-52 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full max-w-[240px] text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* CUBE 1 (Back - Tallest) */}
        <g>
          {/* Top Face */}
          <path d="M 145 22 L 182 41 L 145 60 L 108 41 Z" />
          {/* Subtle '+' on top face */}
          <line x1="145" y1="38" x2="145" y2="44" strokeOpacity="0.6" />
          <line x1="142" y1="41" x2="148" y2="41" strokeOpacity="0.6" />
          {/* Vertical Edges */}
          <line x1="108" y1="41" x2="108" y2="85" />
          <line x1="182" y1="41" x2="182" y2="95" />
          {/* Front Edge */}
          <line x1="145" y1="60" x2="145" y2="105" />
        </g>

        {/* CUBE 2 (Left - Medium) */}
        <g>
          {/* Top Face */}
          <path d="M 88 58 L 125 77 L 88 96 L 51 77 Z" />
          {/* Subtle '+' on top face */}
          <line x1="88" y1="74" x2="88" y2="80" strokeOpacity="0.6" />
          <line x1="85" y1="77" x2="91" y2="77" strokeOpacity="0.6" />
          {/* Vertical Edges */}
          <line x1="51" y1="77" x2="51" y2="135" />
          <line x1="88" y1="96" x2="88" y2="154" />
          <line x1="125" y1="77" x2="125" y2="115" />
          {/* Bottom visible contour */}
          <path d="M 51 135 L 88 154" />
        </g>

        {/* CUBE 3 (Right - Medium-Low) */}
        <g>
          {/* Top Face */}
          <path d="M 195 68 L 232 87 L 195 106 L 158 87 Z" />
          {/* Subtle '+' on top face */}
          <line x1="195" y1="84" x2="195" y2="90" strokeOpacity="0.6" />
          <line x1="192" y1="87" x2="198" y2="87" strokeOpacity="0.6" />
          {/* Vertical Edges */}
          <line x1="158" y1="87" x2="158" y2="120" />
          <line x1="195" y1="106" x2="195" y2="155" />
          <line x1="232" y1="87" x2="232" y2="136" />
          {/* Bottom visible contour */}
          <path d="M 195 155 L 232 136" />
        </g>

        {/* CUBE 4 (Front - Compact Foreground) */}
        <g>
          {/* Top Face */}
          <path d="M 140 102 L 177 121 L 140 140 L 103 121 Z" />
          {/* Subtle '+' on top face */}
          <line x1="140" y1="118" x2="140" y2="124" strokeOpacity="0.6" />
          <line x1="137" y1="121" x2="143" y2="121" strokeOpacity="0.6" />
          {/* Vertical Edges */}
          <line x1="103" y1="121" x2="103" y2="158" />
          <line x1="140" y1="140" x2="140" y2="177" />
          <line x1="177" y1="121" x2="177" y2="158" />
          {/* Bottom Contour */}
          <path d="M 103 158 L 140 177 L 177 158" />
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FIG 0.3: Isometric Ascending Stepped Planar Fins / Staircase               */
/* -------------------------------------------------------------------------- */
function LinearFig3() {
  // 9 ascending vertical planes stepping from low (front-left) to tall (back-right)
  const fins = [
    { x: 50,  yBase: 145, h: 18,  w: 12 },
    { x: 68,  yBase: 136, h: 28,  w: 12 },
    { x: 86,  yBase: 127, h: 40,  w: 12 },
    { x: 104, yBase: 118, h: 54,  w: 12 },
    { x: 122, yBase: 109, h: 70,  w: 12 },
    { x: 140, yBase: 100, h: 88,  w: 12 },
    { x: 158, yBase: 91,  h: 108, w: 12 },
    { x: 176, yBase: 82,  h: 130, w: 12 },
    { x: 194, yBase: 73,  h: 154, w: 12 },
  ];

  return (
    <div className="w-full h-48 sm:h-52 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 280 200"
        className="w-full h-full max-w-[240px] text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {fins.map((fin, i) => {
          const depthX = 40;
          const depthY = -20;
          const x0 = fin.x;
          const y0 = fin.yBase;
          const yTop = y0 - fin.h;

          return (
            <g key={i}>
              {/* Front edge */}
              <line x1={x0} y1={y0} x2={x0} y2={yTop} strokeOpacity={0.8} />
              {/* Top inclined edge */}
              <line x1={x0} y1={yTop} x2={x0 + depthX} y2={yTop + depthY} strokeOpacity={0.9} />
              {/* Back vertical edge */}
              <line x1={x0 + depthX} y1={yTop + depthY} x2={x0 + depthX} y2={y0 + depthY} strokeOpacity={0.5} />
              {/* Bottom depth edge */}
              <line x1={x0} y1={y0} x2={x0 + depthX} y2={y0 + depthY} strokeOpacity={0.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Section: Linear.app-Inspired Minimal 3-Figure Grid                   */
/* -------------------------------------------------------------------------- */
export function HomeHowItWorks() {
  const items = [
    {
      fig: "FIG 0.1",
      title: "Purpose-built",
      description:
        "Built around first-principles systems engineering. Master storage, protocols, and concurrency from scratch.",
      diagram: <LinearFig1 />,
    },
    {
      fig: "FIG 0.2",
      title: "Powered by agents",
      description:
        "Designed for workflows shared by humans and agents. Execute inside isolated Linux container cgroups.",
      diagram: <LinearFig2 />,
    },
    {
      fig: "FIG 0.3",
      title: "Designed for speed",
      description:
        "Stress test against physical limits and verify real bare-metal throughput and latency on the leaderboard.",
      diagram: <LinearFig3 />,
    },
  ];

  return (
    <section className="w-full bg-[#080808] text-white py-20 sm:py-24 border-t border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3 Columns Divided with Clean Subtle Borders (Exact Linear Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-800/90">
          {items.map((item) => (
            <div
              key={item.fig}
              className="px-6 sm:px-8 py-8 md:py-4 flex flex-col justify-between space-y-6 first:pl-0 last:pr-0"
            >
              {/* Figure Identifier */}
              <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                {item.fig}
              </div>

              {/* Central Isometric Wireframe Vector Art */}
              <div className="py-2 flex items-center justify-center">
                {item.diagram}
              </div>

              {/* Typography: Bold Title + Minimal 1-Sentence Description */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
