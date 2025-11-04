export function toISOFromLocal(local: string): string {
  // Accepts input[type="datetime-local"] like "2025-11-05T09:00"
  if (!local) return "";
  const d = new Date(local);
  return d.toISOString();
}

export function formatDateYMD(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function monthLabel(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export type DayCell = {
  date: Date;
  ymd: string;
  inCurrentMonth: boolean;
};

export function buildMonthGrid(anchor: Date, weekStart: 0 | 1 = 1): DayCell[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth(); // 0-11
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(firstOfMonth);
  // Align to week start (0 = Sunday, 1 = Monday)
  const dow = start.getDay();
  const shift = (dow - weekStart + 7) % 7;
  start.setDate(start.getDate() - shift);
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${day}`;
    cells.push({
      date: d,
      ymd,
      inCurrentMonth: d.getMonth() === month,
    });
  }
  return cells;
}

export function toLocalInputFromYMD(ymd: string, hour = 9, minute = 0): string {
  // Returns value for input[type="datetime-local"], e.g. 2025-11-05T09:00
  const [y, m, d] = ymd.split("-").map((v) => parseInt(v, 10));
  if (!y || !m || !d) return "";
  const dt = new Date(y, m - 1, d, hour, minute, 0, 0);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
