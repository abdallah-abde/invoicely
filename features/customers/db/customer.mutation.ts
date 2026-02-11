import prisma from "@/lib/db/prisma";
import { customerFullInclude } from "@/features/customers/db/customer.includes";
import { CustomerInput } from "@/features/customers/customer.types";

export async function createCustomer(data: CustomerInput) {
  return prisma.customer.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
    },
    include: customerFullInclude,
  });
}

export async function updateCustomer(id: string, data: CustomerInput) {
  return prisma.customer.update({
    where: { id },
    data: {
      ...data,
      email: data.email.toLowerCase(),
    },
    include: customerFullInclude,
  });
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({
    where: { id },
  });
}
