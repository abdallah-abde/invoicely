export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generateInvoicePDF } from "@/features/invoices/services/pdf.services";
import { formatDates } from "@/lib/utils/date.utils";
import {
  DOWNLOADABLE_STATUSES,
  DownloadableStatus,
} from "@/features/invoices/invoice.types";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { normalizeDecimal } from "@/lib/normalize/primitives";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string; lang: string }> },
) {
  try {
    const { id, lang } = await params;

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return notFound("validation.invoice-not-found");
    }

    if (!DOWNLOADABLE_STATUSES.includes(invoice.status as DownloadableStatus)) {
      return badRequest(
        "validation.download-bill-not-allowed-for-this-invoice",
      );
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
        quantity: normalizeDecimal(i.quantity),
        unitPrice: normalizeDecimal(i.unitPrice),
        unit: i.product.unit,
      })),
      total: normalizeDecimal(invoice.total),
      lang,
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=bill-${invoice.number}.pdf`,
      },
    });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError();
  }
}
