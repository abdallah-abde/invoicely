import { NextResponse } from "next/server";
import {
  mapInvoicesToDTO,
  mapSingleInvoiceToDTO,
} from "@/features/invoices/lib/invoice.normalize";
import { getWorkingInvoices } from "@/features/invoices/db/invoice.query";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { createInvoice } from "@/features/invoices/db/invoice.mutation";
import { DomainError } from "@/lib/errors/domain-error";

export async function GET() {
  try {
    const data = await getWorkingInvoices();

    return NextResponse.json(mapInvoicesToDTO(data), { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-working-invoice");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoice = await createInvoice(body);

    if (!invoice) {
      return notFound("validation.invoice-not-found");
    }

    return NextResponse.json(mapSingleInvoiceToDTO(invoice), { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-create-invoice");
  }
}
