import prisma from "@/lib/db/prisma";
import { productFullInclude } from "@/features/products/db/product.includes";
import { ProductInput } from "@/features/products/product.types";
import { normalizeDecimal } from "@/lib/normalize/primitives";
import { UserInput } from "../user.types";

// export async function createProduct(data: ProductInput) {
//   const product = await prisma.product.create({
//     data: {
//       ...data,
//       price: normalizeDecimal(data.price),
//     },
//     include: productFullInclude,
//   });

//   return product;

//   // const { price, ...rest } = product;

//   // return {
//   //   ...rest,
//   //   // price: normalizeDecimal(price),
//   //   priceAsNumber: normalizeDecimal(price),
//   // };
// }

export async function updateUser(id: string, data: UserInput) {
  return await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
