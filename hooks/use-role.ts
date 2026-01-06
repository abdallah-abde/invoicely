import { authClient } from "@/features/auth/lib/auth-client";
import {
  ADMIN_ROLE,
  MODERATOR_ROLE,
  SUPERADMIN_ROLE,
  USER_ROLE,
} from "@/features/users/lib/constants";

export function useRole() {
  const { data: session } = authClient.useSession();

  const isRoleUser = session?.user.role === USER_ROLE;
  const isRoleModerator = session?.user.role === MODERATOR_ROLE;
  const isRoleAdmin = session?.user.role === ADMIN_ROLE;
  const isRoleSuperAdmin = session?.user.role === SUPERADMIN_ROLE;

  return { isRoleUser, isRoleModerator, isRoleAdmin, isRoleSuperAdmin };
}
