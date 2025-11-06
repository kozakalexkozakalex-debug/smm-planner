import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "smm-planner", version: "0.1.0" });
}

