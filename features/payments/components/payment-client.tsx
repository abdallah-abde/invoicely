"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/layout/page-header";
import { fetchPayments } from "@/features/payments/api/payment.api";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import { PaymentType } from "@/features/payments/payment.types";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
} from "@/features/users/lib/user.constants";
import { useQuery } from "@tanstack/react-query";
import PaymentCU from "@/features/payments/components/payment-cu";
import TableSkeleton from "@/features/shared/components/table/table-skeleton";
import { GC_TIME } from "@/features/dashboard/charts.constants";

export default function PaymentsClient({
  data,
  role,
}: {
  data: PaymentType[];
  role: string | undefined | null;
}) {
  const t = useTranslations();

  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    initialData: data,
    staleTime: GC_TIME,
  });

  if (paymentsQuery.isLoading) return <TableSkeleton />;

  return (
    <>
      <PageHeader title={t("payments.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? <PaymentCU /> : null}
      </PageHeader>
      <PaymentsTable data={paymentsQuery.data ?? []} />
    </>
  );
}
