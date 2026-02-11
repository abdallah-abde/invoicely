import { NextResponse } from "next/server";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import {
  deleteInvoice,
  updateInvoice,
} from "@/features/invoices/db/invoice.mutation";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import { DomainError } from "@/lib/errors/domain-error";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteInvoice(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return serverError("validation.failed-to-delete-invoice");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const invoiceId = await updateInvoice(id, body);

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return serverError("validation.invoice-not-found");
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error(error);
    return serverError("validation.failed-to-get-invoice");
  }
}
