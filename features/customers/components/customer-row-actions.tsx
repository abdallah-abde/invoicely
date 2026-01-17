import { useState } from "react";
import { CustomerType } from "@/features/customers/customer.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import CustomerCU from "@/features/customers/components/customer-cu";

export function CustomerRowActions({ customer }: { customer: CustomerType }) {
  const [isOpen, setIsOpen] = useState(false);

  const { deleteCustomer } = useCustomers();
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  const isDeleting = deleteCustomer.isPending;

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={<CustomerCU mode="edit" customer={customer} />}
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        await deleteCustomer.mutateAsync(customer.id);
        setIsOpen(false);
      }}
      resource="customer"
    />
  );
}
