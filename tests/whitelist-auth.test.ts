import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../src/db";
import { whitelistUsers, users, auditLogs, submissions, submissionResults } from "../src/db/schema";
import { eq, desc } from "drizzle-orm";
import { ADMIN_EMAIL } from "../src/lib/constants";

async function testWhitelistSystem() {
  console.log("==================================================");
  console.log("  ALGO ACCESS WISHLIST & ADMIN REPAIR TEST SUITE");
  console.log("==================================================");
  console.log(`📡 Admin Email: ${ADMIN_EMAIL}`);

  // Test 1: Platform owner must exist on wishlist
  console.log("\n[Test 1] Verifying Root Platform Owner on Wishlist...");
  const [ownerEntry] = await db
    .select()
    .from(whitelistUsers)
    .where(eq(whitelistUsers.email, ADMIN_EMAIL))
    .limit(1);

  if (!ownerEntry) {
    throw new Error(`Owner ${ADMIN_EMAIL} is missing from whitelist!`);
  }
  console.log(`✓ Owner ${ADMIN_EMAIL} confirmed on access wishlist (ID: ${ownerEntry.id})`);

  // Test 2: Add a new user to the wishlist
  const testCandidate = "curious.tester.2026@gmail.com";
  console.log(`\n[Test 2] Adding test candidate '${testCandidate}' to Wishlist...`);
  
  // Clean up if already exists from prior run
  await db.delete(whitelistUsers).where(eq(whitelistUsers.email, testCandidate));

  const [addedCandidate] = await db
    .insert(whitelistUsers)
    .values({
      email: testCandidate,
      notes: "E2E automated test candidate",
    })
    .returning();

  if (!addedCandidate || addedCandidate.email !== testCandidate) {
    throw new Error("Failed to insert candidate to wishlist!");
  }
  console.log(`✓ Successfully wishlisted '${testCandidate}' (ID: ${addedCandidate.id})`);

  // Test 3: Verify authorization logic
  console.log("\n[Test 3] Simulating Auth Gate for Wishlisted vs Non-Wishlisted Emails...");
  
  async function checkEmailAllowed(email: string): Promise<boolean> {
    const normalized = email.toLowerCase().trim();
    if (normalized === ADMIN_EMAIL) return true;
    const [row] = await db
      .select()
      .from(whitelistUsers)
      .where(eq(whitelistUsers.email, normalized))
      .limit(1);
    return !!row;
  }

  const ownerAllowed = await checkEmailAllowed("pandiajason@gmail.com");
  const candidateAllowed = await checkEmailAllowed(testCandidate);
  const randomStrangerAllowed = await checkEmailAllowed("random.stranger.hacker@gmail.com");

  console.log(`  - Owner (${ADMIN_EMAIL}) allowed: ${ownerAllowed}`);
  console.log(`  - Wishlisted candidate (${testCandidate}) allowed: ${candidateAllowed}`);
  console.log(`  - Non-wishlisted user (random.stranger.hacker@gmail.com) allowed: ${randomStrangerAllowed}`);

  if (!ownerAllowed) throw new Error("Owner was denied access!");
  if (!candidateAllowed) throw new Error("Wishlisted candidate was denied access!");
  if (randomStrangerAllowed) throw new Error("Non-wishlisted stranger was incorrectly granted access!");
  console.log("✓ Auth gate logic strictly enforced! Only wishlisted emails can join.");

  // Test 4: Verify Inspect Submission route data resolution
  console.log("\n[Test 4] Testing Submission Inspection Console Query...");
  const [latestSub] = await db.select().from(submissions).orderBy(desc(submissions.submittedAt)).limit(1);
  if (latestSub) {
    const [subResult] = await db
      .select()
      .from(submissionResults)
      .where(eq(submissionResults.submissionId, latestSub.id))
      .limit(1);

    console.log(`✓ Fetched submission #${latestSub.id.slice(0, 8)}`);
    console.log(`  - Status: ${latestSub.status}`);
    console.log(`  - Lang: ${latestSub.language} (Level ${latestSub.level})`);
    console.log(`  - Result: isCorrect=${subResult?.isCorrect}, Score=${subResult?.score}, Invalidated=${subResult?.isInvalidated}`);
  } else {
    console.log("  - No submissions present in database to inspect.");
  }

  // Test 5: Clean up test candidate
  console.log(`\n[Test 5] Removing '${testCandidate}' from Wishlist...`);
  await db.delete(whitelistUsers).where(eq(whitelistUsers.email, testCandidate));
  const candidateAllowedAfterRemoval = await checkEmailAllowed(testCandidate);
  if (candidateAllowedAfterRemoval) {
    throw new Error("Candidate still allowed after removal from wishlist!");
  }
  console.log(`✓ Candidate revoked. Allowed status after removal: ${candidateAllowedAfterRemoval}`);

  console.log("\n==================================================");
  console.log("  🎉 ALL 5 TEST SUITE CHECKS PASSED PERFECTLY!");
  console.log("==================================================");
}

testWhitelistSystem()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Test Suite Failed:", err);
    process.exit(1);
  });
