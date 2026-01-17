import { Product } from "@/app/generated/prisma/client";
import { ProductType } from "@/features/products/product.types";

type ProductPrismaPayload = Product & { _count: { invoices: number } };

export function mapProductsToDTO(
  products: ProductPrismaPayload[]
): ProductType[] {
  const result = products.map((product) => {
    const { price, ...restOfProduct } = product;

    return {
      ...restOfProduct,
      priceAsNumber: price.toNumber(),
      price: undefined,
    };
  });

  return result;
}
