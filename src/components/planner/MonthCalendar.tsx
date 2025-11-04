"use client";

import { useEffect, useMemo, useState } from "react";
import { getPosts, subscribe } from "@/lib/store";
import { buildMonthGrid, monthLabel } from "@/lib/dates";

type Props = {
  onSelectDate?: (ymd: string) => void;
};

export default function MonthCalendar({ onSelectDate }: Props) {
  const [anchor, setAnchor] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [counts, setCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const compute = () => {
      const map = new Map<string, number>();
      for (const p of getPosts()) {
        const d = new Date(p.date);
        if (Number.isNaN(d.getTime())) continue;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const ymd = `${y}-${m}-${day}`;
        map.set(ymd, (map.get(ymd) ?? 0) + 1);
      }
      setCounts(map);
    };
    compute();
    return subscribe(compute);
  }, []);

  const cells = useMemo(() => buildMonthGrid(anchor), [anchor]);

  function prevMonth() {
    setAnchor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setAnchor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {monthLabel(anchor)}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((c, idx) => {
          const count = counts.get(c.ymd) ?? 0;
          const muted = c.inCurrentMonth ? "" : "opacity-40";
          return (
            <button
              type="button"
              key={`${c.ymd}-${idx}`}
              onClick={() => onSelectDate?.(c.ymd)}
              className={`h-20 rounded-md border border-zinc-200 p-2 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60 ${muted}`}
            >
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {c.date.getDate()}
              </div>
              {count > 0 && (
                <div className="mt-2 inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {count} post{count > 1 ? "s" : ""}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
