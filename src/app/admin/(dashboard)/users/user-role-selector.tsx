"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  initialRole: "STUDENT" | "ADMIN";
  userEmail: string | null;
  adminEmail: string;
}

export function UserRoleSelector({ userId, initialRole, userEmail, adminEmail }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "ADMIN">(initialRole);
  const [loading, setLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  const isRootAdmin = userEmail?.toLowerCase() === adminEmail.toLowerCase();

  const handleRoleChange = async (newRole: "STUDENT" | "ADMIN") => {
    if (newRole === role || loading) return;

    if (isRootAdmin && newRole !== "ADMIN") {
      alert("The root platform administrator account cannot be demoted.");
      return;
    }

    const previousRole = role;
    setRole(newRole);
    setLoading(true);
    setJustUpdated(false);

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);
      router.refresh();
    } catch (err: any) {
      setRole(previousRole);
      alert(err.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  if (isRootAdmin) {
    return (
      <div className="flex items-center gap-1.5 font-sans">
        <Badge variant="purple" className="text-[10px] gap-1 py-0.5 px-2 font-semibold">
          <Shield className="w-3 h-3 text-[#8647E2] inline" />
          ADMIN (OWNER)
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 font-sans">
      <div className="relative inline-flex items-center">
        <select
          value={role}
          onChange={(e) => handleRoleChange(e.target.value as "STUDENT" | "ADMIN")}
          disabled={loading}
          className={`text-xs font-semibold py-1 pl-2.5 pr-7 rounded border transition-colors focus:outline-none focus:ring-1 cursor-pointer disabled:opacity-50 ${
            role === "ADMIN"
              ? "bg-[#8647E2]/10 text-[#8647E2] border-[#8647E2]/30 focus:ring-[#8647E2]"
              : "bg-slate-50 text-slate-700 border-slate-200 focus:ring-[#099BE9] hover:bg-slate-100"
          }`}
        >
          <option value="STUDENT">STUDENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        {loading && (
          <span className="absolute right-2 pointer-events-none">
            <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
          </span>
        )}
      </div>

      {justUpdated && (
        <span className="text-[11px] text-[#0AA793] font-medium inline-flex items-center gap-0.5 animate-fade-in">
          <Check className="w-3 h-3" /> Saved
        </span>
      )}
    </div>
  );
}
