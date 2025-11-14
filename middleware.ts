import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED = new Set(["en", "uk", "pl", "de", "es", "fr", "it", "pt"]);

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const curr = req.cookies.get("locale")?.value;
  if (!curr) {
    const al = req.headers.get("accept-language") || "";
    const lower = al.toLowerCase();
    const order = ["uk", "en", "pl", "de", "es", "fr", "it", "pt"];
    let chosen = "uk";
    for (const code of order) {
      if (lower.startsWith(code)) { chosen = code; break; }
    }
    if (ALLOWED.has(chosen)) {
      res.cookies.set("locale", chosen, { httpOnly: false, sameSite: "lax", path: "/" });
    }
  }
  return res;
}

export const config = {
  matcher: ["/:path*"],
};

