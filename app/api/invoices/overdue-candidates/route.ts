import { NextResponse } from "next/server";
import { getOverdueCandidatesInvoices } from "@/features/invoices/db/invoice.query";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";

export async function GET() {
  try {
    const data = await getOverdueCandidatesInvoices();
    const normalized = mapInvoicesToDTO(data);

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get overdue invoices" },
      { status: 500 },
    );
  }
}
