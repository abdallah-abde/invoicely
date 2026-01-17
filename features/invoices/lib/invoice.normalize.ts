import {
  Customer,
  Invoice,
  Product,
  User,
  InvoiceProduct,
} from "@/app/generated/prisma/client";
import { InvoiceType } from "@/features/invoices/invoice.types";

type InvoiceProductWithProduct = InvoiceProduct & {
  product: Product;
};

type InvoicePrismaPayload = Invoice & {
  customer: Customer;
  createdBy: User;
  _count: { products: number };
  products: InvoiceProductWithProduct[];
};

export function mapInvoicesToDTO(
  invoices: InvoicePrismaPayload[]
): InvoiceType[] {
  const result = invoices.map((invoice) => {
    const createdDate = invoice.createdAt.toLocaleDateString();
    const issuedDate = invoice.issuedAt.toLocaleDateString();
    const dueDate = invoice.dueAt.toLocaleDateString();

    const { total, ...restOfInvoice } = invoice;

    const products = invoice.products.map((ip) => ({
      ...(ip.product ?? {}),
      quantity: ip.quantity.toNumber(),
      unitPrice: ip.unitPrice.toNumber(),
      totalPrice: ip.totalPrice.toNumber(),
      price: ip.product.price.toNumber(),
      id: ip.product ? ip.product.id : ip.id,
    }));

    return {
      ...restOfInvoice,
      createdAt: createdDate,
      issuedDateAsString: issuedDate,
      dueDateAsString: dueDate,
      totalAsNumber: total.toNumber(),
      total: total.toNumber(),
      products,
    };
  });

  return result;
}
