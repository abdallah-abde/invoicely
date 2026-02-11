import prisma from "@/lib/db/prisma";
import {
  productFullInclude,
  productOrderBy,
} from "@/features/products/db/product.includes";

export async function getProducts() {
  return await prisma.product.findMany({
    include: productFullInclude,
    orderBy: productOrderBy,
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: productFullInclude,
  });
}
