import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const found = await db
      .select({
        id: submissions.id,
        userId: submissions.userId,
        status: submissions.status,
        submittedAt: submissions.submittedAt,
        startedAt: submissions.startedAt,
        completedAt: submissions.completedAt,
      })
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    const submission = found[0];
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    if (submission.userId !== session.user.id && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: submission.id,
      status: submission.status,
      submittedAt: submission.submittedAt,
      startedAt: submission.startedAt,
      completedAt: submission.completedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
