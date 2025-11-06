import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { db, updatePost as memUpdate, deletePost as memDelete } from "@/server/memdb";
import { getWorkspaceId, ensureChannel, toPrismaStatus, postToClient } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";
import type { Post } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "post:list");
  if (perm !== true) return perm;
  if (!prisma) {
    const p = db.posts.find((x) => x.id === id && (x as any).workspaceId === ws);
    if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(p);
  }
  const p = await prisma.post.findFirst({ where: { id, workspaceId: ws }, include: { channel: true } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(postToClient(p));
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "post:update");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as Partial<Post>;
  if (!prisma) {
    const updatedM = memUpdate(id, body, ws);
    if (!updatedM) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updatedM);
  }
  const data: any = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.status !== undefined) data.status = toPrismaStatus(body.status);
  if (body.date) data.scheduledAt = new Date(body.date);
  if (body.channel) {
    const ch = await ensureChannel(ws, body.channel as string);
    data.channelId = ch.id;
  }
  const updated = await prisma.post.update({ where: { id }, data, include: { channel: true } });
  return NextResponse.json(postToClient(updated));
}

export async function DELETE(req: Request, ctx: Ctx) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "post:delete");
  if (perm !== true) return perm;
  const { id } = await ctx.params;
  if (!prisma) {
    const ok = memDelete(id, ws);
    return NextResponse.json({ ok });
  }
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
