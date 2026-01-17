import {
  USER_ROLE,
  MODERATOR_ROLE,
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
} from "@/features/users/lib/user.constants";

export const ROLE_OPTIONS = [
  USER_ROLE,
  MODERATOR_ROLE,
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
] as const;

export type Role = (typeof ROLE_OPTIONS)[number];
