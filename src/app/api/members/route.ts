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

export async function POST(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "member:invite");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as { email?: string; role?: string };
  const email = String(body?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const desiredRole = String(body?.role || "VIEWER");
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  // Ensure user
  const user = await (prisma as any).user.upsert({ where: { email }, update: {}, create: { email, name: email.split("@")[0] } });
  // Create membership if absent
  const member = await (prisma as any).member.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: ws } },
    update: { role: desiredRole },
    create: { userId: user.id, workspaceId: ws, role: desiredRole },
  });
  // In a real app, send email invite here
  return NextResponse.json({ id: user.id, email: user.email, role: member.role }, { status: 201 });
}
