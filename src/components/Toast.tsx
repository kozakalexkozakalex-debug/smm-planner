"use client";

type ToastProps = {
  show: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function Toast({ show, message, actionLabel, onAction }: ToastProps) {
  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-50 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        <span>{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
