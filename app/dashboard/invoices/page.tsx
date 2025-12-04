import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import { InvoicesTable } from "./invoices-table";

export default async function page() {
  const data = await prisma.invoice.findMany({
    include: {
      customer: true,
      createdBy: true,
    },
  });

  const result = data.map((inv) => {
    const { total, ...invoiceWithoutTotal } = inv;

    return {
      ...invoiceWithoutTotal,
      totalAsNumber: total.toNumber(),
    };
  });

  return (
    <div>
      <PageHeader title="Invoices">
        <></>
      </PageHeader>
      <InvoicesTable data={result} />
    </div>
  );
}
