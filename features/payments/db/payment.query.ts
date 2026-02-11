import prisma from "@/lib/db/prisma";
import {
  paymentFullInclude,
  paymentOrderBy,
} from "@/features/payments/db/payment.includes";

export async function getPayments() {
  return await prisma.payment.findMany({
    include: paymentFullInclude,
    orderBy: paymentOrderBy,
  });
}
