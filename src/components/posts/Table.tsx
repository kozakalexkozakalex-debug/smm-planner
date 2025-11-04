import type { Post } from "@/lib/types";
import { formatDateYMD } from "@/lib/dates";
import StatusBadge from "@/components/StatusBadge";

export type SortKey = "date" | "channel" | "title" | "status";
export type SortDir = "asc" | "desc";

type TableProps = {
  posts: Post[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
};

export default function PostsTable({ posts, sortKey, sortDir, onSort }: TableProps) {
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
              {renderHeader("Date", "date")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader("Channel", "channel")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader("Title", "title")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              {renderHeader("Status", "status")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.length === 0 ? (
            <tr>
              <td
                className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400"
                colSpan={4}
              >
                No posts match your filters.
              </td>
            </tr>
          ) : (
            posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{formatDateYMD(p.date)}</td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {p.channel}
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200"><StatusBadge status={p.status} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
