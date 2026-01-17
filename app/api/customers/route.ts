import { getCustomers } from "@/features/customers/db/customer.query";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await getCustomers();

    return NextResponse.json(customers);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newCustomer = await prisma.customer.create({
      data: { ...body, email: body.email.toLowerCase() },
    });
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
