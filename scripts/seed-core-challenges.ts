// scripts/seed-core-challenges.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import postgres from "postgres";
import { CORE_CHALLENGES } from "../src/lib/constants/core-challenges";
import { getChallenge } from "../src/lib/challenges";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function retryQuery<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Failed after retries");
}

async function seed() {
  console.log("Starting Core Challenges Seeding via PostgreSQL client...");

  try {
    for (const c of CORE_CHALLENGES) {
      const difficultyMap: Record<string, string> = {
        Easy: "BEGINNER",
        Medium: "INTERMEDIATE",
        Hard: "ADVANCED",
        Expert: "EXPERT",
      };
      const mappedDiff = difficultyMap[c.difficulty] || "INTERMEDIATE";

      // Check if challenge exists by slug
      const existing = await retryQuery(() => sql`
        SELECT id, slug, current_version_number FROM challenges WHERE slug = ${c.slug}
      `);

      let challengeId: string;

      if (existing.length > 0) {
        challengeId = existing[0].id;
        console.log(`Updating existing challenge [${c.slug}] (${challengeId})...`);
        await retryQuery(() => sql`
          UPDATE challenges
          SET 
            title = ${c.title},
            tagline = ${c.signatureQuestion},
            description = ${c.overview},
            difficulty = ${mappedDiff}::challenge_difficulty,
            status = 'PUBLISHED'::challenge_status,
            updated_at = NOW()
          WHERE id = ${challengeId}
        `);
      } else {
        console.log(`Inserting new challenge [${c.slug}]...`);
        const inserted = await retryQuery(() => sql`
          INSERT INTO challenges (
            slug,
            title,
            tagline,
            description,
            difficulty,
            status,
            supported_languages,
            current_version_number
          ) VALUES (
            ${c.slug},
            ${c.title},
            ${c.signatureQuestion},
            ${c.overview},
            ${mappedDiff}::challenge_difficulty,
            'PUBLISHED'::challenge_status,
            ${JSON.stringify(["python", "cpp"])},
            1
          )
          RETURNING id
        `);
        challengeId = inserted[0].id;
      }

      // Resolve challenge detailed curriculum definition
      const chData = getChallenge(c.slug);

      const levelsPayload = chData
        ? Object.values(chData.levels).sort((a, b) => a.level - b.level)
        : c.progressionLevels.map((lvl) => ({
            level: lvl.level,
            title: lvl.name,
            difficulty: c.difficulty,
            tagline: lvl.focus,
            learningLoop: {
              bottleneck: `Bottleneck for Level ${lvl.level}`,
              whatYouUnderstand: [lvl.focus],
              productionParity: c.inspiredBy,
              outcomeSummary: `Master Level ${lvl.level} in ${c.title}.`,
            },
            operations: [],
            examples: [],
            constraints: ["256MB RAM hard limit", "Sub-second timeout"],
            cases: [],
          }));

      const starterTemplates = chData
        ? chData.starterTemplates
        : {
            python: `# ${c.title} - Starter Code\nimport sys\nfor line in sys.stdin:\n    print("OK")\n`,
            cpp: `// ${c.title} - Starter Code\n#include <iostream>\nint main() { return 0; }\n`,
          };

      const specPayload = chData
        ? {
            overview: chData.overview,
            whyItMatters: chData.whyItMatters,
            finalOutcome: chData.finalOutcome,
            inspiredBy: chData.inspiredBy,
            mainSkill: chData.mainSkill,
            signatureQuestion: chData.signatureQuestion,
            architecturalLayers: chData.architecturalLayers,
            whatYouLearn: chData.architecturalLayers.map((l) => `${l.name}: ${l.description}`),
            apiSpecification: Object.values(chData.levels).flatMap((l) =>
              l.operations.map((op) => ({
                command: op.cmd,
                returns: "Response",
                description: op.desc,
              }))
            ),
          }
        : {
            overview: c.overview,
            inspiredBy: c.inspiredBy,
            mainSkill: c.mainSkill,
          };

      // Ensure challenge_version exists and is up to date
      const existingVersion = await retryQuery(() => sql`
        SELECT id FROM challenge_versions WHERE challenge_id = ${challengeId} LIMIT 1
      `);

      if (existingVersion.length === 0) {
        console.log(`Creating version 1 for [${c.slug}]...`);
        await retryQuery(() => sql`
          INSERT INTO challenge_versions (
            challenge_id,
            version,
            spec,
            levels,
            starter_templates,
            test_definitions
          ) VALUES (
            ${challengeId},
            1,
            ${sql.json(specPayload as any)},
            ${sql.json(levelsPayload as any)},
            ${sql.json(starterTemplates as any)},
            ${sql.json([])}
          )
        `);
      } else {
        console.log(`Updating version 1 for [${c.slug}] with authentic curriculum levels...`);
        await retryQuery(() => sql`
          UPDATE challenge_versions
          SET
            spec = ${sql.json(specPayload as any)},
            levels = ${sql.json(levelsPayload as any)},
            starter_templates = ${sql.json(starterTemplates as any)}
          WHERE id = ${existingVersion[0].id}
        `);
      }

      await new Promise((r) => setTimeout(r, 100));
    }

    console.log("✅ Successfully seeded all 10 Core Engineering Challenges with authentic levels!");
  } finally {
    await sql.end();
  }
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
