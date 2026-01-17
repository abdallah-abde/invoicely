import prisma from "@/lib/db/prisma";
import { getFromDate } from "@/lib/utils/date.utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range")!;
  const from = getFromDate(range);

  const result = await prisma.$queryRaw<{ date: string; revenue: bigint }[]>`
    SELECT
      DATE("issuedAt") AS date,
      SUM("total")     AS revenue
    FROM "Invoice"
    WHERE
      "status" = 'PAID'
      AND "issuedAt" >= ${from}
    GROUP BY DATE("issuedAt")
    ORDER BY DATE("issuedAt") ASC
  `;

  return NextResponse.json(
    result.map((row) => ({
      date: row.date, // YYYY-MM-DD
      revenue: Number(row.revenue), // normalize bigint
    }))
  );
}
