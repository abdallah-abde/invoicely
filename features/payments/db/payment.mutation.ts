import prisma from "@/lib/db/prisma";
import {
  ALLOWED_INVOICES_TO_MAKE_PAYMENTS,
  AllowedInvoicesToMakePayments,
  PaymentInput,
  RecordPaymentInput,
} from "@/features/payments/payment.types";
import { paymentFullInclude } from "./payment.includes";
import { normalizeDecimal } from "@/lib/normalize/primitives";
import { DomainError } from "@/lib/errors/domain-error";
import { InvoiceStatus } from "@/features/invoices/invoice.types";
import { invoiceFullInclude } from "@/features/invoices/db/invoice.includes";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import { parseLocalDateOnly, todayLocalDateOnly } from "@/lib/utils/date.utils";

export async function createPayment(data: PaymentInput) {
  const invoice = await getInvoiceById(data.invoiceId[0].value);

  if (!invoice) {
    throw new DomainError("validation.invoice-not-found");
  }

  if (
    !ALLOWED_INVOICES_TO_MAKE_PAYMENTS.includes(
      invoice.status as AllowedInvoicesToMakePayments,
    )
  ) {
    throw new DomainError("validation.payments-not-allowed-for-this-invoice");
  }

  const paymentDate = parseLocalDateOnly(new Date(data.date));

  if (
    !invoice.issuedAt ||
    paymentDate < parseLocalDateOnly(new Date(invoice.issuedAt))
  ) {
    throw new DomainError("validation.payment-date-less-than-invoice-date");
  }

  const today = todayLocalDateOnly();
  today.setHours(0, 0, 0, 0);

  if (paymentDate > today) {
    throw new DomainError("validation.payment-date-grater-than-today");
  }

  const invoiceTotal = normalizeDecimal(invoice.total);
  const invoicePrevPaid = normalizeDecimal(
    invoice.Payments.reduce((sum, it) => sum + normalizeDecimal(it.amount), 0),
  );

  const invoiceRest = invoiceTotal - invoicePrevPaid;

  if (data.amount > invoiceRest) {
    throw new DomainError("validation.payment-amount-not-excced-invoice-rest");
  }

  const updatedStatus =
    data.amount === invoiceRest
      ? InvoiceStatus.PAID
      : InvoiceStatus.PARTIAL_PAID;

  console.log("invoiceRest: ", invoiceRest);
  console.log("updatedStatus: ", updatedStatus);
  console.log("updatedStatus changed: ", invoice.status !== updatedStatus);

  return prisma.$transaction(async (tx) => {
    if (invoice.status !== updatedStatus) {
      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          status: updatedStatus,
        },
      });
    }

    const payment = await tx.payment.create({
      data: {
        invoiceId: invoice.id,
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
