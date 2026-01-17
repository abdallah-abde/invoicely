export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { APIError } from "better-auth";
import { getUserRole } from "@/features/auth/lib/auth-utils";
import { USER_ROLE } from "@/features/users/lib/user.constants";
import { getCustomers } from "@/features/customers/db/customer.query";
import CustomersClient from "@/features/customers/components/customers-client";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function DashboardCustomersPage() {
  const role = await getUserRole();

  if (role === USER_ROLE) {
    throw new APIError("FORBIDDEN");
  }

  const data = await getCustomers();

  return <CustomersClient data={data} role={role} />;
}
