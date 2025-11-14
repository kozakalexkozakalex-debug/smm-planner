export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export type Action =
  | "workspace:read"
  | "workspace:update"
  | "member:list"
  | "member:invite"
  | "member:update"
  | "channel:list"
  | "channel:create"
  | "channel:update"
  | "channel:delete"
  | "post:list"
  | "post:create"
  | "post:update"
  | "post:delete"
  | "post:publish"
  | "brandkit:read"
  | "brandkit:update"
  | "subscription:read";

// Simple matrix placeholder; will enforce later
const MATRIX: Record<Role, Record<Action, boolean>> = {
  OWNER: new Proxy({}, { get: () => true }) as any,
  ADMIN: new Proxy({}, { get: () => true }) as any,
  EDITOR: {
    "workspace:read": true,
    "workspace:update": false,
    "member:list": true,
    "member:invite": false,
    "member:update": false,
    "channel:list": true,
    "channel:create": false,
    "channel:update": false,
    "channel:delete": false,
    "post:list": true,
    "post:create": true,
    "post:update": true,
    "post:delete": false,
    "post:publish": true,
    "brandkit:read": true,
    "brandkit:update": false,
    "subscription:read": true,
  },
  VIEWER: {
    "workspace:read": true,
    "workspace:update": false,
    "member:list": false,
    "member:invite": false,
    "member:update": false,
    "channel:list": true,
    "channel:create": false,
    "channel:update": false,
    "channel:delete": false,
    "post:list": true,
    "post:create": false,
    "post:update": false,
    "post:delete": false,
    "post:publish": false,
    "brandkit:read": true,
    "brandkit:update": false,
    "subscription:read": false,
  },
};

export function can(role: Role, action: Action): boolean {
  const row = MATRIX[role] as any;
  if (!row) return false;
  const val = row[action];
  return typeof val === "boolean" ? val : true;
}

