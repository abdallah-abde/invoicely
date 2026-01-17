import { Product } from "@/app/generated/prisma/client";
import { ProductType } from "@/features/products/product.types";

export async function fetchProducts(): Promise<ProductType[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(data: Partial<Product>) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}
