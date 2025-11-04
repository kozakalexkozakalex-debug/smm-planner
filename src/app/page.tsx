import Link from "next/link";

export default function PlannerDashboard() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Planner Dashboard
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Плануй пости для своїх каналів.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/posts"
          className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Новий пост
        </Link>
      </div>

      <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Calendar placeholder
      </div>
    </section>
  );
}
