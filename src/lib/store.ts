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

export function deletePost(id: string) {
  posts = posts.filter((p) => p.id !== id);
  saveToStorage(posts);
  notify();
}
