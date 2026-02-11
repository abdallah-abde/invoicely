import { NextResponse } from "next/server";
import { createCustomer } from "@/features/customers/db/customer.mutation";
import { getCustomers } from "@/features/customers/db/customer.query";
import { customerSchema } from "@/features/customers/schemas/customer.schema";
import { serverError } from "@/lib/api/api-response";

export async function GET() {
  try {
    const customers = await getCustomers();

    return NextResponse.json(customers, { status: 200 });
  } catch (err) {
    console.error(err);
    return serverError("validation.failed-to-get-customers");
  }
}

export async function POST(req: Request) {
  try {
    const body = customerSchema.parse(await req.json());

    const customer = await createCustomer(body);

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    console.error(err);
    return serverError("validation.failed-to-create-customer");
  }
}
