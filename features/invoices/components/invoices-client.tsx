"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/layout/page-header";
import { fetchInvoices } from "@/features/invoices/api/invoice.api";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import { InvoiceType } from "@/features/invoices/invoice.types";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
} from "@/features/users/lib/user.constants";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import InvoiceCU from "@/features/invoices/components/invoice-cu";
import TableSkeleton from "@/features/shared/components/table/table-skeleton";

export default function InvoicesClient({
  data,
  role,
}: {
  data: InvoiceType[];
  role: string | undefined | null;
}) {
  const t = useTranslations();
  const isMutating =
    useIsMutating({
      mutationKey: ["invoices"],
    }) > 0;

  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    initialData: data,
    staleTime: 1000 * 60 * 5,
  });

  return isMutating ? (
    <TableSkeleton />
  ) : (
    <div>
      <PageHeader title={t("invoices.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? <InvoiceCU /> : null}
      </PageHeader>
      <InvoicesTable data={invoicesQuery.data ?? []} />
    </div>
  );
}
