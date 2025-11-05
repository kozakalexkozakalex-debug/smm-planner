"use client";

import { getChannels, parseChannels, setChannels } from "@/lib/channels";

type Props = {
  onImported?: (count: number) => void;
  onError?: (message: string) => void;
};

export default function ImportExportChannels({ onImported, onError }: Props) {
  function handleExport() {
    const data = JSON.stringify(getChannels(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "channels-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = parseChannels(text);
        if (!parsed) {
          onError?.("Invalid file format");
          return;
        }
        setChannels(parsed);
        onImported?.(parsed.length);
      } catch {
        onError?.("Failed to read file");
      }
    };
    input.click();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Import JSON
      </button>
    </div>
  );
}

