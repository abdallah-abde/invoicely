import { NextResponse } from "next/server";
import { getPayments } from "@/features/payments/db/payment.query";
import {
  mapPaymentsToDTO,
  mapSinglePaymentToDTO,
} from "@/features/payments/lib/payment.normalize";
import { createPayment } from "@/features/payments/db/payment.mutation";
import { DomainError } from "@/lib/errors/domain-error";
import { badRequest, notFound, serverError } from "@/lib/api/api-response";

export async function GET() {
  try {
    const data = await getPayments();

    return NextResponse.json(mapPaymentsToDTO(data), { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-get-payments");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payment = await createPayment(body);

    if (!payment) {
      return notFound("validation.payment-not-found");
    }

    return NextResponse.json(mapSinglePaymentToDTO(payment), { status: 201 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-create-payment");
  }
}
