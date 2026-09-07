"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, User, LogOut, Code, Trophy, Sparkles, Settings } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface NavbarProps {
  user?: {
    id: string;
    username: string;
    email: string | null;
    role: "STUDENT" | "ADMIN";
    name: string | null;
  } | null;
  variant?: "default" | "dark";
}

export function Navbar({ user, variant = "default" }: NavbarProps) {
  const pathname = usePathname();
  const isDark = variant === "dark";

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Sparkles },
    { href: "/challenges", label: "Challenges", icon: Code },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors ${
        isDark
          ? "border-b border-neutral-800 bg-[#262626] text-white"
          : "border-b border-slate-200/80 bg-white/90 backdrop-blur-md text-slate-900"
      }`}
    >
      {/* Signature 4-Color Brand Accent Bar */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#099BE9] via-[#09C899] via-[#8647E2] to-[#F78424]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo size={28} textColor={isDark ? "text-white" : "text-slate-900"} />
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isDark
                      ? isActive
                        ? "text-white bg-white/10 font-semibold"
                        : "text-neutral-300 hover:text-white hover:bg-white/5"
                      : isActive
                      ? "text-slate-900 bg-slate-100 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>


        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={`/profile/${user.username}`}
                className={`text-xs font-medium flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                  isDark
                    ? "text-neutral-200 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#099BE9] to-[#09C899] flex items-center justify-center text-white text-[11px] font-semibold">
                  {user.username.slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden sm:inline">@{user.username}</span>
              </Link>
              <Link
                href="/settings"
                title="ID & Account Settings"
                className={`p-1.5 rounded-md transition-colors ${
                  isDark
                    ? "text-neutral-400 hover:text-white hover:bg-white/10"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
              </Link>
              <SignOutButton
                className={`h-8 px-2 ${
                  isDark
                    ? "text-neutral-400 hover:text-white hover:bg-white/10"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs font-medium ${
                    isDark
                      ? "text-neutral-300 hover:text-white hover:bg-white/10"
                      : "text-slate-700"
                  }`}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="sm"
                  className={`text-xs font-medium gap-1.5 ${
                    isDark
                      ? "bg-[#09C899] hover:bg-[#0AA793] text-white shadow-xs"
                      : "bg-[#099BE9] hover:bg-[#1984E9] text-white shadow-xs"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
