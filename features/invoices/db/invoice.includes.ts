import { Prisma } from "@/app/generated/prisma/client";
import { PaymentStatus } from "@/features/payments/payment.types";

export const invoiceFullInclude = {
  customer: true,
  createdBy: true,

  Payments: {
    where: {
      voidedAt: null,
      status: PaymentStatus.ACTIVE,
    },
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
    select: {
      products: true,
      Payments: {
        where: {
          voidedAt: null,
          status: PaymentStatus.ACTIVE,
        },
      },
    },
  },
} satisfies Prisma.InvoiceInclude;

export const invoiceOrderBy = {
  number: "desc",
} satisfies Prisma.InvoiceOrderByWithRelationInput;
