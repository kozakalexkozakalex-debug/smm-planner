"use client";

import { useState } from "react";
import { getPosts, parsePosts, setPosts } from "@/lib/posts";
import { t } from "@/lib/i18n";
import type { Post } from "@/lib/types";
import { CHANNELS, STATUSES } from "@/lib/data";

type Props = {
  onImported?: (count: number) => void;
  onError?: (message: string) => void;
};

function downloadBlob(data: string | Blob, filename: string, mime: string) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string): string {
  // Escape quotes and wrap when needed
  const needsWrap = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsWrap ? `"${escaped}"` : escaped;
}

function generateId(): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export default function ImportExport({ onImported, onError }: Props) {
  const [live, setLive] = useState("");
  function handleExportJSON() {
    const data = JSON.stringify(getPosts(), null, 2);
    downloadBlob(data, "posts-export.json", "application/json");
    const n = getPosts().length;
    setLive(`Exported ${n} posts`);
  }

  function handleExportCSV() {
    const rows = [
      ["id", "date", "channel", "title", "body", "status"],
      ...getPosts().map((p) => [p.id, p.date, p.channel, p.title, (p as any).body || "", p.status]),
    ];
    const csv = rows.map((r) => r.map((v) => escapeCsv(String(v))).join(",")).join("\n");
    downloadBlob(csv, "posts-export.csv", "text/csv;charset=utf-8");
    const n = getPosts().length;
    setLive(`Exported ${n} posts (CSV)`);
  }

  function handleImportJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = parsePosts(text);
        if (!parsed) {
          const msg = t("importExport.invalidFile");
          onError?.(msg);
          setLive(msg);
          return;
        }
        setPosts(parsed);
        onImported?.(parsed.length);
        setLive(`Imported ${parsed.length} posts`);
      } catch {
        const msg = t("importExport.readError");
        onError?.(msg);
        setLive(msg);
      }
    };
    input.click();
  }

  function parseCsv(text: string): Post[] | null {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length === 0) return null;
    // very simple CSV split (supports quoted cells without embedded newlines)
    const split = (line: string): string[] => {
      const out: string[] = [];
      let curr = "";
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQ && line[i + 1] === '"') {
            curr += '"';
            i++;
          } else {
            inQ = !inQ;
          }
        } else if (ch === "," && !inQ) {
          out.push(curr);
          curr = "";
        } else {
          curr += ch;
        }
      }
      out.push(curr);
      return out.map((s) => s.trim());
    };
    const header = split(lines[0]).map((h) => h.toLowerCase());
    const idx = {
      id: header.indexOf("id"),
      date: header.indexOf("date"),
      channel: header.indexOf("channel"),
      title: header.indexOf("title"),
      body: header.indexOf("body"),
      status: header.indexOf("status"),
    };
    if (idx.date === -1 || idx.channel === -1 || idx.title === -1 || idx.status === -1) return null;
    const channels = new Set<string>([...CHANNELS]);
    const statuses = new Set<string>([...STATUSES]);
    const list: Post[] = [];
    for (let li = 1; li < lines.length; li++) {
      const cols = split(lines[li]);
      const id = idx.id !== -1 ? cols[idx.id] : "";
      const date = cols[idx.date];
      const channel = cols[idx.channel] as Post["channel"];
      const title = cols[idx.title];
      const status = cols[idx.status] as Post["status"];
      const body = idx.body !== -1 ? cols[idx.body] : "";
      if (!date || !title || !channels.has(channel) || !statuses.has(status)) continue;
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) continue;
      list.push({ id: id || generateId(), date: d.toISOString(), channel, title, body, status } as Post);
    }
    return list.length ? list : null;
  }

  function handleImportCSV() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "text/csv,.csv";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = parseCsv(text);
        if (!parsed) {
          const msg = t("importExport.invalidCsv");
          onError?.(msg);
          setLive(msg);
          return;
        }
        setPosts(parsed);
        onImported?.(parsed.length);
        setLive(`Imported ${parsed.length} posts (CSV)`);
      } catch {
        const msg = t("importExport.readError");
        onError?.(msg);
        setLive(msg);
      }
    };
    input.click();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportJSON}
        aria-label={`${t("importExport.exportJson")} (${getPosts().length})`}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {t("importExport.exportJson")}
      </button>
      <button
        type="button"
        onClick={handleImportJSON}
        aria-label={t("importExport.importJson")}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("importExport.importJson")}
      </button>
      <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-700" aria-hidden />
      <button
        type="button"
        onClick={handleExportCSV}
        aria-label={`${t("importExport.exportCsv")} (${getPosts().length})`}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {t("importExport.exportCsv")}
      </button>
      <button
        type="button"
        onClick={handleImportCSV}
        aria-label={t("importExport.importCsv")}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("importExport.importCsv")}
      </button>
      <div role="status" aria-live="polite" className="sr-only">{live}</div>
    </div>
  );
}
