import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import { CustomersTable } from "./customers-table";
import CustomerCU from "./customer-cu";

export default async function page() {
  const data = await prisma.customer.findMany();

  return (
    <div>
      <PageHeader title="Customers">
        <CustomerCU />
      </PageHeader>
      <CustomersTable data={data} />
    </div>
  );
}
