"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  AtSign,
  User,
  ShieldCheck,
  X,
} from "lucide-react";

interface EditProfileModalProps {
  initialUsername: string;
  initialName?: string;
  triggerButton?: React.ReactNode;
}

export function EditProfileModal({
  initialUsername,
  initialName = "",
  triggerButton,
}: EditProfileModalProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();

  const [isOpen, setIsOpen] = useState(false);
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

  // Sync state if initial props change
  useEffect(() => {
    setUsername(initialUsername);
    setName(initialName);
  }, [initialUsername, initialName]);

  // Debounced check for username availability
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = username.trim().toLowerCase();

    // If matches initial username, it's valid & available
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

    // Basic format check before sending network request
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
  }, [username, initialUsername, isOpen]);

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

      setSuccessMessage(`ID updated to @${cleanUsername}!`);

      // Update client session token
      if (updateSession) {
        await updateSession({
          username: cleanUsername,
          name: cleanName,
        });
      }

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage(null);
        // Navigate to new profile URL
        router.push(`/profile/${cleanUsername}`);
        router.refresh();
      }, 800);
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {triggerButton}
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
        >
          <Pencil className="w-3.5 h-3.5 text-[#099BE9]" />
          <span>Edit ID & Name</span>
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#099BE9]/10 border border-[#099BE9]/30 flex items-center justify-center text-[#099BE9]">
                  <AtSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Edit Your Systems ID
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Your unique handle across ALGO leaderboards & profiles
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setUsername(initialUsername);
                  setName(initialName);
                }}
                className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{successMessage}</span>
                </div>
              )}

              {/* Unique Handle Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 font-mono flex items-center gap-1">
                    <span>Systems ID Handle</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    3–30 chars
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-sm">
                    @
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="your_handle"
                    maxLength={30}
                    disabled={isSaving}
                    required
                    className="w-full pl-8 pr-10 py-2 rounded-lg border border-slate-200 font-mono text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#099BE9]/30 focus:border-[#099BE9] transition-all bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
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

                {/* Availability status text */}
                <div className="text-[11px] font-mono flex items-center justify-between">
                  {isChecking ? (
                    <span className="text-slate-400">Checking availability...</span>
                  ) : availability.checked ? (
                    <span
                      className={
                        availability.available
                          ? "text-[#0AA793] font-medium"
                          : "text-rose-600 font-medium"
                      }
                    >
                      {availability.available
                        ? `✓ ${availability.reason || "Available"}`
                        : `✗ ${availability.reason || "Not available"}`}
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Allowed: letters, numbers, underscores
                    </span>
                  )}
                </div>
              </div>

              {/* Display Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 font-mono flex items-center gap-1">
                  <span>Display Name</span>
                  <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jason Pandian"
                    maxLength={100}
                    disabled={isSaving}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#099BE9]/30 focus:border-[#099BE9] transition-all bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Visible alongside your ID on your profile and project submissions.
                </p>
              </div>

              {/* Collision Guard Notice */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1.5 font-mono text-[10px] uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#099BE9]" />
                  <span>Conflict-Free Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Your ID is case-insensitively unique across the entire ALGO cluster. Once updated, your old handle is released and your leaderboard ranks immediately reflect your new identity.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => {
                    setIsOpen(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setUsername(initialUsername);
                    setName(initialName);
                  }}
                  className="text-xs border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving || isChecking || (!availability.available && !availability.isCurrent)}
                  className="text-xs font-semibold bg-[#099BE9] hover:bg-[#1984E9] text-white gap-1.5 shadow-xs"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
