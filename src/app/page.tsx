"use client";

import { useState, useEffect, useRef } from "react";
import NewPostModal from "@/components/NewPostModal";
import Toast from "@/components/Toast";
import MonthCalendar from "@/components/planner/MonthCalendar";
import { toLocalInputFromYMD } from "@/lib/dates";
import DayPostsModal from "@/components/planner/DayPostsModal";
import type { Post } from "@/lib/types";
import { addPost, deletePost } from "@/lib/store";
import Hotkeys from "@/components/Hotkeys";
import { t } from "@/lib/i18n";

export default function PlannerDashboard() {
  const [open, setOpen] = useState(false);
  const [prefillLocal, setPrefillLocal] = useState<string>("");
  const [dayYmd, setDayYmd] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; local?: string; channel?: Post["channel"]; title?: string; status?: Post["status"] } | null>(null);
  const [undo, setUndo] = useState<{ show: boolean; post?: Post }>({ show: false });
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t("planner.subtitle")}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          {t("button.newPost")}
        </button>
      </div>

      <div className="rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <MonthCalendar onSelectDate={(ymd) => setDayYmd(ymd)} />
      </div>

      <DayPostsModal
        open={!!dayYmd}
        ymd={dayYmd}
        onClose={() => setDayYmd(null)}
        onNewForDay={(ymd, hour, minute) => {
          setPrefillLocal(toLocalInputFromYMD(ymd, hour ?? 9, minute ?? 0));
          setDayYmd(null);
          setEditing(null);
          setOpen(true);
        }}
        onEdit={(p) => {
          const local = `${p.date.substring(0, 10)}T${new Date(p.date).toTimeString().slice(0, 5)}`;
          setEditing({ id: p.id, local, channel: p.channel, title: p.title, status: p.status });
          setDayYmd(null);
          setOpen(true);
        }}
        onDelete={(id) => {
          if (!confirm(t("confirm.deletePost"))) return;
          const removed = deletePost(id);
          if (removed) {
            setUndo({ show: true, post: removed });
            if (undoTimer.current) clearTimeout(undoTimer.current);
            undoTimer.current = setTimeout(() => setUndo({ show: false, post: undefined }), 5000);
          }
        }}
      />

      <NewPostModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => setSavedToast(true)}
        initialLocalDateTime={editing?.local || prefillLocal || undefined}
        editingPostId={editing?.id}
        initialChannel={editing?.channel}
        initialTitle={editing?.title}
        initialStatus={editing?.status}
      />
      <Hotkeys onNew={() => setOpen(true)} />
      <Toast show={savedToast} message={t("toast.saved")} />
      <Toast
        show={undo.show}
        message={t("toast.deleted")}
        actionLabel={t("action.undo")}
        onAction={() => {
          if (undoTimer.current) {
            clearTimeout(undoTimer.current);
            undoTimer.current = null;
          }
          if (undo.post) addPost(undo.post);
          setUndo({ show: false, post: undefined });
        }}
      />
    </section>
  );
}
