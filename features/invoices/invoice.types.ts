import {
  Customer,
  Invoice,
  InvoiceProduct,
  Product,
  User,
} from "@/app/generated/prisma/client";
import {
  PaymentMethod,
  PaymentPrismaPayload,
} from "@/features/payments/payment.types";

export interface InvoiceType extends Omit<
  Omit<Omit<Invoice, "total">, "createdAt">,
  "status"
> {
  issuedDateAsString: string | undefined;
  dueDateAsString: string | undefined;
  customer: Customer;
  createdBy: User;
  totalAsNumber: number;
  status: InvoiceStatus;
  _count: {
    products: number;
    Payments: number;
  };
  products: Array<
    Omit<Product, "price"> & {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      price: number;
    }
  >;
  paidAmount: number;
  rest: number;
}

/*** INVOICE PDF DATA TYPE ***/
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
    unit: string;
  }[];
  total: number;
  lang: string;
}

export const InvoiceStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELED: "CANCELED",
  PARTIAL_PAID: "PARTIAL_PAID",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const InvoiceCategory = {
  CANCELED: "canceled",
  WORKING: "working",
  OVERDUE: "overdue",
  CANDIDATES: "candidates",
} as const;

export type InvoiceCategory =
  (typeof InvoiceCategory)[keyof typeof InvoiceCategory];

export const DOWNLOADABLE_STATUSES = [
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
  InvoiceStatus.PARTIAL_PAID,
  InvoiceStatus.OVERDUE,
] as const;

export type DownloadableStatus = (typeof DOWNLOADABLE_STATUSES)[number];

/*** INVOICE NORMALIZE TYPES ***/
export interface InvoiceSelectedProps {
  number: string | null;
  status: InvoiceStatus;
  customer: Pick<Customer, "name">;
}

export interface InvoicePrismaPayload extends Invoice {
  customer: Customer;
  createdBy: User;
  _count: { products: number; Payments: number };
  products: InvoiceProductWithProduct[];
  Payments: PaymentPrismaPayload[];
}

/*** INVOICE PRODUCT ***/
export interface InvoiceProductWithProduct extends InvoiceProduct {
  product: Product;
}

/*** INVOICE EDIT POLICY ***/
export interface InvoiceEditPolicy {
  notes: boolean;
  issuedAt: boolean;
  dueAt: boolean;
  customerId: boolean;
  products: boolean;
}

/* ---------- INPUT TYPES ---------- */

export type InvoiceInput = {
  customerId: string;
  issuedAt?: Date;
  dueAt?: Date;
  status: InvoiceStatus;
  total: number;
  notes?: string;
  createdById: string;
  products: Array<{
    productId: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
};

export type InvoiceCreateInput = InvoiceInput;

export type InvoiceDraftUpdateInput = Partial<InvoiceInput>;

export type InvoiceLockedUpdateInput = {
  notes?: string;
};

export type InvoiceFormValues = {
  notes?: string;
  customerId?: string;
  createdById?: string;
  issuedAt?: Date;
  dueAt?: Date;
  total?: string;
  status?: InvoiceStatus;
  paidAmount?: string;
  paymentMethod?: PaymentMethod;
  products: Array<{
    productId: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
};

export type InvoiceFormProduct = {
  product: Product;
  price: number;
  quantity: number;
  unit: string;
};
