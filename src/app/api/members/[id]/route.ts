import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params; // member userId
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "member:update");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as { role?: string };
  const nextRole = String(body?.role || "");
  if (!nextRole) return NextResponse.json({ ok: false, error: "Missing role" }, { status: 400 });
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  const rec = await (prisma as any).member.update({
    where: { userId_workspaceId: { userId: id, workspaceId: ws } },
    data: { role: nextRole },
  });
  return NextResponse.json({ id: rec.userId, role: rec.role });
}

