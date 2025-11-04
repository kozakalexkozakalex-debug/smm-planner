"use client";

type ToastProps = {
  show: boolean;
  message: string;
};

export default function Toast({ show, message }: ToastProps) {
  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-50 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        {message}
      </div>
    </div>
  );
}

