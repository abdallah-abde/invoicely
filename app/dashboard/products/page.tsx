import PageHeader from "@/components/page-header";
import { ProductsTable } from "@/app/dashboard/products/products-table";
import prisma from "@/lib/db/prisma";
import ProductCU from "./product-cu";
import { APIError } from "better-auth";
import { authSession } from "@/lib/auth/auth-utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default async function page() {
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
        <ProductCU />
      </PageHeader>
      <ProductsTable data={result} />
    </div>
  );
}
