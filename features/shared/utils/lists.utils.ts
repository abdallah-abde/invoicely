import { InvoiceStatus, PaymentMethod } from "@/app/generated/prisma/enums";

export function getInvoiceStatusList() {
  return Object.values(InvoiceStatus);
}

export function getPaymentMethodList() {
  return Object.values(PaymentMethod);
}
