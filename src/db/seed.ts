import { db } from "./index";
import {
  users,
  challenges,
  challengeVersions,
  challengeFiles,
  benchmarkConfigs,
} from "./schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { CHALLENGES_LIST } from "@/lib/challenges";
import { CORE_CHALLENGES } from "@/lib/constants/core-challenges";

export function hashPassword(password: string): string {
  const salt = "algo_dev_salt_2026";
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function mapDifficulty(diff: string): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" {
  switch (diff) {
    case "Easy":
      return "BEGINNER";
    case "Medium":
      return "INTERMEDIATE";
    case "Hard":
      return "ADVANCED";
    case "Expert":
      return "EXPERT";
    default:
      return "INTERMEDIATE";
  }
}

async function seed() {
  console.log("🌱 Seeding ALGO database...");

  // 1. Seed Verified Admin User: Jason Pandian
  const adminPasswordHash = hashPassword("Admin123!algo");

  const [adminUser] = await db
    .insert(users)
    .values({
      name: "Jason Pandian",
      username: "jasonpandian",
      email: "pandiajason@gmail.com",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
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

  console.log(`✓ Admin user: ${adminUser.email} (role: ${adminUser.role})`);

  // 2. Seed All 20 Core Challenges
  for (const chData of CHALLENGES_LIST) {
    const coreDef = CORE_CHALLENGES.find((c) => c.slug === chData.slug);
    const difficulty = mapDifficulty(coreDef?.difficulty || "Medium");

    const existingChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, chData.slug))
      .limit(1);

    let challengeId: string;

    if (!existingChallenges[0]) {
      const [createdChallenge] = await db
        .insert(challenges)
        .values({
          slug: chData.slug,
          title: chData.title,
          tagline: chData.subtitle || chData.badge || chData.whatStudentsBuild,
          description: chData.overview,
          difficulty,
          status: "PUBLISHED",
          supportedLanguages: ["python", "cpp", "rust", "go", "java"],
          currentVersionNumber: 1,
        })
        .returning();
      challengeId = createdChallenge.id;
      console.log(`+ Created challenge: ${chData.slug} (${chData.title})`);
    } else {
      challengeId = existingChallenges[0].id;
      await db
        .update(challenges)
        .set({
          title: chData.title,
          tagline: chData.subtitle || chData.badge || chData.whatStudentsBuild,
          description: chData.overview,
          difficulty,
          status: "PUBLISHED",
          supportedLanguages: ["python", "cpp", "rust", "go", "java"],
          updatedAt: new Date(),
        })
        .where(eq(challenges.id, challengeId));
      console.log(`✓ Updated challenge: ${chData.slug} (${chData.title})`);
    }

    // Build spec and levels
    const levelsArray = Object.values(chData.levels).sort((a, b) => a.level - b.level);
    const spec = {
      badge: chData.badge,
      title: chData.title,
      subtitle: chData.subtitle,
      overview: chData.overview,
      whyItMatters: chData.whyItMatters,
      philosophy: chData.philosophy,
      signatureQuestion: chData.signatureQuestion,
      finalOutcome: chData.finalOutcome,
      architectureDiagram: chData.architectureDiagram,
      architecturalLayers: chData.architecturalLayers,
      levelRoadmap: chData.levelRoadmap,
    };

    const testDefinitions = {
      correctnessSuites: levelsArray.map((l) => ({
        name: `level_${l.level}_suite`,
        level: l.level,
        title: l.title,
        casesCount: l.cases?.length || 0,
        weight: Math.round(100 / levelsArray.length),
        description: l.tagline || `Level ${l.level} verification suite`,
      })),
    };

    // Challenge Version 1
    const existingVersions = await db
      .select()
      .from(challengeVersions)
      .where(
        and(
          eq(challengeVersions.challengeId, challengeId),
          eq(challengeVersions.version, 1)
        )
      )
      .limit(1);

    let versionId: string;

    if (!existingVersions[0]) {
      const [version] = await db
        .insert(challengeVersions)
        .values({
          challengeId,
          version: 1,
          spec,
          levels: levelsArray,
          starterTemplates: chData.starterTemplates,
          testDefinitions,
          createdBy: adminUser.id,
        })
        .returning();
      versionId = version.id;
      console.log(`  + Version 1 seeded for ${chData.slug}`);
    } else {
      versionId = existingVersions[0].id;
      await db
        .update(challengeVersions)
        .set({
          spec,
          levels: levelsArray,
          starterTemplates: chData.starterTemplates,
          testDefinitions,
        })
        .where(eq(challengeVersions.id, versionId));
      console.log(`  ✓ Version 1 updated for ${chData.slug}`);
    }

    // Benchmark Config
    const existingConfigs = await db
      .select()
      .from(benchmarkConfigs)
      .where(eq(benchmarkConfigs.challengeVersionId, versionId))
      .limit(1);

    if (!existingConfigs[0]) {
      await db.insert(benchmarkConfigs).values({
        challengeVersionId: versionId,
        version: 1,
        workloads: [
          { name: "standard_workload", count: 100000, description: "Automated benchmark workload" },
        ],
        iterations: 5,
        warmupIterations: 2,
        timeoutSeconds: 60,
        cpuLimit: "1.00",
        memoryLimitMb: 256,
        baselineMetrics: {
          throughputOpsSec: 100000.0,
          latencyP50Ms: 0.08,
          latencyP95Ms: 0.25,
          latencyP99Ms: 0.52,
          memoryBytes: 32 * 1024 * 1024,
        },
        isActive: true,
      });
      console.log(`  + Benchmark config seeded for ${chData.slug}`);
    }
  }

  console.log("🌱 Database seeding complete! All 20 challenges active.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
