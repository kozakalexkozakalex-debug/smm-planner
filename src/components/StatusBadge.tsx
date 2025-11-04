import type { Post } from "@/lib/types";

type Props = {
  status: Post["status"];
};

const styles: Record<Post["status"], string> = {
  Draft:
    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100",
  Scheduled:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  Published:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
