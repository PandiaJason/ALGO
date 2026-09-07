import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  challenges,
  challengeVersions,
  challengeFiles,
  benchmarkConfigs,
  auditLogs,
  users,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const challengeEditorSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  slug: z.string().min(3).max(128).regex(/^[a-z0-9-]+$/).optional(),
  tagline: z.string().max(255).optional(),
  description: z.string().min(10).optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  spec: z.record(z.string(), z.any()).optional(),
  levels: z.array(z.any()).optional(),
  starterTemplates: z.object({
    python: z.string().min(1).optional(),
    cpp: z.string().min(1).optional(),
  }).optional(),
  testDefinitions: z.array(z.object({
    name: z.string(),
    input: z.string(),
    expected: z.string(),
  })).optional(),
  benchmarkConfig: z.object({
    cpuLimit: z.string().optional(),
    memoryLimitMb: z.number().int().optional(),
    timeoutSeconds: z.number().int().optional(),
    iterations: z.number().int().optional(),
    warmupIterations: z.number().int().optional(),
    baselineThroughput: z.number().optional(),
  }).optional(),
  createNewVersion: z.boolean().default(false).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id))
      .limit(1);

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const [activeVersion] = await db
      .select()
      .from(challengeVersions)
      .where(
        and(
          eq(challengeVersions.challengeId, challenge.id),
          eq(challengeVersions.version, challenge.currentVersionNumber)
        )
      )
      .limit(1);

    let files: any[] = [];
    let benchConfig: any = null;

    if (activeVersion) {
      files = await db
        .select()
        .from(challengeFiles)
        .where(eq(challengeFiles.challengeVersionId, activeVersion.id));

      const [b] = await db
        .select()
        .from(benchmarkConfigs)
        .where(eq(benchmarkConfigs.challengeVersionId, activeVersion.id))
        .limit(1);
      benchConfig = b || null;
    }

    return NextResponse.json({
      challenge,
      version: activeVersion || null,
      files,
      benchmarkConfig: benchConfig,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = challengeEditorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }

    const [currentChallenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id))
      .limit(1);

    if (!currentChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const data = parsed.data;

    // Check slug uniqueness if slug is being updated
    if (data.slug && data.slug !== currentChallenge.slug) {
      const [existingSlug] = await db
        .select()
        .from(challenges)
        .where(eq(challenges.slug, data.slug))
        .limit(1);
      if (existingSlug) {
        return NextResponse.json({ error: "A challenge with this slug already exists" }, { status: 409 });
      }
    }

    let nextVersionNumber = currentChallenge.currentVersionNumber;
    if (data.createNewVersion) {
      nextVersionNumber += 1;
    }

    // 1. Update Challenge Metadata
    const [updatedChallenge] = await db
      .update(challenges)
      .set({
        title: data.title ?? currentChallenge.title,
        slug: data.slug ?? currentChallenge.slug,
        tagline: data.tagline ?? currentChallenge.tagline,
        description: data.description ?? currentChallenge.description,
        difficulty: data.difficulty ?? currentChallenge.difficulty,
        status: data.status ?? currentChallenge.status,
        currentVersionNumber: nextVersionNumber,
        updatedAt: new Date(),
      })
      .where(eq(challenges.id, id))
      .returning();

    // 2. Handle Versioning & Associated Data
    const [existingVersion] = await db
      .select()
      .from(challengeVersions)
      .where(
        and(
          eq(challengeVersions.challengeId, id),
          eq(challengeVersions.version, currentChallenge.currentVersionNumber)
        )
      )
      .limit(1);

    const mergedSpec = data.spec ?? existingVersion?.spec ?? {
      overview: updatedChallenge.description,
      whatYouLearn: ["Data structure design", "Performance optimization"],
    };
    const mergedLevels = data.levels ?? existingVersion?.levels ?? [
      { level: 1, title: "Core Mechanics", description: "All test cases pass." }
    ];
    const mergedStarter = data.starterTemplates ?? (existingVersion?.starterTemplates as any) ?? {
      python: "# solution.py",
      cpp: "// solution.cpp",
    };
    const mergedTests = data.testDefinitions ?? (existingVersion?.testDefinitions as any) ?? [];

    let targetVersionId: string;

    if (data.createNewVersion || !existingVersion) {
      // Insert new version
      const [newVersion] = await db
        .insert(challengeVersions)
        .values({
          challengeId: id,
          version: nextVersionNumber,
          spec: mergedSpec,
          levels: mergedLevels,
          starterTemplates: mergedStarter,
          testDefinitions: mergedTests,
          createdBy: adminUser.id,
        })
        .returning();
      targetVersionId = newVersion.id;

      // Insert files
      const newVersionFiles: Array<{
        challengeVersionId: string;
        filename: string;
        language: string;
        content: string;
        isReadonly: boolean;
        isHidden: boolean;
      }> = [
        {
          challengeVersionId: targetVersionId,
          filename: "solution.py",
          language: "python",
          content: mergedStarter.python || "# Python starter",
          isReadonly: false,
          isHidden: false,
        },
        {
          challengeVersionId: targetVersionId,
          filename: "solution.cpp",
          language: "cpp",
          content: mergedStarter.cpp || "// C++ starter",
          isReadonly: false,
          isHidden: false,
        },
      ];

      if (mergedStarter.rust) {
        newVersionFiles.push({
          challengeVersionId: targetVersionId,
          filename: "solution.rs",
          language: "rust",
          content: mergedStarter.rust,
          isReadonly: false,
          isHidden: false,
        });
      }
      if (mergedStarter.go) {
        newVersionFiles.push({
          challengeVersionId: targetVersionId,
          filename: "main.go",
          language: "go",
          content: mergedStarter.go,
          isReadonly: false,
          isHidden: false,
        });
      }
      if (mergedStarter.java) {
        newVersionFiles.push({
          challengeVersionId: targetVersionId,
          filename: "Solution.java",
          language: "java",
          content: mergedStarter.java,
          isReadonly: false,
          isHidden: false,
        });
      }
      await db.insert(challengeFiles).values(newVersionFiles);

      // Insert benchmark configs
      await db.insert(benchmarkConfigs).values({
        challengeVersionId: targetVersionId,
        version: nextVersionNumber,
        workloads: {
          benchmarkName: `${updatedChallenge.slug}-eval`,
          operations: 100000,
        },
        iterations: data.benchmarkConfig?.iterations ?? 5,
        warmupIterations: data.benchmarkConfig?.warmupIterations ?? 2,
        timeoutSeconds: data.benchmarkConfig?.timeoutSeconds ?? 60,
        cpuLimit: data.benchmarkConfig?.cpuLimit ?? "1.00",
        memoryLimitMb: data.benchmarkConfig?.memoryLimitMb ?? 256,
        baselineMetrics: {
          baselineThroughput: data.benchmarkConfig?.baselineThroughput ?? 85000,
        },
      });
    } else {
      // Update existing version in-place
      targetVersionId = existingVersion.id;
      await db
        .update(challengeVersions)
        .set({
          spec: mergedSpec,
          levels: mergedLevels,
          starterTemplates: mergedStarter,
          testDefinitions: mergedTests,
        })
        .where(eq(challengeVersions.id, targetVersionId));

      // Update starter files if provided
      if (data.starterTemplates) {
        const langEntries = [
          { key: "python", file: "solution.py", lang: "python" },
          { key: "cpp", file: "solution.cpp", lang: "cpp" },
          { key: "rust", file: "solution.rs", lang: "rust" },
          { key: "go", file: "main.go", lang: "go" },
          { key: "java", file: "Solution.java", lang: "java" },
        ];
        for (const item of langEntries) {
          const content = (data.starterTemplates as any)[item.key];
          if (content) {
            const existing = await db
              .select()
              .from(challengeFiles)
              .where(
                and(
                  eq(challengeFiles.challengeVersionId, targetVersionId),
                  eq(challengeFiles.filename, item.file)
                )
              )
              .limit(1);

            if (existing[0]) {
              await db
                .update(challengeFiles)
                .set({ content })
                .where(eq(challengeFiles.id, existing[0].id));
            } else {
              await db.insert(challengeFiles).values({
                challengeVersionId: targetVersionId,
                filename: item.file,
                language: item.lang,
                content,
                isReadonly: false,
                isHidden: false,
              });
            }
          }
        }
      }

      // Update benchmark config if provided
      if (data.benchmarkConfig) {
        const [existingBench] = await db
          .select()
          .from(benchmarkConfigs)
          .where(eq(benchmarkConfigs.challengeVersionId, targetVersionId))
          .limit(1);

        if (existingBench) {
          await db
            .update(benchmarkConfigs)
            .set({
              cpuLimit: data.benchmarkConfig.cpuLimit ?? existingBench.cpuLimit,
              memoryLimitMb: data.benchmarkConfig.memoryLimitMb ?? existingBench.memoryLimitMb,
              timeoutSeconds: data.benchmarkConfig.timeoutSeconds ?? existingBench.timeoutSeconds,
              iterations: data.benchmarkConfig.iterations ?? existingBench.iterations,
              warmupIterations: data.benchmarkConfig.warmupIterations ?? existingBench.warmupIterations,
              baselineMetrics: data.benchmarkConfig.baselineThroughput
                ? { baselineThroughput: data.benchmarkConfig.baselineThroughput }
                : (existingBench.baselineMetrics as any),
            })
            .where(eq(benchmarkConfigs.id, existingBench.id));
        } else {
          await db.insert(benchmarkConfigs).values({
            challengeVersionId: targetVersionId,
            version: currentChallenge.currentVersionNumber,
            workloads: {
              benchmarkName: `${updatedChallenge.slug}-eval`,
              operations: 100000,
            },
            iterations: data.benchmarkConfig.iterations ?? 5,
            warmupIterations: data.benchmarkConfig.warmupIterations ?? 2,
            timeoutSeconds: data.benchmarkConfig.timeoutSeconds ?? 60,
            cpuLimit: data.benchmarkConfig.cpuLimit ?? "1.00",
            memoryLimitMb: data.benchmarkConfig.memoryLimitMb ?? 256,
            baselineMetrics: {
              baselineThroughput: data.benchmarkConfig.baselineThroughput ?? 85000,
            },
          });
        }
      }
    }

    // 3. Log Audit Record
    await db.insert(auditLogs).values({
      adminId: adminUser.id,
      action: "CHALLENGE_UPDATED",
      resource: "challenge",
      resourceId: id,
      metadata: {
        title: updatedChallenge.title,
        slug: updatedChallenge.slug,
        version: nextVersionNumber,
        createNewVersion: !!data.createNewVersion,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      challenge: updatedChallenge,
      versionNumber: nextVersionNumber,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin record not found" }, { status: 403 });
    }

    const [archived] = await db
      .update(challenges)
      .set({ status: "ARCHIVED", updatedAt: new Date() })
      .where(eq(challenges.id, id))
      .returning();

    if (!archived) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    await db.insert(auditLogs).values({
      adminId: adminUser.id,
      action: "CHALLENGE_ARCHIVED",
      resource: "challenge",
      resourceId: id,
      metadata: { slug: archived.slug, title: archived.title },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: `Challenge ${archived.title} archived.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
