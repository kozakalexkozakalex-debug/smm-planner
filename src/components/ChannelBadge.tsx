import type { Post } from "@/lib/types";

type Props = {
  channel: Post["channel"];
};

const styles: Record<Post["channel"], string> = {
  Instagram: "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200",
  Facebook: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  TikTok: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
  YouTube: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  X: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700/40 dark:text-zinc-200",
};

export default function ChannelBadge({ channel }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[channel]}`}>
      {channel}
    </span>
  );
}

