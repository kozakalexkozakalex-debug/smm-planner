import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

type Payload = {
  token?: string;
  chatId?: string;
  text?: string;
  postId?: string;
};

export async function POST(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  // Reuse publish permission for sending via integration
  const perm = await requirePermission(req, ws, "post:publish");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as Payload;

  // Prefer request-provided credentials; fallback to server env for quick testing
  const token = body.token || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = body.chatId || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: "Missing token/chatId" }, { status: 400 });
  }

  // Resolve text from post if postId provided
  let text = body.text || "";
  if (!text && body.postId) {
    if (prisma) {
      const p = await prisma.post.findFirst({ where: { id: body.postId, workspaceId: ws }, include: { channel: true } });
      if (p) {
        const when = p.publishedAt || p.scheduledAt || p.createdAt;
        text = `Publishing: ${p.title}\nChannel: ${p.channel?.name ?? ""}\nWhen: ${when?.toISOString()}`;
      }
    } else {
      // Fallback: just include ID
      text = `Publishing post ${body.postId}`;
    }
  }
  if (!text) text = "Hello from SMM Planner";

  try {
    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const resp = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok || json?.ok === false) {
      return NextResponse.json({ ok: false, error: json?.description || resp.statusText }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
