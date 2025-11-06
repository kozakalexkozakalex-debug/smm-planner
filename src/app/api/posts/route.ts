import { NextResponse } from "next/server";
import { db, upsertPost } from "@/server/memdb";
import type { Post } from "@/lib/types";

export async function GET(req: Request) {
  const ws = req.headers.get("x-workspace-id") || "default";
  const list = db.posts.filter((p) => (p as any).workspaceId === ws);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const ws = req.headers.get("x-workspace-id") || "default";
  const body = (await req.json().catch(() => ({}))) as Partial<Post>;
  const created = upsertPost(body, ws);
  return NextResponse.json(created, { status: 201 });
}
