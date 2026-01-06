import {
  ADMIN_ROLE,
  MODERATOR_ROLE,
  SUPERADMIN_ROLE,
  USER_ROLE,
} from "@/features/users/lib/constants";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  customer: ["create", "list", "update", "delete"],
  product: ["create", "list", "update", "delete"],
  invoice: ["create", "list", "update", "delete", "generate-bill"],
  payment: ["create", "list", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const userRole = ac.newRole({
  user: [],
  customer: [],
  product: [],
  invoice: [],
  payment: [],
});

export const moderatorRole = ac.newRole({
  user: [],
  customer: ["list"],
  product: ["list"],
  invoice: ["list", "generate-bill"],
  payment: ["list"],
});

export const adminRole = ac.newRole({
  user: ["list", "set-password", "update"],
  customer: ["create", "list", "update"],
  product: ["create", "list", "update"],
  invoice: ["create", "list", "update", "generate-bill"],
  payment: ["create", "list", "update"],
});

export const superadminRole = ac.newRole({
  ...adminAc.statements,
  customer: ["create", "list", "update", "delete"],
  product: ["create", "list", "update", "delete"],
  invoice: ["create", "list", "update", "delete", "generate-bill"],
  payment: ["create", "list", "update", "delete"],
});

export const roles = {
  [USER_ROLE]: userRole,
  [MODERATOR_ROLE]: moderatorRole,
  [ADMIN_ROLE]: adminRole,
  [SUPERADMIN_ROLE]: superadminRole,
} as const;

export type RoleName = keyof typeof roles;
