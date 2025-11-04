"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    return subscribe(() => setPosts(getPosts()));
  }, []);

  const list = useMemo(() => {
    if (!ymd) return [] as Post[];
    return posts.filter((p) => p.date.startsWith(ymd));
  }, [posts, ymd]);

  if (!open || !ymd) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-[92vw] max-w-xl rounded-lg border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{ymd}</h3>
          <button
            type="button"
            onClick={() => onNewForDay(ymd)}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
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

