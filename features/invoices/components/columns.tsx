import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import { InvoiceStatus, InvoiceType } from "@/features/invoices/invoice.types";
import { cn } from "@/lib/utils";
import { formatNumbers, formatCurrency } from "@/lib/utils/number.utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useArabic } from "@/hooks/use-arabic";
import { useTranslations } from "next-intl";
import {
  caseInsensitiveSort,
  dateAsStringSort,
} from "@/features/shared/utils/table.utils";
import { formatDates } from "@/lib/utils/date.utils";
import { InvoiceRowActions } from "@/features/invoices/components/invoice-row-actions";
import DropdownDownloadInvoice from "@/features/invoices/components/dropdown-download-invoice";
import DropdownrecordPayment from "@/features/invoices/components/dropdown-record-payment";

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
        <div className="text-xs xs:text-sm">{row.getValue("number")}</div>
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
      cell: ({ row }) => renderStatus(row),
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

        const total = row.original.totalAsNumber;

        return (
          <div className="font-medium text-primary text-xs xs:text-sm">
            {formatCurrency({
              isArabic,
              value: total,
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
        return <DataTableHeaderSort column={column} title="notes" />;
      },
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-xs xs:text-sm">{row.getValue("notes")}</div>
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
      cell: ({ row }) => (
        <InvoiceRowActions invoice={row.original}>
          <DropdownDownloadInvoice invoiceId={row.original.id} />
          {(row.original.status === InvoiceStatus.DRAFT ||
            row.original.status === InvoiceStatus.SENT ||
            row.original.status === InvoiceStatus.PARTIAL_PAID) && (
            <DropdownrecordPayment invoice={row.original} />
          )}
        </InvoiceRowActions>
      ),
    },
  ];
}

function renderStatus(row: Row<InvoiceType>) {
  const paidClr = `bg-[oklch(0.488_0.243_264.376)]`;

  const sentClr = `bg-[oklch(0.696_0.17_162.48)]`;

  const overdueClr = `bg-[oklch(0.769_0.188_70.08)]`;

  const draftClr = `bg-[oklch(0.627_0.265_303.9)]`;

  const canceledClr = `bg-[oklch(0.645_0.246_16.439)]`;

  const partialPaidClr = `bg-[oklch(0.772_0.205_149.54)]`;

  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={cn(
          `text-[8px] xs:text-[10px] border rounded-full p-1.5 px-3.5 w-fit tracking-widest select-none text-primary-foreground `,
          `${
            row.original.status === InvoiceStatus.PAID
              ? paidClr //"text-chart-1" // text-purple-400
              : row.original.status === InvoiceStatus.SENT
                ? sentClr // text-red-400
                : row.original.status === InvoiceStatus.DRAFT
                  ? draftClr // text-sky-400
                  : row.original.status === InvoiceStatus.OVERDUE
                    ? overdueClr // text-gray-400
                    : row.original.status === InvoiceStatus.CANCELED
                      ? canceledClr // text-red-400
                      : row.original.status === InvoiceStatus.PARTIAL_PAID
                        ? partialPaidClr // text-green-400
                        : ""
          }`,
          isArabic ? "text-[11px] xs:text-[13px]" : "",
        )}
      >
        {t(`Labels.${row.original.status.toLowerCase()}`)}
      </div>
    </div>
  );
}
