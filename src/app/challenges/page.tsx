import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ArrowRight, Layers, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const session = await auth();
  const publishedChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.status, "PUBLISHED"));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3 mb-10">
          <div className="text-xs font-mono font-medium text-[#2d7cf6] tracking-wider uppercase">
            ENGINEERING CHALLENGES
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Reconstruct Real Systems
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Choose a challenge to build from first principles. Complete progressive engineering levels, run automated correctness suites, and benchmark performance against official baselines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="flex flex-col justify-between border-slate-200/90 hover:border-slate-300 transition-all hover:shadow-xs group"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#2d7cf6]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="blue" className="text-[11px] font-mono">
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-[11px] font-mono">
                      v{challenge.currentVersionNumber}.0
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-[#2d7cf6] transition-colors">
                  {challenge.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2">
                  {challenge.tagline || challenge.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Levels 1–3 Active
                  </span>
                  <span>•</span>
                  <span>Languages: Python, C++</span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link href={`/challenges/${challenge.slug}`} className="w-full">
                  <Button variant="default" size="sm" className="w-full text-xs font-semibold gap-2 justify-center">
                    <span>VIEW CHALLENGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
