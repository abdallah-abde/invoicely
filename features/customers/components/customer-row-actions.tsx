import { useState } from "react";
import { CustomerType } from "@/features/customers/customer.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import CustomerCU from "@/features/customers/components/customer-cu";
import { OperationMode } from "@/features/shared/shared.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function CustomerRowActions({ customer }: { customer: CustomerType }) {
  const [isOpen, setIsOpen] = useState(false);

  const { deleteCustomer, isDeleting } = useCustomers();
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  const t = useTranslations();

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={
        <CustomerCU mode={OperationMode.UPDATE} customer={customer} />
      }
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        setIsOpen(false);
        await deleteCustomer.mutateAsync(customer.id);
        toast.success(t("customers.messages.success.delete"));
      }}
      resource="customer"
    />
  );
}
