import prisma from "@/lib/db/prisma";

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });
}
