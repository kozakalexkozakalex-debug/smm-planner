import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 header-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-lg font-semibold text-amber-400"
        >
          SMM Planner
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="link-nav"
          >
            Planner
          </Link>
          <Link
            href="/posts"
            className="link-nav"
          >
            Posts
          </Link>
          <Link
            href="/channels"
            className="link-nav"
          >
            Channels
          </Link>
        </nav>
      </div>
    </header>
  );
}
