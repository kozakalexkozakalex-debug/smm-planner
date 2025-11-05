"use client";

import { useEffect, useState } from "react";
import { getSettings, setSettings, subscribeSettings, type Settings } from "@/lib/settings";
import Toast from "@/components/Toast";
import Link from "next/link";

function timeToString(h: number, m: number) {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

function stringToTime(v: string): { hour: number; minute: number } {
  const [hh, mm] = v.split(":");
  const h = Math.max(0, Math.min(23, Number(hh)));
  const m = Math.max(0, Math.min(59, Number(mm)));
  return { hour: isFinite(h) ? h : 0, minute: isFinite(m) ? m : 0 };
}

export default function SettingsPage() {
  const [settings, setState] = useState<Settings>(() => getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => subscribeSettings(() => setState(getSettings())), []);

  function onChangeTimezone(v: string) {
    setState((s) => ({ ...s, timezone: v }));
  }

  function onChangeQuick(i: number, v: string) {
    const next = [...settings.quickTimes];
    next[i] = stringToTime(v);
    setState((s) => ({ ...s, quickTimes: next }));
  }

  function onAddQuick() {
    setState((s) => ({ ...s, quickTimes: [...s.quickTimes, { hour: 9, minute: 0 }] }));
  }
  function onRemoveQuick(i: number) {
    setState((s) => ({ ...s, quickTimes: s.quickTimes.filter((_, idx) => idx !== i) }));
  }

  function onSave() {
    setSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Link href="/" className="link-nav">
          ← Back
        </Link>
      </div>

      <div className="grid max-w-2xl gap-6">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Timezone</label>
          <input
            value={settings.timezone}
            onChange={(e) => onChangeTimezone(e.target.value)}
            placeholder="IANA timezone (e.g., Europe/Kyiv). Leave blank for local."
            className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Note: Currently this affects quick-time presets only; full timezone handling coming next.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Quick times</div>
          <div className="space-y-2">
            {settings.quickTimes.map((qt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  value={timeToString(qt.hour, qt.minute)}
                  onChange={(e) => onChangeQuick(i, e.target.value)}
                  className="h-9 w-28 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => onRemoveQuick(i)}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div>
            <button type="button" onClick={onAddQuick} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
              Add time
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button type="button" onClick={onSave} className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>

      <Toast show={saved} message="Saved" />
    </section>
  );
}

