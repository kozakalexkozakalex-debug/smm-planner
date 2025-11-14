import { api } from "@/lib/api";
import type { Post, Channel } from "@/lib/types";
import { getPosts, addPost as localAddPost, deletePost as localDeletePost, subscribe as subscribePosts } from "@/lib/store";
import { setChannels as localSetChannels, subscribeChannels as subscribeChannelsLocal } from "@/lib/channels";

export function isApiEnabled() {
  return api.enabled();
}

export async function pullPosts() {
  if (!isApiEnabled()) return;
  try {
    const remote = await api.getPosts();
    if (Array.isArray(remote) && remote.length) {
      const current = getPosts();
      for (const p of current) {
        localDeletePost(p.id);
      }
      for (const p of remote) {
        localAddPost(p);
      }
    }
  } catch {
    // ignore
  }
}

export async function pullChannels() {
  if (!isApiEnabled()) return;
  try {
    const remote = await api.getChannels();
    if (Array.isArray(remote) && remote.length) {
      localSetChannels(remote as Channel[]);
    }
  } catch {
    // ignore
  }
}

export function watchAndPush() {
  if (!isApiEnabled()) return () => {};
  const unsubPosts = subscribePosts(() => {
    // TODO: future fine-grained push on add/update/delete
  });
  const unsubChannels = subscribeChannelsLocal(() => {
    // TODO: future fine-grained push
  });
  return () => {
    unsubPosts();
    unsubChannels();
  };
}

export async function pushPostAdd(p: Post) {
  if (!isApiEnabled()) return;
  try {
    await api.createPost(p);
  } catch {}
}
export async function pushPostUpdate(id: string, patch: Partial<Post>) {
  if (!isApiEnabled()) return;
  try {
    await api.updatePost(id, patch);
  } catch {}
}
export async function pushPostDelete(id: string) {
  if (!isApiEnabled()) return;
  try {
    await api.deletePost(id);
  } catch {}
}

export async function pushChannelAdd(c: Channel) {
  if (!isApiEnabled()) return;
  try {
    await api.createChannel(c);
  } catch {}
}
export async function pushChannelUpdate(id: string, patch: Partial<Channel>) {
  if (!isApiEnabled()) return;
  try {
    await api.updateChannel(id, patch);
  } catch {}
}
export async function pushChannelDelete(id: string) {
  if (!isApiEnabled()) return;
  try {
    await api.deleteChannel(id);
  } catch {}
}
