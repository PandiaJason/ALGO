import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

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

  if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
    redirect("/admin/login?error=AccessDenied");
  }

  let currentUser: any = {
    name: session?.user?.name || "Jason Pandian",
    username: "jasonpandian",
    email: ADMIN_EMAIL,
    role: "ADMIN",
  };

  try {
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (dbUsers[0]) {
      currentUser = dbUsers[0];
      if (currentUser.role !== "ADMIN") {
        await db
          .update(users)
          .set({ role: "ADMIN" })
          .where(eq(users.id, currentUser.id));
        currentUser.role = "ADMIN";
      }
    } else {
      // Auto-provision Jason Pandian as ADMIN if record doesn't exist yet
      const [newUser] = await db
        .insert(users)
        .values({
          name: session?.user?.name || "Jason Pandian",
          username: "jasonpandian",
          email: ADMIN_EMAIL,
          role: "ADMIN",
        })
        .returning();
      if (newUser) currentUser = newUser;
    }
  } catch (err) {
    console.warn("AdminLayout user verification query error, continuing with session admin:", err);
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Refined Dark Mission Control Sidebar */}
      <AdminSidebar user={currentUser} />

      {/* Main Admin Surface */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
