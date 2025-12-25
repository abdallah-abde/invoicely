import { Customer } from "@/app/generated/prisma/client";

export interface CustomerType extends Customer {
  _count: {
    invoices: number;
  };
}
