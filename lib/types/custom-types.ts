import { Product } from "@/app/generated/prisma/browser";
import type {
  Customer,
  Invoice,
  Payment,
  User,
} from "@/app/generated/prisma/client";

export interface ProductType extends Omit<Omit<Product, "price">, "createdAt"> {
  _count: {
    invoices: number;
  };
  priceAsNumber: number;
  // createdAt: string;
}

export interface CustomerType extends Customer {
  _count: {
    invoices: number;
  };
}

export interface InvoiceType extends Omit<Omit<Invoice, "total">, "createdAt"> {
  // createdAt: string;
  issuedDateAsString: string;
  dueDateAsString: string;
  customer: Customer;
  createdBy: User;
  totalAsNumber: number;
  _count: {
    products: number;
  };
  products: Omit<Product, "price">[];
}

export interface PaymentType extends Omit<
  Omit<Payment, "amount">,
  "createdAt"
> {
  amountAsNumber: number;
  // createdAt: string;
  dateAsString: string;
  invoice: {
    number: string;
    customer: {
      name: string;
    };
  };
}

export interface InvoicePDFData {
  invoiceNumber: string;
  issueAt: string;
  dueAt: string;
  customer: {
    name: string;
    email?: string;
    address?: string;
  };
  products: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  currency: string;
}
