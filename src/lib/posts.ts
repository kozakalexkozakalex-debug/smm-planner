import type { Post } from "./types";
import { api } from "./api";
import {
  getPosts as localGetPosts,
  setPosts as localSetPosts,
  subscribe as localSubscribe,
  addPost as localAddPost,
  updatePost as localUpdatePost,
  deletePost as localDeletePost,
  duplicatePost as localDuplicatePost,
  parsePosts as localParsePosts,
} from "./store";

function remoteEnabled(): boolean {
  try {
    const val = (api as unknown as { enabled?: unknown }).enabled;
    return typeof val === "function" ? Boolean((val as () => boolean)()) : Boolean(val);
  } catch {
    return false;
  }
}

export function isRemote(): boolean {
  return remoteEnabled();
}

export async function refresh(): Promise<void> {
  if (!remoteEnabled()) return;
  try {
    const list = await api.getPosts();
    localSetPosts(list);
  } catch {
    // ignore network/API errors; UI remains functional with local data
  }
}

export function getPosts(): Post[] {
  return localGetPosts();
}

export function setPosts(next: Post[]): void {
  localSetPosts(next);
}

export function subscribe(fn: () => void): () => void {
  return localSubscribe(fn);
}

export function addPost(p: Post, opts?: { onError?: (code: string, err: unknown) => void }): void {
  localAddPost(p);
  if (remoteEnabled()) {
    void api
      .createPost(p)
      .then(() => refresh())
      .catch((err: any) => {
        if (err?.status === 429) {
          // revert optimistic add
          localDeletePost(p.id);
          opts?.onError?.("quota", err);
          return;
        }
        opts?.onError?.("network", err);
      });
  }
}

export function updatePost(id: string, patch: Partial<Post>): void {
  localUpdatePost(id, patch);
  if (remoteEnabled()) {
    void api
      .updatePost(id, patch)
      .then(() => refresh())
      .catch(() => {});
  }
}

export function deletePost(id: string): Post | null {
  const removed = localDeletePost(id);
  if (removed && remoteEnabled()) {
    void api
      .deletePost(id)
      .then(() => refresh())
      .catch(() => {});
  }
  return removed;
}

export function duplicatePost(id: string, opts?: { onError?: (code: string, err: unknown) => void }): Post | null {
  const clone = localDuplicatePost(id);
  if (clone && remoteEnabled()) {
    void api
      .createPost(clone)
      .then(() => refresh())
      .catch((err: any) => {
        if (err?.status === 429) {
          // revert optimistic duplicate
          localDeletePost(clone.id);
          opts?.onError?.("quota", err);
          return;
        }
        opts?.onError?.("network", err);
      });
  }
  return clone;
}

export function parsePosts(raw: unknown): Post[] | null {
  return localParsePosts(raw);
}

export function publishPost(id: string): void {
  localUpdatePost(id, { status: "Published" as Post["status"] });
  if (remoteEnabled()) {
    void api
      .publishPost(id)
      .then(() => refresh())
      .catch(() => {});
  }
}
