import PageHeader from "@/components/page-header";
import { PaymentsTable } from "@/app/dashboard/payments/payments-table";
import prisma from "@/lib/db/prisma";
import PaymentCU from "./payment-cu";
import { APIError } from "better-auth";
import { authSession } from "@/lib/auth/auth-utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function page() {
  const session = await authSession();

  if (!session?.user.role || session?.user.role === "user") {
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
    const { amount, createdAt, date, ...paymentWithout } = payment;
    // const createdDate = createdAt.toLocaleDateString("en-EN", {
    //   dateStyle: "medium",
    // });
    const invoiceDate = date.toLocaleDateString("en-EN", {
      dateStyle: "medium",
    });

    return {
      ...paymentWithout,
      date,
      // createdAt: createdDate,
      dateAsString: invoiceDate,
      amountAsNumber: amount.toNumber(),
    };
  });

  return (
    <div>
      <PageHeader title="Payments">
        <PaymentCU />
      </PageHeader>
      <PaymentsTable data={result} />
    </div>
  );
}
