"use client";

import type { Post } from "@/lib/types";
import { mockPosts } from "@/lib/data";

type Listener = () => void;

const STORAGE_KEY = "smm_posts_v1";

function isPost(p: unknown): p is Post {
  if (typeof p !== "object" || p === null) return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.date === "string" &&
    typeof o.channel === "string" &&
    typeof o.title === "string" &&
    typeof o.status === "string"
  );
}

function loadFromStorage(): Post[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    const cleaned = arr.filter(isPost);
    return cleaned.length ? cleaned : null;
  } catch {
    return null;
  }
}

function saveToStorage(list: Post[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota or serialization errors
  }
}

let posts: Post[] = loadFromStorage() ?? [...mockPosts];
const listeners = new Set<Listener>();

export function getPosts(): Post[] {
  return posts;
}

export function setPosts(next: Post[]) {
  posts = next;
  saveToStorage(posts);
  notify();
}

export function parsePosts(raw: unknown): Post[] | null {
  try {
    const arr = Array.isArray(raw) ? raw : JSON.parse(String(raw));
    if (!Array.isArray(arr)) return null;
    const cleaned = arr.filter(isPost);
    return cleaned.length ? (cleaned as Post[]) : null;
  } catch {
    return null;
  }
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function notify() {
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      // no-op
    }
  }
}

export function addPost(post: Post) {
  posts = [post, ...posts];
  saveToStorage(posts);
  notify();
}

export function updatePost(id: string, fields: Partial<Post>) {
  posts = posts.map((p) => (p.id === id ? { ...p, ...fields } : p));
  saveToStorage(posts);
  notify();
}

export function deletePost(id: string): Post | null {
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const [removed] = posts.splice(idx, 1);
  saveToStorage(posts);
  notify();
  return removed ?? null;
}

function generateId(): string {
  // Prefer crypto.randomUUID if available
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function duplicatePost(id: string): Post | null {
  const src = posts.find((p) => p.id === id);
  if (!src) return null;
  const clone: Post = { ...src, id: generateId() };
  posts = [clone, ...posts];
  saveToStorage(posts);
  notify();
  return clone;
}
