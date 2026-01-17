import prisma from "@/lib/db/prisma";
import { startOfMonth, subMonths } from "date-fns";

export async function getRevenueByMonth() {
  const invoices = await prisma.invoice.findMany({
    where: { status: "PAID" },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const grouped = invoices.reduce(
    (acc, invoice) => {
      const month = invoice.createdAt.toLocaleString("en-US", {
        month: "short",
      });

      acc[month] = (acc[month] || 0) + Number(invoice.total);
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function getInvoicesByStatus() {
  const statuses = await prisma.invoice.groupBy({
    by: ["status"],
    _count: true,
  });

  return statuses.map((s) => ({
    status: s.status,
    count: s._count,
  }));
}

export async function getTopCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      invoices: {
        where: { status: "PAID" },
        select: { total: true },
      },
    },
  });

  return customers
    .map((c) => ({
      name: c.name,
      total: c.invoices.reduce((sum, i) => sum + Number(i.total), 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export async function getInvoicesByMonth() {
  const invoices = await prisma.invoice.findMany({
    select: { createdAt: true },
  });

  const grouped = invoices.reduce(
    (acc, inv) => {
      const month = inv.createdAt.toLocaleString("en-US", {
        month: "short",
      });

      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped).map(([month, count]) => ({
    month,
    count,
  }));
}

export async function getTopProducts() {
  const items = await prisma.invoiceProduct.findMany({
    include: {
      product: true,
    },
  });

  const grouped = items.reduce(
    (acc, item) => {
      const name = item.product.name;
      acc[name] = (acc[name] || 0) + Number(item.quantity);
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped)
    .map(([product, quantity]) => ({ product, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

export async function getKPIs() {
  const [totalRevenue, invoicesCount, customersCount, overdueCount] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { status: "PAID" },
        _sum: { total: true },
      }),
      prisma.invoice.count(),
      prisma.customer.count(),
      prisma.invoice.count({ where: { status: "OVERDUE" } }),
    ]);

  return {
    revenue: totalRevenue._sum.total || 0,
    invoices: invoicesCount,
    customers: customersCount,
    overdue: overdueCount,
  };
}

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
