"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { Post } from "@/lib/types";
import { STATUSES } from "@/lib/data";
import { addPost, updatePost } from "@/lib/posts";
import { toISOFromLocal } from "@/lib/dates";
import { getSettings } from "@/lib/settings";
import ChannelSelect from "@/components/ChannelSelect";
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
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const [channel, setChannel] = useState<"" | Post["channel"]>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<Post["status"]>(initialStatus ?? "Draft");

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
    setErrors({});
  }

  function close() {
    // restore focus to the element that was focused before opening
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
        status,
      });
    } else {
      const newPost: Post = {
        id: genId(),
        date: nextDate,
        channel: nextChannel,
        title: nextTitle,
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
    // save last focused element and focus first field on open
    if (isOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      const focusables = getFocusable();
      if (focusables.length) {
        focusables[0].focus();
      }
    }
    // no cleanup needed; focus restored in close()
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={handleKeyDown}>
      <div
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-hidden="true"
      />
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
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label={t("action.close")}
          title={t("action.close")}
        >
          ×
        </button>
        <div className="mb-4 pr-8">
          <h2 id="newpost-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{editingPostId ? t("newPost.titleEdit") : t("newPost.titleNew")}</h2>
          <p id="newpost-desc" className="text-sm text-zinc-600 dark:text-zinc-400">{t("newPost.subtitle")}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.channel")}</label>
              <ChannelSelect
                value={channel || initialChannel || ""}
                onChange={(v) => setChannel(v)}
                className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
                aria-invalid={!!errors.channel}
                aria-describedby={errors.channel ? "newpost-err-channel" : undefined}
                required
              />
              {errors.channel && (
                <span id="newpost-err-channel" className="mt-1 text-xs text-red-600">{errors.channel}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.status")}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Post["status"])}
                className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
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
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.datetime")}</label>
            <input
              type="datetime-local"
              value={dateTime || initialLocalDateTime || ""}
              onChange={(e) => setDateTime(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              aria-invalid={!!errors.dateTime}
              aria-describedby={errors.dateTime ? "newpost-err-datetime" : undefined}
              required
            />
            {errors.dateTime && (
              <span id="newpost-err-datetime" className="mt-1 text-xs text-red-600">{errors.dateTime}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("newPost.titleLabel")}</label>
            <input
              value={title || initialTitle || ""}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              placeholder={t("newPost.titlePlaceholder")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "newpost-err-title" : undefined}
              required
            />
            {errors.title && (
              <span id="newpost-err-title" className="mt-1 text-xs text-red-600">{errors.title}</span>
            )}
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
