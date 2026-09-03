import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
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

    // Run test harness
    const result = await runQuickTest(language, code, level);

    return NextResponse.json({
      passed: result.passed,
      total: result.total,
      details: result.details,
      output: result.output,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
