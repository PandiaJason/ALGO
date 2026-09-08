import React from "react";
import { ChallengeCreatorForm } from "./challenge-creator-form";

export const dynamic = "force-dynamic";

export default function NewChallengePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <ChallengeCreatorForm />
    </div>
  );
}
