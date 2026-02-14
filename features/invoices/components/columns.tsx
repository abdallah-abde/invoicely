import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import { InvoiceStatus, InvoiceType } from "@/features/invoices/invoice.types";
import { formatNumbers, formatCurrency } from "@/lib/utils/number.utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useArabic } from "@/hooks/use-arabic";
import {
  caseInsensitiveSort,
  dateAsStringSort,
} from "@/features/shared/utils/table.utils";
import { formatDates } from "@/lib/utils/date.utils";
import { InvoiceRowActions } from "@/features/invoices/components/invoice-row-actions";
import DropdownDownloadInvoice from "@/features/invoices/components/dropdown-download-invoice";
import DropdownrecordPayment from "@/features/invoices/components/dropdown-record-payment";
import { StatusBadge } from "@/features/shared/components/table/status-badge";

export function getInvoiceColumns(options?: {
  withActions?: boolean;
}): ColumnDef<InvoiceType>[] {
  const { withActions = true } = options ?? {};

  const baseColumns: ColumnDef<InvoiceType>[] = [
    {
      accessorKey: "number",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="invoicenumber" />;
      },
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-xs xs:text-sm">{row.original.number ?? "---"}</div>
      ),
    },
    {
      accessorKey: "customer.name",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="customer" />;
      },
      sortingFn: caseInsensitiveSort,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-xs xs:text-sm">
          {row.original.customer?.name ?? "---"}
        </div>
      ),
    },
    {
      accessorKey: "issuedDateAsString",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="issuedat" />;
      },
      enableHiding: false,
      sortingFn: dateAsStringSort,
      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div className="text-xs xs:text-sm">
            {formatDates({
              isArabic,
              value: row.original.issuedAt,
            })}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="status" />;
      },
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },

    {
      accessorKey: "dueDateAsString",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="dueat" />;
      },
      sortingFn: dateAsStringSort,
      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div className="text-xs xs:text-sm">
            {formatDates({
              isArabic,
              value: row.original.dueAt,
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAsNumber",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="total" />;
      },
      enableHiding: false,
      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div className="font-medium text-primary text-xs xs:text-sm">
            {formatCurrency({
              isArabic,
              value: row.original.totalAsNumber,
            })}
          </div>
        );
      },
    },

    {
      accessorKey: "createdBy.name",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="createdby" />;
      },
      sortingFn: caseInsensitiveSort,
      cell: ({ row }) => (
        <div className="text-xs xs:text-sm">
          {row.original.createdBy?.name ?? "---"}
        </div>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="paidamount" />;
      },
      enableHiding: false,

      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div className="font-medium text-primary text-xs xs:text-sm">
            {formatCurrency({
              isArabic,
              value: row.original.paidAmount,
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "rest",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="rest" />;
      },
      enableHiding: false,

      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div className="font-medium text-destructive text-xs xs:text-sm">
            {formatCurrency({
              isArabic,
              value: row.original.rest ?? 0,
            })}
          </div>
        );
      },
    },

    {
      accessorKey: "_count.Payments",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="paymentscount" />;
      },
      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div>
            <Badge
              variant="secondary"
              className="select-none text-xs xs:text-[13px] size-6 xs:size-7"
            >
              {formatNumbers({
                isArabic,
                value: row.original._count?.Payments ?? 0,
              })}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "_count.products",
      header: ({ column }) => {
        return <DataTableHeaderSort column={column} title="productscount" />;
      },
      cell: ({ row }) => {
        const isArabic = useArabic();

        return (
          <div>
            <Badge
              variant="secondary"
              className="select-none text-xs xs:text-[13px] size-6 xs:size-7"
            >
              {formatNumbers({
                isArabic,
                value: row.original._count?.products ?? 0,
              })}
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
        <div className="text-xs xs:text-sm">{row.original.notes}</div>
      ),
    },
  ];

  if (!withActions) {
    return baseColumns;
  }

  return [
    ...baseColumns,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <InvoiceRowActions invoice={row.original}>
            {status !== InvoiceStatus.DRAFT &&
              status !== InvoiceStatus.CANCELED && (
                <DropdownDownloadInvoice invoiceId={row.original.id} />
              )}
            {(status === InvoiceStatus.DRAFT ||
              status === InvoiceStatus.SENT ||
              status === InvoiceStatus.PARTIAL_PAID) && (
              <DropdownrecordPayment invoice={row.original} />
            )}
          </InvoiceRowActions>
        );
      },
    },
  ];
}
