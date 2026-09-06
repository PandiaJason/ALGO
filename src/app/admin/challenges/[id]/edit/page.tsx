import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  challenges,
  challengeVersions,
  challengeFiles,
  benchmarkConfigs,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { ChallengeEditorForm } from "./challenge-editor-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditChallengePage({ params }: Props) {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (userEmail !== ADMIN_EMAIL) {
    redirect("/admin/login?error=AccessDenied");
  }

  const { id } = await params;

  const [challenge] = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, id))
    .limit(1);

  if (!challenge) {
    notFound();
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

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <ChallengeEditorForm
        initialChallenge={challenge}
        initialVersion={activeVersion || null}
        initialFiles={files}
        initialBenchmarkConfig={benchConfig}
      />
    </div>
  );
}
