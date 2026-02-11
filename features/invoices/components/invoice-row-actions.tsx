import React, { useState } from "react";
import {
  InvoiceCategory,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import InvoiceCU from "@/features/invoices/components/invoice-cu";
import { OperationMode } from "@/features/shared/shared.types";
import { parseApiError } from "@/lib/api/parse-api-error";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function InvoiceRowActions({
  invoice,
  children,
}: {
  invoice: InvoiceType;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const { deleteInvoice, isDeleting } = useInvoices(InvoiceCategory.WORKING);
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={
        <InvoiceCU
          mode={OperationMode.UPDATE}
          invoice={invoice}
          type={InvoiceCategory.WORKING}
        />
      }
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        try {
          setIsOpen(false);
          await deleteInvoice.mutateAsync(invoice.id);
          router.refresh();
          toast.success(t("invoices.messages.success.delete"));
        } catch (err: unknown) {
          const parsed = parseApiError(err, t);
          toast.error(parsed.message);
        }
      }}
      resource="invoice"
    >
      {children}
    </DataTableActions>
  );
}
