import React from "react";
import { db } from "@/db";
import { benchmarkConfigs, challengeVersions, challenges } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cpu, Zap, Clock, HardDrive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBenchmarksPage() {
  const configs = await db
    .select({
      id: benchmarkConfigs.id,
      version: benchmarkConfigs.version,
      iterations: benchmarkConfigs.iterations,
      warmupIterations: benchmarkConfigs.warmupIterations,
      timeoutSeconds: benchmarkConfigs.timeoutSeconds,
      cpuLimit: benchmarkConfigs.cpuLimit,
      memoryLimitMb: benchmarkConfigs.memoryLimitMb,
      isActive: benchmarkConfigs.isActive,
      workloads: benchmarkConfigs.workloads,
      baselineMetrics: benchmarkConfigs.baselineMetrics,
      challengeTitle: challenges.title,
    })
    .from(benchmarkConfigs)
    .innerJoin(
      challengeVersions,
      eq(benchmarkConfigs.challengeVersionId, challengeVersions.id)
    )
    .innerJoin(challenges, eq(challengeVersions.challengeId, challenges.id))
    .orderBy(desc(benchmarkConfigs.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Benchmark Infrastructure
        </h1>
        <p className="text-xs text-slate-500">
          Controlled workload definitions, container resource quotas, and official baseline calibrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configs.map((c) => (
          <Card key={c.id} className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <Badge variant="blue" className="text-[10px] font-mono">
                  BENCHMARK CONFIG v{c.version}.0
                </Badge>
                <Badge variant={c.isActive ? "success" : "secondary"}>
                  {c.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 mt-2">
                {c.challengeTitle}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                  <div className="text-[10px] text-slate-400">CPU QUOTA</div>
                  <div className="text-slate-900 font-bold">{c.cpuLimit} Core</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                  <div className="text-[10px] text-slate-400">MEMORY QUOTA</div>
                  <div className="text-slate-900 font-bold">{c.memoryLimitMb} MB</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                  <div className="text-[10px] text-slate-400">ITERATIONS</div>
                  <div className="text-slate-900 font-bold">
                    {c.iterations} ({c.warmupIterations} warmup)
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                  <div className="text-[10px] text-slate-400">TIMEOUT</div>
                  <div className="text-slate-900 font-bold">{c.timeoutSeconds}s</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-slate-500 mb-1.5 uppercase">
                  Configured Workloads
                </div>
                <pre className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-700 overflow-x-auto">
                  {JSON.stringify(c.workloads, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
