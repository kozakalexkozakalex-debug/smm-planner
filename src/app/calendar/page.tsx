"use client";

import { useEffect, useRef, useState } from "react";
import MonthCalendar from "@/components/planner/MonthCalendar";
import DayPostsModal from "@/components/planner/DayPostsModal";
import NewPostModal from "@/components/NewPostModal";
import Toast from "@/components/Toast";
import { toLocalInputFromYMD, formatDateYMD, formatTimeHM } from "@/lib/dates";
import type { Post } from "@/lib/types";
import { addPost, deletePost } from "@/lib/posts";
import { api } from "@/lib/api";
import { entitlementsForPlan } from "@/lib/entitlements";
import { getPosts } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";

export default function CalendarPage() {
  const [open, setOpen] = useState(false);
  const [prefillLocal, setPrefillLocal] = useState<string>("");
  const [dayYmd, setDayYmd] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    id: string;
    local?: string;
    channel?: Post["channel"];
    title?: string;
    status?: Post["status"];
  } | null>(null);
  const [undo, setUndo] = useState<{ show: boolean; post?: Post }>({ show: false });
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [quotaToast, setQuotaToast] = useState(false);
  const [createDisabled, setCreateDisabled] = useState(false);

  useEffect(() => {
    if (!savedToast) return;
    const t = setTimeout(() => setSavedToast(false), 2000);
    return () => clearTimeout(t);
  }, [savedToast]);

  // Check plan/quota and determine whether to allow quick-create
  useEffect(() => {
    (async () => {
      try {
        const sub = await api.getSubscription();
        const ent = entitlementsForPlan(sub?.plan);
        const limit = typeof ent.max_posts_per_month === "number" ? ent.max_posts_per_month : undefined;
        if (!limit || limit <= 0) { setCreateDisabled(false); return; }
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
        const count = getPosts().map(p => new Date(p.date)).filter(d => d >= start && d < end).length;
        setCreateDisabled(count >= limit);
      } catch {
        setCreateDisabled(false);
      }
    })();
  }, []);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{t("calendar.title")}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t("calendar.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (createDisabled) { setQuotaToast(true); setTimeout(() => setQuotaToast(false), 2000); return; }
            setOpen(true);
          }}
          className="btn-primary disabled:opacity-50"
          title={createDisabled ? t("error.quotaPostsExceeded") : undefined}
          aria-disabled={createDisabled}
        >
          {t("button.newPost")}
        </button>
      </header>

      <div className="rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <MonthCalendar onSelectDate={(ymd) => setDayYmd(ymd)} />
      </div>

      <DayPostsModal
        open={!!dayYmd}
        ymd={dayYmd}
        onClose={() => setDayYmd(null)}
        onNewForDay={(ymd, hour, minute) => {
          if (createDisabled) { setQuotaToast(true); setTimeout(() => setQuotaToast(false), 2000); return; }
          const tz = getSettings().timezone || undefined;
          setPrefillLocal(toLocalInputFromYMD(ymd, hour ?? 9, minute ?? 0, tz));
          setDayYmd(null);
          setEditing(null);
          setOpen(true);
        }}
        createDisabled={createDisabled}
        onEdit={(p) => {
          const tz = getSettings().timezone || undefined;
          const ymd = formatDateYMD(p.date, tz);
          const hm = formatTimeHM(p.date, tz);
          const [hh, mm] = hm.split(":").map((x) => parseInt(x, 10));
          const local = toLocalInputFromYMD(ymd, hh || 0, mm || 0, tz);
          setEditing({ id: p.id, local, channel: p.channel, title: p.title, status: p.status });
          setDayYmd(null);
          setOpen(true);
        }}
        onDelete={(id) => {
          if (!confirm("Delete this post?")) return;
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
        onError={(code) => {
          if (code === "quota") {
            setQuotaToast(true);
            setTimeout(() => setQuotaToast(false), 2000);
          }
        }}
        initialLocalDateTime={editing?.local || prefillLocal || undefined}
        editingPostId={editing?.id}
        initialChannel={editing?.channel}
        initialTitle={editing?.title}
        initialStatus={editing?.status}
      />

      <Toast show={savedToast} message={t("toast.saved")} />
      <Toast show={quotaToast} message={t("error.quotaPostsExceeded")} />
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
