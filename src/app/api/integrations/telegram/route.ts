import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

export async function GET(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "workspace:read");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json({ connected: false });
  const row = await prisma.socialConnection.findFirst({ where: { workspaceId: ws, platform: "TELEGRAM" } });
  return NextResponse.json({ connected: !!row, chatId: row?.externalId || null });
}

export async function POST(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "workspace:update");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as { botToken?: string; chatId?: string };
  if (!prisma) return NextResponse.json({ error: "prisma_unavailable" }, { status: 501 });
  const created = await prisma.socialConnection.upsert({
    where: { workspaceId_platform_externalId: { workspaceId: ws, platform: "TELEGRAM", externalId: body.chatId || undefined as any } },
    create: { workspaceId: ws, platform: "TELEGRAM", externalId: body.chatId || null, accessToken: body.botToken || null },
    update: { externalId: body.chatId || null, accessToken: body.botToken || null },
  } as any);
  return NextResponse.json({ ok: true, connected: true, chatId: created.externalId || null });
}

export async function DELETE(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "workspace:update");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json({ ok: true });
  await prisma.socialConnection.deleteMany({ where: { workspaceId: ws, platform: "TELEGRAM" } });
  return NextResponse.json({ ok: true });
}

