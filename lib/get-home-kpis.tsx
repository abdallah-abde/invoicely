import prisma from "@/lib/prisma";
import { startOfMonth, subMonths } from "date-fns";

export async function getHomeKPIs() {
  const now = new Date();
  const thisMonth = startOfMonth(now);
  const lastMonth = startOfMonth(subMonths(now, 1));

  const [thisRevenue, lastRevenue, thisCustomers, lastCustomers, topProduct] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { status: "PAID", createdAt: { gte: thisMonth } },
        _sum: { total: true },
      }),

      prisma.invoice.aggregate({
        where: {
          status: "PAID",
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
        _sum: { total: true },
      }),

      prisma.customer.count({
        where: { createdAt: { gte: thisMonth } },
      }),

      prisma.customer.count({
        where: {
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
      }),

      prisma.invoiceProduct.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 1,
      }),
    ]);

  const revenueNow = Number(thisRevenue._sum.total ?? 0);
  const revenueBefore = Number(lastRevenue._sum.total ?? 0);

  const revenueDelta =
    revenueBefore === 0
      ? null
      : ((revenueNow - revenueBefore) / revenueBefore) * 100;

  const customersDelta =
    lastCustomers === 0
      ? null
      : ((thisCustomers - lastCustomers) / lastCustomers) * 100;

  const topProductRaw = topProduct[0] ?? null;

  return {
    revenue: revenueNow,
    revenueDelta,
    customers: thisCustomers,
    customersDelta,
    topProduct: topProductRaw
      ? {
          productId: topProductRaw.productId,
          quantity: Number(topProductRaw._sum.quantity),
        }
      : null,
  };
}
