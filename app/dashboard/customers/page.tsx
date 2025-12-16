import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import { CustomersTable } from "./customers-table";
import CustomerCU from "./customer-cu";
import { authSession } from "@/lib/auth-utils";
import { APIError } from "better-auth";

export default async function page() {
  const session = await authSession();

  if (!session?.user.role || session?.user.role === "user") {
    throw new APIError("FORBIDDEN");
  }

  const data = await prisma.customer.findMany({
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });

  return (
    <div>
      <PageHeader title="Customers">
        <CustomerCU />
      </PageHeader>
      <CustomersTable data={data} />
    </div>
  );
}
