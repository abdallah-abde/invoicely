import React, { useState } from "react";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import InvoiceCU from "@/features/invoices/components/invoice-cu";

export function InvoiceRowActions({
  invoice,
  children,
}: {
  invoice: InvoiceType;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { deleteInvoice } = useInvoices();
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  const isDeleting = deleteInvoice.isPending;

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={<InvoiceCU mode="edit" invoice={invoice} />}
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        await deleteInvoice.mutateAsync(invoice.id);
        setIsOpen(false);
      }}
      resource="invoice"
    >
      {children}
    </DataTableActions>
  );
}
