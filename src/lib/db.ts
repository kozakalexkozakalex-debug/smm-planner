// Lazy optional Prisma import to avoid build-time resolution when not installed
let PrismaClient: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClient = require("@prisma/client").PrismaClient;
} catch {
  PrismaClient = null;
}

// Disable Prisma at runtime if DATABASE_URL is not configured, keep fallback memdb
if (!process.env.DATABASE_URL) {
  PrismaClient = null;
}

// Prevent multiple instances in dev HMR
const g = globalThis as unknown as { __PRISMA__?: any };

export const prisma: any = PrismaClient
  ? g.__PRISMA__ || new PrismaClient()
  : null;
if (process.env.NODE_ENV !== "production" && PrismaClient) {
  g.__PRISMA__ = prisma;
}
