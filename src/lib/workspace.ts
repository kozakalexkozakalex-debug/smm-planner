"use client";

export type Workspace = { id: string; name: string };

const STORAGE_KEY = "smm_ws_id";
const defaultWorkspaces: Workspace[] = [
  { id: "ws-acme", name: "Acme" },
  { id: "ws-globex", name: "Globex" },
];

let workspaces: Workspace[] = [...defaultWorkspaces];
let currentId: string = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && workspaces.some((w) => w.id === saved)) return saved;
  } catch {}
  return workspaces[0].id;
})();

type Listener = () => void;
const listeners = new Set<Listener>();

export function getWorkspaces(): Workspace[] {
  return workspaces;
}

export function getCurrentWorkspace(): Workspace | null {
  return workspaces.find((w) => w.id === currentId) ?? null;
}

export function setWorkspace(id: string) {
  if (!workspaces.some((w) => w.id === id)) return;
  currentId = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
  for (const fn of listeners) {
    try {
      fn();
    } catch {}
  }
}

export function subscribeWorkspace(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

