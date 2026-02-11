import { PrismaClient } from "@/app/generated/prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/client";

export async function generateInvoiceNumber(
  prismaClient: Omit<
    PrismaClient<never, undefined, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
  >,
  year: number,
) {
  // Lock rows for this year implicitly via transaction isolation
  const last = await prismaClient.invoice.findFirst({
    where: { year },
    orderBy: { seq: "desc" },
    select: { seq: true },
  });

  const nextSeq = (last?.seq ?? 0) + 1;

  return {
    year,
    seq: nextSeq,
    number: `INV-${year}-${nextSeq}`,
  };
}
