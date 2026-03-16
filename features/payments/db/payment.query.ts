import prisma from "@/lib/db/prisma";
import {
  paymentFullInclude,
  paymentOrderBy,
  paymentReceiptFullInclude,
} from "@/features/payments/db/payment.includes";
import { PaymentStatus } from "@/features/payments/payment.types";

export async function getPayments() {
  return await prisma.payment.findMany({
    include: paymentFullInclude,
    orderBy: paymentOrderBy,
  });
}

export async function getPaymentsByInvoiceId(invoiceId: string) {
  return await prisma.payment.findMany({
    where: { invoiceId, status: PaymentStatus.ACTIVE },
  });
}

export async function getPaymentById(id: string) {
  return await prisma.payment.findUnique({
    where: { id },
    include: paymentFullInclude,
  });
}

export async function getPaymentByIdForReceipt(id: string) {
  return await prisma.payment.findUnique({
    where: { id },
    include: paymentReceiptFullInclude,
  });
}
