"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { AlgoLogoIcon } from "@/components/layout/algo-logo-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          Loading ALGO Auth...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/challenges";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setError("Unable to connect to Google authentication service.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#fafafa]">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <AlgoLogoIcon size={56} />
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-wider text-slate-900">
            ALGO
          </h1>
          <div className="text-xs font-mono font-bold tracking-widest text-slate-800 uppercase">
            GO CURIOUS.
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Where the next generation of engineers learn by building real technology, measuring what they create, and pushing it further through an agentic flow state.
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-slate-200/90 shadow-sm bg-white overflow-hidden relative">
          {/* Signature 4-Color Brand Accent Bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#099BE9] via-[#09C899] via-[#8647E2] to-[#F78424]" />
          <CardContent className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all shadow-2xs hover:shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{loading ? "Redirecting to Google..." : "Continue with Google"}</span>
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400 leading-tight">
              By continuing, you agree to ALGO's{" "}
              <span className="text-slate-600 underline cursor-pointer">Terms</span> and{" "}
              <span className="text-slate-600 underline cursor-pointer">Privacy Policy</span>.
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
