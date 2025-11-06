import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { db, updateChannel as memUpdate, deleteChannel as memDelete } from "@/server/memdb";
import type { Channel } from "@/lib/types";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";
import { getWorkspaceId } from "@/app/api/_utils/mapping";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "channel:list");
  if (perm !== true) return perm;
  if (!prisma) {
    const c = db.channels.find((x) => x.id === id);
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ id: c.id, name: (c as any).name });
  }
  const c = await prisma.channel.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: c.id, name: c.name });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "channel:update");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as Partial<Channel>;
  if (!prisma) {
    const updated = memUpdate(id, { name: body.name as any }, ws);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ id: updated.id, name: (updated as any).name });
  }
  const updated = await prisma.channel.update({ where: { id }, data: { name: String(body.name || "") } });
  return NextResponse.json({ id: updated.id, name: updated.name });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "channel:delete");
  if (perm !== true) return perm;
  if (!prisma) {
    const ok = memDelete(id, ws);
    return NextResponse.json({ ok });
  }
  await prisma.channel.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
