import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.payment.findMany();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { invoiceId, amount, date, notes, method } = body;

    const newPayment = await prisma.payment.create({
      data: {
        invoiceId: invoiceId[0].value,
        notes,
        method,
        date,
        amount: Number(amount),
      },
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
