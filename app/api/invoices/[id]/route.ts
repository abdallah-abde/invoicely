import { NextResponse } from "next/server";
import { mapSingleInvoiceToDTO } from "@/features/invoices/lib/invoice.normalize";
import {
  deleteInvoice,
  updateInvoice,
} from "@/features/invoices/db/invoice.mutation";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import { DomainError } from "@/lib/errors/domain-error";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteInvoice(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
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

    const invoice = await updateInvoice(id, body);

    if (!invoice) {
      return notFound("validation.invoice-not-found");
    }

    return NextResponse.json(mapSingleInvoiceToDTO(invoice), { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-update-invoice");
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return notFound("validation.invoice-not-found");
    }

    return NextResponse.json(mapSingleInvoiceToDTO(invoice), { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-invoice");
  }
}
