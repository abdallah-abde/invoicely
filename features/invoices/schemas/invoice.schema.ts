import z from "zod";
import { InvoiceStatus } from "@/features/invoices/invoice.types";

export const invoiceCreateSchema = z
  .object({
    customerId: z
      .string()
      .trim()
      .nonempty({ error: "required" })
      .min(1, { error: "min" }),
    notes: z.string().trim().optional(),
    issuedAt: z.coerce.date().optional(),
    dueAt: z.coerce.date().optional(),
    status: z.enum(InvoiceStatus, {
      error: "required",
    }),
    total: z
      .string()
      .trim()
      .nonempty({ error: "required" })
      .min(1, { error: "min" }),
    createdById: z
      .string()
      .trim()
      .nonempty({ error: "required" })
      .min(1, { error: "min" }),
    paidAmount: z.string().optional(),
    paymentMethod: z.string().optional(),
    products: z
      .array(
        z.object({
          productId: z.string(),
          unitPrice: z.coerce.number(),
          totalPrice: z.coerce.number(),
          quantity: z.coerce.number(),
          unit: z.string(),
        }),
      )
      .nonempty({ error: "required" })
      .min(1, { error: "min" }),
  })
  .superRefine((data, ctx) => {
    const total = Number(data.total);
    const paid = Number(data.paidAmount ?? 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.status !== InvoiceStatus.DRAFT && data.issuedAt && data.dueAt) {
      if (data.issuedAt < today) {
        ctx.addIssue({
          path: ["issuedAt"],
          message: "invoice-date-less-than-today",
          code: "custom",
        });
      }

      if (data.dueAt < data.issuedAt) {
        ctx.addIssue({
          path: ["dueAt"],
          message: "due-date-less-than-invoice-date",
          code: "custom",
        });
      }
    }

    if (data.status === InvoiceStatus.PAID) {
      if (!data.paidAmount || !data.paymentMethod) {
        ctx.addIssue({
          path: ["paidAmount"],
          message: "required",
          code: "custom",
        });
      }

      if (paid <= 0 || paid > total) {
        ctx.addIssue({
          path: ["paidAmount"],
          message: "amount-not-excced-total",
          code: "custom",
        });
      }

      if (!data.dueAt && paid > 0 && paid < total) {
        ctx.addIssue({
          path: ["dueAt"],
          message: "required",
          code: "custom",
        });
      }
    }

    if (data.status === InvoiceStatus.SENT) {
      if (!data.dueAt) {
        ctx.addIssue({
          path: ["dueAt"],
          message: "required",
          code: "custom",
        });
      }
    }
  });

export const invoiceUpdateSchema = z.object({
  notes: z.string().trim().optional(),
});
