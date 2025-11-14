"use client";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

const STORAGE_KEY = "smm_user";

let current: User | null = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {}
  // Default demo user
  return {
    id: "user-demo",
    name: "Demo User",
    email: "demo@example.com",
  };
})();

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  for (const fn of listeners) {
    try {
      fn();
    } catch {}
  }
}

export function getUser(): User | null {
  return current;
}

export function subscribeUser(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function signInDemo() {
  current = {
    id: "user-demo",
    name: "Demo User",
    email: "demo@example.com",
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {}
  notify();
}

export function signOut() {
  current = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  notify();
}

