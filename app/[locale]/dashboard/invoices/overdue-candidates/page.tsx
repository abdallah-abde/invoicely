export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { APIError } from "better-auth";
import { getUserRole } from "@/features/auth/lib/auth-utils";
import { USER_ROLE } from "@/features/users/lib/user.constants";
import { getOverdueCandidatesInvoices } from "@/features/invoices/db/invoice.query";
import InvoicesClient from "@/features/invoices/components/invoices-client";
import { mapInvoicesToDTO } from "@/features/invoices/lib/invoice.normalize";
import { InvoiceCategory } from "@/features/invoices/invoice.types";

export const metadata: Metadata = {
  title: "Candidate overdue invoices",
};

export default async function DashboardOverdueInvoicesPage() {
  const role = await getUserRole();

  if (role === USER_ROLE) {
    throw new APIError("FORBIDDEN");
  }

  const data = await getOverdueCandidatesInvoices();

  const result = mapInvoicesToDTO(data);

  return (
    <InvoicesClient
      data={result}
      role={role}
      type={InvoiceCategory.CANDIDATES}
    />
  );
}
