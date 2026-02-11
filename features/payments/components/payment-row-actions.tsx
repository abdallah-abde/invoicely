import { useState } from "react";
import { PaymentType } from "@/features/payments/payment.types";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import PaymentCU from "@/features/payments/components/payment-cu";

export function PaymentRowActions({ payment }: { payment: PaymentType }) {
  const [isOpen, setIsOpen] = useState(false);

  const { deletePayment, isDeleting } = usePayments();
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={<PaymentCU mode="update" payment={payment} />}
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        await deletePayment.mutateAsync(payment.id);
        setIsOpen(false);
      }}
      resource="payment"
    />
  );
}
