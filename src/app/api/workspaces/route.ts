import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/app/api/_utils/auth";

export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!prisma) {
    // Fallback: return a single current workspace placeholder
    const ws = req.headers.get("x-workspace-id") || "default";
    return NextResponse.json([{ id: ws, name: ws }]);
  }
  const list = await prisma.member.findMany({ where: { userId }, include: { workspace: true } });
  return NextResponse.json(list.map((m: any) => ({ id: m.workspace.id, name: m.workspace.name })));
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!prisma) return NextResponse.json({ ok: false, error: "Not available in fallback" }, { status: 501 });
  const body = (await req.json().catch(() => ({}))) as { name?: string };
  const ws = await prisma.workspace.create({ data: { name: body.name || "New Workspace", ownerId: userId } });
  await prisma.member.create({ data: { userId, workspaceId: ws.id, role: "OWNER" } as any });
  return NextResponse.json({ id: ws.id, name: ws.name }, { status: 201 });
}

