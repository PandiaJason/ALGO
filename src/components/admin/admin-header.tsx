"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink, Activity, Database, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  const getSectionName = () => {
    if (pathname === "/admin") return "Overview";
    if (pathname.startsWith("/admin/challenges")) return "Challenges";
    if (pathname.startsWith("/admin/submissions")) return "Submissions";
    if (pathname.startsWith("/admin/benchmarks")) return "Benchmarks";
    if (pathname.startsWith("/admin/whitelist")) return "Wishlist";
    if (pathname.startsWith("/admin/users")) return "Users";
    if (pathname.startsWith("/admin/audit")) return "Audit Log";
    return "Control Plane";
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 font-medium">Control Plane</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-900 font-bold">{getSectionName()}</span>
      </div>

      {/* System Status Telemetry Badges */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          {/* Worker Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WORKER: ACTIVE</span>
          </div>

          {/* DB Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#099BE9]/10 border border-[#099BE9]/25 text-[#099BE9] text-[11px] font-mono font-semibold">
            <Database className="w-3 h-3" />
            <span>DB: READY</span>
          </div>

          {/* Sandbox Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold">
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            <span>CONTAINERS: ISOLATED</span>
          </div>
        </div>

        <Link
          href="/challenges"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <span>Live Arena</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
