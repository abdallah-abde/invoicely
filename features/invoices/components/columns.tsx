import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { cn } from "@/lib/utils";
import { formatNumbers, formatCurrency } from "@/lib/utils/number.utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useRouter } from "next/navigation";
import InvoiceCU from "./invoice-cu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { hasPermission } from "@/features/auth/services/access";
import { DeletingLoader } from "@/features/shared/components/table/data-table-columns";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/hooks/use-role";
import { useArabic } from "@/hooks/use-arabic";
import { useTranslations } from "next-intl";
import {
  caseInsensitiveSort,
  dateAsStringSort,
} from "@/features/shared/utils/table.utils";
import { formatDates } from "@/lib/utils/date.utils";
import { InvoiceRowActions } from "./invoice-row-actions";
import DropdownDownloadInvoice from "./dropdown-download-invoice";

export const columns: ColumnDef<InvoiceType>[] = [
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

      // console.log("original date: ", row.original.issuedAt);

      return (
        <div className="text-xs xs:text-sm">
          {formatDates({
            isArabic,
            value: row.original.issuedDateAsString,
          })}
        </div>
      );
    },
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
            value: row.original.dueDateAsString,
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
    accessorKey: "totalAsNumber",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="total" />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const isArabic = useArabic();

      const total = parseFloat(row.getValue("totalAsNumber"));

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
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="notes" />;
    },
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("notes")}</div>
    ),
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <InvoiceRowActions invoice={row.original}>
        <DropdownDownloadInvoice invoiceId={row.original.id} />
      </InvoiceRowActions>
    ),
  },
];

function renderStatus(row: Row<InvoiceType>) {
  const paidClr = `text-[oklch(0.488_0.243_264.376)]`;

  const sentClr = `text-[oklch(0.696_0.17_162.48)]`;

  const overdueClr = `text-[oklch(0.769_0.188_70.08)]`;

  const draftClr = `text-[oklch(0.627_0.265_303.9)]`;

  const canceledClr = `text-[oklch(0.645_0.246_16.439)]`;

  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <div
      className={cn(
        `text-[8px] xs:text-[10px] border rounded-md p-1.5 w-fit tracking-widest select-none`,
        `${
          row.original.status === "PAID"
            ? paidClr //"text-chart-1" // text-purple-400
            : row.original.status === "SENT"
              ? sentClr // text-red-400
              : row.original.status === "OVERDUE"
                ? overdueClr // text-gray-400
                : row.original.status === "DRAFT"
                  ? draftClr // text-sky-400
                  : row.original.status === "CANCELED"
                    ? canceledClr // text-red-400
                    : ""
        }`,
        isArabic ? "text-[11px] xs:text-[13px]" : ""
      )}
    >
      {t(`Labels.${row.original.status.toLowerCase()}`)}
    </div>
  );
}
