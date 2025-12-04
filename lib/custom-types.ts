import { Product } from "@/app/generated/prisma/browser";
import { Customer, Invoice, User } from "@/app/generated/prisma/client";

export interface ProductType extends Omit<Omit<Product, "price">, "createdAt"> {
  priceAsNumber: number;
  createdAt: string;
}

export interface InvoiceType extends Omit<Omit<Invoice, "total">, "createdAt"> {
  createdAt: string;
  issuedDateAsString: string;
  dueDateAsString: string;
  customer: Customer;
  createdBy: User;
  totalAsNumber: number;
}
