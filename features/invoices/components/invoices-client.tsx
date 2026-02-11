"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/layout/page-header";
import {
  fetchCanceledInvoices,
  fetchOverdueCandidatesInvoices,
  fetchWorkingInvoices,
} from "@/features/invoices/api/invoice.api";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";
import {
  InvoiceCategory,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
} from "@/features/users/lib/user.constants";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import InvoiceCU from "@/features/invoices/components/invoice-cu";
import TableSkeleton from "@/features/shared/components/table/table-skeleton";
import { GC_TIME } from "@/features/dashboard/charts.constants";

export default function InvoicesClient({
  data,
  role,
  type = InvoiceCategory.WORKING,
}: {
  data: InvoiceType[];
  role: string | undefined | null;
  type?: InvoiceCategory;
}) {
  const t = useTranslations();
  const isMutating =
    useIsMutating({
      mutationKey: ["invoices", type],
    }) > 0;

  const invoicesQuery = useQuery({
    queryKey: ["invoices", type],
    queryFn: () => {
      switch (type) {
        case InvoiceCategory.CANCELED:
          return fetchCanceledInvoices();
        case InvoiceCategory.CANDIDATES:
          return fetchOverdueCandidatesInvoices();
        case InvoiceCategory.WORKING:
        default:
          return fetchWorkingInvoices();
      }
    },
    initialData: data,
    staleTime: GC_TIME,
  });

  if (invoicesQuery.isLoading) return <TableSkeleton />;

  return (
    <>
      <PageHeader title={t(`${type}.label`)}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? (
          type === InvoiceCategory.WORKING ? (
            <InvoiceCU type={type} />
          ) : (
            <></>
          )
        ) : null}
      </PageHeader>
      <InvoicesTable data={invoicesQuery.data ?? []} type={type} />
    </>
  );
}
