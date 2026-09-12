import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, challenges } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SystemsRoadmap } from "@/components/roadmap/systems-roadmap";
import { Route } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Systems Engineering Roadmap | ALGO",
  description:
    "A progressive visual roadmap from single-process Unix primitives to high-throughput storage engines, Raft consensus, and LLM KV caches.",
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

      {/* Hero Section matching ALGO styling */}
      <section className="relative bg-[#262626] pt-10 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            SYSTEMS ENGINEERING CURRICULUM
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Route className="w-6 h-6 text-[#09C899]" />
            <span>Systems Engineering Roadmap</span>
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1.5 max-w-2xl">
            A structured visual path from single-process Unix primitives to high-throughput storage engines, Raft consensus, and LLM KV caches.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-10 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        />
      </section>

      {/* Roadmap Body */}
      <main className="flex-1">
        <SystemsRoadmap userSolvedSlugs={userSolvedSlugs} />
      </main>

      <Footer />
    </div>
  );
}
