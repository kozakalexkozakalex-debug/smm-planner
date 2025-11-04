import type { Post } from "@/lib/types";

type TableProps = {
  posts: Post[];
};

export default function PostsTable({ posts }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Channel
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Title
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Status
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
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {p.date.substring(0, 10)}
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {p.channel}
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                  {p.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
