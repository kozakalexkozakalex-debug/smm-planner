import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId, postToClient } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";
import { updatePost as memUpdate, db } from "@/server/memdb";
import type { Post } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "post:publish");
  if (perm !== true) return perm;
  if (!prisma) {
    const curr = db.posts.find((x) => x.id === id && (x as any).workspaceId === ws);
    if (!curr) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = memUpdate(id, { status: "Published" as any }, ws);
    return NextResponse.json(updated);
  }
  const curr = await prisma.post.findFirst({ where: { id, workspaceId: ws }, include: { channel: true } });
  if (!curr) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = await prisma.post.update({ where: { id }, data: { status: "PUBLISHED", publishedAt: new Date() }, include: { channel: true } });
  // If Telegram env is configured, send a basic notification (best‑effort)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const text = `Published: ${updated.title}\nChannel: ${updated.channel?.name ?? ""}\nAt: ${(updated.publishedAt || new Date()).toISOString()}`;
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch {}
  }
  return NextResponse.json(postToClient(updated));
}
