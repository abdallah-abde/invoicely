import { Invoice } from "@/app/generated/prisma/client";
import {
  LAST_30_DAYS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_90_DAYS_VALUE,
} from "@/features/dashboard/charts.constants";
import prisma from "@/lib/db/prisma";
import { getDateBeginningOfDay } from "@/lib/utils/date.utils";
import { NextResponse } from "next/server";

interface RouteProps extends Pick<Invoice, "issuedAt" | "total" | "status"> {}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (await searchParams.get("range")) || LAST_7_DAYS_VALUE;

  const now = new Date();
  let from = new Date();

  switch (range) {
    case LAST_7_DAYS_VALUE:
      from.setDate(now.getDate() - 7);
      break;
    case LAST_30_DAYS_VALUE:
      from.setDate(now.getDate() - 30);
      break;
    case LAST_90_DAYS_VALUE:
      from.setDate(now.getDate() - 90);
      break;
  }

  from = getDateBeginningOfDay(from);

  const [
    invoices,
    customersCount,
    // topCustomers,
    topProducts,
    // totalRevenue,
    // paidInvoices,
    // overdueInvoices,
    // newCustomersCount,
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
    // getCustomersCount(),
    // getTopCustomersFormDB(from),
    getTopProductsFormDB(from),
    // getTotalRevenue(from),
    // getPaidInvoices(from),
    // getOverdueInvoices(from),
    getNewCustomersOverTime(from),
    getMonthlyRevenue(),
  ]);

  return NextResponse.json(
    {
      // revenueByDay: groupRevenueByDay(invoices),
      invoicesByStatus: groupByStatus(invoices),
      // totalRevenue,
      // paidInvoices,
      // overdueInvoices,
      customersCount,
      // topCustomers,
      topProducts,
      // newCustomersCount,
      monthlyRevenue,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

async function getMonthlyRevenue() {
  const result = await prisma.$queryRaw<{ month: string; revenue: bigint }[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "issuedAt"), 'YYYY-MM') AS month,
      SUM("total") AS revenue
    FROM "Invoice"
    WHERE "issuedAt" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `;

  return result.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue),
  }));
}

// async function getTopCustomersFormDB(fromDate: Date) {
//   const data = await prisma.invoice.groupBy({
//     by: ["customerId"],
//     where: {
//       status: "PAID",
//       issuedAt: {
//         gte: fromDate,
//       },
//     },
//     _sum: {
//       total: true,
//     },
//     orderBy: {
//       _sum: {
//         total: "desc",
//       },
//     },
//     take: 5,
//   });

//   const customers = await prisma.customer.findMany({
//     where: {
//       id: {
//         in: data.map((d) => d.customerId),
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//     },
//   });

//   return data.map((item) => ({
//     customerId: item.customerId,
//     name: customers.find((c) => c.id === item.customerId)?.name ?? "Unknown",
//     total: item._sum.total?.toNumber() ?? 0,
//   }));
// }

async function getTopProductsFormDB(fromDate: Date) {
  const data = await prisma.invoiceProduct.groupBy({
    by: ["productId"],
    where: {
      invoice: {
        status: "PAID",
        issuedAt: { gte: fromDate },
      },
    },
    _sum: {
      quantity: true,
      // unitPrice: true,
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
      unit: true,
    },
  });

  return data.map((item) => ({
    productId: item.productId,
    name: products.find((c) => c.id === item.productId)?.name ?? "Unknown",
    quantity: item._sum.quantity?.toNumber() ?? 0,
    // price: item._sum.unitPrice?.toNumber() ?? 0,
    unit: products.find((c) => c.id === item.productId)?.unit ?? "Unknown",
    total: item._sum.totalPrice?.toNumber() ?? 0,
  }));
}

// function groupRevenueByDay(invoices: RouteProps[]) {
//   const map: Record<string, number> = {};

//   invoices
//     .filter((i) => i.status === "PAID")
//     .forEach((i) => {
//       const day = i.issuedAt.toISOString().slice(0, 10); // YYYY-MM-DD
//       map[day] = (map[day] || 0) + Number(i.total);
//     });

//   const data = Object.entries(map)
//     .map(([date, revenue]) => ({
//       date,
//       revenue,
//     }))
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//   return data;
// }

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

// async function getTotalRevenue(from: Date) {
//   const result = await prisma.invoice.aggregate({
//     where: {
//       status: "PAID",
//       issuedAt: { gte: from },
//     },
//     _sum: {
//       total: true,
//     },
//   });

//   return result._sum.total;
// }

// async function getPaidInvoices(from: Date) {
//   const result = await prisma.invoice.count({
//     where: {
//       status: "PAID",
//       issuedAt: { gte: from },
//     },
//   });

//   return result;
// }

// async function getOverdueInvoices(from: Date) {
//   const result = await prisma.invoice.count({
//     where: {
//       status: "OVERDUE",
//       issuedAt: { gte: from },
//     },
//   });

//   return result;
// }

// async function getCustomersCount() {
//   return await prisma.customer.count();
// }

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
