export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import { ProductsTable } from "@/features/products/components/products-table";
import prisma from "@/lib/db/prisma";
import ProductCU from "@/features/products/components/product-cu";
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
  title: "Products",
};

export default async function DashboardProductsPage() {
  const role = await getUserRole();
  const t = await getTranslations();

  if (role === USER_ROLE) {
    throw new APIError("FORBIDDEN");
  }

  const data = await prisma.product.findMany({
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });

  const result = data.map((product) => {
    const { price, ...restOfProduct } = product;

    return {
      ...restOfProduct,
      priceAsNumber: price.toNumber(),
    };
  });

  return (
    <div>
      <PageHeader title={t("products.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? <ProductCU /> : null}
      </PageHeader>
      <ProductsTable data={result} />
    </div>
  );
}
