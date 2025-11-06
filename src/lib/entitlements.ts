export type EntitlementKey =
  | "max_members"
  | "max_connected_accounts"
  | "max_posts_per_month"
  | "templates_enabled"
  | "calendar_enabled"
  | "approvals_enabled";

export type Entitlements = Partial<Record<EntitlementKey, number | boolean>>;

const PLANS: Record<string, Entitlements> = {
  Free: {
    max_members: 2,
    max_connected_accounts: 1,
    max_posts_per_month: 30,
    templates_enabled: false,
    calendar_enabled: true,
    approvals_enabled: false,
  },
  Starter: {
    max_members: 5,
    max_connected_accounts: 3,
    max_posts_per_month: 200,
    templates_enabled: true,
    calendar_enabled: true,
    approvals_enabled: false,
  },
  Pro: {
    max_members: 15,
    max_connected_accounts: 10,
    max_posts_per_month: 1000,
    templates_enabled: true,
    calendar_enabled: true,
    approvals_enabled: true,
  },
  Business: {
    max_members: 50,
    max_connected_accounts: 30,
    max_posts_per_month: 5000,
    templates_enabled: true,
    calendar_enabled: true,
    approvals_enabled: true,
  },
};

import { prisma } from "@/lib/db";

export async function getEntitlements(workspaceId: string): Promise<Entitlements> {
  try {
    if (!prisma) return PLANS.Free;
    const sub = await (prisma as any).subscription.findFirst({ where: { workspaceId } });
    const plan = sub?.planCode as string | undefined;
    return entitlementsForPlan(plan);
  } catch {
    return PLANS.Free;
  }
}

export function entitlementsForPlan(plan: string | undefined | null): Entitlements {
  if (!plan) return PLANS.Free;
  return PLANS[plan] ?? PLANS.Free;
}
