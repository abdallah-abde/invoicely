import { authSession } from "@/features/auth/lib/auth-utils";
import { getUsers } from "@/features/users/db/user.query";
import { mapUsersToDTO } from "@/features/users/lib/user.normalize";
import { badRequest, serverError } from "@/lib/api/api-response";
import { auth } from "@/lib/auth/auth";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await getUsers();
    const session = await authSession();

    const { success } = await auth.api.userHasPermission({
      body: {
        userId: session?.user.id,
        permission: {
          user: ["delete"],
        },
      },
    });

    return NextResponse.json(
      mapUsersToDTO(
        users.map((user) => ({ ...user, hasDeletePermission: success })),
      ),
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-users");
  }
}
