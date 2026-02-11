import { NextResponse } from "next/server";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import {
  deleteInvoice,
  updateInvoice,
  updateInvoiceNotes,
} from "@/features/invoices/db/invoice.mutation";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import { DomainError } from "@/lib/errors/domain-error";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const invoiceId = await updateInvoiceNotes(id, body);

    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      return notFound("validation.invoice-not-found");
    }

    return NextResponse.json(mapInvoicesToDTO([invoice])[0], { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-update-invoice");
  }
}
