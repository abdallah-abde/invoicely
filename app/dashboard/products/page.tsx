export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import { ProductsTable } from "@/features/products/components/products-table";
import prisma from "@/lib/db/prisma";
import ProductCU from "@/features/products/components/product-cu";
import { APIError } from "better-auth";
import { authSession } from "@/features/auth/lib/auth-utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default async function DashboardProductsPage() {
  const session = await authSession();

  if (!session?.user.role || session?.user.role === "user") {
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
    const { price, createdAt, ...productWithout } = product;
    // const createdDate = createdAt.toLocaleDateString("en-EN", {
    //   dateStyle: "medium",
    // });

    return {
      ...productWithout,
      // createdAt: createdDate,
      priceAsNumber: price.toNumber(),
    };
  });

  return (
    <div>
      <PageHeader title="Products">
        {session.user.role === "admin" || session.user.role === "superadmin" ? (
          <ProductCU />
        ) : null}
      </PageHeader>
      <ProductsTable data={result} />
    </div>
  );
}
