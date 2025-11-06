import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in dev HMR
const g = globalThis as unknown as { __PRISMA__?: PrismaClient };

export const prisma = g.__PRISMA__ || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  g.__PRISMA__ = prisma;
}

