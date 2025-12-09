import PageHeader from "@/components/page-header";
import { InvoicesTable } from "./invoices-table";
import prisma from "@/lib/prisma";
import InvoiceCU from "./invoice-cu";

export default async function page() {
  const data = await prisma.invoice.findMany({
    include: {
      customer: true,
      createdBy: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const result = data.map((inv) => {
    const createdDate = inv.createdAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const issuedDate = inv.issuedAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const dueDate = inv.dueAt.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });
    const { total, ...invoiceWithoutTotal } = inv;

    return {
      ...invoiceWithoutTotal,
      createdAt: createdDate,
      issuedDateAsString: issuedDate,
      dueDateAsString: dueDate,
      totalAsNumber: total.toNumber(),
    };
  });

  return (
    <div>
      <PageHeader title="Invoices">
        <InvoiceCU />
      </PageHeader>
      <InvoicesTable data={result} />
    </div>
  );
}
