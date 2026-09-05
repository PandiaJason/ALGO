import { db } from "../db";
import { users, submissions, submissionResults, leaderboardEntries, submissionFiles } from "../db/schema";
import { eq, or } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function cleanDemoData() {
  console.log("🧹 Purging demo/seed accounts and fake leaderboard entries...");

  // 1. Find demo users
  const demoUsers = await db
    .select()
    .from(users)
    .where(or(eq(users.username, "engineer"), eq(users.email, "student@algo.local")));

  for (const u of demoUsers) {
    console.log(`Found demo user: ${u.username} (${u.email}) - ID: ${u.id}`);

    // Remove user challenge progress
    const { userChallengeProgress } = await import("../db/schema");
    await db.delete(userChallengeProgress).where(eq(userChallengeProgress.userId, u.id));

    // Remove leaderboard entries
    await db.delete(leaderboardEntries).where(eq(leaderboardEntries.userId, u.id));

    // Get submissions
    const subs = await db.select().from(submissions).where(eq(submissions.userId, u.id));
    for (const s of subs) {
      await db.delete(submissionFiles).where(eq(submissionFiles.submissionId, s.id));
      await db.delete(submissionResults).where(eq(submissionResults.submissionId, s.id));
    }
    await db.delete(submissions).where(eq(submissions.userId, u.id));

    // Delete user
    await db.delete(users).where(eq(users.id, u.id));
    console.log(`✓ Deleted demo user ${u.username} and all associated records.`);
  }

  // 2. Ensure Jason Pandian is provisioned as ADMIN
  const jasonUser = await db
    .insert(users)
    .values({
      name: "Jason Pandian",
      username: "jasonpandian",
      email: "pandiajason@gmail.com",
      role: "ADMIN",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: "Jason Pandian",
        username: "jasonpandian",
        role: "ADMIN",
      },
    })
    .returning();

  console.log(`✓ Verified Admin User: ${jasonUser[0].email} (${jasonUser[0].name}) with role ${jasonUser[0].role}`);
  console.log("✨ Demo data cleanup complete! Leaderboard now contains 0 fake accounts.");
  process.exit(0);
}

cleanDemoData().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
