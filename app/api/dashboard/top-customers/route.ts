import { cached } from "@/features/dashboard/cached";
import { DASHBOARD_GC_TIME } from "@/features/dashboard/charts.constants";
import prisma from "@/lib/db/prisma";
import { getFromDate } from "@/lib/utils/date.utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range")!;
  const from = getFromDate(range);

  return NextResponse.json(
    await cached(`top-customers-${range}`, DASHBOARD_GC_TIME, async () => {
      const data = await prisma.invoice.groupBy({
        by: ["customerId"],
        where: {
          status: "PAID",
          issuedAt: {
            gte: from,
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

      const customerMap = new Map(
        (
          await prisma.customer.findMany({
            where: {
              id: {
                in: data.map((d) => d.customerId),
              },
            },
            select: {
              id: true,
              name: true,
            },
          })
        ).map((c) => [c.id, c.name])
      );

      return data.map((item) => ({
        customerId: item.customerId,
        name: customerMap.get(item.customerId) ?? "Unknown",
        total: item._sum.total?.toNumber() ?? 0,
      }));
    })
  );
}
