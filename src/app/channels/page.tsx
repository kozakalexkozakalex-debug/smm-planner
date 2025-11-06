"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Toast from "@/components/Toast";
import ImportExportChannels from "@/components/channels/ImportExportChannels";
import { addChannel, deleteChannel, getChannels, subscribeChannels, updateChannel } from "@/lib/channelsBoundary";
import type { Channel } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function ChannelsPage() {
  const [channels, setChannelsState] = useState<Channel[]>(() => getChannels());
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [undo, setUndo] = useState<{ show: boolean; channel?: Channel }>({ show: false });
  const [importToast, setImportToast] = useState<string | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => subscribeChannels(() => setChannelsState(getChannels())), []);

  useEffect(() => {
    if (!undo.show) return;
    const t = setTimeout(() => setUndo({ show: false, channel: undefined }), 5000);
    return () => clearTimeout(t);
  }, [undo.show]);

  useEffect(() => {
    if (!importToast) return;
    const t = setTimeout(() => setImportToast(null), 2000);
    return () => clearTimeout(t);
  }, [importToast]);

  const sorted = useMemo(() => {
    return [...channels].sort((a, b) => a.name.localeCompare(b.name));
  }, [channels]);

  function handleAdd() {
    const name = newName.trim() as Channel["name"];
    if (!name) return;
    addChannel(name);
    setNewName("");
  }

  function startEdit(c: Channel) {
    setEditingId(c.id);
    setDraftName(c.name);
  }
  function saveEdit(c: Channel) {
    const next = draftName.trim();
    if (next && next !== c.name) updateChannel(c.id, { name: next as Channel["name"] });
    setEditingId(null);
    setDraftName("");
  }
  function cancelEdit() {
    setEditingId(null);
    setDraftName("");
  }
  function handleDelete(id: string) {
    if (!confirm(t("confirm.deleteChannel"))) return;
    const removed = deleteChannel(id);
    if (removed) {
      setUndo({ show: true, channel: removed });
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setUndo({ show: false, channel: undefined }), 5000);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{t("channels.title")}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t("channels.subtitle")}</p>
        </div>
        <ImportExportChannels
          onImported={(n) => setImportToast(`Imported ${n} channels`)}
          onError={(m) => setImportToast(m)}
        />
      </header>

      <div className="flex items-end gap-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("channels.new")}</label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Instagram, Facebook, …"
            className="h-9 w-64 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="h-9 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("channels.add")}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">{t("channels.name")}</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">{t("channels.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sorted.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center" colSpan={2}>
                  <div className="mx-auto max-w-md space-y-3">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{t("channels.empty")}</div>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                    {editingId === c.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit(c);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEdit();
                            }
                          }}
                          className="h-8 w-full max-w-sm rounded-md border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(c)}
                          className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                          {t("channels.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          {t("channels.cancel")}
                        </button>
                      </div>
                    ) : (
                      <span>{c.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {editingId !== c.id ? (
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        aria-label={`Edit channel ${c.name}`}
                      >
                        {t("channels.edit")}
                      </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                        aria-label={`Delete channel ${c.name}`}
                      >
                        {t("channels.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast
        show={undo.show}
        message={t("toast.deleted")}
        actionLabel={t("action.undo")}
        onAction={() => {
          if (undoTimer.current) {
            clearTimeout(undoTimer.current);
            undoTimer.current = null;
          }
          if (undo.channel) addChannel(undo.channel.name);
          setUndo({ show: false, channel: undefined });
        }}
      />
      <Toast show={!!importToast} message={importToast ?? ""} />
    </section>
  );
}
