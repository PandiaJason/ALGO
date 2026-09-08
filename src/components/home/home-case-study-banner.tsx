"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export function HomeCaseStudyBanner() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="rounded-3xl bg-[#1c1c20] border border-neutral-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-mono font-bold text-[#09C899] uppercase tracking-wider">
              FULL RESEARCH BRIEF
            </span>
            <span className="text-xs font-mono text-neutral-400">• 9 Primary Citations</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Read the Complete Case Study &amp; Architectural Thesis
          </h3>
          <p className="text-xs text-neutral-300 font-normal max-w-xl">
            Explore the complete research paper with primary data from HackerRank, Stack Overflow, Karat, and real systems benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-[#099BE9]" />
            <span>Read Case Study</span>
          </Link>
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md transition-all active:scale-95"
          >
            <span>Explore Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
