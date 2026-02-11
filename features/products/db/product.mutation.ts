import prisma from "@/lib/db/prisma";
import { productFullInclude } from "@/features/products/db/product.includes";
import { ProductInput } from "@/features/products/product.types";
import { normalizeDecimal } from "@/lib/normalize/primitives";

export async function createProduct(data: ProductInput) {
  const product = await prisma.product.create({
    data: {
      ...data,
      price: normalizeDecimal(Number(data.price)),
    },
    include: productFullInclude,
  });

  const { price, ...rest } = product;

  return {
    ...rest,
    priceAsNumber: normalizeDecimal(price),
  };
}

export async function updateProduct(id: string, data: ProductInput) {
  return await prisma.product.update({
    where: { id },
    data: {
      ...data,
      price: normalizeDecimal(Number(data.price)),
    },
    include: productFullInclude,
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
