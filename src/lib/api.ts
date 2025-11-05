import type { Post, Channel } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function ok(): boolean {
  return !!BASE && /^https?:\/\//.test(BASE);
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
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
};

