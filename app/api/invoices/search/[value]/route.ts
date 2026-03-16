import { InvoiceStatus } from "@/features/invoices/invoice.types";
import { badRequest, serverError } from "@/lib/api/api-response";
import prisma from "@/lib/db/prisma";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ value: string }> },
) {
  try {
    const { value } = await params;
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        number: true,
      },
      where: {
        number: {
          contains: value,
          mode: "insensitive",
        },
        status: {
          in: [
            InvoiceStatus.OVERDUE,
            InvoiceStatus.PARTIAL_PAID,
            InvoiceStatus.SENT,
          ],
        },
      },
    });

    return NextResponse.json(
      invoices.map((pro) => ({ label: pro.number, value: pro.id })),
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-invoices");
  }
}
