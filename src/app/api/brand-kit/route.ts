import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getWorkspaceId } from "@/app/api/_utils/mapping";
import { getUserId, ensureWorkspaceAndMembership, requirePermission } from "@/app/api/_utils/auth";

export async function GET(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "brandkit:read");
  if (perm !== true) return perm;
  if (!prisma) return NextResponse.json({ logoUrl: null, colors: null, fonts: null });
  const kit = await prisma.brandKit.findFirst({ where: { workspaceId: ws } });
  return NextResponse.json({ logoUrl: kit?.logoUrl ?? null, colors: kit?.colors ?? null, fonts: kit?.fonts ?? null });
}

export async function PUT(req: Request) {
  const ws = getWorkspaceId(req);
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(ws, userId);
  const perm = await requirePermission(req, ws, "brandkit:update");
  if (perm !== true) return perm;
  const body = (await req.json().catch(() => ({}))) as any;
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  const saved = await prisma.brandKit.upsert({
    where: { workspaceId: ws },
    update: { logoUrl: body.logoUrl ?? null, colors: body.colors ?? null, fonts: body.fonts ?? null },
    create: { workspaceId: ws, logoUrl: body.logoUrl ?? null, colors: body.colors ?? null, fonts: body.fonts ?? null },
  } as any);
  return NextResponse.json({ logoUrl: saved.logoUrl, colors: saved.colors, fonts: saved.fonts });
}
