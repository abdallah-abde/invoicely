import { deleteUser, updateUser } from "@/features/users/db/user.mutation";
import { getUserById } from "@/features/users/db/user.query";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteUser(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-delete-user");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const user = await updateUser(id, body);

    if (!user) {
      return notFound("validation.user-not-found");
    }

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-update-user");
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await getUserById(id);

    if (!user) {
      return notFound("validation.user-not-found");
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-user");
  }
}
