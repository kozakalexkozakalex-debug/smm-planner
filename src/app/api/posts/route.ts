import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { db, upsertPost as memUpsert } from "@/server/memdb";
import { getWorkspaceId, ensureChannel, toPrismaStatus, postToClient } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";
import { getEntitlements } from "@/lib/entitlements";
import type { Post } from "@/lib/types";

export async function GET(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "post:list");
  if (perm !== true) return perm;
  if (!prisma) {
    const list = db.posts.filter((p) => (p as any).workspaceId === ws) as any[];
    return NextResponse.json(list);
  }
  const rows = await prisma.post.findMany({ where: { workspaceId: ws }, include: { channel: true }, orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json(rows.map(postToClient));
}

export async function POST(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "post:create");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as Partial<Post>;
  // Entitlements: enforce max_posts_per_month
  try {
    const ent = await getEntitlements(ws);
    const limit = typeof ent.max_posts_per_month === "number" ? ent.max_posts_per_month : undefined;
    if (limit && limit > 0) {
      const now = new Date();
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
      if (!prisma) {
        const count = db.posts.filter((p: any) => p.workspaceId === ws)
          .map((p: any) => new Date(p.date))
          .filter((d: Date) => d >= start && d < end).length;
        if (count >= limit) {
          return NextResponse.json({ error: "post_quota_exceeded", message: "Monthly post limit reached." }, { status: 429 });
        }
      } else {
        const count = await prisma.post.count({ where: { workspaceId: ws, scheduledAt: { gte: start, lt: end } } });
        if (count >= limit) {
          return NextResponse.json({ error: "post_quota_exceeded", message: "Monthly post limit reached." }, { status: 429 });
        }
      }
    }
  } catch {}
  if (!prisma) {
    const created = memUpsert(body, ws);
    return NextResponse.json(created, { status: 201 });
  }
  const dateIso = body.date ? new Date(body.date) : new Date();
  const chName = (body.channel as string) || "Instagram";
  const channel = await ensureChannel(ws, chName);
  const created = await prisma.post.create({ data: { workspaceId: ws, channelId: channel.id, title: body.title || "", body: (body as any).body || null, status: toPrismaStatus(body.status), scheduledAt: dateIso }, include: { channel: true } });
  return NextResponse.json(postToClient(created), { status: 201 });
}
