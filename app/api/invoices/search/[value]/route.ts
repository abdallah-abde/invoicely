import type { Invoice } from "@/app/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { value: string } }
) {
  try {
    const { value } = await params;
    const invoices: Invoice[] = await prisma.invoice.findMany({
      where: {
        number: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json(
      invoices.map((pro) => ({ label: pro.number, value: pro.id })),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get invoices" },
      { status: 500 }
    );
  }
}
