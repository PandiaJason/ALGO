"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Shield, ArrowRight, AlertCircle } from "lucide-react";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading ALGO Auth...</div>}>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/challenges";
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    setError(null);
    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid email, username, or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(null);
    }
  };

  const handleDevQuickLogin = async (role: "student" | "admin") => {
    setLoading(role);
    setError(null);
    const id = role === "admin" ? "admin@algo.local" : "student@algo.local";
    const pw = role === "admin" ? "Admin123!algo" : "Student123!algo";
    const target = role === "admin" ? "/admin" : callbackUrl;

    const res = await signIn("credentials", {
      identifier: id,
      password: pw,
      redirect: false,
      callbackUrl: target,
    });

    if (res?.error) {
      setError("Quick login failed. Ensure database has been seeded.");
    } else {
      router.push(target);
      router.refresh();
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size={40} showText={false} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to ALGO
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to start building, measuring, and optimizing real systems.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">
              Authentication
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* OAuth Options */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full text-xs font-medium gap-2"
                onClick={() => signIn("github", { callbackUrl })}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs font-medium gap-2"
                onClick={() => signIn("google", { callbackUrl })}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Google
              </Button>
            </div>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[11px] uppercase tracking-wider text-slate-400 font-medium absolute">
                or sign in with password
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleCredentialsLogin} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="student@algo.local"
                  className="w-full h-9 px-3 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full text-xs font-medium"
                disabled={loading === "credentials"}
              >
                {loading === "credentials" ? "Verifying..." : "Sign In"}
              </Button>
            </form>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium mb-2 uppercase tracking-wider">
                Instant Dev Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="subtle"
                  size="sm"
                  className="w-full text-xs gap-1 justify-center text-slate-700 hover:text-slate-900"
                  onClick={() => handleDevQuickLogin("student")}
                  disabled={!!loading}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Student Demo
                </Button>
                <Button
                  type="button"
                  variant="subtle"
                  size="sm"
                  className="w-full text-xs gap-1 justify-center text-slate-700 hover:text-slate-900"
                  onClick={() => handleDevQuickLogin("admin")}
                  disabled={!!loading}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  Admin Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-400">
          ALGO does not store plaintext credentials. Protected by scrypt hashing & Auth.js JWT sessions.
        </p>
      </div>
    </div>
  );
}
