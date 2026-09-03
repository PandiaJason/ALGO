import React from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          User Directory
        </h1>
        <p className="text-xs text-slate-500">
          Authorized accounts, role assignments, and authentication providers.
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {allUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                  @{u.username}
                </td>
                <td className="py-3 px-4 font-sans text-slate-600">
                  {u.name || "—"}
                </td>
                <td className="py-3 px-4 text-slate-500">
                  {u.email}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={u.role === "ADMIN" ? "purple" : "secondary"} className="text-[10px]">
                    {u.role}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right font-sans text-slate-400 text-[11px]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
