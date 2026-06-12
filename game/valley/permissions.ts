import type {
  ValleyMember,
  ValleyPermission,
  ValleyRole,
  VisitSession,
} from "@/types";

export const VALLEY_ROLE_DEFAULT_PERMISSIONS: Readonly<
  Record<ValleyRole, readonly ValleyPermission[]>
> = {
  owner: [
    "view_valley",
    "collect_gifts",
    "help_tasks",
    "decorate",
    "manage_invites",
    "manage_valley",
  ],
  member: ["view_valley", "collect_gifts", "help_tasks", "decorate"],
  visitor: ["view_valley", "collect_gifts", "help_tasks"],
};

export function getRoleDefaultPermissions(role: ValleyRole): readonly ValleyPermission[] {
  return VALLEY_ROLE_DEFAULT_PERMISSIONS[role];
}

export function getEffectivePermissions(
  subject: Pick<ValleyMember, "role" | "permissions"> | Pick<VisitSession, "permissions">,
): readonly ValleyPermission[] {
  if ("role" in subject) {
    const defaults = getRoleDefaultPermissions(subject.role);
    const overrides = subject.permissions;

    if (overrides.length === 0) {
      return defaults;
    }

    return [...new Set([...defaults, ...overrides])];
  }

  return subject.permissions.length > 0
    ? subject.permissions
    : getRoleDefaultPermissions("visitor");
}

export function hasValleyPermission(
  subject: Pick<ValleyMember, "role" | "permissions"> | Pick<VisitSession, "permissions">,
  permission: ValleyPermission,
): boolean {
  return getEffectivePermissions(subject).includes(permission);
}

export function canManageValley(member: Pick<ValleyMember, "role" | "permissions">): boolean {
  return hasValleyPermission(member, "manage_valley");
}

export function canManageInvites(member: Pick<ValleyMember, "role" | "permissions">): boolean {
  return hasValleyPermission(member, "manage_invites");
}
