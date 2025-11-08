"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocale, setLocale, subscribeLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getWorkspaces, getCurrentWorkspace, setWorkspace, subscribeWorkspace, refreshWorkspaces, createWorkspace, renameWorkspace, deleteWorkspace } from "@/lib/workspace";
import { refresh as refreshPosts } from "@/lib/posts";
import { refresh as refreshChannels } from "@/lib/channelsBoundary";
import { getUser, subscribeUser, signInDemo, signOut } from "@/lib/auth";
import SimpleModal from "@/components/SimpleModal";
import { api } from "@/lib/api";

export default function Navbar() {
  const [locale, setLocaleState] = useState<Locale>(() => getLocale());
  useEffect(() => subscribeLocale(() => setLocaleState(getLocale())), []);
  const pathname = usePathname();
  const [wsList, setWsList] = useState(() => getWorkspaces());
  const [wsId, setWsId] = useState(() => getCurrentWorkspace()?.id || "");
  const [user, setUser] = useState(() => getUser());
  const [role, setRole] = useState<string>("OWNER");
  const [modal, setModal] = useState<{ open: boolean; kind: "new" | "rename" | "delete"; name?: string }>({ open: false, kind: "new" });
  const [plan, setPlan] = useState<string>("");
  useEffect(() => subscribeUser(() => setUser(getUser())), []);

  useEffect(() => subscribeWorkspace(() => {
    setWsList(getWorkspaces());
    setWsId(getCurrentWorkspace()?.id || "");
  }), []);
  useEffect(() => {
    // fetch workspace labels from API on mount and when auth changes
    refreshWorkspaces().catch(() => {});
  }, [user?.id]);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    function start() {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
          refreshWorkspaces().catch(() => {});
        }, 60_000);
      }
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        refreshWorkspaces().catch(() => {});
        start();
      } else {
        stop();
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("focus", start);
      window.addEventListener("blur", stop);
    }
    // kick off
    start();
    return () => {
      stop();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", start);
        window.removeEventListener("blur", stop);
      }
    };
  }, [user?.id]);
  useEffect(() => {
    const curr = getCurrentWorkspace();
    if (!curr || !user?.id) return;
    (async () => {
      try {
        const res = await fetch("/api/members", { headers: { "X-Workspace-Id": curr.id, "X-User-Id": user.id } });
        if (!res.ok) return;
        const list = (await res.json()) as Array<{ id: string; role: string }>;
        const me = list.find((m) => m.id === user.id);
        if (me?.role) setRole(String(me.role));
      } catch {}
    })();
  }, [wsId, user?.id]);
  useEffect(() => {
    (async () => {
      try {
        const sub = await api.getSubscription();
        if (sub?.plan) setPlan(String(sub.plan));
      } catch {}
    })();
  }, [wsId, user?.id]);

  function switchLocale(next: Locale) {
    if (next === locale) return;
    setLocale(next);
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <header className="sticky top-0 z-50 header-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-lg font-semibold text-amber-400"
        >
          SMM Planner
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`link-nav ${pathname === "/" ? "font-semibold text-amber-400" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            {t("navbar.planner")}
          </Link>
          <Link
            href="/calendar"
            className={`link-nav ${pathname?.startsWith("/calendar") ? "font-semibold text-amber-400" : ""}`}
            aria-current={pathname?.startsWith("/calendar") ? "page" : undefined}
          >
            {t("navbar.calendar")}
          </Link>
          <Link
            href="/integrations"
            className={`link-nav ${pathname?.startsWith("/integrations") ? "font-semibold text-amber-400" : ""}`}
            aria-current={pathname?.startsWith("/integrations") ? "page" : undefined}
          >
            {t("navbar.integrations")}
          </Link>
          <Link
            href="/posts"
            className={`link-nav ${pathname?.startsWith("/posts") ? "font-semibold text-amber-400" : ""}`}
            aria-current={pathname?.startsWith("/posts") ? "page" : undefined}
          >
            {t("navbar.posts")}
          </Link>
          <Link
            href="/channels"
            className={`link-nav ${pathname?.startsWith("/channels") ? "font-semibold text-amber-400" : ""}`}
            aria-current={pathname?.startsWith("/channels") ? "page" : undefined}
          >
            {t("navbar.channels")}
          </Link>
          <Link
            href="/members"
            className={`link-nav ${pathname?.startsWith("/members") ? "font-semibold text-amber-400" : ""}`}
            aria-current={pathname?.startsWith("/members") ? "page" : undefined}
          >
            {t("navbar.members")}
          </Link>
          <div className="ml-2 inline-flex items-center gap-1 text-xs">
            <label htmlFor="lang" className="sr-only">Language</label>
            <select
              id="lang"
              value={locale}
              onChange={(e) => switchLocale(e.target.value as Locale)}
              className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              aria-label="Language"
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
              <option disabled>—</option>
              <option value="pl">Polski</option>
              <option value="de">Deutsch</option>
              <option value="es">EspaГ±ol</option>
              <option value="fr">FranГ§ais</option>
              <option value="it">Italiano</option>
              <option value="pt">Portugues</option>
            </select>
          </div>
          <div className="ml-4 inline-flex items-center gap-2">
            <label htmlFor="ws" className="sr-only">Workspace</label>
            <select
              id="ws"
              value={wsId}
              onChange={(e) => {
                setWorkspace(e.target.value);
                // simplest: refresh data and keep current page
                refreshPosts().catch(() => {});
                refreshChannels().catch(() => {});
              }}
              className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              aria-label="Workspace"
            >
              {wsList.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            {plan ? (
              <span
                className="rounded border border-zinc-300 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                title={`Plan: ${plan}`}
                aria-label={`Plan ${plan}`}
              >
                {plan}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setModal({ open: true, kind: "new", name: "" })}
              className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              aria-label="New workspace"
              title="New workspace"
            >
              New
            </button>
            <button
              type="button"
              onClick={() => { const curr = getCurrentWorkspace(); if (curr) setModal({ open: true, kind: "rename", name: curr.name }); }}
              className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              aria-label="Rename workspace"
              title="Rename workspace"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={() => setModal({ open: true, kind: "delete" })}
              className="rounded border border-red-300 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:bg-zinc-900 dark:text-red-300"
              aria-label="Delete workspace"
              title={role !== "OWNER" ? "Only owners can delete workspaces" : "Delete workspace"}
              disabled={role !== "OWNER"}
            >
              Delete
            </button>
          </div>
          <div className="ml-3 inline-flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden sm:block text-xs text-zinc-300 dark:text-zinc-400" aria-label={`Signed in as ${user.name}`}>
                  {user.name}
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded border border-zinc-500/50 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800 dark:text-zinc-100"
                >
                  {t("navbar.signOut")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => signInDemo()}
                className="rounded border border-zinc-500/50 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800 dark:text-zinc-100"
              >
                {t("navbar.signIn")}
              </button>
            )}
          </div>
        </nav>
        <SimpleModal
          open={modal.open && (modal.kind === "new" || modal.kind === "rename")}
          title={modal.kind === "new" ? "New workspace" : "Rename workspace"}
          onClose={() => setModal({ open: false, kind: "new" })}
          description={modal.kind === "new" ? "Create a new workspace for your team." : undefined}
          footer={(
            <>
              <button type="button" onClick={() => setModal({ open: false, kind: "new" })} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const input = (document.getElementById("ws-modal-input") as HTMLInputElement | null)?.value.trim();
                  if (!input) return;
                  if (modal.kind === "new") {
                    const ws = await createWorkspace(input);
                    if (ws) { await refreshPosts().catch(() => {}); await refreshChannels().catch(() => {}); }
                  } else {
                    const curr = getCurrentWorkspace();
                    if (curr && curr.name !== input) {
                      const ok = await renameWorkspace(curr.id, input);
                      if (ok) { await refreshPosts().catch(() => {}); await refreshChannels().catch(() => {}); }
                    }
                  }
                  setModal({ open: false, kind: "new" });
                }}
                className="btn-primary"
              >
                Save
              </button>
            </>
          )}
        >
          <input id="ws-modal-input" defaultValue={modal.name || ""} className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" placeholder="Workspace name" />
        </SimpleModal>

        <SimpleModal
          open={modal.open && modal.kind === "delete"}
          title="Delete workspace"
          onClose={() => setModal({ open: false, kind: "new" })}
          description="This action cannot be undone."
          footer={(
            <>
              <button type="button" onClick={() => setModal({ open: false, kind: "new" })} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">Cancel</button>
              <button
                type="button"
                onClick={async () => {
                  const curr = getCurrentWorkspace();
                  if (!curr) return;
                  const ok = await deleteWorkspace(curr.id);
                  if (ok) { await refreshPosts().catch(() => {}); await refreshChannels().catch(() => {}); }
                  setModal({ open: false, kind: "new" });
                }}
                className="inline-flex h-9 items-center rounded-md bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                disabled={role !== "OWNER"}
              >
                Delete
              </button>
            </>
          )}
        />
      </div>
    </header>
  );
}
