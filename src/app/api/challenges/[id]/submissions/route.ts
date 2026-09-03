import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions, submissionFiles, challenges, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { enqueueSubmission } from "@/lib/queue/producer";
import { z } from "zod";

const submissionSchema = z.object({
  challengeVersionId: z.string().uuid(),
  language: z.enum(["python", "cpp"]),
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

    // Find challenge
    const foundChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeIdOrSlug))
      .limit(1);

    const challenge = foundChallenges[0] || (
      await db.select().from(challenges).where(eq(challenges.slug, challengeIdOrSlug)).limit(1)
    )[0];

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

    // 1. Create submission record in PostgreSQL
    const [submission] = await db
      .insert(submissions)
      .values({
        userId: session.user.id,
        challengeId: challenge.id,
        challengeVersionId,
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
      userId: session.user.id,
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
        challengeVersionId,
        userId: session.user.id,
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
