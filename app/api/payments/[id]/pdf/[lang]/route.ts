export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { formatDates } from "@/lib/utils/date.utils";
import { PaymentStatus } from "@/features/payments/payment.types";
import { normalizeDecimal } from "@/lib/normalize/primitives";
import { generateReceiptPDF } from "@/features/payments/services/pdf.services";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { getPaymentByIdForReceipt } from "@/features/payments/db/payment.query";
import { DomainError } from "@/lib/errors/domain-error";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string; lang: string }> },
) {
  try {
    const { id, lang } = await params;

    const payment = await getPaymentByIdForReceipt(id);

    if (!payment) {
      return notFound("validation.payment-not-found");
    }

    if (payment.status !== PaymentStatus.ACTIVE) {
      throw new Error("PDF not allowed for this payment status");
    }

    const pdf = await generateReceiptPDF({
      referenceNo: payment.referenceNo || "",
      amount: normalizeDecimal(payment.amount),
      receiptDate: formatDates({ isArabic: false, value: payment.date }),
      method: payment.method.toString(),
      paymentStatus: payment.status.toString(),
      lang,
      invoice: {
        invoiceNumber: payment.invoice.number || "",
        issueAt: formatDates({
          isArabic: false,
          value: payment.invoice.issuedAt,
        }),
        dueAt: formatDates({ isArabic: false, value: payment.invoice.dueAt }),
        customer: {
          name: payment.invoice.customer.name,
          email: payment.invoice.customer.email,
          address: payment.invoice.customer.address,
        },
        products: payment.invoice.products.map((i) => ({
          name: i.product.name,
          quantity: normalizeDecimal(i.quantity),
          unitPrice: normalizeDecimal(i.unitPrice),
          unit: i.product.unit,
        })),
        total: normalizeDecimal(payment.invoice.total),
        lang,
      },
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=receipt-${payment.referenceNo}.pdf`,
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
