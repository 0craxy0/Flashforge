"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  KeyRound,
  Mail,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: "Cluster Owner" | "Billing Admin" | "Platform Engineer" | "Read-Only";
  unixGroup: string;
  lastActive: string;
  mfaEnabled: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = React.useState<MemberItem[]>([
    {
      id: "mem-1",
      name: "Alex Morgan",
      email: "alex@acme.dev",
      role: "Cluster Owner",
      unixGroup: "flashforge, sudo",
      lastActive: "Just now",
      mfaEnabled: true,
    },
    {
      id: "mem-2",
      name: "Sarah Chen",
      email: "sarah.chen@acme.dev",
      role: "Billing Admin",
      unixGroup: "flashforge",
      lastActive: "4 hours ago",
      mfaEnabled: true,
    },
    {
      id: "mem-3",
      name: "David Kim",
      email: "d.kim@acme.dev",
      role: "Platform Engineer",
      unixGroup: "flashforge",
      lastActive: "Yesterday",
      mfaEnabled: true,
    },
    {
      id: "mem-4",
      name: "Elena Rostova",
      email: "elena@acme.dev",
      role: "Read-Only",
      unixGroup: "flashforge-readonly",
      lastActive: "3 days ago",
      mfaEnabled: false,
    },
  ]);

  const [showInviteModal, setShowInviteModal] = React.useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = React.useState<string>("");
  const [inviteRole, setInviteRole] = React.useState<MemberItem["role"]>("Platform Engineer");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: MemberItem = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split("@")[0].replace(".", " "),
      email: inviteEmail,
      role: inviteRole,
      unixGroup: "flashforge",
      lastActive: "Pending Invite",
      mfaEnabled: false,
    };

    setMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Governance &amp; Identity
            </span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <Shield size={12} />
              RBAC Enforced
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Users size={22} className="text-zinc-400" />
            Access Control &amp; Team Members
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage administrative privileges, billing authorities, and Linux host system user mappings.
          </p>
        </div>

        <Button onClick={() => setShowInviteModal(true)} className="gap-2 font-semibold">
          <Plus size={14} />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Linux System Group Banner */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-md animate-fade-in delay-1">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
            <UserCheck size={14} className="text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-zinc-200">
              Host Security Directives &amp; Unix Group Mapping
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Users with <code className="font-mono text-zinc-300">Cluster Owner</code> or{" "}
              <code className="font-mono text-zinc-300">Platform Engineer</code> roles are granted access to write directly to{" "}
              <code className="font-mono text-zinc-300">/var/run/flashforge.sock</code> under group{" "}
              <code className="font-mono text-zinc-300">flashforge</code> (GID 998).
            </p>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden animate-fade-in delay-2">
        <CardHeader className="border-b border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-100">
                Authorized Personnel ({members.length})
              </CardTitle>
              <CardDescription className="mt-0.5">
                Active collaborators with access to billing telemetry and daemon configuration.
              </CardDescription>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              MFA Mandatory for Admins
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs" aria-label="Members table">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400">
                  <th scope="col" className="px-4 py-3 font-medium">User</th>
                  <th scope="col" className="px-4 py-3 font-medium">Role</th>
                  <th scope="col" className="px-4 py-3 font-medium">Unix Group Mapping</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last Active</th>
                  <th scope="col" className="px-4 py-3 font-medium text-center">MFA</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {members.map((mem) => (
                  <tr
                    key={mem.id}
                    className="group transition-colors hover:bg-zinc-900/40"
                  >
                    <td className="px-4 py-3.5 font-sans">
                      <div className="font-semibold text-zinc-200 capitalize">{mem.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{mem.email}</div>
                    </td>

                    <td className="px-4 py-3.5 font-sans">
                      <Badge
                        variant={mem.role === "Cluster Owner" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {mem.role}
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5 text-zinc-300">
                      <span className="rounded bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
                        {mem.unixGroup}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-zinc-400">
                      {mem.lastActive}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {mem.mfaEnabled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px]">
                          <Check size={12} /> Enabled
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">Disabled</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right font-sans">
                      {mem.role !== "Cluster Owner" && (
                        <button
                          type="button"
                          onClick={() => setMembers(members.filter((m) => m.id !== mem.id))}
                          className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove member"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Users size={16} className="text-zinc-400" />
                Invite Team Member
              </h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="colleague@acme.dev"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Role Authority</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as MemberItem["role"])}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                >
                  <option value="Billing Admin">Billing Admin (Invoices, Thresholds, Quotas)</option>
                  <option value="Platform Engineer">Platform Engineer (API Secrets, Daemon Telemetry)</option>
                  <option value="Read-Only">Read-Only (View Telemetry &amp; Reports)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
