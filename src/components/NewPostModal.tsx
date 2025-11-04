"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/types";
import { CHANNELS, STATUSES } from "@/lib/data";
import { addPost } from "@/lib/store";
import { toISOFromLocal } from "@/lib/dates";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  initialLocalDateTime?: string;
};

export default function NewPostModal({ open, onClose, onSaved, initialLocalDateTime }: Props) {
  const [channel, setChannel] = useState<"" | Post["channel"]>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<Post["status"]>("Draft");

  const [errors, setErrors] = useState<{ channel?: string; dateTime?: string; title?: string }>({});

  const isOpen = open;

  const canSave = useMemo(() => {
    const effectiveDateTime = dateTime || initialLocalDateTime || "";
    return Boolean(channel && effectiveDateTime && title);
  }, [channel, dateTime, title, initialLocalDateTime]);

  function resetForm() {
    setChannel("");
    setDateTime("");
    setTitle("");
    setContent("");
    setStatus("Draft");
    setErrors({});
  }

  function close() {
    onClose();
  }

  function validate() {
    const next: typeof errors = {};
    if (!channel) next.channel = "Required";
    if (!dateTime) next.dateTime = "Required";
    if (!title) next.title = "Required";
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
    const newPost: Post = {
      id: genId(),
      date: toISOFromLocal(local),
      channel: channel as Post["channel"],
      title,
      status,
    };

    addPost(newPost);
    onSaved?.();
    resetForm();
    close();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[92vw] max-w-lg rounded-lg border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">New Post</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Fill in the details below.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as Post["channel"] | "")}
                className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              >
                <option value="">Select…</option>
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.channel && (
                <span className="mt-1 text-xs text-red-600">{errors.channel}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Status</label>
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
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Date & Time</label>
            <input
              type="datetime-local"
              value={dateTime || initialLocalDateTime || ""}
              onChange={(e) => setDateTime(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
            {errors.dateTime && (
              <span className="mt-1 text-xs text-red-600">{errors.dateTime}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              placeholder="Post title…"
            />
            {errors.title && (
              <span className="mt-1 text-xs text-red-600">{errors.title}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
              placeholder="Optional content…"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="inline-flex h-9 items-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
