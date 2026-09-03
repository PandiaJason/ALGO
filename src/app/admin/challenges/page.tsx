import React from "react";
import Link from "next/link";
import { db } from "@/db";
import { challenges, challengeVersions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, EyeOff, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminChallengesPage() {
  const allChallenges = await db
    .select()
    .from(challenges)
    .orderBy(desc(challenges.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Challenge Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, version, configure benchmarks, and publish engineering challenges.
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {allChallenges.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                  {c.title}
                </td>
                <td className="py-3 px-4 text-slate-500">{c.slug}</td>
                <td className="py-3 px-4">
                  <Badge variant="blue" className="text-[10px]">
                    {c.difficulty}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-700">
                  v{c.currentVersionNumber}.0
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      c.status === "PUBLISHED"
                        ? "success"
                        : c.status === "DRAFT"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {c.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right font-sans">
                  <Link
                    href={`/challenges/${c.slug}`}
                    className="text-xs text-[#2d7cf6] hover:underline font-medium"
                  >
                    View Live
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
