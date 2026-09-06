"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  UserCheck,
  UserPlus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Shield,
  Mail,
  Pencil,
  X,
  Check,
  Save,
} from "lucide-react";

export interface WhitelistEntry {
  id: string;
  email: string;
  notes: string | null;
  createdAt: Date | string;
  registeredUsername: string | null;
  registeredName: string | null;
  registeredRole?: "STUDENT" | "ADMIN" | null;
  registeredAt: Date | string | null;
}

interface Props {
  initialEntries: WhitelistEntry[];
  adminEmail: string;
}

export function WhitelistManager({ initialEntries, adminEmail }: Props) {
  const [entries, setEntries] = useState<WhitelistEntry[]>(initialEntries);
  const [newEmail, setNewEmail] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Modal/State
  const [editingEntry, setEditingEntry] = useState<WhitelistEntry | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editRole, setEditRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [editSaving, setEditSaving] = useState(false);

  const registeredCount = entries.filter((e) => e.registeredUsername).length;
  const pendingCount = entries.length - registeredCount;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim(), notes: newNotes.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add email to wishlist");
      }

      setEntries((prev) => [
        {
          ...data.entry,
          registeredUsername: null,
          registeredName: null,
          registeredRole: "STUDENT",
          registeredAt: null,
        },
        ...prev,
      ]);
      setNewEmail("");
      setNewNotes("");
      setFeedback({ type: "success", text: `Successfully added ${data.entry.email} to wishlist!` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      alert("The platform owner cannot be removed from the wishlist.");
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${email} from the wishlist? They will immediately lose access to sign in.`)) {
      return;
    }

    setDeletingEmail(email);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/whitelist?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to remove email");
      }

      setEntries((prev) => prev.filter((e) => e.email.toLowerCase() !== email.toLowerCase()));
      setFeedback({ type: "success", text: `Removed ${email} from wishlist.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setDeletingEmail(null);
    }
  };

  const startEdit = (entry: WhitelistEntry) => {
    setEditingEntry(entry);
    setEditNotes(entry.notes || "");
    setEditRole(entry.registeredRole === "ADMIN" ? "ADMIN" : "STUDENT");
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    setEditSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editingEntry.email,
          notes: editNotes,
          role: editRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update wishlist entry");
      }

      setEntries((prev) =>
        prev.map((item) =>
          item.email.toLowerCase() === editingEntry.email.toLowerCase()
            ? {
                ...item,
                notes: editNotes.trim() || null,
                registeredRole: editRole,
              }
            : item
        )
      );

      setFeedback({ type: "success", text: `Updated ${editingEntry.email} successfully!` });
      setEditingEntry(null);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setEditSaving(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.email.toLowerCase().includes(q) ||
      (e.notes && e.notes.toLowerCase().includes(q)) ||
      (e.registeredUsername && e.registeredUsername.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Wishlisted</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{entries.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approved Google accounts</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Registered & Active</div>
          <div className="text-2xl font-bold text-[#0AA793] mt-1">{registeredCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Have signed in and created profiles</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Pending Access</div>
          <div className="text-2xl font-bold text-[#F78424] mt-1">{pendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Whitelisted, waiting to sign in</div>
        </div>
      </div>

      {/* Add Email Card */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono uppercase">
            <UserPlus className="w-3.5 h-3.5 text-[#099BE9]" />
            <span>Add User to Access Wishlist</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Google / Gmail address (e.g. student@gmail.com)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-slate-50/30"
              />
            </div>
            <input
              type="text"
              placeholder="Optional notes / memo (e.g. Beta Tester)"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-slate-50/30"
            />
            <Button
              type="submit"
              disabled={loading || !newEmail.trim()}
              size="sm"
              className="w-full sm:w-auto text-xs font-semibold gap-1.5 bg-[#099BE9] hover:bg-[#1984E9] text-white shrink-0 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
              <span>Add to Wishlist</span>
            </Button>
          </form>

          {feedback && (
            <div
              className={`mt-3 p-2.5 rounded text-xs flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-[#09C899]/10 border border-[#09C899]/30 text-[#0AA793]"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#09C899]" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal / Drawer overlay */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#099BE9]" />
                <h3 className="text-sm font-bold text-slate-900">Edit Wishlist Entry</h3>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Google Email</label>
                <input
                  type="text"
                  disabled
                  value={editingEntry.email}
                  className="w-full text-xs font-mono px-3 py-2 rounded bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Memo</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Candidate, External Reviewer"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#099BE9]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={editRole}
                  onChange={(e: any) => setEditRole(e.target.value)}
                  disabled={editingEntry.email.toLowerCase() === adminEmail.toLowerCase()}
                  className="w-full text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#099BE9] bg-white"
                >
                  <option value="STUDENT">STUDENT (Standard Solve & Benchmark Access)</option>
                  <option value="ADMIN">ADMIN (Full Control Plane Access)</option>
                </select>
                {editingEntry.email.toLowerCase() === adminEmail.toLowerCase() && (
                  <p className="text-[11px] text-slate-400 mt-1">Platform owner role cannot be modified.</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingEntry(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="text-xs bg-[#099BE9] hover:bg-[#1984E9] text-white gap-1.5 shadow-2xs cursor-pointer"
              >
                {editSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#0AA793]" />
            <span>Authorized Email Accounts</span>
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#099BE9]"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Authorized Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Added On</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No matching accounts found on wishlist.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => {
                  const isOwner = e.email.toLowerCase() === adminEmail.toLowerCase();
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-semibold text-slate-900">{e.email}</span>
                          {isOwner && (
                            <Badge variant="purple" className="text-[10px] gap-1 py-0">
                              <Shield className="w-2.5 h-2.5" />
                              <span>OWNER</span>
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {e.registeredUsername ? (
                          <Badge variant="success" className="text-[10px] font-sans">
                            Joined @{e.registeredUsername}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] font-sans text-[#F78424] bg-[#FBAE0C]/10 border-[#FBAE0C]/30">
                            Pending Invite
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={e.registeredRole === "ADMIN" || isOwner ? "purple" : "secondary"}
                          className="text-[10px]"
                        >
                          {e.registeredRole || (isOwner ? "ADMIN" : "STUDENT")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                        {e.notes || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => startEdit(e)}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-[#099BE9] text-xs font-medium cursor-pointer"
                            title="Edit wishlist entry"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {isOwner ? (
                            <span className="text-[11px] text-slate-400 italic">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleRemove(e.email)}
                              disabled={deletingEmail === e.email}
                              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                              title="Remove from wishlist"
                            >
                              {deletingEmail === e.email ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
