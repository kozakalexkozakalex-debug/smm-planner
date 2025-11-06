import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // In real integration, we'd call Telegram Bot API here.
  // For now, just echo back success.
  return NextResponse.json({ ok: true, echo: body });
}

