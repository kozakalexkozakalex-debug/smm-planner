"use client";

import type { Channel, Post } from "@/lib/types";
import { CHANNELS } from "@/lib/data";

type Listener = () => void;
const STORAGE_KEY = "smm_channels_v1";

function isChannel(x: unknown): x is Channel {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.name === "string";
}

function load(): Channel[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    const cleaned = arr.filter(isChannel);
    return cleaned.length ? cleaned : null;
  } catch {
    return null;
  }
}

function save(list: Channel[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

function generateId(): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function isAllowedName(name: unknown): name is Post["channel"] {
  return (CHANNELS as readonly Post["channel"][]).includes(name as Post["channel"]);
}

function normalizeName(name: string): Post["channel"] | null {
  const trimmed = name.trim();
  return isAllowedName(trimmed) ? trimmed : null;
}

let channels: Channel[] =
  load() ?? (CHANNELS as readonly Post["channel"][]).map((name) => ({ id: generateId(), name }));

const listeners = new Set<Listener>();
function notify() {
  for (const fn of listeners) {
    try {
      fn();
    } catch {}
  }
}

export function getChannels(): Channel[] {
  return channels;
}
export function subscribeChannels(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function addChannel(name: Channel["name"]) {
  const norm = normalizeName(name);
  if (!norm) return; // ignore invalid
  if (channels.some((c) => c.name === norm)) return; // dedupe
  channels = [{ id: generateId(), name: norm }, ...channels];
  save(channels);
  notify();
}
export function updateChannel(id: string, fields: Partial<Pick<Channel, "name">>) {
  channels = channels.map((c) => {
    if (c.id !== id) return c;
    const nextName = fields.name ? normalizeName(fields.name) : c.name;
    if (!nextName) return c; // invalid -> no change
    if (channels.some((x) => x.id !== id && x.name === nextName)) return c; // duplicate -> no change
    return { ...c, name: nextName };
  });
  save(channels);
  notify();
}
export function deleteChannel(id: string): Channel | null {
  const idx = channels.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const [removed] = channels.splice(idx, 1);
  save(channels);
  notify();
  return removed ?? null;
}
export function setChannels(next: Channel[]) {
  const seen = new Set<Post["channel"]>();
  const cleaned: Channel[] = [];
  for (const c of next) {
    const norm = normalizeName(c.name);
    if (!norm) continue;
    if (seen.has(norm)) continue;
    seen.add(norm);
    cleaned.push({ id: c.id || generateId(), name: norm });
  }
  channels = cleaned.length ? cleaned : channels;
  save(channels);
  notify();
}
export function parseChannels(raw: unknown): Channel[] | null {
  try {
    const arr = Array.isArray(raw) ? raw : JSON.parse(String(raw));
    if (!Array.isArray(arr)) return null;
    const cleaned: Channel[] = [];
    const seen = new Set<Post["channel"]>();
    for (const item of arr) {
      if (!isChannel(item)) continue;
      const norm = normalizeName(item.name);
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      cleaned.push({ id: typeof item.id === "string" && item.id ? item.id : generateId(), name: norm });
    }
    return cleaned.length ? cleaned : null;
  } catch {
    return null;
  }
}
