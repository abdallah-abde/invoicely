import { InvoiceStatus } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const invoiceSchema = z.object({
  number: z.string().trim().min(1, {
    error: "Invoice number is required",
  }),
  customerId: z.string().trim().min(1, {
    error: "Customer is required",
  }),
  issuedAt: z.date({
    error: "Issued date is required",
  }),
  dueAt: z.date({
    error: "Due date is required",
  }),
  status: z.enum(InvoiceStatus, {
    error: "Invoice Status is required",
  }),
  total: z.string().trim().min(1, {
    error: "Invoice total is required",
  }),
  notes: z.string().optional(),
  createdById: z.string().trim().min(1, {
    error: "Created by is required",
  }),
});
