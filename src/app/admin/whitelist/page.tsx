import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { whitelistUsers, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/constants";
import { WhitelistManager } from "./whitelist-manager";

export const dynamic = "force-dynamic";

export default async function AdminWhitelistPage() {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (userEmail !== ADMIN_EMAIL) {
    redirect("/admin/login?error=AccessDenied");
  }

  // Fetch all whitelist entries joined with registered user data
  const entries = await db
    .select({
      id: whitelistUsers.id,
      email: whitelistUsers.email,
      notes: whitelistUsers.notes,
      createdAt: whitelistUsers.createdAt,
      registeredUsername: users.username,
      registeredName: users.name,
      registeredAt: users.createdAt,
    })
    .from(whitelistUsers)
    .leftJoin(users, eq(whitelistUsers.email, users.email))
    .orderBy(desc(whitelistUsers.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Access Wishlist & Allowlist
        </h1>
        <p className="text-xs text-slate-500">
          Strict access control: Only users whose Google accounts are explicitly added to this wishlist can authenticate and join ALGO.
        </p>
      </div>

      <WhitelistManager
        initialEntries={entries}
        adminEmail={ADMIN_EMAIL}
      />
    </div>
  );
}
