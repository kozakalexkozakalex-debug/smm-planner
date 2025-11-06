"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { getPosts, subscribe, updatePost } from "@/lib/posts";
import { getSettings, subscribeSettings } from "@/lib/settings";
import { toISOFromLocal, formatTimeHM, formatDateYMD } from "@/lib/dates";
import Toast from "@/components/Toast";
import StatusBadge from "@/components/StatusBadge";
import ChannelBadge from "@/components/ChannelBadge";
import { t } from "@/lib/i18n";

type Props = {
  open: boolean;
  ymd: string | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onNewForDay: (ymd: string, hour?: number, minute?: number) => void;
};

export default function DayPostsModal({ open, ymd, onClose, onEdit, onDelete, onNewForDay }: Props) {
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const newBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const initialSettings = getSettings();
  const [quickTimes, setQuickTimes] = useState(() => initialSettings.quickTimes);
  const [timezone, setTimezone] = useState(() => initialSettings.timezone);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [resched, setResched] = useState(false);

  useEffect(() => {
    return subscribe(() => setPosts(getPosts()));
  }, []);

  useEffect(() => {
    return subscribeSettings(() => {
      const s = getSettings();
      setQuickTimes(s.quickTimes);
      setTimezone(s.timezone);
    });
  }, []);

  const list = useMemo(() => {
    if (!ymd) return [] as Post[];
    const tz = timezone || undefined;
    return posts.filter((p) => formatDateYMD(p.date, tz) === ymd);
  }, [posts, ymd, timezone]);

  useEffect(() => {
    if (open) {
      // store last focused element and move focus inside modal
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      if (newBtnRef.current) newBtnRef.current.focus();
    }
  }, [open]);

  function close() {
    onClose();
    const last = lastActiveRef.current;
    if (last) queueMicrotask(() => last.focus());
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
      onClose();
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

  if (!open || !ymd) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden="true" />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dayposts-title"
        aria-describedby="dayposts-desc"
        className="relative z-10 w-[92vw] max-w-xl rounded-lg border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
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
        <div className="mb-3 flex items-center justify-between">
          <h3 id="dayposts-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{ymd}</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onNewForDay(ymd)} ref={newBtnRef} className="btn-primary text-xs py-1.5 px-3">
              {t("button.newPost")}
            </button>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
              <span>
                {t("day.quick")}
                {timezone ? ` (${t("day.tz")} ${timezone})` : ":"}
              </span>
              {quickTimes.map((qt, idx) => {
                const hh = String(qt.hour).padStart(2, "0");
                const mm = String(qt.minute).padStart(2, "0");
                const label = `${hh}:${mm}`;
                return (
                  <button
                    key={`${idx}-${label}`}
                    type="button"
                    onClick={() => onNewForDay(ymd, qt.hour, qt.minute)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragKey(label);
                    }}
                    onDragLeave={() => setDragKey((k) => (k === label ? null : k))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedId = e.dataTransfer.getData("text/post-id");
                      if (droppedId) {
                        const local = `${ymd}T${label}`;
                        const tz = timezone || undefined;
                        updatePost(droppedId, { date: toISOFromLocal(local, tz) });
                        setResched(true);
                        setTimeout(() => setResched(false), 1200);
                      }
                      setDragKey(null);
                    }}
                    className={`rounded-md border px-2 py-0.5 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 ${
                      dragKey === label
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
                        : "border-zinc-300 bg-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div id="dayposts-desc" className="hidden sm:block text-[10px] text-zinc-500 dark:text-zinc-400">{t("day.tip")}</div>
          {list.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{t("day.noPosts")}</div>
          ) : (
            list.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 p-2 dark:border-zinc-800"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/post-id", p.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <StatusBadge status={p.status} />
                  <ChannelBadge channel={p.channel} />
                  <div className="truncate text-sm text-zinc-900 dark:text-zinc-100">{p.title}</div>
                  <div className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatTimeHM(p.date, timezone || undefined)}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <label className="sr-only" htmlFor={`move-${p.id}`}>
                    Move post to time
                  </label>
                  <select
                    id={`move-${p.id}`}
                    aria-label="Move post to quick time"
                    defaultValue=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const tz = timezone || undefined;
                      const local = `${ymd}T${val}`;
                      updatePost(p.id, { date: toISOFromLocal(local, tz) });
                      setResched(true);
                      setTimeout(() => setResched(false), 1200);
                      e.currentTarget.value = "";
                    }}
                    className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="">Move to…</option>
                    {quickTimes.map((qt, i) => {
                      const hh = String(qt.hour).padStart(2, "0");
                      const mm = String(qt.minute).padStart(2, "0");
                      const label = `${hh}:${mm}`;
                      return (
                        <option key={`${p.id}-qt-${i}`} value={label}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    {t("action.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                  >
                    {t("action.delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Toast show={resched} message={t("day.rescheduled")} />
    </div>
  );
}
