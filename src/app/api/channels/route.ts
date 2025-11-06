import { NextResponse } from "next/server";
import { db, upsertChannel } from "@/server/memdb";
import type { Channel } from "@/lib/types";

export async function GET() {
  return NextResponse.json(db.channels);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<Channel>;
  const created = upsertChannel(body);
  return NextResponse.json(created, { status: 201 });
}

