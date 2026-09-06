import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { enqueueQuickTest } from "@/lib/queue/producer";
import { runQuickTest } from "@/lib/sandbox/runner";
import { z } from "zod";

const testSchema = z.object({
  language: z.enum(["python", "cpp"]),
  level: z.number().int().min(1).max(6).default(1),
  code: z.string().min(1),
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

    const { id } = await params;
    let challengeSlug = id;
    try {
      const found = await db
        .select({ slug: challenges.slug })
        .from(challenges)
        .where(eq(challenges.id, id))
        .limit(1);
      if (found[0]?.slug) {
        challengeSlug = found[0].slug;
      }
    } catch {}

    const body = await req.json();
    const parsed = testSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { language, level, code } = parsed.data;

    // 1. Attempt delegated execution via BullMQ queue (Vercel-compatible)
    let result: any = null;
    let queueError: any = null;

    try {
      result = await enqueueQuickTest({ language, level, code, challengeSlug }, 25000);
    } catch (err: any) {
      console.error("[QuickTest Queue Error]:", err);
      queueError = err;
    }

    // 2. Fallback: only if running locally on dev machine with Docker
    if (!result) {
      if (!process.env.VERCEL) {
        try {
          result = await runQuickTest(language, code, level, challengeSlug);
        } catch (directErr: any) {
          throw new Error(
            queueError?.message ||
              directErr?.message ||
              "Evaluator worker is currently unavailable."
          );
        }
      } else {
        throw new Error(
          queueError?.message ||
            "Evaluator worker is currently busy. Please verify the worker daemon is active."
        );
      }
    }

    return NextResponse.json({
      passed: result.passed,
      total: result.total,
      details: result.details,
      output: result.output,
      cases: result.cases,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
