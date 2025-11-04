import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          SMM Planner
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Planner
          </Link>
          <Link
            href="/posts"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Posts
          </Link>
        </nav>
      </div>
    </header>
  );
}
