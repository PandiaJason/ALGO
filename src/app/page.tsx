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
  CheckCircle2,
  Database,
  Search,
  Code2,
  Trophy,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  const sampleProblems = [
    {
      id: "1",
      title: "Build a Key-Value Store",
      slug: "kv-store",
      category: "In-Memory Databases",
      difficulty: "Medium",
      difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
      throughput: "101,170 ops/sec",
      languages: "Python, C++",
      status: "Available",
    },
    {
      id: "2",
      title: "Append-Only Write-Ahead Log (WAL)",
      slug: "kv-store",
      category: "Storage Engines",
      difficulty: "Medium",
      difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
      throughput: "85,000 ops/sec",
      languages: "Python, C++",
      status: "Available",
    },
    {
      id: "3",
      title: "Lock-Free Ring Buffer Queue",
      slug: "kv-store",
      category: "Concurrency & Locks",
      difficulty: "Hard",
      difficultyColor: "text-rose-600 bg-rose-50 border-rose-200",
      throughput: "250,000 ops/sec",
      languages: "C++20",
      status: "Upcoming",
    },
    {
      id: "4",
      title: "Raft Distributed Consensus Engine",
      slug: "kv-store",
      category: "Distributed Systems",
      difficulty: "Hard",
      difficultyColor: "text-rose-600 bg-rose-50 border-rose-200",
      throughput: "50,000 ops/sec",
      languages: "Python, C++",
      status: "Upcoming",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] text-slate-900 selection:bg-slate-100">
      <Navbar user={session?.user as any} />

      <main className="flex-1">
        {/* Minimal LeetCode Hero */}
        <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-[#fafafa]/50">
          <div className="max-w-4xl mx-auto text-center">
            {/* Minimal Pill */}
            <Link
              href="/challenges/kv-store/workspace"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-700 font-mono mb-6 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Module 01 Live: Build a Key-Value Engine</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </Link>

            {/* Clean Authoritative Title: GO CURIOUS. */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
              GO CURIOUS.
            </h1>

            {/* Minimal Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              A new way to build, benchmark, and master real systems. Reconstruct production engines from first principles and optimize against empirical hardware workloads.
            </p>

            {/* Clean Minimal Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/challenges/kv-store/workspace">
                <Button size="lg" className="h-10 px-5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md shadow-xs gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Start Module 01</span>
                </Button>
              </Link>
              <Link href="/challenges">
                <Button size="lg" variant="outline" className="h-10 px-5 text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-md">
                  Explore Problems
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button size="lg" variant="ghost" className="h-10 px-4 text-xs font-medium text-slate-600 hover:text-slate-900">
                  Leaderboard
                </Button>
              </Link>
            </div>

            {/* Interactive LeetCode-style Workbench Console */}
            <HeroWorkbench />
          </div>
        </section>

        {/* LeetCode Problem Set Preview */}
        <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Problem Set
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Systems engineering challenges evaluated in containerized sandboxes.
              </p>
            </div>

            <Link
              href="/challenges"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all problems</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Minimalist LeetCode Table */}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#f8fafc] text-slate-600 font-mono">
                  <th className="py-2.5 px-4 w-12 text-center font-medium">#</th>
                  <th className="py-2.5 px-4 font-medium">Title</th>
                  <th className="py-2.5 px-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="py-2.5 px-4 font-medium">Throughput Target</th>
                  <th className="py-2.5 px-4 font-medium">Difficulty</th>
                  <th className="py-2.5 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleProblems.map((prob) => (
                  <tr
                    key={prob.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-xs">
                      {prob.id}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/challenges/${prob.slug}`}
                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                      >
                        <span>{prob.title}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-500 hidden sm:table-cell text-xs">
                      {prob.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-xs">
                      {prob.throughput}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border font-mono ${prob.difficultyColor}`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {prob.status === "Available" ? (
                        <Link href={`/challenges/${prob.slug}/workspace`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 border-slate-200 hover:bg-slate-100">
                            Solve
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Soon
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Minimal Three Pillars Section */}
        <section className="py-14 border-t border-slate-100 bg-[#fafafa]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Build */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white space-y-2">
                <div className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
                  01 • BUILD
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  First-Principles Engineering
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reconstruct in-memory engines, append-only logs, and thread pools without relying on toy abstractions.
                </p>
              </div>

              {/* Optimize */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white space-y-2">
                <div className="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">
                  02 • OPTIMIZE
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Hardware-Level Metrics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Measure raw ops/sec throughput, p99 tail latency, and RSS heap footprint in isolated Linux containers.
                </p>
              </div>

              {/* Compete */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white space-y-2">
                <div className="text-xs font-mono font-semibold text-purple-600 uppercase tracking-wider">
                  03 • COMPETE
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Verifiable Proof-of-Work
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero fake rankings. Every leaderboard entry is backed by container execution logs and deterministic workloads.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
