import {
  deleteCustomer,
  updateCustomer,
} from "@/features/customers/db/customer.mutation";
import { customerSchema } from "@/features/customers/schemas/customer.schema";
import { notFound, serverError } from "@/lib/api/api-response";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteCustomer(id);

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error(error);
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
      return notFound("validation.customer-not-found-after-update");
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error(error);
    return serverError("validation.failed-to-update-customer");
  }
}
