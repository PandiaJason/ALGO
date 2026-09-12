import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SystemsRoadmap } from "@/components/roadmap/systems-roadmap";
import { Sparkles, Terminal, Route, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Systems Engineering Roadmap | ALGO",
  description:
    "A progressive first-principles roadmap from beginner-friendly single-process systems to intermediate storage engines and advanced distributed consensus.",
};

export default async function RoadmapPage() {
  const session = await auth();
  const userSolvedSlugs: string[] = [];

  try {
    if (session?.user?.id) {
      const userSubs = await db
        .select({ slug: challenges.slug })
        .from(submissions)
        .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
        .where(
          and(
            eq(submissions.userId, session.user.id),
            eq(submissions.status, "COMPLETED")
          )
        );
      userSubs.forEach((s) => {
        if (s.slug && !userSolvedSlugs.includes(s.slug)) {
          userSolvedSlugs.push(s.slug);
        }
      });
    }
  } catch (err) {
    console.warn("Error fetching user submissions on roadmap page:", err);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} variant="dark" />

      {/* Hero Header */}
      <section className="relative bg-[#262626] pt-12 pb-20 overflow-hidden text-white border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-400 border border-white/10 backdrop-blur-md">
            <Route className="w-3.5 h-3.5 text-[#09C899]" />
            Inspired by roadmap.sh
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Systems Engineering Roadmap
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed">
            Deconstruct 20 production systems layer-by-layer. Move from beginner-friendly
            Unix shells and HTTP parsers to B-Tree storage engines, Raft consensus, and LLM KV caches.
          </p>
        </div>
      </section>

      {/* Interactive Roadmap Body */}
      <main className="flex-1 pb-24">
        <SystemsRoadmap userSolvedSlugs={userSolvedSlugs} />
      </main>

      <Footer />
    </div>
  );
}
