import {
  ProductPrismaPayload,
  ProductType,
} from "@/features/products/product.types";

export function mapProductsToDTO(
  products: ProductPrismaPayload[],
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
