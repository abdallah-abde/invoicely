import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    await prisma.invoice.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting invoice" },
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

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...body,
        issuedAt: new Date(body.issuedAt),
        dueAt: new Date(body.dueAt),
        total: Number(body.total),
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating invoice" },
      { status: 500 }
    );
  }
}
