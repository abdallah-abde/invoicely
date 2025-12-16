import { auth } from "@/auth";
import { authIsRequired, authSession } from "@/lib/auth-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import UserManagementForm, { Role } from "./user-client";

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
        role: user.role || "",
        email: user.email,
        emailVerified: user.emailVerified,
        hasDeletePermission: hasDeletePermission.success,
      };
    })
    .filter((f) => ["user", "admin"].includes(f.role as Role));

  if (!users) redirect("/sign-in");

  return (
    <div className="flex gap-6 py-4 items-start">
      <UserManagementForm users={formattedUsers} />
    </div>
  );
}
