"use client";

import { authClient } from "../lib/auth-client";

export const isRoleSuperAdmin = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === "superadmin";
};

export const isRoleAdmin = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === "admin";
};

export const isRoleModerator = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === "moderator";
};

export const isRoleUser = () => {
  const { data: session } = authClient.useSession();

  return session?.user.role === "user";
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
