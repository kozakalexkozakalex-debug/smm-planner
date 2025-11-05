"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLocale, setLocale, subscribeLocale, type Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function Navbar() {
  const [locale, setLocaleState] = useState<Locale>(() => getLocale());
  useEffect(() => subscribeLocale(() => setLocaleState(getLocale())), []);

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
          <Link href="/" className="link-nav">{t("navbar.planner")}</Link>
          <Link href="/calendar" className="link-nav">{t("navbar.calendar")}</Link>
          <Link href="/posts" className="link-nav">{t("navbar.posts")}</Link>
          <Link href="/channels" className="link-nav">{t("navbar.channels")}</Link>
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
        </nav>
      </div>
    </header>
  );
}
