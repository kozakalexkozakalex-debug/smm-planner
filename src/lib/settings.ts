"use client";

type QuickTime = { hour: number; minute: number };
export type Settings = {
  timezone: string; // IANA TZ string or empty for local
  quickTimes: QuickTime[];
};

const STORAGE_KEY = "smm_settings_v1";
type Listener = () => void;
const listeners = new Set<Listener>();

function defaultSettings(): Settings {
  return {
    timezone: "",
    quickTimes: [
      { hour: 9, minute: 0 },
      { hour: 13, minute: 0 },
      { hour: 18, minute: 0 },
    ],
  };
}

function isValidQuickTime(x: unknown): x is QuickTime {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.hour === "number" &&
    typeof o.minute === "number" &&
    o.hour >= 0 &&
    o.hour <= 23 &&
    o.minute >= 0 &&
    o.minute <= 59
  );
}

function isValidSettings(x: unknown): x is Settings {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (typeof o.timezone !== "string") return false;
  if (!Array.isArray(o.quickTimes)) return false;
  return o.quickTimes.every(isValidQuickTime);
}

let current: Settings = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw);
    return isValidSettings(parsed) ? parsed : defaultSettings();
  } catch {
    return defaultSettings();
  }
})();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

function notify() {
  for (const fn of listeners) {
    try {
      fn();
    } catch {}
  }
}

export function getSettings(): Settings {
  return current;
}

export function subscribeSettings(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSettings(next: Settings) {
  current = next;
  save();
  notify();
}

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch };
  save();
  notify();
}

