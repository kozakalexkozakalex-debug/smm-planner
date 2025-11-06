import { NextResponse } from "next/server";
import { db, updateChannel as dbUpdate, deleteChannel as dbDelete } from "@/server/memdb";
import type { Channel } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = req.headers.get("x-workspace-id") || "default";
  const c = db.channels.find((x) => x.id === id && (x as any).workspaceId === ws);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = req.headers.get("x-workspace-id") || "default";
  const body = (await req.json().catch(() => ({}))) as Partial<Channel>;
  const updated = dbUpdate(id, body, ws);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = req.headers.get("x-workspace-id") || "default";
  const ok = dbDelete(id, ws);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
