"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  AtSign,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SettingsProfileFormProps {
  initialUsername: string;
  initialName?: string;
  email?: string | null;
}

export function SettingsProfileForm({
  initialUsername,
  initialName = "",
  email = "",
}: SettingsProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();

  const [username, setUsername] = useState(initialUsername);
  const [name, setName] = useState(initialName);

  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    checked: boolean;
    available: boolean;
    reason?: string;
    isCurrent?: boolean;
  }>({
    checked: false,
    available: true,
    isCurrent: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Debounced check for username availability
  useEffect(() => {
    const trimmed = username.trim().toLowerCase();

    if (trimmed === initialUsername.toLowerCase()) {
      setAvailability({
        checked: true,
        available: true,
        isCurrent: true,
        reason: "Your current ID",
      });
      setErrorMessage(null);
      return;
    }

    if (trimmed.length < 3) {
      setAvailability({
        checked: true,
        available: false,
        reason: "Must be at least 3 characters",
      });
      return;
    }

    if (trimmed.length > 30) {
      setAvailability({
        checked: true,
        available: false,
        reason: "Maximum 30 characters",
      });
      return;
    }

    if (!/^[a-z0-9_]+$/.test(trimmed)) {
      setAvailability({
        checked: true,
        available: false,
        reason: "Letters, numbers, and underscores only",
      });
      return;
    }

    setIsChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setAvailability({
          checked: true,
          available: !!data.available,
          reason: data.reason,
          isCurrent: !!data.isCurrent,
        });
      } catch (err) {
        setAvailability({
          checked: true,
          available: false,
          reason: "Unable to verify availability",
        });
      } finally {
        setIsChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, initialUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanUsername) {
      setErrorMessage("Please enter an ID / username.");
      return;
    }

    if (!availability.available && !availability.isCurrent) {
      setErrorMessage(availability.reason || "Username is not available.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          name: cleanName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update profile.");
        setIsSaving(false);
        return;
      }

      setSuccessMessage(`ID successfully updated to @${cleanUsername}!`);

      if (updateSession) {
        await updateSession({
          username: cleanUsername,
          name: cleanName,
        });
      }

      setTimeout(() => {
        router.push(`/u/${cleanUsername}`);
        router.refresh();
      }, 1000);
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    username.trim().toLowerCase() !== initialUsername.toLowerCase() ||
    name.trim() !== (initialName || "").trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* Systems ID Handle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1.5">
            <AtSign className="w-3.5 h-3.5 text-[#099BE9]" />
            <span>Systems ID (Username Handle)</span>
            <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            3–30 chars (letters, numbers, underscores)
          </span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
            @
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder="handle"
            maxLength={30}
            disabled={isSaving}
            required
            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 font-mono text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#099BE9]/30 focus:border-[#099BE9] transition-all bg-white"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {isChecking ? (
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            ) : availability.checked && !availability.isCurrent ? (
              availability.available ? (
                <CheckCircle2 className="w-4 h-4 text-[#0AA793]" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500" />
              )
            ) : null}
          </div>
        </div>

        {/* Live validation / availability helper */}
        <div className="text-xs font-mono flex items-center justify-between pt-0.5">
          {isChecking ? (
            <span className="text-slate-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Checking availability across cluster...
            </span>
          ) : availability.checked ? (
            <span
              className={
                availability.available
                  ? "text-[#0AA793] font-medium flex items-center gap-1"
                  : "text-rose-600 font-medium flex items-center gap-1"
              }
            >
              {availability.available ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{availability.reason || "Available!"}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{availability.reason || "Already taken by another engineer"}</span>
                </>
              )}
            </span>
          ) : (
            <span className="text-slate-400">
              Only alphanumeric characters and underscores allowed.
            </span>
          )}
          <span className="text-slate-400 text-[10px]">
            Public URL: /u/{username || "handle"}
          </span>
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>Full Display Name</span>
          <span className="text-slate-400 font-normal text-xs">(Optional)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jason Pandian"
          maxLength={100}
          disabled={isSaving}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#099BE9]/30 focus:border-[#099BE9] transition-all bg-white"
        />
        <p className="text-xs text-slate-500">
          Your full name as displayed on your engineering submissions and certificate records.
        </p>
      </div>

      {/* Linked Email (Read-only) */}
      {email && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-900 font-mono">
            Authenticated Account Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 bg-slate-50 cursor-not-allowed font-mono"
          />
          <p className="text-xs text-slate-400">
            Managed via your OAuth provider. Used for platform access authorization.
          </p>
        </div>
      )}

      {/* Non-Conflicting Systems Guarantee Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
        <div className="font-bold text-slate-800 flex items-center gap-1.5 font-mono text-[11px] uppercase">
          <ShieldCheck className="w-4 h-4 text-[#099BE9]" />
          <span>Case-Insensitive Uniqueness Guarantee</span>
        </div>
        <p className="leading-relaxed">
          User IDs are strictly isolated. No two engineers can share or shadow the same handle (even across different letter casing). All your code submissions, leaderboard benchmarks, and verification records will instantly update to your new handle.
        </p>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isSaving || isChecking || !hasChanges || (!availability.available && !availability.isCurrent)}
          className="h-10 px-6 text-xs font-bold bg-[#099BE9] hover:bg-[#1984E9] text-white gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Identity...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save & Update ID</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
