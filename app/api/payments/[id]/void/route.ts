import { voidPayment } from "@/features/payments/db/payment.mutation";
import { badRequest, serverError } from "@/lib/api/api-response";
import { DomainError } from "@/lib/errors/domain-error";
import { NextResponse } from "next/server";

export async function PUT(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await voidPayment(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof DomainError) {
      return badRequest(err.code);
    }
    console.error(err);
    return serverError("validation.failed-to-delete-payment");
  }
}
