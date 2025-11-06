import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";
import { db, upsertChannel as memUpsert } from "@/server/memdb";
import type { Channel } from "@/lib/types";

export async function GET(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "channel:list");
  if (perm !== true) return perm;
  if (!prisma) {
    const list = db.channels.filter((c) => (c as any).workspaceId === ws);
    return NextResponse.json(list.map((c: any) => ({ id: c.id, name: c.name })));
  }
  const list = await prisma.channel.findMany({ where: { workspaceId: ws } });
  return NextResponse.json(list.map((c: any) => ({ id: c.id, name: c.name })));
}

export async function POST(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "channel:create");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as Partial<Channel>;
  if (!prisma) {
    const created = memUpsert({ id: body.id, name: body.name as any }, ws);
    return NextResponse.json({ id: created.id, name: created.name }, { status: 201 });
  }
  const created = await prisma.channel.upsert({ where: { workspaceId_name: { workspaceId: ws, name: String(body.name || "") } }, update: {}, create: { workspaceId: ws, name: String(body.name || "") } });
  return NextResponse.json({ id: created.id, name: created.name }, { status: 201 });
}
