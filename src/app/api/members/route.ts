import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

export async function GET(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "member:list");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json([]);
  const list = await prisma.member.findMany({ where: { workspaceId: ws }, include: { user: true } });
  return NextResponse.json(list.map((m: any) => ({ id: m.userId, email: m.user?.email, role: m.role })));
}

export async function POST() {
  return NextResponse.json({ ok: false, error: "Invites not implemented" }, { status: 501 });
}
