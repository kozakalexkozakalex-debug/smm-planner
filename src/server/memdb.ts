import type { Post, Channel } from "@/lib/types";

type DB = {
  posts: (Post & { workspaceId?: string })[];
  channels: (Channel & { workspaceId?: string })[];
};

const g = globalThis as unknown as { __MEM_DB__?: DB };
if (!g.__MEM_DB__) {
  g.__MEM_DB__ = { posts: [], channels: [] };
}

export const db: DB = g.__MEM_DB__!;

function genId(): string {
  // @ts-ignore
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function upsertPost(p: Partial<Post> & { id?: string }, workspaceId: string): Post {
  const id = p.id || genId();
  const idx = db.posts.findIndex((x) => x.id === id && x.workspaceId === workspaceId);
  const next: Post = {
    id,
    date: p.date || new Date().toISOString(),
    channel: (p.channel as Post["channel"]) || "Instagram",
    title: p.title || "",
    body: (p as any).body || "",
    media: (p as any).media || [],
    status: (p.status as Post["status"]) || "Draft",
  };
  if (idx === -1) db.posts.unshift({ ...next, workspaceId });
  else db.posts[idx] = { ...db.posts[idx], ...next, workspaceId };
  return next;
}

export function updatePost(id: string, patch: Partial<Post>, workspaceId: string): Post | null {
  const idx = db.posts.findIndex((x) => x.id === id && x.workspaceId === workspaceId);
  if (idx === -1) return null;
  db.posts[idx] = { ...db.posts[idx], ...patch };
  return db.posts[idx];
}

export function deletePost(id: string, workspaceId: string): boolean {
  const idx = db.posts.findIndex((x) => x.id === id && x.workspaceId === workspaceId);
  if (idx === -1) return false;
  db.posts.splice(idx, 1);
  return true;
}

export function upsertChannel(c: Partial<Channel> & { id?: string }, workspaceId: string): Channel {
  const id = c.id || genId();
  const idx = db.channels.findIndex((x) => x.id === id && x.workspaceId === workspaceId);
  const next: Channel = {
    id,
    name: (c.name as Channel["name"]) || "Instagram",
  };
  if (idx === -1) db.channels.unshift({ ...next, workspaceId });
  else db.channels[idx] = { ...db.channels[idx], ...next, workspaceId };
  return next;
}

export function updateChannel(id: string, patch: Partial<Channel>, workspaceId: string): Channel | null {
  const idx = db.channels.findIndex((x) => x.id === id && x.workspaceId === workspaceId);
  if (idx === -1) return null;
  db.channels[idx] = { ...db.channels[idx], ...patch } as Channel;
  return db.channels[idx];
}

export function deleteChannel(id: string, workspaceId: string): boolean {
  const idx = db.channels.findIndex((x) => x.id === id && x.workspaceId === workspaceId);
  if (idx === -1) return false;
  db.channels.splice(idx, 1);
  return true;
}
