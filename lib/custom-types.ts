import { Product } from "@/app/generated/prisma/browser";
import { Customer, Invoice, User } from "@/app/generated/prisma/client";

export interface ProductType extends Omit<Omit<Product, "price">, "createdAt"> {
  id: string;
  name: string;
  description: string;
  unit: string;
  priceAsNumber: number;
  createdAt: string;
  updatedAt: Date;
}

export interface InvoiceType extends Omit<Invoice, "total"> {
  customer: Customer;
  createdBy: User;
  totalAsNumber: number;
}
