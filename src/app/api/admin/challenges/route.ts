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
import { eq, desc } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const createChallengeSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(128).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric and hyphens"),
  tagline: z.string().max(255).optional(),
  description: z.string().min(10),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  supportedLanguages: z.array(z.string()).default(["python", "cpp"]),
  spec: z.object({
    overview: z.string(),
    whatYouLearn: z.array(z.string()).default([]),
    apiSpecification: z.array(z.object({
      command: z.string(),
      returns: z.string(),
      description: z.string(),
    })).default([]),
  }),
  levels: z.array(z.object({
    level: z.number().int().min(1),
    title: z.string(),
    description: z.string(),
    requirements: z.string().optional(),
  })).default([]),
  starterTemplates: z.object({
    python: z.string().min(1),
    cpp: z.string().min(1),
  }),
  testDefinitions: z.array(z.object({
    name: z.string(),
    input: z.string(),
    expected: z.string(),
  })).default([]),
  benchmarkConfig: z.object({
    cpuLimit: z.string().default("1.00"),
    memoryLimitMb: z.number().int().default(256),
    timeoutSeconds: z.number().int().default(60),
    iterations: z.number().int().default(5),
    warmupIterations: z.number().int().default(2),
    baselineThroughput: z.number().default(50000),
  }).default({
    cpuLimit: "1.00",
    memoryLimitMb: 256,
    timeoutSeconds: 60,
    iterations: 5,
    warmupIterations: 2,
    baselineThroughput: 50000,
  }),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const allChallenges = await db
      .select()
      .from(challenges)
      .orderBy(desc(challenges.createdAt));

    return NextResponse.json({ challenges: allChallenges });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session?.user || userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [adminUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 403 });
    }
    const adminId = adminUser.id;

    const body = await req.json();
    const parsed = createChallengeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Check slug uniqueness
    const [existing] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, data.slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: `Challenge with slug '${data.slug}' already exists` },
        { status: 409 }
      );
    }

    // 2. Insert challenge
    const [challenge] = await db
      .insert(challenges)
      .values({
        slug: data.slug,
        title: data.title,
        tagline: data.tagline || null,
        description: data.description,
        difficulty: data.difficulty,
        status: data.status,
        supportedLanguages: data.supportedLanguages,
        currentVersionNumber: 1,
      })
      .returning();

    // 3. Insert challenge version 1
    const [version] = await db
      .insert(challengeVersions)
      .values({
        challengeId: challenge.id,
        version: 1,
        spec: data.spec,
        levels: data.levels,
        starterTemplates: data.starterTemplates,
        testDefinitions: data.testDefinitions,
        createdBy: adminId,
      })
      .returning();

    // 4. Insert starter template files for Python and C++
    await db.insert(challengeFiles).values([
      {
        challengeVersionId: version.id,
        filename: "solution.py",
        language: "python",
        content: data.starterTemplates.python,
        isReadonly: false,
        isHidden: false,
      },
      {
        challengeVersionId: version.id,
        filename: "solution.cpp",
        language: "cpp",
        content: data.starterTemplates.cpp,
        isReadonly: false,
        isHidden: false,
      },
    ]);

    // 5. Insert benchmark config
    const [benchConfig] = await db
      .insert(benchmarkConfigs)
      .values({
        challengeVersionId: version.id,
        version: 1,
        workloads: {
          benchmarkName: `${challenge.slug}-throughput-eval`,
          operations: 100000,
        },
        iterations: data.benchmarkConfig.iterations,
        warmupIterations: data.benchmarkConfig.warmupIterations,
        timeoutSeconds: data.benchmarkConfig.timeoutSeconds,
        cpuLimit: data.benchmarkConfig.cpuLimit,
        memoryLimitMb: data.benchmarkConfig.memoryLimitMb,
        baselineMetrics: {
          throughputOpsSec: data.benchmarkConfig.baselineThroughput,
          p99LatencyMs: 0.15,
        },
        isActive: true,
      })
      .returning();

    // 6. Record audit log
    await db.insert(auditLogs).values({
      adminId,
      action: "CHALLENGE_CREATED",
      resource: "challenge",
      resourceId: challenge.id,
      metadata: {
        slug: challenge.slug,
        title: challenge.title,
        status: challenge.status,
        difficulty: challenge.difficulty,
      },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      challenge,
      version,
      benchmarkConfig: benchConfig,
    });
  } catch (err: any) {
    console.error("[Create Challenge Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
