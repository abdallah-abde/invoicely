import { useState } from "react";
import { PaymentType } from "@/features/payments/payment.types";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useRole } from "@/hooks/use-role";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import PaymentCU from "@/features/payments/components/payment-cu";
import { OperationMode } from "@/features/shared/shared.types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parseApiError } from "@/lib/api/parse-api-error";
import { InvoiceStatus } from "@/features/invoices/invoice.types";

export function PaymentRowActions({ payment }: { payment: PaymentType }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const { deletePayment, isDeleting } = usePayments();
  const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

  if (isRoleUser || isRoleModerator) return null;

  return (
    <DataTableActions
      editTrigger={
        payment.invoice.status !== InvoiceStatus.PAID && (
          <PaymentCU mode={OperationMode.UPDATE} payment={payment} />
        )
      }
      isDeleting={isDeleting}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showDelete={isRoleSuperAdmin}
      onDelete={async () => {
        setIsOpen(false);
        try {
          await deletePayment.mutateAsync(payment.id);
          router.refresh();
          toast.success(t("payments.messages.success.delete"));
        } catch (err: unknown) {
          const parsed = parseApiError(err, t);
          toast.error(parsed.message);
        }
      }}
      resource="payment"
    />
  );
}
