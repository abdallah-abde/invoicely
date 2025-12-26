import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;
    const payment = await prisma.payment.findMany({ where: { invoiceId } });
    if (!payment) {
      return NextResponse.json(
        { error: "Payments not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching payments" },
      { status: 500 }
    );
  }
}
