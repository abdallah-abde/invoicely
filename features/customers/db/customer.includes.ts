import { Prisma } from "@/app/generated/prisma/client";

export const customerFullInclude = {
  _count: {
    select: { invoices: true },
  },
} satisfies Prisma.CustomerInclude;

export const customerOrderBy = {
  name: "asc",
} satisfies Prisma.CustomerOrderByWithRelationInput;
