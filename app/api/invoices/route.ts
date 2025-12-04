import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.invoice.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      number,
      customerId,
      issuedAt,
      dueAt,
      status,
      total,
      notes,
      createdById,
    } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        number,
        customerId,
        issuedAt: new Date(body.issuedAt),
        dueAt: new Date(body.dueAt),
        status,
        total: Number(total),
        notes,
        createdById,
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
