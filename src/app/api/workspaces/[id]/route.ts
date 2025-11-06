import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!prisma) return NextResponse.json({ id, name: id });
  const ws = await prisma.workspace.findUnique({ where: { id } });
  if (!ws) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: ws.id, name: ws.name });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { name?: string };
  const wsId = id;
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(wsId, userId);
  const perm = await requirePermission(req, wsId, "workspace:update");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  const rec = await prisma.workspace.update({ where: { id }, data: { name: body.name || "Workspace" } });
  return NextResponse.json({ id: rec.id, name: rec.name });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const wsId = id;
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(wsId, userId);
  const perm = await requirePermission(req, wsId, "workspace:update");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  await prisma.workspace.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
