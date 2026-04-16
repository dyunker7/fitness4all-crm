import type { UserRole } from "@/lib/types";

export type CrmPermission =
  | "dashboard:view"
  | "contacts:view"
  | "contacts:edit"
  | "opportunities:view"
  | "opportunities:edit"
  | "tasks:edit"
  | "inbox:view"
  | "inbox:send"
  | "schedule:view"
  | "schedule:edit"
  | "meta:view"
  | "meta:ingest"
  | "automations:view"
  | "automations:edit"
  | "activity:view";

type PermissionMap = Record<UserRole, CrmPermission[]>;

const permissionMap: PermissionMap = {
  Admin: [
    "dashboard:view",
    "contacts:view",
    "contacts:edit",
    "opportunities:view",
    "opportunities:edit",
    "tasks:edit",
    "inbox:view",
    "inbox:send",
    "schedule:view",
    "schedule:edit",
    "meta:view",
    "meta:ingest",
    "automations:view",
    "automations:edit",
    "activity:view",
  ],
  "Sales Manager": [
    "dashboard:view",
    "contacts:view",
    "contacts:edit",
    "opportunities:view",
    "opportunities:edit",
    "tasks:edit",
    "inbox:view",
    "inbox:send",
    "schedule:view",
    "schedule:edit",
    "meta:view",
    "meta:ingest",
    "automations:view",
    "automations:edit",
    "activity:view",
  ],
  "Sales Rep / Front Desk": [
    "dashboard:view",
    "contacts:view",
    "contacts:edit",
    "opportunities:view",
    "opportunities:edit",
    "tasks:edit",
    "inbox:view",
    "inbox:send",
    "schedule:view",
    "schedule:edit",
    "meta:view",
    "meta:ingest",
  ],
  Trainer: [
    "dashboard:view",
    "contacts:view",
    "inbox:view",
    "schedule:view",
    "schedule:edit",
  ],
  Support: [
    "dashboard:view",
    "contacts:view",
    "inbox:view",
    "inbox:send",
    "activity:view",
  ],
};

const pathPermissions: Array<[string, CrmPermission]> = [
  ["/dashboard", "dashboard:view"],
  ["/contacts", "contacts:view"],
  ["/opportunities", "opportunities:view"],
  ["/inbox", "inbox:view"],
  ["/schedule", "schedule:view"],
  ["/meta", "meta:view"],
  ["/automations", "automations:view"],
  ["/activity", "activity:view"],
];

export function hasPermission(role: UserRole, permission: CrmPermission) {
  return permissionMap[role]?.includes(permission) ?? false;
}

export function getPermissionForPath(pathname: string) {
  const match = pathPermissions.find(
    ([path]) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return match?.[1] ?? null;
}

export function canAccessPath(role: UserRole, pathname: string) {
  const permission = getPermissionForPath(pathname);

  if (!permission) {
    return true;
  }

  return hasPermission(role, permission);
}
