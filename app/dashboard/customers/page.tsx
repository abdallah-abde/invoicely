export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import prisma from "@/lib/db/prisma";
import { CustomersTable } from "@/features/customers/components/customers-table";
import CustomerCU from "@/features/customers/components/customer-cu";
import { authSession } from "@/features/auth/lib/auth-utils";
import { APIError } from "better-auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function DashboardCustomersPage() {
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
