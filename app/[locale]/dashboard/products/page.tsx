export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { APIError } from "better-auth";
import { getUserRole } from "@/features/auth/lib/auth-utils";
import { USER_ROLE } from "@/features/users/lib/user.constants";
import { getProducts } from "@/features/products/db/product.query";
import ProductsClient from "@/features/products/components/products-client";
import { mapProductsToDTO } from "@/features/products/lib/product.normalize";

export const metadata: Metadata = {
  title: "Products",
};

export default async function DashboardProductsPage() {
  const role = await getUserRole();

  if (role === USER_ROLE) {
    throw new APIError("FORBIDDEN");
  }

  const data = await getProducts();

  const result = mapProductsToDTO(data);

  return <ProductsClient data={result} role={role} />;
}
