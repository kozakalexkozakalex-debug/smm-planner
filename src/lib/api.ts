import type { Post, Channel } from "@/lib/types";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getUser } from "@/lib/auth";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function ok(): boolean {
  // Treat relative API as enabled (use Next.js app routes)
  return true;
}

function buildUrl(path: string): string {
  if (BASE) return `${BASE}${path}`;
  // Use relative Next.js routes under /api when no explicit BASE
  return path.startsWith("/api") ? path : `/api${path}`;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const ws = getCurrentWorkspace();
  const user = getUser();
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
      ...(ws ? { "X-Workspace-Id": ws.id } : {}),
      ...(user ? { "X-User-Id": user.id } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`API ${res.status}: ${text || res.statusText}`) as Error & { status?: number; body?: unknown };
    err.status = res.status;
    try { err.body = text ? JSON.parse(text) : undefined; } catch { err.body = text; }
    throw err;
  }
  return (await res.json()) as T;
}

export const api = {
  enabled: ok,
  async getPosts(): Promise<Post[]> {
    return req<Post[]>("/posts");
  },
  async createPost(p: Post): Promise<Post> {
    return req<Post>("/posts", { method: "POST", body: JSON.stringify(p) });
  },
  async updatePost(id: string, patch: Partial<Post>): Promise<Post> {
    return req<Post>(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async deletePost(id: string): Promise<void> {
    await req<void>(`/posts/${id}`, { method: "DELETE" });
  },
  async publishPost(id: string): Promise<Post> {
    return req<Post>(`/posts/${id}/publish`, { method: "POST" });
  },
  async getChannels(): Promise<Channel[]> {
    return req<Channel[]>("/channels");
  },
  async createChannel(c: Channel): Promise<Channel> {
    return req<Channel>("/channels", { method: "POST", body: JSON.stringify(c) });
  },
  async updateChannel(id: string, patch: Partial<Channel>): Promise<Channel> {
    return req<Channel>(`/channels/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async deleteChannel(id: string): Promise<void> {
    await req<void>(`/channels/${id}`, { method: "DELETE" });
  },
  async getSubscription(): Promise<{ plan: string; status: string; currentPeriodEnd?: string }>
  {
    return req<{ plan: string; status: string; currentPeriodEnd?: string }>("/subscriptions");
  },
};
