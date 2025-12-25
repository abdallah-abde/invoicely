import {
  Customer,
  Invoice,
  Product,
  User,
} from "@/app/generated/prisma/client";

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
