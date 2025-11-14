"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { Post } from "@/lib/types";
import { STATUSES } from "@/lib/data";
import { addPost, updatePost } from "@/lib/posts";
import { toISOFromLocal } from "@/lib/dates";
import { getSettings } from "@/lib/settings";
import ChannelSelect from "@/components/ChannelSelect";
import ChannelBadge from "@/components/ChannelBadge";
import StatusBadge from "@/components/StatusBadge";
import { t } from "@/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  onError?: (code: "quota" | "network" | "forbidden" | "unknown") => void;
  initialLocalDateTime?: string;
  editingPostId?: string;
  initialChannel?: Post["channel"];
  initialTitle?: string;
  initialStatus?: Post["status"];
  initialMedia?: string[];
  initialContent?: string;
};

export default function NewPostModal({
  open,
  onClose,
  onSaved,
  onError,
  initialLocalDateTime,
  editingPostId,
  initialChannel,
  initialTitle,
  initialStatus,
  initialMedia,
  initialContent,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const [channel, setChannel] = useState<"" | Post["channel"]>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<Post["status"]>(initialStatus ?? "Draft");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [media, setMedia] = useState<string[]>(() => (initialMedia ?? []) as string[]);
  const [copied, setCopied] = useState(false);

  const [errors, setErrors] = useState<{ channel?: string; dateTime?: string; title?: string }>({});

  const isOpen = open;

  const canSave = useMemo(() => {
    const effectiveDateTime = dateTime || initialLocalDateTime || "";
    const effectiveChannel = channel || initialChannel || "";
    const effectiveTitle = title || initialTitle || "";
    return Boolean(effectiveChannel && effectiveDateTime && effectiveTitle);
  }, [channel, dateTime, title, initialLocalDateTime, initialChannel, initialTitle]);

  function resetForm() {
    setChannel("");
    setDateTime("");
    setTitle("");
    setContent("");
    setStatus("Draft");
    setMediaUrl("");
    setMedia([]);
    setErrors({});
  }

  function close() {
    const last = lastActiveRef.current;
    onClose();
    if (last) {
      queueMicrotask(() => last.focus());
    }
  }

  function validate() {
    const next: typeof errors = {};
    if (!(channel || initialChannel)) next.channel = t("error.required");
    if (!(dateTime || initialLocalDateTime)) next.dateTime = t("error.required");
    if (!(title || initialTitle)) next.title = t("error.required");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function genId() {
    // Prefer UUID if available
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const local = dateTime || initialLocalDateTime || "";
    const tz = getSettings().timezone || undefined;
    const nextDate = toISOFromLocal(local, tz);
    const nextChannel = (channel || initialChannel) as Post["channel"];
    const nextTitle = title || (initialTitle ?? "");

    if (editingPostId) {
      updatePost(editingPostId, {
        date: nextDate,
        channel: nextChannel,
        title: nextTitle,
        body: content || initialContent || "",
        status,
        media,
      });
    } else {
      const newPost: Post = {
        id: genId(),
        date: nextDate,
        channel: nextChannel,
        title: nextTitle,
        body: content || "",
        media,
        status,
      };
      addPost(newPost, {
        onError: (code) => {
          onError?.(code as any);
        },
      });
    }
    onSaved?.();
    resetForm();
    close();
  }

  function isValidUrl(u: string): boolean {
    try {
      const url = new URL(u);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function formatPreview(dt: string | undefined | null): string {
    const val = dt || initialLocalDateTime || "";
    if (!val) return "";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    try {
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" } as any);
    } catch {
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  }

  const previewText = (() => {
    const txt = content || initialContent || "";
    return txt.length > 280 ? `${txt.slice(0, 277)}...` : txt;
  })();

  async function copyPreview() {
    try {
      const txt = `${title || initialTitle || ""}\n${content || initialContent || ""}`.trim();
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  function getFocusable(): HTMLElement[] {
    const root = containerRef.current;
    if (!root) return [];
    const nodes = root.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    return Array.from(nodes).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === "Tab") {
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !focusables.includes(active as HTMLElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !focusables.includes(active as HTMLElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      const focusables = getFocusable();
      if (focusables.length) {
        focusables[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newpost-title"
        aria-describedby="newpost-desc"
        ref={containerRef}
        className="relative z-10 w-[92vw] max-w-lg rounded-lg border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("action.close")}
          className="absolute right-3 top-3 rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
        >
          Г—
        </button>

        <h2 id="newpost-title" className="text-xl font-semibold">
          {editingPostId ? t("newPost.titleEdit") : t("newPost.titleNew")}
        </h2>
        <p id="newpost-desc" className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          {t("newPost.subtitle")}
        </p>

        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.channel")}</label>
              <ChannelSelect value={channel} onChange={(v) => setChannel(v)} />
              {errors.channel && <span className="mt-1 text-xs text-red-600">{errors.channel}</span>}
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
              aria-invalid={!!errors.dateTime}
            />
            {errors.dateTime && <span className="mt-1 text-xs text-red-600">{errors.dateTime}</span>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.titleLabel")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              placeholder={t("newPost.titlePlaceholder")}
              aria-invalid={!!errors.title}
              required
            />
            {errors.title && <span className="mt-1 text-xs text-red-600">{errors.title}</span>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.contentLabel")}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              placeholder={t("newPost.contentPlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.mediaLabel")}</label>
            <div className="flex items-center gap-2">
              <input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={t("newPost.mediaPlaceholder")}
                className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              />
              <button
                type="button"
                onClick={() => {
                  const u = mediaUrl.trim();
                  if (!u) return;
                  if (!isValidUrl(u)) return;
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
                      <div className="absolute inset-x-1 top-1 flex items-center justify-between gap-1">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setMedia((m) => {
                                if (idx === 0) return m;
                                const next = [...m];
                                const [it] = next.splice(idx, 1);
                                next.splice(idx - 1, 0, it);
                                return next;
                              })
                            }
                            className="rounded bg-white/80 px-1 text-[10px] text-zinc-700 hover:bg-white dark:bg-zinc-900/80 dark:text-zinc-200"
                            aria-label="Move left"
                            disabled={idx === 0}
                          >
                            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setMedia((m) => {
                                if (idx === m.length - 1) return m;
                                const next = [...m];
                                const [it] = next.splice(idx, 1);
                                next.splice(idx + 1, 0, it);
                                return next;
                              })
                            }
                            className="rounded bg-white/80 px-1 text-[10px] text-zinc-700 hover:bg-white dark:bg-zinc-900/80 dark:text-zinc-200"
                            aria-label="Move right"
                            disabled={idx === media.length - 1}
                          >
                            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMedia((m) => m.filter((x) => x !== u))}
                          className="rounded bg-white/80 px-1 text-[10px] text-zinc-700 hover:bg-white dark:bg-zinc-900/80 dark:text-zinc-200"
                          aria-label={t("action.delete")}
                        >
                          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-200">
              <span>{t("preview.title")}</span>
              <button
                type="button"
                onClick={copyPreview}
                className="rounded-md border border-zinc-300 px-2 py-0.5 text-[10px] font-normal text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                aria-live="polite"
              >
                {copied ? t("preview.copied") : t("preview.copy")}
              </button>
            </div>
            <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <ChannelBadge channel={(channel || initialChannel || "Instagram") as Post["channel"]} />
                <span>В· {formatPreview(dateTime)}</span>
              </div>
              <div className="mt-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{title || initialTitle || t("posts.untitled")}</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">{previewText}</div>
              {media.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {media.slice(0, 3).map((u) => (
                    <img key={u} src={u} alt="" className="h-16 w-full rounded object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {t("action.cancel")}
            </button>
            <button type="submit" disabled={!canSave} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
              {t("action.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
