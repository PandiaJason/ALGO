"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, User, LogOut, Code, Trophy, Sparkles } from "lucide-react";

interface NavbarProps {
  user?: {
    id: string;
    username: string;
    email: string | null;
    role: "STUDENT" | "ADMIN";
    name: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/challenges", label: "Challenges", icon: Code },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo size={32} />
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
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
            <div className="flex items-center gap-3">
              {user.role === "ADMIN" && (
                <Link href="/admin">
                  <Badge variant="purple" className="gap-1 hover:bg-purple-100 cursor-pointer">
                    <Shield className="w-3 h-3 text-purple-700" />
                    <span>Admin</span>
                  </Badge>
                </Link>
              )}
              <Link
                href={`/profile/${user.username}`}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-50"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2d7cf6] to-[#2dbfa8] flex items-center justify-center text-white text-[11px] font-semibold">
                  {user.username.slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden sm:inline">@{user.username}</span>
              </Link>
              <form action="/api/auth/signout" method="POST">
                <Button variant="ghost" size="sm" type="submit" className="h-8 px-2 text-slate-500 hover:text-slate-800">
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-xs font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="primary" size="sm" className="text-xs font-medium gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Explore
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
