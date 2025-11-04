"use client";

import type { Post } from "@/lib/types";
import { mockPosts } from "@/lib/data";

type Listener = () => void;

let posts: Post[] = [...mockPosts];
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
  notify();
}
