import { NextResponse } from "next/server";
import { db, updatePost as dbUpdate, deletePost as dbDelete } from "@/server/memdb";
import type { Post } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = req.headers.get("x-workspace-id") || "default";
  const p = db.posts.find((x) => x.id === id && (x as any).workspaceId === ws);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = req.headers.get("x-workspace-id") || "default";
  const body = (await req.json().catch(() => ({}))) as Partial<Post>;
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
