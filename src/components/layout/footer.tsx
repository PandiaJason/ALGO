import React from "react";
import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size={20} showText={true} />
          <span className="text-xs text-slate-400">
            The engineering proving ground for the AI era.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <span className="font-mono text-slate-400">BUILD. OPTIMIZE. INNOVATE.</span>
          <Link href="/challenges" className="hover:text-slate-900 transition-colors">
            Challenges
          </Link>
          <Link href="/leaderboard" className="hover:text-slate-900 transition-colors">
            Leaderboard
          </Link>
          <Link href="/admin/login" className="text-slate-400 hover:text-slate-600 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
