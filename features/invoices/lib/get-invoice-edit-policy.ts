import {
  InvoiceEditPolicy,
  InvoiceStatus,
  InvoiceType,
} from "@/features/invoices/invoice.types";

export function getInvoiceEditPolicy(invoice?: InvoiceType): InvoiceEditPolicy {
  if (!invoice)
    return {
      notes: true,
      issuedAt: true,
      dueAt: true,
      customerId: true,
      products: true,
    };

  switch (invoice.status) {
    case InvoiceStatus.DRAFT:
      return {
        notes: true,
        issuedAt: true,
        dueAt: true,
        customerId: true,
        products: true,
      };

    case InvoiceStatus.PAID:
      return {
        notes: true,
        issuedAt: false,
        dueAt: false,
        customerId: false,
        products: false,
      };

    case InvoiceStatus.SENT:
      return {
        notes: true,
        issuedAt: false,
        dueAt: false,
        customerId: false,
        products: false,
      };

    case InvoiceStatus.OVERDUE:
      return {
        notes: true,
        issuedAt: false,
        dueAt: false,
        customerId: false,
        products: false,
      };

    case InvoiceStatus.CANCELED:
      return {
        notes: false,
        issuedAt: false,
        dueAt: false,
        customerId: false,
        products: false,
      };

    case InvoiceStatus.PARTIAL_PAID:
      return {
        notes: true,
        issuedAt: false,
        dueAt: false,
        customerId: false,
        products: false,
      };
  }
}
