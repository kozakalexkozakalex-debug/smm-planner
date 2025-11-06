import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

export async function GET(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "subscription:read");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json({ plan: "Free", status: "active" });
  const sub = await prisma.subscription.findFirst({ where: { workspaceId: ws } });
  if (!sub) return NextResponse.json({ plan: "Free", status: "none" });
  return NextResponse.json({ plan: sub.planCode, status: sub.status, currentPeriodEnd: sub.currentPeriodEnd });
}

export async function PUT(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  // Changing plan is an administrative action
  const perm = await requirePermission(req, ws, "workspace:update");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = String(body?.plan || "");
  if (!plan) return NextResponse.json({ ok: false, error: "Missing plan" }, { status: 400 });
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  const rec = await prisma.subscription.upsert({
    where: { workspaceId: ws },
    update: { planCode: plan, status: "active" },
    create: { workspaceId: ws, planCode: plan, status: "active" },
  } as any);
  return NextResponse.json({ plan: rec.planCode, status: rec.status });
}
