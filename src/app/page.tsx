import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroWorkbench } from "@/components/home/hero-workbench";
import {
  ArrowRight,
  Terminal,
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Layers,
  Activity,
  Award,
  Sparkles,
  Database,
  Lock,
  GitBranch,
  Gauge
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  const provingGroundLoop = [
    {
      step: "01",
      title: "DISCOVER",
      desc: "Deconstruct real-world architectures (Redis, SQLite, Raft, Kafka).",
      icon: Database,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      step: "02",
      title: "BUILD",
      desc: "Reconstruct core primitives from first principles in Python or C++.",
      icon: Code2,
      color: "text-teal-600",
      bg: "bg-teal-50 border-teal-100",
    },
    {
      step: "03",
      title: "RUN",
      desc: "Execute in isolated Linux containers with strict cgroup quotas.",
      icon: Terminal,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
    },
    {
      step: "04",
      title: "MEASURE",
      desc: "Capture empirical hardware metrics: ops/sec, p99 latency, and heap RSS.",
      icon: Gauge,
      color: "text-violet-600",
      bg: "bg-violet-50 border-violet-100",
    },
    {
      step: "05",
      title: "BREAK",
      desc: "Fuzz with adversarial concurrency races, TTL edge-cases, and crash recovery.",
      icon: Lock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
    {
      step: "06",
      title: "OPTIMIZE",
      desc: "Eliminate allocations, tune memory layout, and vectorize hot loops.",
      icon: Zap,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      step: "07",
      title: "COMPETE",
      desc: "Climb the verified global leaderboard based on empirical performance.",
      icon: Award,
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-100",
    },
    {
      step: "08",
      title: "EXPLAIN",
      desc: "Publish architectural briefs and prove your engineering decisions.",
      icon: GitBranch,
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-100",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar user={session?.user as any} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Subtle Technical Engineering Dot Grid & Radial Fade */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

          {/* Ambient Brand Luminescence in ALGO Brand Colors */}
          <div className="absolute top-[-6rem] left-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[-4rem] right-1/4 -z-10 h-[30rem] w-[30rem] rounded-full bg-gradient-to-bl from-teal-400/10 to-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[28rem] right-1/3 -z-10 h-[26rem] w-[26rem] rounded-full bg-purple-400/08 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Top Live Badge */}
            <Link
              href="/challenges/kv-store/workspace"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-gradient-to-r from-blue-50/90 via-teal-50/50 to-indigo-50/90 hover:border-blue-300 transition-all mb-8 shadow-xs group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-800 uppercase">
                MODULE 01 LIVE: IN-MEMORY KEY-VALUE ENGINE
              </span>
              <span className="text-xs font-mono text-blue-600 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              <span>GO CURIOUS.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 mt-1">
                BUILD. OPTIMIZE. INNOVATE.
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-lg sm:text-xl font-normal text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              The engineering proving ground for the AI era. Learn real systems by reconstructing them from first principles, measuring performance under true 100K+ ops/sec workloads, and proving your engineering capability.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link href="/challenges/kv-store/workspace">
                <Button size="lg" variant="primary" className="gap-2 px-6 h-12 text-sm font-semibold shadow-md shadow-blue-500/10">
                  <Terminal className="w-4 h-4" />
                  <span>START MODULE 01: KV ENGINE</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/challenges">
                <Button size="lg" variant="secondary" className="px-6 h-12 text-sm font-medium">
                  EXPLORE ALL CHALLENGES
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button size="lg" variant="outline" className="px-5 h-12 text-sm font-medium border-slate-200">
                  GLOBAL LEADERBOARD
                </Button>
              </Link>
            </div>

            {/* Proof of Work Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono text-slate-500 pb-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deterministic Linux Sandboxes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>True Hardware Latency & Heap Profiling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Synthetic Data or Fake Rankings</span>
              </div>
            </div>

            {/* Interactive Workbench / Live Engine Showcase */}
            <HeroWorkbench />
          </div>
        </section>

        {/* The 8-Stage ALGO Engine Loop */}
        <section className="py-20 border-t border-slate-200/80 bg-slate-50/60 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-mono font-medium mb-3 shadow-2xs">
                <span>SYSTEMS ENGINEERING LIFECYCLE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                The ALGO Proving Ground Loop
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Writing code is just step two. Real systems engineering requires measuring under stress, finding bottlenecks, and hardening against failures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {provingGroundLoop.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="p-5 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-lg ${item.bg} border flex items-center justify-center ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                        STEP {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Module 01 Spotlight */}
        <section className="py-20 border-t border-slate-200/80 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-white to-blue-50/30 p-8 sm:p-12 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>FLAGSHIP EXPERIMENT • MODULE 01</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Build a Key-Value Engine
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Redis powers millions of critical systems worldwide. In this challenge, you reconstruct an in-memory data engine from first principles. Handle core commands, implement active/passive TTL expiration, write-ahead logging (WAL), crash recovery, and optimize against 100K ops/sec benchmarks.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-mono font-semibold text-blue-600 uppercase">
                        LEVEL 01
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        Core Hash & TTL
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        O(1) lookups, passive & active eviction
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-mono font-semibold text-teal-600 uppercase">
                        LEVEL 02
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        Durable WAL Log
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Append-only log, crash recovery, snapshots
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-mono font-semibold text-purple-600 uppercase">
                        LEVEL 03
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        Concurrency
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Lock striping, atomic counters, zero-copy
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link href="/challenges/kv-store/workspace">
                      <Button variant="primary" size="lg" className="text-xs font-semibold gap-2 h-11 px-5 shadow-xs">
                        <span>LAUNCH WORKSPACE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link href="/challenges/kv-store/leaderboard">
                      <Button variant="outline" size="lg" className="text-xs font-medium h-11 px-4 border-slate-200">
                        <span>VIEW MODULE LEADERBOARD</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-xs space-y-4">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Module 01 Specifications
                    </div>
                    <div className="divide-y divide-slate-100 text-xs font-mono">
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500">Missions Count</span>
                        <span className="font-semibold text-slate-900">10 Progressive Missions</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500">Supported Languages</span>
                        <span className="font-semibold text-slate-900">Python 3.12, C++20</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500">Baseline Throughput</span>
                        <span className="font-semibold text-slate-700">72,296 ops/sec</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500">High-Performance Target</span>
                        <span className="font-semibold text-emerald-600">&gt; 100,000 ops/sec</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500">Execution Sandbox</span>
                        <span className="font-semibold text-slate-700">Docker (cgroups, --read-only)</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500">Memory Quota</span>
                        <span className="font-semibold text-slate-700">256MB Hard Cap</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Three Pillars Section */}
        <section id="how-it-works" className="py-20 border-t border-slate-200/80 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Core Architectural Pillars
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Designed from the ground up for engineers who care about what happens underneath the abstractions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* BUILD */}
              <div className="p-8 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all space-y-4">
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
              <div className="p-8 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all space-y-4">
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
              <div className="p-8 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all space-y-4">
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

        {/* Comparison: ALGO vs Traditional Coding Platforms */}
        <section className="py-20 border-t border-slate-200/80 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Why ALGO is Different
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Traditional coding platforms test syntax memorization. ALGO proves your ability to engineer, measure, and optimize real systems.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                    <th className="py-3 px-4 sm:px-6 font-semibold">Evaluation Dimension</th>
                    <th className="py-3 px-4 sm:px-6 font-semibold text-slate-400">Traditional Interview Sites</th>
                    <th className="py-3 px-4 sm:px-6 font-semibold text-blue-700 bg-blue-50/50">ALGO Proving Ground</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800">What You Build</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500">20-line algorithmic snippets & puzzles</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium bg-blue-50/20">Full systems: In-memory engines, WALs, Schedulers</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800">Execution Quality</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500">Flaky "runtime: 45ms (beats 60%)"</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium bg-blue-50/20">Empirical ops/sec, p50/p99 latency, and heap size</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800">Sandbox Isolation</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500">Noisy multi-tenant shared VMs</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium bg-blue-50/20">Linux cgroups, non-root, read-only rootfs</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800">AI Relevance</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500">Solved in 2 seconds by generic LLMs</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium bg-blue-50/20">Demands profiling, cache locality, and systems tuning</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800">Ranking Credibility</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500">Synthetic points & vanity badges</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium bg-blue-50/20">Verifiable proof-of-work backed by execution logs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Verified Engineering Results & Bottom CTA Banner */}
        <section className="py-20 border-t border-slate-200/80 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>VERIFIED ENGINEERING PROOF-OF-WORK</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              No fake numbers. No vanity certificates.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every score on ALGO is computed by an independent containerized execution worker. Correctness comes strictly before performance — an incorrect implementation cannot rank above a correct one.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link href="/challenges/kv-store/workspace">
                <Button variant="primary" size="lg" className="text-xs font-semibold gap-2 h-11 px-6 shadow-xs">
                  <span>ENTER ARENA (MODULE 01)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="outline" size="lg" className="text-xs font-medium h-11 px-6 border-slate-200">
                  BROWSE ALL PROBLEMS
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
