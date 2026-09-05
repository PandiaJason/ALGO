"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlgoLogoIcon } from "@/components/layout/algo-logo-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const isAccessDenied = searchParams.get("error") === "AccessDenied";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    isAccessDenied
      ? "Access Denied: Administrative access is restricted exclusively to Jason Pandian (pandiajason@gmail.com)."
      : null
  );

  const handleGoogleAdminLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/admin" });
    } catch {
      setError("Unable to initiate administrator login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-900 text-slate-100">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AlgoLogoIcon size={52} />
          </div>
          <div className="flex items-center justify-center gap-1 font-black text-2xl tracking-wider">
            <span className="text-[#099BE9]">A</span>
            <span className="text-[#09C899]">L</span>
            <span className="text-[#8647E2]">G</span>
            <span className="text-[#F78424]">O</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>CONTROL PLANE</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Administrative Access
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Restricted exclusively to platform owner <span className="text-purple-300 font-semibold font-mono">Jason Pandian (pandiajason@gmail.com)</span>.
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-800 bg-slate-800/80 backdrop-blur-md shadow-xl overflow-hidden relative">
          {/* Signature 4-Color Brand Accent Bar */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#099BE9] via-[#09C899] via-[#8647E2] to-[#F78424]" />
          <CardContent className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGoogleAdminLogin}
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-3 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
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
              <span>{loading ? "Verifying Credentials..." : "Continue with Google"}</span>
            </button>

            <div className="text-center text-[11px] text-slate-500">
              Only <code className="text-purple-400">pandiajason@gmail.com</code> is authorized to access the control plane.
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
