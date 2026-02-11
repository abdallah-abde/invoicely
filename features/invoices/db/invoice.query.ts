import { InvoiceStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/db/prisma";
import {
  invoiceFullInclude,
  invoiceOrderBy,
} from "@/features/invoices/db/invoice.includes";

export async function getWorkingInvoices() {
  return await prisma.invoice.findMany({
    where: {
      status: {
        in: [
          InvoiceStatus.DRAFT,
          InvoiceStatus.PAID,
          InvoiceStatus.SENT,
          InvoiceStatus.PARTIAL_PAID,
        ],
      },
    },
    include: invoiceFullInclude,
    orderBy: invoiceOrderBy,
  });
}

export async function getCanceledInvoices() {
  return await prisma.invoice.findMany({
    where: {
      status: InvoiceStatus.CANCELED,
    },
    include: invoiceFullInclude,
    orderBy: invoiceOrderBy,
  });
}

export async function getOverdueCandidatesInvoices() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return await prisma.invoice.findMany({
    where: {
      status: {
        in: [InvoiceStatus.SENT, InvoiceStatus.PARTIAL_PAID],
      },
      dueAt: { lt: date },
    },
    include: invoiceFullInclude,
    orderBy: invoiceOrderBy,
  });
}

export async function getInvoiceById(id: string) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: invoiceFullInclude,
  });
}
