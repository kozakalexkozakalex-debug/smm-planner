import type { Post as ClientPost } from "@/lib/types";
import { prisma } from "@/lib/db";

export function getWorkspaceId(req: Request): string {
  return req.headers.get("x-workspace-id") || "default";
}

export function toClientStatus(s?: string): ClientPost["status"] {
  switch (s) {
    case "DRAFT":
      return "Draft";
    case "SCHEDULED":
    case "APPROVED":
      return "Scheduled";
    case "PUBLISHED":
      return "Published";
    default:
      return "Draft";
  }
}

export function toPrismaStatus(s?: ClientPost["status"]): string {
  switch (s) {
    case "Draft":
      return "DRAFT";
    case "Scheduled":
      return "SCHEDULED";
    case "Published":
      return "PUBLISHED";
    default:
      return "DRAFT";
  }
}

export async function ensureChannel(workspaceId: string, name: string) {
  const key = { workspaceId_name: { workspaceId, name } } as any;
  return prisma.channel.upsert({
    where: key,
    update: {},
    create: { workspaceId, name },
  } as any);
}

export function postToClient(p: any): ClientPost {
  return {
    id: p.id,
    date: (p.scheduledAt || p.publishedAt || p.createdAt || new Date()).toISOString(),
    channel: (p.channel?.name || "Instagram") as ClientPost["channel"],
    title: p.title || "",
    body: p.body || "",
    media: p.media || [],
    status: toClientStatus(p.status),
  } as ClientPost;
}
