"use client";
import { api } from "@/lib/api";

type Telegram = {
  connected: boolean;
  botToken?: string;
  chatId?: string;
};

const STORAGE_KEY = "smm_integrations_telegram";
let telegram: Telegram = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Telegram;
  } catch {}
  return { connected: false };
})();

type Listener = () => void;
const listeners = new Set<Listener>();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(telegram));
  } catch {}
}

function notify() {
  for (const fn of listeners) {
    try { fn(); } catch {}
  }
}

export function getTelegram(): Telegram {
  return telegram;
}
export function subscribeTelegram(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export async function connectTelegram(botToken: string, chatId: string) {
  try {
    await api.connectTelegram(botToken, chatId);
    telegram = { connected: true, chatId };
  } catch {
    telegram = { connected: true, botToken, chatId };
  }
  save();
  notify();
}
export async function disconnectTelegram() {
  try { await api.disconnectTelegram(); } catch {}
  telegram = { connected: false };
  save();
  notify();
}
