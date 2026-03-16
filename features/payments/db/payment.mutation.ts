import prisma from "@/lib/db/prisma";
import {
  ALLOWED_INVOICES_TO_MAKE_PAYMENTS,
  AllowedInvoicesToMakePayments,
  PaymentInput,
  PaymentStatus,
  RecordPaymentInput,
} from "@/features/payments/payment.types";
import { paymentFullInclude } from "./payment.includes";
import { normalizeDecimal } from "@/lib/normalize/primitives";
import { DomainError } from "@/lib/errors/domain-error";
import { InvoiceStatus } from "@/features/invoices/invoice.types";
import { invoiceFullInclude } from "@/features/invoices/db/invoice.includes";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import {
  getDateEndOfDay,
  getDaysBetweenDates,
  parseLocalDateOnly,
  todayLocalDateOnly,
} from "@/lib/utils/date.utils";
import { generatePaymentReferenceNumber } from "@/features/invoices/lib/generate-payment-reference-number";

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

  const { year, seq, referenceNo } = await generatePaymentReferenceNumber(
    prisma,
    new Date().getFullYear(),
  );

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
        seq,
        year,
        referenceNo,
        status: PaymentStatus.ACTIVE,
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
    include: invoiceFullInclude,
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

  const { year, seq, referenceNo } = await generatePaymentReferenceNumber(
    prisma,
    new Date().getFullYear(),
  );

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
        notes: data.notes ?? "",
        method: data.method,
        date: new Date(),
        amount,
        seq,
        year,
        referenceNo,
        status: PaymentStatus.ACTIVE,
      },
    });

    return inv;
  });
}

export async function voidPayment(id: string) {
  console.log("updating");
  const existing = await prisma.payment.findUnique({ where: { id } });

  if (!existing) {
    throw new DomainError("validation.payment-not-found");
  }

  if (getDaysBetweenDates(new Date(), existing.date) > 30) {
    throw new DomainError("validation.cannot-void-payment-after-30-days");
  }

  const invoice = await getInvoiceById(existing.invoiceId);

  if (!invoice) {
    throw new DomainError("validation.invoice-not-found");
  }

  const invoiceTotal = invoice.total;
  const paymentAmount = existing.amount;

  let updatedStatus =
    invoice.dueAt &&
    getDateEndOfDay(invoice.dueAt) < getDateEndOfDay(new Date())
      ? InvoiceStatus.OVERDUE
      : Number(invoiceTotal) === Number(paymentAmount)
        ? InvoiceStatus.SENT
        : InvoiceStatus.PARTIAL_PAID;

  return await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        status: updatedStatus,
      },
    });

    return await tx.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.VOIDED,
        voidedAt: new Date(),
      },
      include: paymentFullInclude,
    });
  });
}
