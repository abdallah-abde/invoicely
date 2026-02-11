import { NextResponse } from "next/server";
import { getPayments } from "@/features/payments/db/payment.query";
import { mapPaymentsToDTO } from "@/features/payments/lib/payment.normalize";
import { createPayment } from "@/features/payments/db/payment.mutation";
import { DomainError } from "@/lib/errors/domain-error";
import { badRequest, serverError } from "@/lib/api/api-response";

export async function GET() {
  try {
    const data = await getPayments();
    const normalized = mapPaymentsToDTO(data);

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    console.error(err);
    return serverError("validation.failed-to-get-payments");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payment = await createPayment(body);

    return NextResponse.json(mapPaymentsToDTO([payment])[0], { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-create-payment");
  }
}
