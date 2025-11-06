import { NextResponse } from "next/server";
import { db, upsertChannel } from "@/server/memdb";
import type { Channel } from "@/lib/types";

export async function GET(req: Request) {
  const ws = req.headers.get("x-workspace-id") || "default";
  const list = db.channels.filter((c) => (c as any).workspaceId === ws);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const ws = req.headers.get("x-workspace-id") || "default";
  const body = (await req.json().catch(() => ({}))) as Partial<Channel>;
  const created = upsertChannel(body, ws);
  return NextResponse.json(created, { status: 201 });
}
