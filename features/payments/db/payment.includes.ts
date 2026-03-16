import { Prisma } from "@/app/generated/prisma/client";

export const paymentFullInclude = {
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
} satisfies Prisma.PaymentInclude;

export const paymentReceiptFullInclude = {
  invoice: {
    select: {
      number: true,
      status: true,
      issuedAt: true,
      dueAt: true,
      customer: {
        select: {
          name: true,
          email: true,
          address: true,
        },
      },
      products: {
        select: {
          quantity: true,
          unitPrice: true,
          product: {
            select: {
              name: true,
              unit: true,
            },
          },
        },
      },
      total: true,
    },
  },
} satisfies Prisma.PaymentInclude;

export const paymentOrderBy = {
  date: "desc",
} satisfies Prisma.PaymentOrderByWithRelationInput;
