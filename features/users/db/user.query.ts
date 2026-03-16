import prisma from "@/lib/db/prisma";
import {
  productFullInclude,
  productOrderBy,
} from "@/features/products/db/product.includes";

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });
}
