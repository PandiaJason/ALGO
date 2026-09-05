import React from "react";
import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/70 bg-white py-5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <Logo size={22} showText={true} />
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 font-normal">
            Where the next generation of engineers learn.
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs text-slate-500">
          <Link
            href="/challenges"
            className="hover:text-slate-900 transition-colors"
          >
            Problems
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-slate-900 transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/admin/login"
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            Admin
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-400 font-mono">
            © 2026 ALGO. GO CURIOUS.
          </span>
        </div>
      </div>
    </footer>
  );
}
