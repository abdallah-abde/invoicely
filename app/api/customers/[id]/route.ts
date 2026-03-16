import {
  deleteCustomer,
  updateCustomer,
} from "@/features/customers/db/customer.mutation";
import { customerSchema } from "@/features/customers/schemas/customer.schema";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteCustomer(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-delete-customer");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = customerSchema.parse(await req.json());

    const customer = await updateCustomer(id, body);

    if (!customer) {
      return notFound("validation.customer-not-found");
    }

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-update-customer");
  }
}
