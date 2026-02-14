import prisma from "@/lib/db/prisma";
import { InvoiceInput, InvoiceStatus } from "@/features/invoices/invoice.types";
import { generateInvoiceNumber } from "@/features/invoices/lib/generate-invoice-number";
import { normalizeDecimal } from "@/lib/normalize/primitives";
import { PaymentMethod } from "@/features/payments/payment.types";
import { DomainError } from "@/lib/errors/domain-error";
import { getInvoiceEditPolicy } from "@/features/invoices/lib/get-invoice-edit-policy";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import { getInvoiceById } from "@/features/invoices/db/invoice.query";
import { parseLocalDateOnly, todayLocalDateOnly } from "@/lib/utils/date.utils";

export async function createInvoice(data: InvoiceInput) {
  const totalNumber = normalizeDecimal(data.total);
  const paid = normalizeDecimal(data.paidAmount) ?? 0;

  if (!data.products.length) {
    throw new DomainError("validation.products-required");
  }

  if (paid > totalNumber) {
    throw new DomainError("validation.paid-exceeds-total");
  }

  if (data.status !== InvoiceStatus.PAID && paid > 0) {
    throw new DomainError("validation.payments-not-allowed-unless-paid");
  }

  if (data.status === InvoiceStatus.PAID && paid <= 0) {
    throw new DomainError("validation.payment-amount-required");
  }

  let issued = data.issuedAt
    ? parseLocalDateOnly(new Date(data.issuedAt))
    : undefined;
  const due = data.dueAt ? parseLocalDateOnly(new Date(data.dueAt)) : undefined;

  const today = todayLocalDateOnly();
  today.setHours(0, 0, 0, 0);

  if (issued && issued < today) {
    throw new DomainError("validation.invoice-date-less-than-today");
  }

  if (issued && due && due < issued) {
    throw new DomainError("validation.due-date-less-than-invoice-date");
  }

  const normalizedPaid = data.status === InvoiceStatus.PAID ? paid : 0;

  let finalStatus = data.status;

  if (data.status === InvoiceStatus.PAID && paid < totalNumber && paid > 0) {
    finalStatus = InvoiceStatus.PARTIAL_PAID;
  }

  if (data.status === InvoiceStatus.PAID && paid === 0) {
    finalStatus = InvoiceStatus.SENT;
  }

  const { year, seq, number } = await generateInvoiceNumber(
    prisma,
    new Date().getFullYear(),
  );

  // issued = new Date(2026, 1, 12, 12, 0, 0); // TODO: remove after testing

  return prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.create({
      data: {
        number,
        seq,
        year,
        customerId: data.customerId,
        issuedAt: issued,
        dueAt: finalStatus === InvoiceStatus.PAID ? issued : due,
        status: finalStatus,
        total: totalNumber,
        notes: data.notes ?? "",
        createdById: data.createdById,
      },
    });

    if (data.products.length) {
      await tx.invoiceProduct.createMany({
        data: data.products.map((p: any) => ({
          invoiceId: inv.id,
          productId: p.productId,
          quantity: normalizeDecimal(p.quantity),
          unitPrice: normalizeDecimal(p.unitPrice),
          totalPrice: normalizeDecimal(p.totalPrice),
        })),
      });
    }

    // create payment
    if (paid > 0) {
      await tx.payment.create({
        data: {
          invoiceId: inv.id,
          amount: normalizedPaid,
          date: issued ?? new Date(),
          method: data.paymentMethod ?? PaymentMethod.CASH,
          notes: "Auto payment on invoice creation",
        },
      });
    }

    return inv.id;
  });
}

export async function updateInvoice(id: string, data: InvoiceInput) {
  const totalNumber = normalizeDecimal(data.total);
  const paid = normalizeDecimal(data.paidAmount) ?? 0;

  if (!data.products.length) {
    throw new DomainError("validation.products-required");
  }

  if (paid > totalNumber) {
    throw new DomainError("validation.paid-exceeds-total");
  }

  if (data.status !== InvoiceStatus.PAID && paid > 0) {
    throw new DomainError("validation.payments-not-allowed-unless-paid");
  }

  if (data.status === InvoiceStatus.PAID && paid <= 0) {
    throw new DomainError("validation.payment-amount-required");
  }

  const issued = data.issuedAt ? new Date(data.issuedAt) : undefined;
  const due = data.dueAt ? new Date(data.dueAt) : undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (issued && issued < today) {
    throw new DomainError("validation.invoice-date-less-than-today");
  }

  if (issued && due && due < issued) {
    throw new DomainError("validation.due-date-less-than-invoice-date");
  }

  const normalizedPaid = data.status === InvoiceStatus.PAID ? paid : 0;

  let finalStatus = data.status;

  if (data.status === InvoiceStatus.PAID && paid < totalNumber && paid > 0) {
    finalStatus = InvoiceStatus.PARTIAL_PAID;
  }

  if (data.status === InvoiceStatus.PAID && paid === 0) {
    finalStatus = InvoiceStatus.SENT;
  }

  if (paid === totalNumber) {
    finalStatus = InvoiceStatus.PAID;
  }

  const existing = await getInvoiceById(id);

  if (!existing) {
    throw new DomainError("validation.invoice-not-found");
  }

  const policy = getInvoiceEditPolicy(mapInvoicesToDTO([existing])[0]);

  if (!policy.customerId && data.customerId !== undefined) {
    throw new DomainError("validation.customer-cannot-be-updated");
  }
  if (!policy.products && data.products !== undefined) {
    throw new DomainError("validation.products-cannot-be-updated");
  }
  if (
    existing.status === InvoiceStatus.PAID &&
    data.status !== InvoiceStatus.PAID
  ) {
    throw new DomainError("validation.paid-invoice-downgrade-not-allowed");
  }

  return prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.update({
      where: { id },
      data: {
        notes: data.notes,
        customerId: data.customerId,
        status: finalStatus,
        total: totalNumber,
      },
    });

    if (data.products.length) {
      await tx.invoiceProduct.deleteMany({ where: { invoiceId: id } });

      await tx.invoiceProduct.createMany({
        data: data.products.map((p: any) => ({
          invoiceId: inv.id,
          productId: p.productId,
          quantity: normalizeDecimal(p.quantity),
          unitPrice: normalizeDecimal(p.unitPrice),
          totalPrice: normalizeDecimal(p.totalPrice),
        })),
      });
    }

    // create payment
    if (paid > 0) {
      await tx.payment.create({
        data: {
          invoiceId: inv.id,
          amount: normalizedPaid,
          date: issued ?? new Date(),
          method: data.paymentMethod ?? PaymentMethod.CASH,
          notes: "Auto payment on invoice update",
        },
      });
    }

    return inv.id;
  });
}

export async function updateInvoiceNotes(id: string, data: { notes: string }) {
  const existing = await getInvoiceById(id);

  if (!existing) {
    throw new DomainError("validation.invoice-not-found");
  }

  const policy = getInvoiceEditPolicy(mapInvoicesToDTO([existing])[0]);

  if (!policy.notes) {
    throw new DomainError("validation.notes-cannot-be-updated");
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { notes: data.notes },
  });

  return invoice.id;
}

export async function deleteInvoice(id: string) {
  const d = await prisma.invoice.delete({
    where: { id },
  });
  console.log(d);

  return d;
}
