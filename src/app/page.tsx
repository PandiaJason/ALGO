import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Terminal, Cpu, Zap, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200/80 bg-slate-50 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#2d7cf6]" />
              <span className="text-xs font-mono text-slate-600 font-medium tracking-wide">
                CAN YOU MAKE TECHNOLOGY BETTER?
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              GO CURIOUS.
            </h1>

            <p className="text-xl sm:text-2xl font-normal text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
              Build technology. Make it better. Invent what's next.
            </p>

            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-10">
              The engineering proving ground for the AI era. Learn real systems by reconstructing them from first principles, measuring performance under true workloads, and optimizing against real hardware benchmarks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/challenges">
                <Button size="lg" variant="primary" className="gap-2 px-6 h-11 text-sm font-semibold shadow-xs">
                  <span>EXPLORE CHALLENGES</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="secondary" className="px-6 h-11 text-sm font-medium">
                  HOW IT WORKS
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* The Three Pillars Section */}
        <section id="how-it-works" className="py-20 border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* BUILD */}
              <div className="p-8 rounded-xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2d7cf6]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-semibold tracking-wider text-[#2d7cf6] uppercase">
                  PILLAR 01
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  BUILD
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Reconstruct real technology from first principles. Build key-value stores, database engines, message queues, and runtimes without relying on toy frameworks.
                </p>
                <div className="pt-2 text-xs font-mono text-slate-400">
                  Data Structures • Concurrency • Durability
                </div>
              </div>

              {/* OPTIMIZE */}
              <div className="p-8 rounded-xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2dbfa8]">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-semibold tracking-wider text-[#2dbfa8] uppercase">
                  PILLAR 02
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  OPTIMIZE
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Measure what you build. ALGO executes your implementation in an isolated sandbox, subjecting it to 100K+ operations to compute real throughput, latency percentiles, and memory footprint.
                </p>
                <div className="pt-2 text-xs font-mono text-slate-400">
                  p99 Latency • Ops/Sec • Cache Efficiency
                </div>
              </div>

              {/* INNOVATE */}
              <div className="p-8 rounded-xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#8b5cf6]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-semibold tracking-wider text-[#8b5cf6] uppercase">
                  PILLAR 03
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  INNOVATE
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Invent what's next. Explore trade-offs across storage engines, thread topologies, and algorithmic designs. Compare your architecture directly against official baselines and peer systems.
                </p>
                <div className="pt-2 text-xs font-mono text-slate-400">
                  Novel Architectures • Trade-off Exploration
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Results Spotlight */}
        <section className="py-20 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>VERIFIED ENGINEERING RESULTS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              No fake numbers. No vanity certificates.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Every score on ALGO is computed by an independent containerized execution worker. Correctness comes strictly before performance — an incorrect implementation cannot rank above a correct one.
            </p>

            <div className="pt-4 flex justify-center">
              <Link href="/challenges/kv-store">
                <Button variant="default" size="lg" className="text-xs font-semibold gap-2">
                  <span>START WITH THE KEY-VALUE STORE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
