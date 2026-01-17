export const dynamic = "force-dynamic";

import PageHeader from "@/components/layout/page-header";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import prisma from "@/lib/db/prisma";
import PaymentCU from "@/features/payments/components/payment-cu";
import { APIError } from "better-auth";
import { getUserRole } from "@/features/auth/lib/auth-utils";

import type { Metadata } from "next";
import {
  ADMIN_ROLE,
  SUPERADMIN_ROLE,
  USER_ROLE,
} from "@/features/users/lib/user.constants";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function DashboardPaymentsPage() {
  const role = await getUserRole();
  const t = await getTranslations();

  if (role === USER_ROLE) {
    throw new APIError("FORBIDDEN");
  }

  const data = await prisma.payment.findMany({
    include: {
      invoice: {
        select: {
          number: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const result = data.map((payment) => {
    const { amount, ...restOfPayment } = payment;

    const invoiceDate = payment.date.toLocaleDateString();

    return {
      ...restOfPayment,
      dateAsString: invoiceDate,
      amountAsNumber: amount.toNumber(),
    };
  });

  return (
    <div>
      <PageHeader title={t("payments.label")}>
        {role === ADMIN_ROLE || role === SUPERADMIN_ROLE ? <PaymentCU /> : null}
      </PageHeader>
      <PaymentsTable data={result} />
    </div>
  );
}
