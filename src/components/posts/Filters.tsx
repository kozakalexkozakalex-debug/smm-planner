"use client";

type FiltersProps = {
  channelOptions: Array<"Instagram" | "Facebook" | "TikTok" | "YouTube" | "X">;
  statusOptions: Array<"Draft" | "Scheduled" | "Published">;
  selectedChannel: string;
  selectedStatus: string;
  search: string;
  onChannelChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export default function Filters({
  channelOptions,
  statusOptions,
  selectedChannel,
  selectedStatus,
  search,
  onChannelChange,
  onStatusChange,
  onSearchChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Channel
        </label>
        <select
          value={selectedChannel}
          onChange={(e) => onChannelChange(e.target.value)}
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        >
          <option value="">All channels</option>
          {channelOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        >
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex grow flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Title
        </label>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title…"
          className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        />
      </div>
    </div>
  );
}
