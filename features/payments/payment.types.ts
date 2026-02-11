import { Payment } from "@/app/generated/prisma/client";
import { InvoiceSelectedProps } from "@/features/invoices/invoice.types";
import z from "zod";
import { paymentSchema, recordPaymentSchema } from "./schemas/payment.schema";

export interface PaymentType extends Omit<
  Omit<Payment, "amount">,
  "createdAt"
> {
  amountAsNumber: number;
  dateAsString: string;
  invoice: {
    number: string | null;
    customer: {
      name: string;
    };
  };
}

export const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  CASH: "CASH",
  CHECK: "CHECK",
  OTHER: "OTHER",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

/*** PAYMENT NORMALIZE TYPES ***/
export interface PaymentPrismaPayload extends Payment {
  invoice: InvoiceSelectedProps;
}

/* ---------- INPUT TYPES ---------- */

export type PaymentInput = z.infer<typeof paymentSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

/* ---------- RESPONSE TYPES ---------- */

export type PaymentResponse = Payment;
