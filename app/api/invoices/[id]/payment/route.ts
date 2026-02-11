import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import { recordPayment } from "@/features/payments/db/payment.mutation";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const invoice = await recordPayment(id, body);

    if (!invoice) {
      return notFound("validation.invoice-not-found");
    }

    return NextResponse.json(mapInvoicesToDTO([invoice])[0], { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-record-payment");
  }
}
