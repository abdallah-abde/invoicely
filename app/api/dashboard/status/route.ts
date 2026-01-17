import prisma from "@/lib/db/prisma";
import { getFromDate } from "@/lib/utils/date.utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range")!;
  const from = getFromDate(range);

  const data = await prisma.invoice.groupBy({
    by: ["status"],
    where: { issuedAt: { gte: from } },
    // _sum: { total: true },
    _count: { status: true },
  });

  return NextResponse.json(data);
}
