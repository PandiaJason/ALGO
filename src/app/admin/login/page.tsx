"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (res?.error) {
        setError("Invalid administrative credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      identifier: "admin@algo.local",
      password: "Admin123!algo",
      redirect: false,
      callbackUrl: "/admin",
    });
    if (res?.error) {
      setError("Quick admin login failed.");
    } else {
      router.push("/admin");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            ALGO Control Plane
          </h1>
          <p className="text-xs text-slate-400">
            Administrative portal. Privileged server authorization required.
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-850 text-slate-100 shadow-xl">
          <CardHeader className="space-y-1 pb-4 border-b border-slate-800">
            <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Authentication</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Access is gated by database role <code className="text-purple-300">ADMIN</code>.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {error && (
              <div className="p-3 rounded bg-red-950/80 border border-red-800/60 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Administrator Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@algo.local"
                  className="w-full h-9 px-3 text-xs rounded-md border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 text-xs rounded-md border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white gap-2"
                disabled={loading}
              >
                <span>{loading ? "Authenticating..." : "Authorize Admin Session"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>

            <div className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white justify-center"
                onClick={handleQuickAdminLogin}
                disabled={loading}
              >
                <span>One-Click Dev Admin Login</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-500">
          All administrative operations are logged to <code className="text-slate-400">audit_logs</code> with client IP and metadata.
        </p>
      </div>
    </div>
  );
}
