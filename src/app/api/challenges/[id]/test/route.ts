import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
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
      result = await enqueueQuickTest({ language, level, code }, 25000);
    } catch (err: any) {
      queueError = err;
    }

    // 2. Fallback: direct runner if running locally with Docker available
    if (!result) {
      try {
        result = await runQuickTest(language, code, level);
      } catch (directErr: any) {
        throw new Error(
          queueError?.message ||
            directErr?.message ||
            "Evaluator worker is currently unavailable."
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
