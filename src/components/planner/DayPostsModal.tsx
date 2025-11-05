"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { getPosts, subscribe } from "@/lib/store";
import StatusBadge from "@/components/StatusBadge";

type Props = {
  open: boolean;
  ymd: string | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onNewForDay: (ymd: string) => void;
};

export default function DayPostsModal({ open, ymd, onClose, onEdit, onDelete, onNewForDay }: Props) {
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const newBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    return subscribe(() => setPosts(getPosts()));
  }, []);

  const list = useMemo(() => {
    if (!ymd) return [] as Post[];
    return posts.filter((p) => p.date.startsWith(ymd));
  }, [posts, ymd]);

  useEffect(() => {
    if (open) {
      if (newBtnRef.current) newBtnRef.current.focus();
    }
  }, [open]);

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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dayposts-title"
        className="relative z-10 w-[92vw] max-w-xl rounded-lg border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 id="dayposts-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{ymd}</h3>
          <button type="button" onClick={() => onNewForDay(ymd)} ref={newBtnRef} className="btn-primary text-xs py-1.5 px-3">
            New Post
          </button>
        </div>
        <div className="space-y-2">
          {list.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">No posts for this day.</div>
          ) : (
            list.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-2 dark:border-zinc-800">
                <div className="flex min-w-0 items-center gap-3">
                  <StatusBadge status={p.status} />
                  <div className="truncate text-sm text-zinc-900 dark:text-zinc-100">{p.title}</div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
