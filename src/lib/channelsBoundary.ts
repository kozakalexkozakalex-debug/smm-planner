import type { Channel } from "@/lib/types";
import { api } from "@/lib/api";
import {
  getChannels as localGet,
  subscribeChannels as localSubscribe,
  addChannel as localAdd,
  updateChannel as localUpdate,
  deleteChannel as localDelete,
  setChannels as localSet,
  parseChannels as localParse,
} from "@/lib/channels";

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
    const list = await api.getChannels();
    localSet(list);
  } catch {
    // ignore network errors
  }
}

export function getChannels(): Channel[] {
  return localGet();
}
export function subscribeChannels(fn: () => void): () => void {
  return localSubscribe(fn);
}
export function addChannel(name: Channel["name"]): void {
  localAdd(name);
  if (remoteEnabled()) {
    const c: Channel | undefined = getChannels().find((x) => x.name === name);
    if (c) {
      void api.createChannel(c).then(() => refresh()).catch(() => {});
    }
  }
}
export function updateChannel(id: string, fields: Partial<Pick<Channel, "name">>): void {
  localUpdate(id, fields);
  if (remoteEnabled()) {
    void api.updateChannel(id, fields).then(() => refresh()).catch(() => {});
  }
}
export function deleteChannel(id: string): Channel | null {
  const removed = localDelete(id);
  if (removed && remoteEnabled()) {
    void api.deleteChannel(id).then(() => refresh()).catch(() => {});
  }
  return removed;
}
export function setChannels(list: Channel[]): void {
  localSet(list);
  if (remoteEnabled()) {
    // naive sync: push each channel (API should handle upserts)
    void Promise.all(list.map((c) => api.updateChannel(c.id, { name: c.name }))).then(() => refresh()).catch(() => {});
  }
}
export function parseChannels(raw: unknown): Channel[] | null {
  return localParse(raw);
}

