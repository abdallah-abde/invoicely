"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/layout/page-header";
import { fetchProducts } from "@/features/products/api/product.api";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductType } from "@/features/products/product.types";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
} from "@/features/users/lib/user.constants";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import ProductCU from "@/features/products/components/product-cu";
import TableSkeleton from "@/features/shared/components/table/table-skeleton";
import { GC_TIME } from "@/features/dashboard/charts.constants";

export default function ProductsClient({
  data,
  role,
}: {
  data: ProductType[];
  role: string | undefined | null;
}) {
  const t = useTranslations();
  const isMutating =
    useIsMutating({
      mutationKey: ["products"],
    }) > 0;

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: data,
    staleTime: GC_TIME,
  });

  return isMutating ? (
    <TableSkeleton />
  ) : (
    <div>
      <PageHeader title={t("products.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? <ProductCU /> : null}
      </PageHeader>
      <ProductsTable data={productsQuery.data ?? []} />
    </div>
  );
}
