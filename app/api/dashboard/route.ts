import { Invoice } from "@/app/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

interface RouteProps extends Pick<Invoice, "issuedAt" | "total" | "status"> {}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (await searchParams.get("range")) || "7d";

  const now = new Date();
  const from = new Date();

  switch (range) {
    case "7d":
      from.setDate(now.getDate() - 7);
      break;
    case "1m":
      from.setMonth(now.getMonth() - 1);
      break;
    case "3m":
      from.setMonth(now.getMonth() - 3);
      break;
  }

  const [
    invoices,
    customersCount,
    topCustomers,
    topProducts,
    totalRevenue,
    paidInvoices,
    overdueInvoices,
    newCustomersCount,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        issuedAt: {
          gte: from,
        },
      },
      select: {
        total: true,
        status: true,
        issuedAt: true,
      },
    }),
    getCustomersCount(),
    getTopCustomersFormDB(from),
    getTopProductsFormDB(from),
    getTotalRevenue(from),
    getPaidInvoices(from),
    getOverdueInvoices(from),
    getNewCustomersOverTime(from),
    getMonthlyRevenue(),
  ]);

  return NextResponse.json({
    revenueByDay: groupRevenueByDay(invoices),
    invoicesByStatus: groupByStatus(invoices),
    totalRevenue,
    paidInvoices,
    overdueInvoices,
    customersCount,
    topCustomers,
    topProducts,
    newCustomersCount,
    monthlyRevenue,
  });
}

async function getMonthlyRevenue() {
  const result = await prisma.$queryRaw<{ month: string; revenue: bigint }[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
      SUM("total") AS revenue
    FROM "Invoice"
    WHERE "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `;

  return result.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue),
  }));
}

async function getTopCustomersFormDB(fromDate: Date) {
  const data = await prisma.invoice.groupBy({
    by: ["customerId"],
    where: {
      status: "PAID",
      createdAt: {
        gte: fromDate,
      },
    },
    _sum: {
      total: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: 5,
  });

  const customers = await prisma.customer.findMany({
    where: {
      id: {
        in: data.map((d) => d.customerId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return data.map((item) => ({
    customerId: item.customerId,
    name: customers.find((c) => c.id === item.customerId)?.name ?? "Unknown",
    total: item._sum.total?.toNumber() ?? 0,
  }));
}

async function getTopProductsFormDB(fromDate: Date) {
  const data = await prisma.invoiceProduct.groupBy({
    by: ["productId"],
    where: {
      invoice: {
        status: "PAID",
        createdAt: { gte: fromDate },
      },
    },
    _sum: {
      quantity: true,
      unitPrice: true,
      totalPrice: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: data.map((d) => d.productId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return data.map((item) => ({
    productId: item.productId,
    name: products.find((c) => c.id === item.productId)?.name ?? "Unknown",
    quantity: item._sum.quantity?.toNumber() ?? 0,
    price: item._sum.unitPrice?.toNumber() ?? 0,
    total: item._sum.totalPrice?.toNumber() ?? 0,
  }));
}

function groupRevenueByDay(invoices: RouteProps[]) {
  const map: Record<string, number> = {};

  invoices
    .filter((i) => i.status === "PAID")
    .forEach((i) => {
      const day = i.issuedAt.toISOString().split("T")[0];
      map[day] = (map[day] || 0) + Number(i.total);
    });

  return Object.entries(map).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

function groupByStatus(invoices: RouteProps[]) {
  const map: Record<string, number> = {};

  invoices.forEach((i) => {
    map[i.status] = (map[i.status] || 0) + 1;
  });

  return Object.entries(map).map(([status, count]) => ({
    status,
    count,
  }));
}

async function getTotalRevenue(from: Date) {
  const result = await prisma.invoice.aggregate({
    where: {
      status: "PAID",
      createdAt: { gte: from },
    },
    _sum: {
      total: true,
    },
  });

  return result._sum.total;
}

async function getPaidInvoices(from: Date) {
  const result = await prisma.invoice.count({
    where: {
      status: "PAID",
      createdAt: { gte: from },
    },
  });

  return result;
}

async function getOverdueInvoices(from: Date) {
  const result = await prisma.invoice.count({
    where: {
      status: "OVERDUE",
      createdAt: { gte: from },
    },
  });

  return result;
}

async function getCustomersCount() {
  return await prisma.customer.count();
}

async function getNewCustomersOverTime(fromDate: Date) {
  const result = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT
      DATE("createdAt") as date,
      COUNT(*) as count
    FROM "Customer"
    WHERE "createdAt" >= ${fromDate}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
  `;

  return result.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    count: Number(row.count),
  }));
}
