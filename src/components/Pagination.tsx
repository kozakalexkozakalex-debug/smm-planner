"use client";

import { t } from "@/lib/i18n";
type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label={t("pagination.prev")}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 disabled:opacity-50 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {t("pagination.prev")}
      </button>
      <div className="text-zinc-600 dark:text-zinc-400">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label={t("pagination.next")}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 disabled:opacity-50 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {t("pagination.next")}
      </button>
    </div>
  );
}
