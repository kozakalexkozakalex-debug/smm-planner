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
  channels = [{ id: generateId(), name }, ...channels];
  save(channels);
  notify();
}
export function updateChannel(id: string, fields: Partial<Pick<Channel, "name">>) {
  channels = channels.map((c) => (c.id === id ? { ...c, ...fields } : c));
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
  channels = next;
  save(channels);
  notify();
}
export function parseChannels(raw: unknown): Channel[] | null {
  try {
    const arr = Array.isArray(raw) ? raw : JSON.parse(String(raw));
    if (!Array.isArray(arr)) return null;
    const cleaned = arr.filter(isChannel);
    return cleaned.length ? (cleaned as Channel[]) : null;
  } catch {
    return null;
  }
}
