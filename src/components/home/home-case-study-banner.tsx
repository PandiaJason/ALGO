"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export function HomeCaseStudyBanner() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="rounded-3xl bg-slate-950 border-2 border-[#09C899]/30 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-mono font-bold text-[#09C899] uppercase tracking-wider">
              DEEP RESEARCH &amp; ANALYSIS
            </span>
            <span className="text-xs font-mono text-slate-400">• 20-System Curriculum</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Case Study: Systems Engineering in the Agentic Era
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
            Explore the 10 invariant dimensions of systems thinking, the 6-stage engineering progression, the 20-system curriculum, and full empirical data from SWE-bench and developer reports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md shadow-[#09C899]/25 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Read Full Case Study</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all active:scale-95"
          >
            <span>Explore Challenges</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
