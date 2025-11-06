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
