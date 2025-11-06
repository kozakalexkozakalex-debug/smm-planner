"use client";

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
export function connectTelegram(botToken: string, chatId: string) {
  telegram = { connected: true, botToken, chatId };
  save();
  notify();
}
export function disconnectTelegram() {
  telegram = { connected: false };
  save();
  notify();
}

