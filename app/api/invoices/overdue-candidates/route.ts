import { NextResponse } from "next/server";
import { getOverdueCandidatesInvoices } from "@/features/invoices/db/invoice.query";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import { DomainError } from "@/lib/errors/domain-error";
import { badRequest, serverError } from "@/lib/api/api-response";

export async function GET() {
  try {
    const data = await getOverdueCandidatesInvoices();

    return NextResponse.json(mapInvoicesToDTO(data), { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-overdue-invoices");
  }
}
