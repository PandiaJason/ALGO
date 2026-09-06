"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface SignOutButtonProps {
  className?: string;
  variant?: "ghost" | "default" | "secondary" | "outline" | "danger" | "subtle";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  label?: string;
  iconClassName?: string;
}

export function SignOutButton({
  className = "",
  variant = "ghost",
  size = "sm",
  showLabel = false,
  label = "Sign Out",
  iconClassName = "w-3.5 h-3.5",
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClientSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Execute Auth.js v5 client-side signout with CSRF handling & redirect
      await signOut({ callbackUrl: "/", redirectTo: "/" });
    } catch (err) {
      console.warn("Client signOut failed, executing server action fallback:", err);
      // Fallback directly to server action
      await signOutAction();
    }
  };

  return (
    <form action={signOutAction} onSubmit={handleClientSignOut} className="inline-block">
      <Button
        type="submit"
        variant={variant}
        size={size}
        disabled={loading}
        title={label}
        className={className}
      >
        {loading ? (
          <Loader2 className={`${iconClassName} animate-spin`} />
        ) : (
          <LogOut className={iconClassName} />
        )}
        {showLabel && <span className="ml-1.5">{loading ? "Signing out..." : label}</span>}
      </Button>
    </form>
  );
}
