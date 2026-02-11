import { cached } from "@/features/dashboard/cached";
import { GC_TIME } from "@/features/dashboard/charts.constants";
import prisma from "@/lib/db/prisma";
import { getFromDate } from "@/lib/utils/date.utils";
import { Item } from "@radix-ui/react-select";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range")!;
  const from = getFromDate(range);

  return NextResponse.json(
    await cached(`top-products-${range}`, GC_TIME, async () => {
      const data = await prisma.invoiceProduct.groupBy({
        by: ["productId"],
        where: { invoice: { status: "PAID", issuedAt: { gte: from } } },
        _sum: { quantity: true, totalPrice: true },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      });

      const productMap = new Map(
        (
          await prisma.product.findMany({
            where: { id: { in: data.map((d) => d.productId) } },
            select: { id: true, name: true, unit: true },
          })
        ).map((p) => [p.id, { name: p.name, unit: p.unit }]),
      );

      return data.map((d) => ({
        productId: d.productId,
        name: productMap.get(d.productId)?.name ?? "Unknown",
        quantity: Number(d._sum.quantity),
        total: Number(d._sum.totalPrice),
        unit: productMap.get(d.productId)?.unit ?? "Unknown",
      }));
    }),
  );
}
