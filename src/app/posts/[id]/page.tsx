"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Post } from "@/lib/types";
import { getPosts, updatePost, deletePost } from "@/lib/posts";
import { formatDateYMD, toISOFromLocal } from "@/lib/dates";
import { getSettings } from "@/lib/settings";
import ChannelSelect from "@/components/ChannelSelect";
import { STATUSES } from "@/lib/data";
import Link from "next/link";
import Toast from "@/components/Toast";
import { publishPost } from "@/lib/posts";
import { t } from "@/lib/i18n";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getUser } from "@/lib/auth";

export default function PostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? "");
  const post = useMemo(() => getPosts().find((p) => p.id === id), [id]);

  const [title, setTitle] = useState<string>(post?.title ?? "");
  const [channel, setChannel] = useState<Post["channel"] | "">(post?.channel ?? "");
  const localDefault = post
    ? `${formatDateYMD(post.date)}T${new Date(post.date).toTimeString().slice(0, 5)}`
    : "";
  const [dateTime, setDateTime] = useState<string>(localDefault);
  const [status, setStatus] = useState<Post["status"]>(post?.status ?? "Draft");
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState<string>("OWNER");

  useEffect(() => {
    const curr = getCurrentWorkspace();
    const user = getUser();
    if (!curr || !user?.id) return;
    (async () => {
      try {
        const res = await fetch("/api/members", { headers: { "X-Workspace-Id": curr.id, "X-User-Id": user.id } });
        if (!res.ok) return;
        const list = (await res.json()) as Array<{ id: string; role: string }>;
        const me = list.find((m) => m.id === user.id);
        if (me?.role) setRole(String(me.role));
      } catch {}
    })();
  }, []);

  const canUpdate = role === "OWNER" || role === "ADMIN" || role === "EDITOR";
  const canDelete = role === "OWNER" || role === "ADMIN";
  const canPublish = role !== "VIEWER";

  const canSave = Boolean(title && channel && dateTime);

  function onSave() {
    if (!canSave) return;
    if (!post) return;
    const tz = getSettings().timezone || undefined;
    updatePost(id, {
      title,
      channel: channel as Post["channel"],
      date: toISOFromLocal(dateTime, tz),
      status,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function onPublish() {
    if (!post) return;
    publishPost(id);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function onDelete() {
    if (!confirm("Delete this post?")) return;
    const removed = deletePost(id);
    if (removed) {
      router.push("/posts");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{post ? "Edit Post" : "Post not found"}</h1>
        <Link href="/posts" className="link-nav">
          ← Back to Posts
        </Link>
      </div>

      {!post ? null : (
        <div className="grid max-w-2xl gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            disabled={!canUpdate}
            title={!canUpdate ? "Insufficient permissions" : undefined}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Channel</label>
            <ChannelSelect
              value={channel}
              onChange={(v) => setChannel(v)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              disabled={!canUpdate}
              title={!canUpdate ? "Insufficient permissions" : undefined}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Post["status"])}
              className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              disabled={!canUpdate}
              title={!canUpdate ? "Insufficient permissions" : undefined}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            disabled={!canUpdate}
            title={!canUpdate ? "Insufficient permissions" : undefined}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button type="button" onClick={onSave} disabled={!canSave || !canUpdate} className="btn-primary disabled:opacity-60" title={!canUpdate ? "Insufficient permissions" : undefined}>
            Save
          </button>
          {post.status !== "Published" && canPublish && (
            <button
              type="button"
              onClick={onPublish}
              className="inline-flex h-9 items-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Publish
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 items-center rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            disabled={!canDelete}
            title={!canDelete ? "Only admins or owners can delete" : undefined}
          >
            Delete
          </button>
        </div>
        </div>
      )}

      <Toast show={saved} message={t("toast.saved")} />
    </section>
  );
}
