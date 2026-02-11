import { cached } from "@/features/dashboard/cached";
import { GC_TIME } from "@/features/dashboard/charts.constants";
import prisma from "@/lib/db/prisma";
import { getFromDate } from "@/lib/utils/date.utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range")!;
  const from = getFromDate(range);

  return NextResponse.json(
    await cached(`new-customers-${range}`, GC_TIME, async () => {
      const result = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT
      DATE("createdAt") as date,
      COUNT(*) as count
    FROM "Customer"
    WHERE "createdAt" >= ${from}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
  `;
      return result.map((row) => ({
        date: row.date.toISOString().split("T")[0],
        count: Number(row.count),
      }));
    }),
  );
}
