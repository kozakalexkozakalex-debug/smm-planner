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

export function setWorkspaces(list: Workspace[]) {
  const unique: Workspace[] = [];
  const seen = new Set<string>();
  for (const w of list) {
    if (!w?.id || !w?.name) continue;
    if (seen.has(w.id)) continue;
    seen.add(w.id);
    unique.push({ id: String(w.id), name: String(w.name) });
  }
  if (!unique.length) return;
  workspaces = unique;
  if (!workspaces.some((w) => w.id === currentId)) {
    currentId = workspaces[0].id;
    try {
      localStorage.setItem(STORAGE_KEY, currentId);
    } catch {}
  }
  for (const fn of listeners) {
    try {
      fn();
    } catch {}
  }
}

export async function refreshWorkspaces(): Promise<void> {
  try {
    const res = await fetch("/api/workspaces", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as Workspace[];
    if (Array.isArray(data)) setWorkspaces(data);
  } catch {
    // ignore
  }
}

export async function createWorkspace(name: string): Promise<Workspace | null> {
  try {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    const ws = (await res.json()) as Workspace;
    if (ws?.id) {
      setWorkspaces([...getWorkspaces(), ws]);
      setWorkspace(ws.id);
      // Sync with server labels/membership
      await refreshWorkspaces().catch(() => {});
      return ws;
    }
  } catch {}
  return null;
}

export async function renameWorkspace(id: string, name: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/workspaces/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return false;
    const ws = (await res.json()) as Workspace;
    const list = getWorkspaces().map((w) => (w.id === id ? ws : w));
    setWorkspaces(list);
    await refreshWorkspaces().catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export async function deleteWorkspace(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/workspaces/${id}`, { method: "DELETE" });
    if (!res.ok) return false;
    const next = getWorkspaces().filter((w) => w.id !== id);
    if (next.length) {
      setWorkspaces(next);
      setWorkspace(next[0].id);
    }
    await refreshWorkspaces().catch(() => {});
    return true;
  } catch {
    return false;
  }
}
