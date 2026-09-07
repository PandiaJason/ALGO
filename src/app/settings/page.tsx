import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SettingsProfileForm } from "@/components/profile/settings-profile-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  User,
  Shield,
  Calendar,
  AtSign,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  let dbUser: any = null;
  try {
    if (session.user.id) {
      const [u] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
      dbUser = u;
    }
    if (!dbUser && session.user.email) {
      const [u] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email.toLowerCase().trim()))
        .limit(1);
      dbUser = u;
    }
  } catch (err) {
    console.warn("User lookup in settings page error:", err);
  }

  const username = dbUser?.username || (session.user as any).username || "engineer";
  const name = dbUser?.name || session.user.name || "";
  const email = dbUser?.email || session.user.email || "";
  const role = dbUser?.role || (session.user as any).role || "STUDENT";
  const createdAt = dbUser?.createdAt ? new Date(dbUser.createdAt) : new Date();

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] font-sans">
      <Navbar user={session?.user as any} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb Header */}
        <div className="space-y-1.5 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-semibold">Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Account & Identity Settings
          </h1>
          <p className="text-xs text-slate-600">
            Manage your unique systems handle, display profile, and platform preferences.
          </p>
        </div>

        {/* Identity & Handle Card */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#099BE9] via-[#09C899] to-[#8647E2] flex items-center justify-center text-white text-xl font-bold shadow-xs shrink-0">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  @{username}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#099BE9]/10 text-[#099BE9] border border-[#099BE9]/30">
                  {role}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {name || "Systems Engineer"}
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <SettingsProfileForm
            initialUsername={username}
            initialName={name}
            email={email}
          />
        </div>

        {/* Platform Metadata & Actions */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900">
              Session Management
            </div>
            <div className="text-xs text-slate-500">
              Member since {createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/profile/${username}`}>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                View Public Profile
              </button>
            </Link>
            <SignOutButton
              showLabel
              label="Sign Out of ALGO"
              variant="subtle"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
