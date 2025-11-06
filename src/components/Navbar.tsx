"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocale, setLocale, subscribeLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getWorkspaces, getCurrentWorkspace, setWorkspace, subscribeWorkspace } from "@/lib/workspace";
import { refresh as refreshPosts } from "@/lib/posts";
import { refresh as refreshChannels } from "@/lib/channelsBoundary";
import { getUser, subscribeUser, signInDemo, signOut } from "@/lib/auth";

export default function Navbar() {
  const [locale, setLocaleState] = useState<Locale>(() => getLocale());
  useEffect(() => subscribeLocale(() => setLocaleState(getLocale())), []);
  const pathname = usePathname();
  const [wsList, setWsList] = useState(() => getWorkspaces());
  const [wsId, setWsId] = useState(() => getCurrentWorkspace()?.id || "");
  useEffect(() => subscribeWorkspace(() => {
    setWsList(getWorkspaces());
    setWsId(getCurrentWorkspace()?.id || "");
  }), []);
  const [user, setUser] = useState(() => getUser());
  useEffect(() => subscribeUser(() => setUser(getUser())), []);

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
          <div className="ml-2 inline-flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => switchLocale("en")}
              className={`rounded px-2 py-1 ${locale === "en" ? "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"}`}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLocale("uk")}
              className={`rounded px-2 py-1 ${locale === "uk" ? "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"}`}
              aria-pressed={locale === "uk"}
            >
              UK
            </button>
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
      </div>
    </header>
  );
}
