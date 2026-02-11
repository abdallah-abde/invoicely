import { Prisma } from "@/app/generated/prisma/client";

export const paymentFullInclude = {
  invoice: {
    select: {
      number: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.PaymentInclude;

export const paymentOrderBy = {
  date: "desc",
} satisfies Prisma.PaymentOrderByWithRelationInput;
