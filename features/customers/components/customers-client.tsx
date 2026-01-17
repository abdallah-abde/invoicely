"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/layout/page-header";
import { fetchCustomers } from "@/features/customers/api/customer.api";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomerType } from "@/features/customers/customer.types";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
} from "@/features/users/lib/user.constants";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import CustomerCU from "@/features/customers/components/customer-cu";
import TableSkeleton from "@/features/shared/components/table/table-skeleton";

export default function CustomersClient({
  data,
  role,
}: {
  data: CustomerType[];
  role: string | undefined | null;
}) {
  const t = useTranslations();

  const isMutating =
    useIsMutating({
      mutationKey: ["customers"],
    }) > 0;

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    initialData: data,
    staleTime: 1000 * 60 * 5,
  });

  return isMutating ? (
    <TableSkeleton />
  ) : (
    <div>
      <PageHeader title={t("customers.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? (
          <CustomerCU />
        ) : null}
      </PageHeader>
      <CustomersTable data={customersQuery.data ?? []} />
    </div>
  );
}
