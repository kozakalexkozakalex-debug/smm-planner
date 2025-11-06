"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "@/components/Toast";
import SimpleModal from "@/components/SimpleModal";
import { getCurrentWorkspace, subscribeWorkspace } from "@/lib/workspace";
import { getUser } from "@/lib/auth";

type Member = { id: string; email?: string | null; role: string };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [role, setRole] = useState<string>("OWNER");
  const [toast, setToast] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  async function refreshMembers() {
    const ws = getCurrentWorkspace();
    const user = getUser();
    if (!ws || !user?.id) return;
    try {
      // fetch role first
      const res = await fetch("/api/members", { headers: { "X-Workspace-Id": ws.id, "X-User-Id": user.id }, cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Member[];
      setMembers(Array.isArray(data) ? data : []);
      const me = data.find((m) => m.id === user.id);
      if (me?.role) setRole(String(me.role));
    } catch {}
  }

  useEffect(() => {
    refreshMembers();
    return subscribeWorkspace(() => refreshMembers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canManage = role === "OWNER" || role === "ADMIN";

  async function onInvite(email: string) {
    const ws = getCurrentWorkspace();
    const user = getUser();
    if (!ws || !user?.id) return;
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Workspace-Id": ws.id, "X-User-Id": user.id },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        showToast("Invites not implemented");
      } else {
        showToast("Invite sent");
        refreshMembers();
      }
    } catch {
      showToast("Failed to invite");
    }
  }

  async function onChangeRole(memberId: string, nextRole: string) {
    const ws = getCurrentWorkspace();
    const user = getUser();
    if (!ws || !user?.id) return;
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Workspace-Id": ws.id, "X-User-Id": user.id },
        body: JSON.stringify({ role: nextRole }),
      });
      if (!res.ok) {
        showToast("Failed to change role");
        return;
      }
      await refreshMembers();
      showToast("Role updated");
    } catch {
      showToast("Failed to change role");
    }
  }

  const sorted = useMemo(() => {
    return [...members].sort((a, b) => (a.email || a.id).localeCompare(b.email || b.id));
  }, [members]);
  const ownersCount = useMemo(() => members.filter((m) => m.role === "OWNER").length, [members]);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Members</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Manage workspace members and roles.</p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="btn-primary disabled:opacity-50"
          disabled={!canManage}
          title={!canManage ? "Only admins or owners can invite" : undefined}
        >
          Invite Member
        </button>
      </header>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Email</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">Role</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sorted.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center" colSpan={3}>
                  <div className="mx-auto max-w-md space-y-3">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">No members found.</div>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{m.email || m.id}</td>
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                    <select
                      value={m.role}
                      onChange={(e) => onChangeRole(m.id, e.target.value)}
                      className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      disabled={!canManage}
                      title={!canManage ? "Only admins or owners can change roles" : undefined}
                    >
                      {(["OWNER", "ADMIN", "EDITOR", "VIEWER"] as const).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm("Remove this member?")) return;
                          const ws = getCurrentWorkspace();
                          const user = getUser();
                          if (!ws || !user?.id) return;
                          try {
                            const res = await fetch(`/api/members/${m.id}` , { method: "DELETE", headers: { "X-Workspace-Id": ws.id, "X-User-Id": user.id } });
                            if (!res.ok) {
                              const body = await res.json().catch(() => ({}));
                              if (body?.error === "cannot_remove_last_owner") showToast("Cannot remove last owner");
                              else showToast("Failed to remove");
                              return;
                            }
                            await refreshMembers();
                            showToast("Removed");
                          } catch {
                            showToast("Failed to remove");
                          }
                        }}
                        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        disabled={!canManage || (m.role === "OWNER" && ownersCount <= 1)}
                        title={
                          !canManage
                            ? "Only admins or owners can manage members"
                            : m.role === "OWNER" && ownersCount <= 1
                            ? "Cannot remove the last owner"
                            : undefined
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SimpleModal
        open={inviteOpen}
        title="Invite Member"
        onClose={() => setInviteOpen(false)}
        description="Enter an email to invite to this workspace."
        footer={
          <>
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("invite-email") as HTMLInputElement | null;
                const email = el?.value.trim();
                if (!email) return;
                onInvite(email);
                setInviteOpen(false);
              }}
              className="btn-primary"
              disabled={!canManage}
              title={!canManage ? "Only admins or owners can invite" : undefined}
            >
              Send Invite
            </button>
          </>
        }
      >
        <input
          id="invite-email"
          type="email"
          placeholder="name@example.com"
          className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </SimpleModal>

      <Toast show={!!toast} message={toast || ""} />
    </section>
  );
}
