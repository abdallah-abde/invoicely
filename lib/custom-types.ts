import { Product } from "@/app/generated/prisma/browser";
import type { Customer, Invoice, User } from "@/app/generated/prisma/client";

export interface ProductType extends Omit<Omit<Product, "price">, "createdAt"> {
  _count: {
    invoices: number;
  };
  priceAsNumber: number;
  createdAt: string;
}

export interface CustomerType extends Customer {
  _count: {
    invoices: number;
  };
}

export interface InvoiceType extends Omit<Omit<Invoice, "total">, "createdAt"> {
  createdAt: string;
  issuedDateAsString: string;
  dueDateAsString: string;
  customer: Customer;
  createdBy: User;
  totalAsNumber: number;
  _count: {
    products: number;
  };
  products: Product[];
}
