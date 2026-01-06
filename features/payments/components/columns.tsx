import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import { PaymentType } from "@/features/payments/payment.types";
import { ColumnDef } from "@tanstack/react-table";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  arToLocaleDate,
  caseInsensitiveSort,
  cn,
  dateAsStringSort,
  enToLocaleDate,
  syPound,
  usDollar,
} from "@/lib/utils";
import PaymentCU from "@/features/payments/components/payment-cu";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/features/auth/services/access";
import {
  DeletingLoader,
  selectColumn,
} from "@/features/shared/components/table/data-table-columns";
import { useRole } from "@/hooks/use-role";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export const columns: ColumnDef<PaymentType>[] = [
  // selectColumn<PaymentType>(),
  {
    accessorKey: "invoice.number",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="invoicenumber" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.original.invoice.number}</div>
    ),
  },
  {
    accessorKey: "invoice.customer.name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="customer" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">
        {row.original.invoice.customer.name}
      </div>
    ),
  },
  {
    accessorKey: "dateAsString",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="paymentdate" />;
    },
    enableHiding: false,
    sortingFn: dateAsStringSort,
    cell: ({ row }) => {
      const isArabic = useArabic();

      return (
        <div className="text-xs xs:text-sm">
          {isArabic
            ? arToLocaleDate.format(row.original.date)
            : enToLocaleDate.format(row.original.date)}
        </div>
      );
    },
  },
  {
    accessorKey: "amountAsNumber",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="amount" />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const isArabic = useArabic();

      const amount = parseFloat(row.getValue("amountAsNumber"));

      const formatted = isArabic
        ? syPound.format(amount)
        : usDollar.format(amount);

      return (
        <div className="font-medium text-primary text-xs xs:text-sm">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "method",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="method" />;
    },
    cell: ({ row }) => {
      const t = useTranslations();
      const isArabic = useArabic();

      return (
        <div>
          <Badge
            variant="secondary"
            className={cn(
              "select-none text-xs xs:text-[13px]",
              isArabic ? "text-[11px] xs:text-[13px]" : ""
            )}
          >
            {t(`Labels.${row.original.method.toLowerCase()}`)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="notes" justTitle />;
    },
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("notes")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      const { deletePayment, isLoading } = usePayments();
      const router = useRouter();
      const t = useTranslations();

      const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

      if (isRoleUser || isRoleModerator) return null;

      if (isLoading) return <DeletingLoader />;

      return (
        <DataTableActions
          editTrigger={<PaymentCU mode="edit" payment={payment} />}
          onDelete={async () => {
            const hasDeletePermission = await hasPermission({
              resource: "payment",
              permission: ["delete"],
            });

            if (hasDeletePermission)
              deletePayment.mutate(payment.id, {
                onSuccess: () => {
                  router.refresh();
                  toast.success(t("payments.messages.success.delete"));
                },
              });
            else toast.error(t("payments.messages.error.delete"));
          }}
          showDelete={isRoleSuperAdmin}
        />
      );
    },
  },
];
