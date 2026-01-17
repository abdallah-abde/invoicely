import { cached } from "@/features/dashboard/cached";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(
    await cached("monthly-revenue", 30 * 60_000, async () => {
      const result = await prisma.$queryRaw<
        { month: string; revenue: bigint }[]
      >`
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
    })
  );
}
