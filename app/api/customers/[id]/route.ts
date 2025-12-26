import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    await prisma.customer.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Customer deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const customer = await prisma.customer.update({
      where: { id },
      data: { ...body, email: body.email.toLowerCase() },
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}
