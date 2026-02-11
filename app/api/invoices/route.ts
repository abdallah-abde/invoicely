import { NextResponse } from "next/server";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import {
  getInvoiceById,
  getWorkingInvoices,
} from "@/features/invoices/db/invoice.query";
import { badRequest, serverError } from "@/lib/api/api-response";
import { createInvoice } from "@/features/invoices/db/invoice.mutation";
import { DomainError } from "@/lib/errors/domain-error";

export async function GET() {
  try {
    const data = await getWorkingInvoices();
    const normalized = mapInvoicesToDTO(data);

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error(err);
    return serverError("validation.failed-to-get-working-invoice");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoiceId = await createInvoice(body);

    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      return serverError("validation.invoice-not-found");
    }

    return NextResponse.json(mapInvoicesToDTO([invoice])[0], { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-create-invoice");
  }
}
