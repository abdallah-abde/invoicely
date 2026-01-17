import prisma from "@/lib/db/prisma";

export async function getCustomers() {
  return await prisma.customer.findMany({
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });
}
