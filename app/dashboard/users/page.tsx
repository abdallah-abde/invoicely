import { auth } from "@/auth";
import { authIsRequired, authSession } from "@/lib/auth/auth-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Role } from "@/schemas/user";
import UserCU from "./user-cu";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage() {
  await authIsRequired();

  const { users } = await auth.api.listUsers({
    query: {},
    headers: await headers(),
  });

  const session = await authSession();
  const hasDeletePermission = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permission: {
        user: ["delete"],
      },
    },
  });

  const formattedUsers = users
    .map((user) => {
      return {
        id: user.id,
        name: user.name,
        image: user.image || "",
        role: user.role || "",
        email: user.email,
        emailVerified: user.emailVerified,
        hasDeletePermission: hasDeletePermission.success,
      };
    })
    .filter((f) => ["user", "admin"].includes(f.role as Role));

  if (!users) redirect("/sign-in");

  return <UserCU users={formattedUsers} />;
}
