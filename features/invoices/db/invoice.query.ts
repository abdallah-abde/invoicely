import prisma from "@/lib/db/prisma";

export async function getInvoices() {
  return await prisma.invoice.findMany({
    include: {
      customer: true,
      createdBy: true,
      _count: {
        select: {
          products: true,
        },
      },
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      number: "desc",
    },
  });
}
