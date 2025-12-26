import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    await prisma.payment.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Payment deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting payment" },
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
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...body,
        invoiceId: body.invoiceId[0].value,
        amount: Number(body.amount),
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating payment" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching payment" },
      { status: 500 }
    );
  }
}
