"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  LayoutDashboard,
  Code,
  Layers,
  Cpu,
  Users,
  FileText,
  Shield,
  ArrowLeft,
  UserCheck,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    username?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const adminNav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/challenges", label: "Challenges", icon: Code },
    { href: "/admin/submissions", label: "Submissions", icon: Layers },
    { href: "/admin/benchmarks", label: "Benchmarks", icon: Cpu },
    { href: "/admin/whitelist", label: "Wishlist", icon: UserCheck },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/audit", label: "Audit Log", icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#141416] text-neutral-300 flex flex-col justify-between shrink-0 relative select-none">
      <div className="p-4 space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <Link href="/admin" className="hover:opacity-90 transition-opacity">
            <Logo size={26} textColor="text-white" />
          </Link>
          <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Shield className="w-3 h-3 text-purple-400" />
            <span>ROOT</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Management
          </div>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white/10 text-white font-bold border-l-2 border-[#099BE9] shadow-inner"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#099BE9]" : "text-neutral-500 group-hover:text-neutral-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#099BE9]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile Card */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#111113]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#099BE9] to-[#09C899] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            {(user.name?.[0] || user.username?.[0] || "A").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-white truncate">
              {user.name || user.username || "Administrator"}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CONTROL PLANE</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white flex items-center gap-1.5 text-[11px] font-medium transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Public Site</span>
          </Link>
          <SignOutButton
            showLabel
            label="Exit"
            variant="ghost"
            size="sm"
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-6 px-2 font-medium"
          />
        </div>
      </div>
    </aside>
  );
}
