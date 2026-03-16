import { Payment } from "@/app/generated/prisma/client";
import {
  InvoicePDFData,
  InvoiceSelectedProps,
  InvoiceStatus,
} from "@/features/invoices/invoice.types";
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
    status: InvoiceStatus;
    customer: {
      name: string;
    };
  };
}

/*** RECEIPT PDF DATA TYPE ***/
export interface ReceiptPDFData {
  referenceNo: string;
  amount: number;
  receiptDate: string;
  method: string;
  paymentStatus: string;
  invoice: InvoicePDFData;
  lang: string;
}

export const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  CASH: "CASH",
  CHECK: "CHECK",
  OTHER: "OTHER",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  ACTIVE: "ACTIVE",
  VOIDED: "VOIDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const ALLOWED_INVOICES_TO_MAKE_PAYMENTS = [
  InvoiceStatus.SENT,
  InvoiceStatus.PARTIAL_PAID,
  InvoiceStatus.OVERDUE,
] as const;

export type AllowedInvoicesToMakePayments =
  (typeof ALLOWED_INVOICES_TO_MAKE_PAYMENTS)[number];

/*** PAYMENT NORMALIZE TYPES ***/
export interface PaymentPrismaPayload extends Payment {
  invoice: InvoiceSelectedProps;
}

/* ---------- INPUT TYPES ---------- */

export type PaymentInput = z.infer<typeof paymentSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

/* ---------- RESPONSE TYPES ---------- */

export type PaymentResponse = Payment;
