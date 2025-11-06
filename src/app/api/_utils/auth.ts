import { prisma } from "@/lib/db";
import type { Role } from "@/server/rbac";
import { can } from "@/server/rbac";

export function getUserId(req: Request): string {
  return req.headers.get("x-user-id") || "user-demo";
}

export async function ensureWorkspaceAndMembership(wsId: string, userId: string) {
  if (!prisma) return; // fallback mode: skip
  // Ensure workspace exists
  await (prisma as any).workspace.upsert({
    where: { id: wsId },
    update: {},
    create: { id: wsId, name: wsId, ownerId: userId },
  });
  // Ensure membership
  await (prisma as any).member.upsert({
    where: { userId_workspaceId: { userId, workspaceId: wsId } },
    update: {},
    create: { userId, workspaceId: wsId, role: "OWNER" },
  });
}

export async function getUserRole(wsId: string, userId: string): Promise<Role> {
  if (!prisma) return "OWNER";
  const m = await (prisma as any).member.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: wsId } },
  });
  return (m?.role as Role) || "VIEWER";
}

export async function requirePermission(
  req: Request,
  wsId: string,
  action: import("@/server/rbac").Action,
): Promise<true | Response> {
  const userId = getUserId(req);
  await ensureWorkspaceAndMembership(wsId, userId);
  const role = await getUserRole(wsId, userId);
  if (!can(role, action)) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return true;
}
