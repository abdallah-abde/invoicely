import { Prisma } from "@/app/generated/prisma/client";

export const invoiceFullInclude = {
  customer: true,
  createdBy: true,

  Payments: {
    include: {
      invoice: {
        select: {
          number: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },

  products: {
    include: {
      product: true,
    },
  },
  _count: {
    select: { products: true, Payments: true },
  },
} satisfies Prisma.InvoiceInclude;

export const invoiceOrderBy = {
  number: "desc",
} satisfies Prisma.InvoiceOrderByWithRelationInput;
