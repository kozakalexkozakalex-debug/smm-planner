"use client";

import { useState, useEffect } from "react";
import NewPostModal from "@/components/NewPostModal";
import Toast from "@/components/Toast";
import MonthCalendar from "@/components/planner/MonthCalendar";
import { toLocalInputFromYMD } from "@/lib/dates";

export default function PlannerDashboard() {
  const [open, setOpen] = useState(false);
  const [prefillLocal, setPrefillLocal] = useState<string>("");
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (!savedToast) return;
    const t = setTimeout(() => setSavedToast(false), 2000);
    return () => clearTimeout(t);
  }, [savedToast]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Planner Dashboard</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">Плануй пости для своїх каналів.</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Новий пост
        </button>
      </div>

      <div className="rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <MonthCalendar
          onSelectDate={(ymd) => {
            setPrefillLocal(toLocalInputFromYMD(ymd, 9, 0));
            setOpen(true);
          }}
        />
      </div>

      <NewPostModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => setSavedToast(true)}
        initialLocalDateTime={prefillLocal || undefined}
      />
      <Toast show={savedToast} message="Saved" />
    </section>
  );
}
