export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import prisma from "@/lib/db/prisma";
import { CustomersTable } from "@/features/customers/components/customers-table";
import CustomerCU from "@/features/customers/components/customer-cu";
import { getUserRole } from "@/features/auth/lib/auth-utils";
import { APIError } from "better-auth";

import type { Metadata } from "next";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
  USER_ROLE,
} from "@/features/users/lib/constants";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function DashboardCustomersPage() {
  const role = await getUserRole();
  const t = await getTranslations();

  if (role === USER_ROLE) {
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
      <PageHeader title={t("customers.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? (
          <CustomerCU />
        ) : null}
      </PageHeader>
      <CustomersTable data={data} />
    </div>
  );
}
