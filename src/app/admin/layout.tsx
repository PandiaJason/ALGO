import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Code,
  Layers,
  Cpu,
  Users,
  FileText,
  Shield,
  ArrowLeft,
  LogOut,
  UserCheck,
} from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/constants";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side strict authorization: Accessible EXCLUSIVELY by ADMIN_EMAIL
  const userEmail = session?.user?.email?.toLowerCase();
  if (!userEmail) {
    redirect("/admin/login");
  }

  if (userEmail !== ADMIN_EMAIL) {
    redirect("/admin/login?error=AccessDenied");
  }

  const dbUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, userEmail))
    .limit(1);

  let currentUser = dbUsers[0];
  if (!currentUser) {
    // Auto-provision Jason Pandian as ADMIN if record doesn't exist yet
    const [newUser] = await db
      .insert(users)
      .values({
        name: "Jason Pandian",
        username: "jasonpandian",
        email: ADMIN_EMAIL,
        role: "ADMIN",
      })
      .returning();
    currentUser = newUser;
  } else if (currentUser.role !== "ADMIN") {
    await db
      .update(users)
      .set({ role: "ADMIN" })
      .where(eq(users.id, currentUser.id));
    currentUser.role = "ADMIN";
  }

  const adminNav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/challenges", label: "Challenges", icon: Code },
    { href: "/admin/submissions", label: "Submissions", icon: Layers },
    { href: "/admin/benchmarks", label: "Benchmarks", icon: Cpu },
    { href: "/admin/whitelist", label: "Wishlist", icon: UserCheck },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/audit", label: "Audit Log", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200/90 bg-white flex flex-col justify-between shrink-0 relative overflow-hidden">
        {/* Signature 4-Color Brand Accent Bar */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-[#099BE9] via-[#09C899] via-[#8647E2] to-[#F78424]" />
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Logo size={28} />
            <Badge variant="purple" className="text-[10px] font-mono">
              CONTROL PLANE
            </Badge>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
              A
            </div>
            <div className="truncate">
              <div className="font-semibold text-slate-900 truncate">
                {currentUser.name || currentUser.username}
              </div>
              <div className="text-[10px] text-purple-600 font-mono">
                ADMIN AUTHORIZED
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Exit Admin</span>
            </Link>
            <SignOutButton
              showLabel
              label="Sign Out"
              variant="ghost"
              size="sm"
              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 font-medium"
            />
          </div>
        </div>
      </aside>

      {/* Main Admin Surface */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
