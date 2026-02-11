import { Customer } from "@/app/generated/prisma/client";
import { customerSchema } from "./schemas/customer.schema";
import z from "zod";

export interface CustomerType extends Customer {
  _count: {
    invoices: number;
  };
}

/* ---------- INPUT TYPES ---------- */

export type CustomerInput = z.infer<typeof customerSchema>;

/* ---------- RESPONSE TYPES ---------- */

export type CustomerResponse = Customer;
