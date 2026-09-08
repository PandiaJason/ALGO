"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

interface InvalidationClientProps {
  submissionId: string;
  initialIsInvalidated: boolean;
  invalidationReason?: string | null;
}

export function InvalidationClient({
  submissionId,
  initialIsInvalidated,
  invalidationReason,
}: InvalidationClientProps) {
  const router = useRouter();
  const [isInvalidated, setIsInvalidated] = useState(initialIsInvalidated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    const confirmMessage = isInvalidated
      ? "Are you sure you want to RESTORE the validity of this submission and re-include it on the leaderboard?"
      : "Are you sure you want to INVALIDATE this submission? Its score will be purged from the leaderboard and marked as fraudulent/disqualified.";

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}/invalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: isInvalidated ? "Admin restored validity" : "Disqualified by platform admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update invalidation status");
      }

      setIsInvalidated(data.isInvalidated);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded border border-red-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isInvalidated ? (
        <Button
          onClick={handleToggle}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-[#09C899]/30 text-[#0AA793] hover:bg-[#09C899]/10 text-xs font-semibold gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-[#09C899]" />
          )}
          <span>Restore Benchmark Validity</span>
        </Button>
      ) : (
        <Button
          onClick={handleToggle}
          disabled={loading}
          variant="danger"
          size="sm"
          className="text-xs font-semibold gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          <span>Disqualify / Invalidate Score</span>
        </Button>
      )}
    </div>
  );
}
