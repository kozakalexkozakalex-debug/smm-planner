"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Post } from "@/lib/types";
import { getPosts, updatePost, deletePost, publishPost } from "@/lib/posts";
import { formatDateYMD, toISOFromLocal } from "@/lib/dates";
import { getSettings } from "@/lib/settings";
import ChannelSelect from "@/components/ChannelSelect";
import ChannelBadge from "@/components/ChannelBadge";
import StatusBadge from "@/components/StatusBadge";
import { STATUSES } from "@/lib/data";
import Link from "next/link";
import Toast from "@/components/Toast";
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
  const [content, setContent] = useState<string>((post as any)?.body ?? "");
  const [media, setMedia] = useState<string[]>(() => ((post as any)?.media ?? []) as string[]);
  const [mediaUrl, setMediaUrl] = useState("");
  const localDefault = post ? `${formatDateYMD(post.date)}T${new Date(post.date).toTimeString().slice(0, 5)}` : "";
  const [dateTime, setDateTime] = useState<string>(localDefault);
  const [status, setStatus] = useState<Post["status"]>(post?.status ?? "Draft");
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState<string>("OWNER");
  const [copied, setCopied] = useState(false);

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
    if (!canSave || !post) return;
    const tz = getSettings().timezone || undefined;
    updatePost(id, {
      title,
      channel: channel as Post["channel"],
      date: toISOFromLocal(dateTime, tz),
      body: content,
      media,
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
    if (removed) router.push("/posts");
  }

  function formatPreview(dt: string | undefined | null): string {
    const val = dt || "";
    if (!val) return "";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    try {
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" } as any);
    } catch {
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  }
  const previewText = content.length > 280 ? `${content.slice(0, 277)}Р Р†Р вЂљР’В¦` : content;

  async function copyPreview() {
    try {
      const txt = `${title}\n${content}`.trim();
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{post ? t("post.editTitle") : t("post.notFound")}</h1>
        <Link href="/posts" className="link-nav">{t("posts.back")}</Link>
      </div>

      {!post ? null : (
        <div className="grid max-w-2xl gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.titleLabel")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.channel")}</label>
              <ChannelSelect value={channel} onChange={(v) => setChannel(v)} />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.status")}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Post["status"])}
                className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{t("status." + s)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.datetime")}</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.contentLabel")}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.mediaLabel")}</label>
            <div className="flex items-center gap-2">
              <input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://Р Р†Р вЂљР’В¦"
                className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              />
              <button
                type="button"
                onClick={() => {
                  const u = mediaUrl.trim();
                  if (!u) return;
                  try {
                    const url = new URL(u);
                    if (!(url.protocol === "http:" || url.protocol === "https:")) return;
                  } catch { return; }
                  setMedia((m) => (m.includes(u) ? m : [u, ...m]));
                  setMediaUrl("");
                }}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {t("channels.add")}
              </button>
            </div>
            {media.length > 0 && (
              <>
              <div id="media-hint" className="text-xs text-zinc-500 dark:text-zinc-400">{t("media.reorderHint")}</div>
              <div className="grid grid-cols-3 gap-2" role="list" aria-describedby="media-hint">
                {media.map((u, idx) => (
                  <div
                    key={u}
                    className="relative overflow-hidden rounded border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800"
                    role="listitem"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", String(idx));
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = Number(e.dataTransfer.getData("text/plain"));
                      if (!Number.isFinite(from) || from === idx) return;
                      setMedia((m) => {
                        const next = [...m];
                        const [it] = next.splice(from, 1);
                        next.splice(idx, 0, it);
                        return next;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft" && idx > 0) {
                        e.preventDefault();
                        setMedia((m) => {
                          const next = [...m];
                          const [it] = next.splice(idx, 1);
                          next.splice(idx - 1, 0, it);
                          return next;
                        });
                      } else if (e.key === "ArrowRight" && idx < media.length - 1) {
                        e.preventDefault();
                        setMedia((m) => {
                          const next = [...m];
                          const [it] = next.splice(idx, 1);
                          next.splice(idx + 1, 0, it);
                          return next;
                        });
                      } else if (e.key === "Delete" || e.key === "Backspace") {
                        e.preventDefault();
                        setMedia((m) => m.filter((x) => x !== u));
                      }
                    }}
                    tabIndex={0}
                    aria-grabbed="true"
                  >
                    <img src={u} alt="" className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setMedia((m) => m.filter((x) => x !== u))}
                      className="absolute right-1 top-1 rounded bg-white/80 px-1 text-[10px] text-zinc-700 hover:bg-white dark:bg-zinc-900/80 dark:text-zinc-200"
                      aria-label={t("action.delete")}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>

          <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <ChannelBadge channel={(channel || post?.channel || "Instagram") as Post["channel"]} />
              <span>Р Р†Р вЂљРЎС› {formatPreview(dateTime)}</span>
              <StatusBadge status={status} />
            </div>
            <div className="mt-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{title || t("posts.untitled")}</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">{previewText}</div>
            {media.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {media.slice(0, 3).map((u) => (
                  <img key={u} src={u} alt="" className="h-16 w-full rounded object-cover" />
                ))}
              </div>
            )}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={copyPreview}
                className="rounded-md border border-zinc-300 px-2 py-0.5 text-[10px] font-normal text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {copied ? t("preview.copied") : t("preview.copy")}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onSave} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={!canSave || !canUpdate}>Save</button>
            <button type="button" onClick={onPublish} className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800" disabled={!canPublish}>Publish</button>
            <button type="button" onClick={onDelete} className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-700 dark:bg-zinc-900 dark:text-red-300 dark:hover:bg-red-900/20" disabled={!canDelete}>Delete</button>
          </div>
        </div>
      )}

      <Toast show={saved} message={t("toast.saved")} />
    </section>
  );
}

