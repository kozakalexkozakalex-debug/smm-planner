import { NextResponse } from "next/server";
import { db, upsertPost } from "@/server/memdb";
import type { Post } from "@/lib/types";

export async function GET() {
  return NextResponse.json(db.posts);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<Post>;
  const created = upsertPost(body);
  return NextResponse.json(created, { status: 201 });
}

