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
    .nonempty({ error: "required" })
    .min(1, { error: "min" })
    .max(1, { error: "max" }),
  amount: z.coerce
    .number()
    .positive({ error: "required" })
    .min(1, { error: "min" }),
  date: z.date().nonoptional({ error: "required" }),
  method: z.enum(PaymentMethod, {
    error: "required",
  }),
  notes: z.string().trim().optional(),
});

export const recordPaymentSchema = z.object({
  invoiceId: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(1, { error: "min" }),
  amount: z.coerce
    .number()
    .positive({ error: "required" })
    .min(1, { error: "min" }),
  method: z.enum(PaymentMethod, {
    error: "required",
  }),
  notes: z.string().trim().optional(),
  dueAt: z.coerce.date().optional(),
});
