import {
  ProductPrismaPayload,
  ProductType,
} from "@/features/products/product.types";
import { normalizeDecimal } from "@/lib/normalize/primitives";

export function mapProductsToDTO(
  products: ProductPrismaPayload[],
): ProductType[] {
  const result = products.map((product) => {
    return mapSingleProductToDTO(product);
  });

  return result;
}

export function mapSingleProductToDTO(
  product: ProductPrismaPayload,
): ProductType {
  const { price, ...restOfProduct } = product;

  return {
    ...restOfProduct,
    priceAsNumber: normalizeDecimal(price),
    // price: undefined,
  };
}
