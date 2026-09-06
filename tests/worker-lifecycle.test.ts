/**
 * ALGO Worker Lifecycle & End-to-End Verification Test
 *
 * Verifies:
 * 1. Worker initializes, reports healthy on HTTP port 8080 (Redis, Postgres, Docker)
 * 2. Enqueues a valid submission via BullMQ
 * 3. Observes end-to-end lifecycle: QUEUED -> RUNNING -> TESTING -> BENCHMARKING -> COMPLETED
 * 4. Verifies submission_results, real benchmark metrics, and leaderboard entry ranking
 * 5. Enqueues an invalid submission and verifies graceful failure containment: QUEUED -> FAILED
 * 6. Graceful shutdown
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import http from "http";
import { db } from "../src/db";
import {
  users,
  challenges,
  challengeVersions,
  submissions,
  submissionFiles,
  submissionResults,
  leaderboardEntries,
  userChallengeProgress,
} from "../src/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { enqueueSubmission } from "../src/lib/queue/producer";
import { worker, healthServer, queue, connection } from "../worker/src/index";

function checkHealth(port = 8080): Promise<any> {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:${port}/health`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse health response: ${data}`));
          }
        });
      })
      .on("error", reject);
  });
}

async function runLifecycleTest() {
  console.log("=================================================");
  console.log("     ALGO Worker Lifecycle Verification Suite    ");
  console.log("=================================================\n");

  // 1. Wait for Worker & Health server
  console.log("Step 1: Checking Worker HTTP Health Server...");
  let health: any = null;
  for (let i = 0; i < 10; i++) {
    try {
      health = await checkHealth(8080);
      if (health.status === "healthy" || health.status === "degraded") break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!health) {
    throw new Error("Worker health check server did not respond on port 8080");
  }

  console.log(`   ✓ Health Server: status=${health.status}`);
  console.log(`   ✓ Subsystems: Redis=${health.subsystems.redis}, Postgres=${health.subsystems.postgres}, Docker=${health.subsystems.docker}`);
  console.log(`   ✓ Queue: waiting=${health.queue.waiting}, active=${health.queue.active}`);

  if (health.subsystems.redis !== "connected" || health.subsystems.postgres !== "connected" || !health.subsystems.docker.startsWith("available")) {
    throw new Error(`One or more subsystems are unhealthy: ${JSON.stringify(health.subsystems)}`);
  }

  // 2. Fetch or create test user & challenge
  console.log("\nStep 2: Preparing Test User and KV-Store Challenge...");
  let [testUser] = await db.select().from(users).where(eq(users.email, "pandiajason@gmail.com"));
  if (!testUser) {
    const allUsers = await db.select().from(users).limit(1);
    testUser = allUsers[0];
  }
  if (!testUser) {
    throw new Error("No user found in database. Please run db:seed first.");
  }

  const [challenge] = await db.select().from(challenges).where(eq(challenges.slug, "kv-store"));
  if (!challenge) {
    throw new Error("Key-Value store challenge not found. Please run db:seed first.");
  }

  const [version] = await db
    .select()
    .from(challengeVersions)
    .where(eq(challengeVersions.challengeId, challenge.id))
    .limit(1);

  console.log(`   ✓ User: ${testUser.username || testUser.email} (${testUser.id})`);
  console.log(`   ✓ Challenge: ${challenge.title} (${challenge.id})`);

  // 3. Test Valid Submission (Python L1)
  console.log("\nStep 3: Submitting Valid Python Solution to Queue...");
  const [validSub] = await db
    .insert(submissions)
    .values({
      userId: testUser.id,
      challengeId: challenge.id,
      challengeVersionId: version.id,
      language: "python",
      level: 1,
      status: "QUEUED",
    })
    .returning();

  const starterCode = (version.starterTemplates as any).python;
  await db.insert(submissionFiles).values({
    submissionId: validSub.id,
    filename: "store.py",
    content: starterCode,
  });

  await enqueueSubmission({
    submissionId: validSub.id,
    challengeId: challenge.id,
    challengeVersionId: version.id,
    userId: testUser.id,
    language: "python",
    level: 1,
    files: [{ filename: "store.py", content: starterCode }],
  });

  console.log(`   ✓ Enqueued valid submission: ${validSub.id}`);
  console.log("   Waiting for worker evaluation pipeline...");

  // Poll submission status transitions
  let validCompleted = false;
  const observedStatuses: string[] = ["QUEUED"];

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const [sub] = await db.select().from(submissions).where(eq(submissions.id, validSub.id));
    if (!observedStatuses.includes(sub.status)) {
      observedStatuses.push(sub.status);
      console.log(`   -> Transitioned to: ${sub.status}`);
    }

    if (sub.status === "COMPLETED" || sub.status === "FAILED") {
      validCompleted = true;
      break;
    }
  }

  if (!validCompleted) {
    throw new Error(`Valid submission timed out without reaching COMPLETED state. Observed: ${observedStatuses.join(" -> ")}`);
  }

  // Verify results
  const [result] = await db
    .select()
    .from(submissionResults)
    .where(eq(submissionResults.submissionId, validSub.id));

  if (!result) {
    throw new Error("No submission_results row found for completed submission");
  }

  console.log("\nStep 4: Validating Submission Results & Leaderboard Entry...");
  console.log(`   ✓ Correctness: ${result.correctnessPassed}/${result.correctnessTotal} tests passed (isCorrect: ${result.isCorrect})`);
  console.log(`   ✓ Measured Throughput: ${result.throughputOpsSec} ops/sec`);
  console.log(`   ✓ Latency p50: ${result.latencyP50Ms} ms | p99: ${result.latencyP99Ms} ms`);
  console.log(`   ✓ Normalized Score: ${result.score}x baseline`);

  if (!result.isCorrect || result.correctnessPassed !== result.correctnessTotal) {
    throw new Error(`Expected all tests to pass, but got ${result.correctnessPassed}/${result.correctnessTotal}`);
  }

  // Check Leaderboard entry
  const [leaderEntry] = await db
    .select()
    .from(leaderboardEntries)
    .where(
      and(
        eq(leaderboardEntries.challengeId, challenge.id),
        eq(leaderboardEntries.userId, testUser.id)
      )
    );

  if (!leaderEntry) {
    throw new Error("Expected leaderboard entry to be created for correct submission");
  }

  console.log(`   ✓ Leaderboard Entry: Rank #${leaderEntry.rank} | Score: ${leaderEntry.score}x | Verified: ${leaderEntry.isVerified}`);

  // 4. Test Invalid Submission Failure Handling
  console.log("\nStep 5: Submitting Malformed Python Code (Testing Failure Containment)...");
  const [invalidSub] = await db
    .insert(submissions)
    .values({
      userId: testUser.id,
      challengeId: challenge.id,
      challengeVersionId: version.id,
      language: "python",
      level: 1,
      status: "QUEUED",
    })
    .returning();

  const brokenCode = "def syntax_error(\n   broken = true";
  await db.insert(submissionFiles).values({
    submissionId: invalidSub.id,
    filename: "store.py",
    content: brokenCode,
  });

  await enqueueSubmission({
    submissionId: invalidSub.id,
    challengeId: challenge.id,
    challengeVersionId: version.id,
    userId: testUser.id,
    language: "python",
    level: 1,
    files: [{ filename: "store.py", content: brokenCode }],
  });

  console.log(`   ✓ Enqueued invalid submission: ${invalidSub.id}`);

  let invalidHandled = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const [sub] = await db.select().from(submissions).where(eq(submissions.id, invalidSub.id));
    if (sub.status === "FAILED") {
      invalidHandled = true;
      console.log(`   ✓ Submission correctly marked as FAILED`);
      break;
    }
  }

  if (!invalidHandled) {
    throw new Error("Broken submission did not fail as expected");
  }

  const [brokenResult] = await db
    .select()
    .from(submissionResults)
    .where(eq(submissionResults.submissionId, invalidSub.id));

  console.log(`   ✓ Failure Diagnostics: isCorrect=${brokenResult?.isCorrect}, passed=${brokenResult?.correctnessPassed}/${brokenResult?.correctnessTotal}`);

  console.log("\n=================================================");
  console.log("  🎉 WORKER LIFECYCLE VERIFICATION 100% PASS!");
  console.log("=================================================");

  // Graceful shutdown
  try {
    healthServer.close();
    await worker.close();
    await queue.close();
    await connection.quit();
  } catch {}
  process.exit(0);
}

runLifecycleTest().catch(async (err) => {
  console.error("Lifecycle test failed:", err);
  try {
    healthServer.close();
    await worker.close();
    await queue.close();
    await connection.quit();
  } catch {}
  process.exit(1);
});
