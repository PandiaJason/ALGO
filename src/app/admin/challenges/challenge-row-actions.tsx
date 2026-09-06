"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Archive, CheckCircle2, Loader2, Pencil } from "lucide-react";

interface ChallengeRowActionsProps {
  id: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export function ChallengeRowActions({ id, slug, status: initialStatus }: ChallengeRowActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async (newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/challenges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 font-sans">
      <Link
        href={`/admin/challenges/${id}/edit`}
        className="text-xs text-slate-700 hover:text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
        title="Edit Challenge"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </Link>

      <Link
        href={`/challenges/${slug}`}
        target="_blank"
        className="text-xs text-[#2d7cf6] hover:underline font-medium inline-flex items-center gap-1"
      >
        <Eye className="w-3.5 h-3.5" />
        View Live
      </Link>

      {status === "PUBLISHED" ? (
        <button
          onClick={() => toggleStatus("DRAFT")}
          disabled={loading}
          className="text-xs text-amber-600 hover:text-amber-700 hover:underline font-medium inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
          title="Unpublish to Draft"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />}
          Unpublish
        </button>
      ) : (
        <button
          onClick={() => toggleStatus("PUBLISHED")}
          disabled={loading}
          className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
          title="Publish Challenge"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Publish
        </button>
      )}

      {status !== "ARCHIVED" && (
        <button
          onClick={() => {
            if (confirm("Are you sure you want to archive this challenge?")) {
              toggleStatus("ARCHIVED");
            }
          }}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-red-600 hover:underline font-medium inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
          title="Archive Challenge"
        >
          <Archive className="w-3.5 h-3.5" />
          Archive
        </button>
      )}
    </div>
  );
}
