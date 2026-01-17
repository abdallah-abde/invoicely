import z from "zod";
import { InvoiceStatus } from "@/app/generated/prisma/enums";

export const invoiceSchema = z.object({
  number: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(1, { error: "min" }),
  customerId: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(1, { error: "min" }),
  issuedAt: z.coerce.date({
    error: "required",
  }),
  dueAt: z.coerce.date({
    error: "required",
  }),
  status: z.enum(InvoiceStatus, {
    error: "required",
  }),
  total: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(1, { error: "min" }),
  notes: z.string().trim().optional(),
  createdById: z
    .string()
    .trim()
    .nonempty({ error: "required" })
    .min(1, { error: "min" }),
});
