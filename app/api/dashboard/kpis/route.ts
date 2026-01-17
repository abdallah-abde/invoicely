import prisma from "@/lib/db/prisma";
import { getFromDate } from "@/lib/utils/date.utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range")!;

  const from = getFromDate(range);

  const [totalRevenue, paid, overdue, customers] = await Promise.all([
    prisma.invoice.aggregate({
      where: { status: "PAID", issuedAt: { gte: from } },
      _sum: { total: true },
    }),
    prisma.invoice.count({
      where: { status: "PAID", issuedAt: { gte: from } },
    }),
    prisma.invoice.count({
      where: { status: "OVERDUE", issuedAt: { gte: from } },
    }),
    prisma.customer.count(),
  ]);

  return NextResponse.json({
    totalRevenue: totalRevenue._sum.total ?? 0,
    paidInvoices: paid,
    overdueInvoices: overdue,
    customersCount: customers,
  });
}
