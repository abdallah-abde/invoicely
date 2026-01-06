export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import prisma from "@/lib/db/prisma";
import InvoiceCU from "@/features/invoices/components/invoice-cu";
import { APIError } from "better-auth";
import { getUserRole } from "@/features/auth/lib/auth-utils";

import type { Metadata } from "next";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
  USER_ROLE,
} from "@/features/users/lib/constants";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function DashboardInvoicesPage() {
  const role = await getUserRole();
  const t = await getTranslations();

  if (role === USER_ROLE) {
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
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  const result = data.map((inv) => {
    const createdDate = inv.createdAt.toLocaleDateString();
    const issuedDate = inv.issuedAt.toLocaleDateString();
    const dueDate = inv.dueAt.toLocaleDateString();

    const { total, ...restOfInvoice } = inv;

    const products = inv.products.map((ip) => ({
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

  return (
    <div>
      <PageHeader title={t("invoices.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? <InvoiceCU /> : null}
      </PageHeader>
      <InvoicesTable data={result} />
    </div>
  );
}
