export const runtime = "nodejs";

import { NextResponse } from "next/server";

import prisma from "@/lib/db/prisma";
import { generateInvoicePDF } from "@/lib/pdf/generate-invoice-pdf";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      products: {
        include: { product: true },
      },
    },
  });

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const pdf = await generateInvoicePDF({
    invoiceNumber: invoice.number,
    issueAt: invoice.createdAt.toDateString(),
    dueAt: invoice.dueAt.toDateString(),
    customer: {
      name: invoice.customer.name,
      email: invoice.customer.email,
      address: invoice.customer.address,
    },
    products: invoice.products.map((i) => ({
      name: i.product.name,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
    })),
    total: Number(invoice.total),
    currency: "USD",
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${invoice.number}.pdf`,
    },
  });
}
