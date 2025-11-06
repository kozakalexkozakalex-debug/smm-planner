import { NextResponse } from "next/server";
import { db, updatePost as dbUpdate } from "@/server/memdb";
import type { Post } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ws = req.headers.get("x-workspace-id") || "default";
  const curr = db.posts.find((x) => x.id === id && (x as any).workspaceId === ws);
  if (!curr) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = dbUpdate(id, { status: "Published" as Post["status"] }, ws);
  return NextResponse.json(updated);
}

