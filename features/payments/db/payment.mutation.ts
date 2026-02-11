import prisma from "@/lib/db/prisma";
import {
  PaymentInput,
  RecordPaymentInput,
} from "@/features/payments/payment.types";
import { paymentFullInclude } from "./payment.includes";
import { normalizeDecimal } from "@/lib/normalize/primitives";
import { DomainError } from "@/lib/errors/domain-error";
import { InvoiceStatus } from "@/features/invoices/invoice.types";
import { invoiceFullInclude } from "@/features/invoices/db/invoice.includes";

export async function createPayment(data: PaymentInput) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        invoiceId: data.invoiceId[0].value as string,
        notes: data.notes ?? "",
        method: data.method,
        date: data.date,
        amount: normalizeDecimal(data.amount),
      },
      include: paymentFullInclude,
    });

    return payment;
  });
}

export async function recordPayment(
  invoiceId: string,
  data: RecordPaymentInput,
) {
  const existing = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { Payments: true },
  });

  if (!existing) throw new DomainError("validation.invoice-not-found");

  const amount = normalizeDecimal(data.amount);

  const rest =
    normalizeDecimal(existing.total) -
    existing.Payments.reduce(
      (acc, item) => normalizeDecimal(item.amount) + acc,
      0,
    );

  if (amount > rest)
    throw new DomainError("validation.amount-not-excced-total");

  const normalizeStatus =
    amount === rest ? InvoiceStatus.PAID : InvoiceStatus.PARTIAL_PAID;

  const issuedAt = existing.issuedAt ?? new Date();
  const dueAt = data.dueAt ? new Date(data.dueAt) : new Date();

  return await prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        status: normalizeStatus,
        issuedAt: issuedAt,
        dueAt: dueAt,
      },
      include: invoiceFullInclude,
    });

    await tx.payment.create({
      data: {
        invoiceId,
        amount,
        method: data.method,
        notes: data.notes ?? "",
        date: new Date(),
      },
    });

    return inv;
  });
}
