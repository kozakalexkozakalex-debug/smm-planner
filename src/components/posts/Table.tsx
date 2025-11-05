import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDateYMD } from "@/lib/dates";
import StatusBadge from "@/components/StatusBadge";
import ChannelBadge from "@/components/ChannelBadge";
import { t } from "@/lib/i18n";

export type SortKey = "date" | "channel" | "title" | "status";
export type SortDir = "asc" | "desc";

type TableProps = {
  posts: Post[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Post["status"]) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onDuplicate: (id: string) => void;
  hasActiveFilters: boolean;
  onCreate: () => void;
  onClearFilters?: () => void;
};

export default function PostsTable({
  posts,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdateTitle,
  onDuplicate,
  hasActiveFilters,
  onCreate,
  onClearFilters,
}: TableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState<string>("");

  function startEdit(p: Post) {
    setEditingId(p.id);
    setDraftTitle(p.title);
  }
  function saveEdit(p: Post) {
    const next = draftTitle.trim();
    if (next && next !== p.title) onUpdateTitle(p.id, next);
    setEditingId(null);
    setDraftTitle("");
  }
  function cancelEdit() {
    setEditingId(null);
    setDraftTitle("");
  }
  function renderHeader(label: string, key: SortKey) {
    const isActive = sortKey === key;
    const arrow = !isActive ? "↕" : sortDir === "asc" ? "▲" : "▼";
    return (
      <button
        type="button"
        onClick={() => onSort(key)}
        className="inline-flex items-center gap-1 hover:underline"
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        <span className="text-zinc-400">{arrow}</span>
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader(t("table.date"), "date")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader(t("table.channel"), "channel")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader(t("table.title"), "title")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader(t("table.status"), "status")}
            </th>
            <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center" colSpan={5}>
                <div className="mx-auto max-w-md space-y-3">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {hasActiveFilters ? t("table.noMatches") : t("table.noPosts")}
                  </div>
                  <div className="flex justify-center gap-2">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={onClearFilters}
                        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {t("table.clearFilters")}
                      </button>
                    )}
                    <button type="button" onClick={onCreate} className="btn-primary">
                      {hasActiveFilters ? t("table.newPost") : t("table.createPost")}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{formatDateYMD(p.date)}</td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  <ChannelBadge channel={p.channel} />
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit(p);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            cancelEdit();
                          }
                        }}
                        className="h-8 w-full max-w-sm rounded-md border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(p)}
                        className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      >
                        {t("action.save")}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        {t("action.cancel")}
                      </button>
                    </div>
                  ) : (
                    <Link href={`/posts/${p.id}`} className="hover:underline">
                      {p.title}
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <select
                      value={p.status}
                      onChange={(e) => onUpdateStatus(p.id, e.target.value as Post["status"])}
                      className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      {t("action.edit")}
                    </button>
                    {editingId !== p.id ? (
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        {t("action.quickEdit")}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onDuplicate(p.id)}
                      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      {t("action.duplicate")}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                    >
                      {t("action.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
