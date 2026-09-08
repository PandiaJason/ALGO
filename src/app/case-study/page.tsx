import React from "react";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExploreManifesto } from "@/components/explore/explore-manifesto";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Case Study — The Engineering Proving Ground | ALGO",
  description:
    "Software engineering changed. The way we measure it hasn't. An evidence-led case study of technical assessment in the agentic era, backed by empirical data from Stack Overflow, HackerRank, and real systems benchmarks.",
};

export default async function CaseStudyPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} variant="dark" />

      <section className="relative bg-[#262626] pt-10 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            // EVIDENCE BRIEF • 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Case Study: Systems Architecture & Thesis
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
            An evidence-led analysis of technical assessment in the agentic era.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <ExploreManifesto />
      </main>

      <Footer />
    </div>
  );
}

