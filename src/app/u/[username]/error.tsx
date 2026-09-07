"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900">
            Engineer Profile Unavailable
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn&apos;t load this profile. The handle may not exist or is temporarily undergoing maintenance.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link href="/">
            <Button size="sm" variant="primary" className="text-xs gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>Back to ALGO</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
