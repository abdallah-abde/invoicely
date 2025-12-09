import PageHeader from "@/components/page-header";
import { ProductsTable } from "@/app/dashboard/products/products-table";
import prisma from "@/lib/prisma";
import ProductCU from "./product-cu";

export default async function page() {
  const data = await prisma.product.findMany({
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });

  const result = data.map((product) => {
    const { price, createdAt, ...productWithout } = product;
    const createdDate = createdAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });

    return {
      ...productWithout,
      createdAt: createdDate,
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
