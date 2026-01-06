"use client";

import {
  ADMIN_ROLE,
  MODERATOR_ROLE,
  SUPERADMIN_ROLE,
  USER_ROLE,
} from "@/features/users/lib/constants";
import { authClient } from "@/features/auth/lib/auth-client";

export const isRoleSuperAdmin = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === SUPERADMIN_ROLE;
};

export const isRoleAdmin = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === ADMIN_ROLE;
};

export const isRoleModerator = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === MODERATOR_ROLE;
};

export const isRoleUser = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === USER_ROLE;
};

export const hasPermission = async ({
  resource,
  permission,
}: {
  resource: string;
  permission: string[];
}) => {
  const { data } = await authClient.admin.hasPermission({
    permission: {
      [resource]: permission,
    },
  });

  return data?.success || false;
};
