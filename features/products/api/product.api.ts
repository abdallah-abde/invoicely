import { ProductType } from "@/features/products/product.types";

export async function fetchProducts(): Promise<ProductType[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
