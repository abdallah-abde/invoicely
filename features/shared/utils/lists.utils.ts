import { InvoiceStatus, PaymentMethod } from "@/app/generated/prisma/enums";

export function getInvoiceStatusList() {
  return Object.values(InvoiceStatus);
}

export function getInvoiceStatusForInvoiceCreation() {
  return [InvoiceStatus.DRAFT, InvoiceStatus.PAID, InvoiceStatus.SENT];
}

export function getPaymentMethodList() {
  return Object.values(PaymentMethod);
}
