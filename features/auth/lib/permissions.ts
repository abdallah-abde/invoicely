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
  user: userRole,
  moderator: moderatorRole,
  admin: adminRole,
  superadmin: superadminRole,
} as const;

export type RoleName = keyof typeof roles;
