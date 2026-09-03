import React from "react";
import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      resource: auditLogs.resource,
      resourceId: auditLogs.resourceId,
      metadata: auditLogs.metadata,
      ipAddress: auditLogs.ipAddress,
      createdAt: auditLogs.createdAt,
      adminUsername: users.username,
    })
    .from(auditLogs)
    .innerJoin(users, eq(auditLogs.adminId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(50);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Security Audit Trail
        </h1>
        <p className="text-xs text-slate-500">
          Immutable log of privileged administrative operations, benchmark invalidations, and system actions.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 bg-white">
          No audit log entries recorded yet.
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Metadata</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-purple-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-900">
                    @{log.adminUsername}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {log.ipAddress || "127.0.0.1"}
                  </td>
                  <td className="py-3 px-4 text-right font-sans text-slate-400 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
