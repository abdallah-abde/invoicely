import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import { PaymentType } from "@/features/payments/payment.types";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/number.utils";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import {
  caseInsensitiveSort,
  dateAsStringSort,
} from "@/features/shared/utils/table.utils";
import { formatDates } from "@/lib/utils/date.utils";
import { PaymentRowActions } from "@/features/payments/components/payment-row-actions";

export const columns: ColumnDef<PaymentType>[] = [
  {
    accessorKey: "invoice.number",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="invoicenumber" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">
        {row.original.invoice?.number ?? "---"}
      </div>
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
        {row.original.invoice?.customer?.name ?? "---"}
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
          {formatDates({
            isArabic,
            value: row.original.date,
          })}
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

      return (
        <div className="font-medium text-primary text-xs xs:text-sm">
          {formatCurrency({
            isArabic,
            value: amount,
          })}
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
              "select-none",
              isArabic
                ? "text-[11px] xs:text-[13px]"
                : "text-xs xs:text-[13px]",
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
    cell: ({ row }) => <PaymentRowActions payment={row.original} />,
  },
];
