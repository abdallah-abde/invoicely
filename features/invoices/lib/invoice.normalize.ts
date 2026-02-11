import {
  InvoicePrismaPayload,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import { mapPaymentsToDTO } from "@/features/payments/lib/payment.normalize";
import { normalizeDecimal } from "@/lib/normalize/primitives";

export function mapInvoicesToDTO(
  invoices: InvoicePrismaPayload[],
): InvoiceType[] {
  const result = invoices.map((invoice) => {
    const createdDate = invoice.createdAt;

    const issuedDate = invoice.issuedAt ?? undefined;

    const dueDate = invoice.dueAt ?? undefined;

    const { total, ...restOfInvoice } = invoice;

    const products = invoice.products.map((ip) => ({
      ...(ip.product ?? {}),
      quantity: normalizeDecimal(ip.quantity),
      unitPrice: normalizeDecimal(ip.unitPrice),
      totalPrice: normalizeDecimal(ip.totalPrice),
      price: normalizeDecimal(ip.product.price),
      id: ip.product ? ip.product.id : ip.id,
    }));

    const paidAmount = invoice.Payments.reduce((acc, payment) => {
      return acc + normalizeDecimal(payment.amount);
    }, 0);

    return {
      ...restOfInvoice,

      createdAt: createdDate,
      issuedDateAsString: issuedDate?.toString() || "",
      dueDateAsString: dueDate?.toString() || "",

      totalAsNumber: normalizeDecimal(total),
      total: normalizeDecimal(total),

      products,

      Payments: mapPaymentsToDTO(invoice.Payments),

      paidAmount,

      rest: normalizeDecimal(total) - paidAmount,
    };
  });

  return result;
}
