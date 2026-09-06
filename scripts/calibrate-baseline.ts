/**
 * Empirical Baseline Calibration Script for ALGO Evaluator
 * Executes official baseline solutions in the Docker sandbox, measures true hardware
 * throughput and latency percentiles, and updates benchmarkConfigs in PostgreSQL.
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { db } from "../src/db";
import { benchmarkConfigs, challengeVersions, challenges } from "../src/db/schema";
import { eq, desc } from "drizzle-orm";
import { runQuickTest, runBenchmark } from "../src/lib/sandbox/runner";

async function calibrate() {
  console.log("=================================================");
  console.log("  ALGO Evaluator: Baseline Empirical Calibration");
  console.log("=================================================\n");

  const cppPath = path.join(
    process.cwd(),
    "src/challenges/kv-store/benchmark/baseline/cpp/solution.cpp"
  );
  const pythonPath = path.join(
    process.cwd(),
    "src/challenges/kv-store/benchmark/baseline/python/solution.py"
  );

  const cppCode = fs.readFileSync(cppPath, "utf-8");
  const pythonCode = fs.readFileSync(pythonPath, "utf-8");

  console.log("1. Verifying C++ Baseline Correctness...");
  const cppTest = await runQuickTest("cpp", cppCode, 1);
  console.log(`   C++ L1 Test: ${cppTest.passed}/${cppTest.total} passed.`);
  if (cppTest.passed !== cppTest.total) {
    throw new Error(`C++ Baseline failed correctness test: ${cppTest.details}`);
  }

  console.log("2. Verifying Python Baseline Correctness...");
  const pyTest = await runQuickTest("python", pythonCode, 1);
  console.log(`   Python L1 Test: ${pyTest.passed}/${pyTest.total} passed.`);
  if (pyTest.passed !== pyTest.total) {
    throw new Error(`Python Baseline failed correctness test: ${pyTest.details}`);
  }

  console.log("\n3. Benchmarking Python Baseline in Docker Sandbox (30,000 ops)...");
  const pyMetrics = await runBenchmark("python", pythonCode, 30000);
  console.log(`   Python Throughput: ${pyMetrics.throughputOpsSec.toLocaleString()} ops/sec`);
  console.log(`   Python p50 Latency: ${pyMetrics.latencyP50Ms} ms`);
  console.log(`   Python p99 Latency: ${pyMetrics.latencyP99Ms} ms`);
  console.log(`   Python CPU Time: ${pyMetrics.cpuTimeMs} ms`);

  console.log("\n4. Benchmarking C++ Baseline in Docker Sandbox (30,000 ops)...");
  const cppMetrics = await runBenchmark("cpp", cppCode, 30000);
  console.log(`   C++ Throughput: ${cppMetrics.throughputOpsSec.toLocaleString()} ops/sec`);
  console.log(`   C++ p50 Latency: ${cppMetrics.latencyP50Ms} ms`);
  console.log(`   C++ p99 Latency: ${cppMetrics.latencyP99Ms} ms`);
  console.log(`   C++ CPU Time: ${cppMetrics.cpuTimeMs} ms`);

  // Target baseline standard is the C++ baseline performance on the current host hardware
  const calibratedOps = cppMetrics.throughputOpsSec;

  console.log("\n5. Updating benchmarkConfigs in PostgreSQL with empirical baseline...");
  const latestConfig = await db
    .select()
    .from(benchmarkConfigs)
    .orderBy(desc(benchmarkConfigs.createdAt))
    .limit(1);

  if (latestConfig[0]) {
    await db
      .update(benchmarkConfigs)
      .set({
        baselineCode: {
          cpp: cppCode,
          python: pythonCode,
        },
        baselineMetrics: {
          throughputOpsSec: calibratedOps,
          latencyP50Ms: cppMetrics.latencyP50Ms,
          latencyP95Ms: cppMetrics.latencyP95Ms,
          latencyP99Ms: cppMetrics.latencyP99Ms,
          memoryBytes: cppMetrics.memoryBytes,
          calibratedAt: new Date().toISOString(),
          hardware: process.arch,
          pythonThroughput: pyMetrics.throughputOpsSec,
          cppThroughput: cppMetrics.throughputOpsSec,
        },
      })
      .where(eq(benchmarkConfigs.id, latestConfig[0].id));
    console.log(`   ✓ Updated config ID ${latestConfig[0].id} with baseline: ${calibratedOps} ops/sec`);
  } else {
    console.log("   ⚠ No existing benchmark config found in DB to update.");
  }

  console.log("\n=================================================");
  console.log("  Empirical Calibration Complete!");
  console.log(`  CALIBRATED_BASELINE_OPS_SEC=${calibratedOps}`);
  console.log("=================================================");

  return { pyMetrics, cppMetrics, calibratedOps };
}

calibrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Calibration failed:", err);
    process.exit(1);
  });
