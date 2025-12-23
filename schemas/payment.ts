import z from "zod";
import { PaymentMethod } from "@/app/generated/prisma/enums";

export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const paymentSchema = z.object({
  invoiceId: z
    .array(optionSchema)
    .min(1, {
      error: "Invoice is required",
    })
    .max(1, {
      error: "You can enter one invoice only",
    }),
  amount: z.string().trim().min(1, {
    message: "Amount is required",
  }),
  date: z.date({
    error: "Invoice date is required",
  }),
  method: z.enum(PaymentMethod, {
    error: "Payment method is required",
  }),
  notes: z.string().trim().optional(),
});
