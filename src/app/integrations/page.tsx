"use client";

import { useEffect, useState } from "react";
import { connectTelegram, disconnectTelegram, getTelegram, subscribeTelegram } from "@/lib/integrations";
import { api } from "@/lib/api";
import { publishPost } from "@/lib/posts";
import Toast from "@/components/Toast";
import { t } from "@/lib/i18n";

export default function IntegrationsPage() {
  const [tg, setTg] = useState(() => getTelegram());
  const [token, setToken] = useState("");
  const [chat, setChat] = useState("");
  const [postId, setPostId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeTelegram(() => setTg(getTelegram()));
    (async () => {
      try {
        const s = await api.getTelegram();
        if (s?.connected) setTg({ connected: true, chatId: s.chatId || undefined });
      } catch {}
    })();
    return unsub;
  }, []);

  async function testSendAndPublish() {
    try {
      if (!postId) return;
      // simulate telegram send
      await fetch("/api/integrations/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tg.connected && !tg.botToken ? { postId } : { postId, token: tg.botToken, chatId: tg.chatId }),
      });
      // then publish
      publishPost(postId);
      setMsg(t("integrations.sentPublished"));
    } catch {
      setMsg(t("integrations.sendFailed"));
    }
    setTimeout(() => setMsg(null), 1500);
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("integrations.title")}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("integrations.subtitle")}</p>
        </div>
      </header>

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">{t("integrations.telegram")}</h2>
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{t("integrations.telegramSubtitle")}</p>

        <div className="grid max-w-lg gap-3 sm:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("integrations.botToken")}</label>
            <input value={token} onChange={(e) => setToken(e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("integrations.chatId")}</label>
            <input value={chat} onChange={(e) => setChat(e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {tg.connected ? (
            <button type="button" onClick={() => disconnectTelegram()} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">{t("integrations.disconnect")}</button>
          ) : (
            <button type="button" onClick={() => connectTelegram(token, chat)} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500">{t("integrations.connect")}</button>
          )}
          <span className={`text-xs ${tg.connected ? "text-emerald-600" : "text-zinc-500"}`}>{tg.connected ? t("integrations.connected") : t("integrations.disconnected")}</span>
        </div>

        <div className="mt-6 grid max-w-lg gap-3 sm:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t("integrations.postId")}</label>
            <input value={postId} onChange={(e) => setPostId(e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="flex items-end">
            <button type="button" onClick={testSendAndPublish} className="btn-primary">{t("integrations.sendTest")}</button>
          </div>
        </div>
      </div>

      <Toast show={!!msg} message={msg || ""} />
    </section>
  );
}
