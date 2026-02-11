export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { APIError } from "better-auth";
import { getUserRole } from "@/features/auth/lib/auth-utils";
import { USER_ROLE } from "@/features/users/lib/user.constants";
import { getPayments } from "@/features/payments/db/payment.query";
import PaymentsClient from "@/features/payments/components/payment-client";
import { mapPaymentsToDTO } from "@/features/payments/lib/payment.normalize";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function DashboardPaymentsPage() {
  const role = await getUserRole();

  if (role === USER_ROLE) {
    throw new APIError("FORBIDDEN");
  }

  const data = await getPayments();

  const result = mapPaymentsToDTO(data);

  return <PaymentsClient data={result} role={role} />;
}
