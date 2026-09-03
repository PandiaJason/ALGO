import { db } from "../src/db";
import {
  users,
  challenges,
  challengeVersions,
  submissions,
  submissionFiles,
  submissionResults,
  leaderboardEntries,
} from "../src/db/schema";
import { eq, desc } from "drizzle-orm";
import { enqueueSubmission } from "../src/lib/queue/producer";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verify() {
  console.log("🔍 Running ALGO End-to-End Flow Verification...");

  // 1. Get student user & challenge
  const [student] = await db.select().from(users).where(eq(users.email, "student@algo.local"));
  const [challenge] = await db.select().from(challenges).where(eq(challenges.slug, "kv-store"));
  const [version] = await db
    .select()
    .from(challengeVersions)
    .where(eq(challengeVersions.challengeId, challenge.id))
    .limit(1);

  console.log(`✓ Student: ${student.username}`);
  console.log(`✓ Challenge: ${challenge.title} (v${version.version})`);

  // 2. Insert test submission
  const [submission] = await db
    .insert(submissions)
    .values({
      userId: student.id,
      challengeId: challenge.id,
      challengeVersionId: version.id,
      language: "python",
      level: 1,
      status: "QUEUED",
    })
    .returning();

  const starterCode = (version.starterTemplates as any).python;

  await db.insert(submissionFiles).values({
    submissionId: submission.id,
    filename: "store.py",
    content: starterCode,
  });

  console.log(`✓ Created submission record: ${submission.id}`);

  // 3. Enqueue to BullMQ
  await enqueueSubmission({
    submissionId: submission.id,
    challengeId: challenge.id,
    challengeVersionId: version.id,
    userId: student.id,
    language: "python",
    level: 1,
    files: [{ filename: "store.py", content: starterCode }],
  });

  console.log("✓ Enqueued job to BullMQ queue. Waiting for worker evaluation...");

  // 4. Poll until completed
  let attempts = 0;
  while (attempts < 30) {
    await new Promise((r) => setTimeout(r, 1000));
    const [sub] = await db.select().from(submissions).where(eq(submissions.id, submission.id));

    if (sub.status === "COMPLETED" || sub.status === "FAILED") {
      console.log(`✓ Final status reached: ${sub.status}`);
      break;
    }
    process.stdout.write(`... status is ${sub.status}\n`);
    attempts++;
  }

  // 5. Check submission results
  const [result] = await db
    .select()
    .from(submissionResults)
    .where(eq(submissionResults.submissionId, submission.id));

  if (!result) {
    throw new Error("No submission result recorded!");
  }

  console.log("\n==========================================");
  console.log("       VERIFIED BENCHMARK RESULT");
  console.log("==========================================");
  console.log(`✓ Correctness: ${result.correctnessPassed}/${result.correctnessTotal} tests passed (isCorrect: ${result.isCorrect})`);
  console.log(`✓ Throughput: ${result.throughputOpsSec} ops/sec`);
  console.log(`✓ Normalized Score: ${result.score}x baseline`);
  console.log(`✓ Improvement vs baseline: ${result.improvementPct}%`);
  console.log(`✓ P50 Latency: ${result.latencyP50Ms} ms`);
  console.log(`✓ P95 Latency: ${result.latencyP95Ms} ms`);
  console.log(`✓ P99 Latency: ${result.latencyP99Ms} ms`);
  console.log(`✓ Memory: ${result.memoryBytes} bytes`);

  // 6. Check leaderboard
  const leaders = await db
    .select()
    .from(leaderboardEntries)
    .where(eq(leaderboardEntries.challengeId, challenge.id))
    .orderBy(desc(leaderboardEntries.score));

  console.log("\n==========================================");
  console.log("       OFFICIAL LEADERBOARD STATE");
  console.log("==========================================");
  leaders.forEach((l) => {
    console.log(`Rank #${l.rank}: User ${l.userId} | Score: ${l.score}x | Throughput: ${l.throughputOpsSec} ops/s`);
  });

  console.log("\n🎉 END-TO-END VERIFICATION SUCCEEDED!");
  process.exit(0);
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
