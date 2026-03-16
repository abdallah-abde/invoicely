import { getPaymentsByInvoiceId } from "@/features/payments/db/payment.query";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;

    const payments = await getPaymentsByInvoiceId(invoiceId);

    if (!payments) {
      return notFound("validation.payments-not-found");
    }
    return NextResponse.json(payments, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-payments");
  }
}
