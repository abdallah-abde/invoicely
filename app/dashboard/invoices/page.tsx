export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import prisma from "@/lib/db/prisma";
import InvoiceCU from "@/features/invoices/components/invoice-cu";
import { APIError } from "better-auth";
import { authSession } from "@/features/auth/lib/auth-utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function DashboardInvoicesPage() {
  const session = await authSession();

  if (!session?.user.role || session?.user.role === "user") {
    throw new APIError("FORBIDDEN");
  }

  const data = await prisma.invoice.findMany({
    include: {
      customer: true,
      createdBy: true,
      _count: {
        select: {
          products: true,
        },
      },
      // include the related product for each invoice-product pivot row
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  const result = data.map((inv) => {
    const createdDate = inv.createdAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const issuedDate = inv.issuedAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const dueDate = inv.dueAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const { total, ...invoiceWithoutTotal } = inv;

    // map invoice-product pivot rows into the expected product shape
    const products = inv.products.map((ip) => ({
      // spread the actual product fields first (name, id, createdAt, updatedAt, description, price, unit, ...)
      ...(ip.product ?? {}),
      // add invoice-specific fields if needed
      quantity: ip.quantity.toNumber(),
      unitPrice: ip.unitPrice.toNumber(),
      totalPrice: ip.totalPrice.toNumber(),
      price: ip.product.price.toNumber(),
      // keep pivot ids if you need them later
      id: ip.product ? ip.product.id : ip.id,
    }));

    return {
      ...invoiceWithoutTotal,
      createdAt: createdDate,
      issuedDateAsString: issuedDate,
      dueDateAsString: dueDate,
      totalAsNumber: total.toNumber(),
      total: total.toNumber(),
      products,
    };
  });

  return (
    <div>
      <PageHeader title="Invoices">
        {session.user.role === "admin" || session.user.role === "superadmin" ? (
          <InvoiceCU />
        ) : null}
      </PageHeader>
      <InvoicesTable data={result} />
    </div>
  );
}
