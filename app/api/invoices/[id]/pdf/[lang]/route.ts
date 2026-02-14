export const runtime = "nodejs";

import { NextResponse } from "next/server";

import prisma from "@/lib/db/prisma";
import { generateInvoicePDF } from "@/features/invoices/services/pdf.services";
import { formatDates } from "@/lib/utils/date.utils";
import {
  DOWNLOADABLE_STATUSES,
  DownloadableStatus,
} from "@/features/invoices/invoice.types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string; lang: string }> },
) {
  const { id, lang } = await params;

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

  if (!DOWNLOADABLE_STATUSES.includes(invoice.status as DownloadableStatus)) {
    throw new Error("PDF not allowed for this invoice status");
  }

  const pdf = await generateInvoicePDF({
    invoiceNumber: invoice.number || "",
    issueAt: formatDates({ isArabic: false, value: invoice.issuedAt }),
    dueAt: formatDates({ isArabic: false, value: invoice.dueAt }),
    customer: {
      name: invoice.customer.name,
      email: invoice.customer.email,
      address: invoice.customer.address,
    },
    products: invoice.products.map((i) => ({
      name: i.product.name,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
      unit: i.product.unit,
    })),
    total: Number(invoice.total),
    lang,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${invoice.number}.pdf`,
    },
  });
}
