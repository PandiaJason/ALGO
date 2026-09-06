// scripts/seed-core-challenges.ts
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { CORE_CHALLENGES } from "../src/lib/constants/core-challenges";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

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
  console.log("Starting Core Challenges Seeding...");

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

    // Ensure challenge_version exists
    const existingVersion = await retryQuery(() => sql`
      SELECT id FROM challenge_versions WHERE challenge_id = ${challengeId} LIMIT 1
    `);

    if (existingVersion.length === 0) {
      console.log(`Creating version 1 for [${c.slug}]...`);
      const levelsPayload = c.progressionLevels.map((lvl) => ({
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

      const starterTemplates = {
        python: `# ${c.title} - Starter Code\n# Inspired by ${c.inspiredBy}\nimport sys\n\ndef main():\n    for line in sys.stdin:\n        line = line.strip()\n        if not line or line == "EXIT":\n            break\n        print("OK")\n\nif __name__ == "__main__":\n    main()\n`,
        cpp: `// ${c.title} - Starter Code\n// Inspired by ${c.inspiredBy}\n#include <iostream>\n#include <string>\n\nint main() {\n    std::ios_base::sync_with_stdio(false);\n    std::cin.tie(NULL);\n    std::string line;\n    while (std::getline(std::cin, line)) {\n        if (line.empty() || line == "EXIT") break;\n        std::cout << "OK\\n";\n    }\n    return 0;\n}\n`,
      };

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
          ${JSON.stringify({ overview: c.overview, inspiredBy: c.inspiredBy, mainSkill: c.mainSkill })},
          ${JSON.stringify(levelsPayload)},
          ${JSON.stringify(starterTemplates)},
          ${JSON.stringify([])}
        )
      `);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("✅ Successfully seeded all 10 Core Engineering Challenges!");
}

seed().catch(console.error);
