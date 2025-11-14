import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ALLOWED = new Set(["en", "uk", "pl", "de", "es", "fr", "it", "pt"]);

export async function GET() {
  const c = await cookies();
  const current = c.get("locale")?.value || null;
  return NextResponse.json({ locale: current });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { locale?: string };
  const next = typeof body.locale === "string" ? body.locale.toLowerCase() : "";
  if (!ALLOWED.has(next)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, locale: next });
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  res.cookies.set("locale", next, { httpOnly: false, sameSite: "lax", path: "/", maxAge });
  return res;
}
