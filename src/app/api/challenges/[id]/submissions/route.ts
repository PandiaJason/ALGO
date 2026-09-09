import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, submissionFiles, challenges, challengeVersions, events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { enqueueSubmission } from "@/lib/queue/producer";
import { z } from "zod";

const submissionSchema = z.object({
  challengeVersionId: z.string().optional(),
  language: z.enum(["python", "cpp", "rust", "go", "java"]),
  level: z.number().int().min(1).max(6).default(1),
  files: z.array(
    z.object({
      filename: z.string(),
      content: z.string().min(1),
    })
  ).min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: challengeIdOrSlug } = await params;

    // Safe challenge lookup: check if parameter is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(challengeIdOrSlug);
    let challenge = null;

    if (isUuid) {
      const found = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, challengeIdOrSlug))
        .limit(1);
      challenge = found[0];
    }

    if (!challenge) {
      const found = await db
        .select()
        .from(challenges)
        .where(eq(challenges.slug, challengeIdOrSlug))
        .limit(1);
      challenge = found[0];
    }

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { challengeVersionId, language, level, files } = parsed.data;

    // Auto-resolve version UUID if not valid UUID (e.g. "v1" or missing)
    let finalVersionId = challengeVersionId;
    const isVerUuid =
      finalVersionId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(finalVersionId);

    if (!isVerUuid) {
      const latestVer = await db
        .select({ id: challengeVersions.id })
        .from(challengeVersions)
        .where(eq(challengeVersions.challengeId, challenge.id))
        .orderBy(desc(challengeVersions.version))
        .limit(1);

      if (!latestVer[0]) {
        return NextResponse.json({ error: "No active challenge version found" }, { status: 404 });
      }
      finalVersionId = latestVer[0].id;
    }

    // 1. Create submission record in PostgreSQL
    const [submission] = await db
      .insert(submissions)
      .values({
        userId: session.user.id!,
        challengeId: challenge.id,
        challengeVersionId: finalVersionId!,
        language,
        level,
        status: "QUEUED",
      })
      .returning();

    // 2. Persist submission files
    for (const file of files) {
      await db.insert(submissionFiles).values({
        submissionId: submission.id,
        filename: file.filename,
        content: file.content,
      });
    }

    // 3. Track analytics event
    await db.insert(events).values({
      userId: session.user.id!,
      eventType: "submission_created",
      challengeId: challenge.id,
      submissionId: submission.id,
      metadata: { language, level },
    });

    // 4. Enqueue evaluation job to BullMQ
    try {
      await enqueueSubmission({
        submissionId: submission.id,
        challengeId: challenge.id,
        challengeSlug: challenge.slug,
        challengeVersionId: finalVersionId!,
        userId: session.user.id!,
        language,
        level,
        files,
      });
    } catch (queueErr) {
      console.error("Queue enqueue error:", queueErr);
      // Fallback: If Redis is unavailable or in development, record error
    }

    return NextResponse.json(
      {
        message: "Submission queued for evaluation",
        submissionId: submission.id,
        status: "QUEUED",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: "Internal submission error", message: err.message },
      { status: 500 }
    );
  }
}
