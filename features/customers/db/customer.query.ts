import prisma from "@/lib/db/prisma";
import {
  customerFullInclude,
  customerOrderBy,
} from "@/features/customers/db/customer.includes";

export async function getCustomers() {
  return await prisma.customer.findMany({
    include: customerFullInclude,
    orderBy: customerOrderBy,
  });
}
