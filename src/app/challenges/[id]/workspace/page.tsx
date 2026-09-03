import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { challenges, challengeVersions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { WorkspaceClient } from "./workspace-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const foundChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, id))
    .limit(1);

  const challenge = foundChallenges[0];
  if (!challenge) {
    notFound();
  }

  const versions = await db
    .select()
    .from(challengeVersions)
    .where(eq(challengeVersions.challengeId, challenge.id))
    .orderBy(desc(challengeVersions.version))
    .limit(1);

  const version = versions[0];
  if (!version) {
    notFound();
  }

  return (
    <WorkspaceClient
      challenge={{
        id: challenge.id,
        slug: challenge.slug,
        title: challenge.title,
      }}
      version={{
        id: version.id,
        starterTemplates: version.starterTemplates as any,
        levels: (version.levels as any[]) || [],
      }}
      user={session?.user as any}
    />
  );
}
