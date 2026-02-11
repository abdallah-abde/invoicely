import { Prisma } from "@/app/generated/prisma/client";

export const productFullInclude = {
  _count: {
    select: { invoices: true },
  },
} satisfies Prisma.ProductInclude;

export const productOrderBy = {
  name: "asc",
} satisfies Prisma.ProductOrderByWithRelationInput;
