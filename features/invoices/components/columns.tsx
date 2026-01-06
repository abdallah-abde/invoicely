import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import { InvoiceType } from "@/features/invoices/invoice.types";
import {
  arDigitsNoGrouping,
  caseInsensitiveSort,
  cn,
  dateAsStringSort,
  syPound,
  arToLocaleDate,
  enToLocaleDate,
  usDollar,
} from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useRouter } from "next/navigation";
import InvoiceCU from "./invoice-cu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { hasPermission } from "@/features/auth/services/access";
import {
  DeletingLoader,
  selectColumn,
} from "@/features/shared/components/table/data-table-columns";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/hooks/use-role";
import { useArabic } from "@/hooks/use-arabic";
import { useTranslations } from "next-intl";

export const columns: ColumnDef<InvoiceType>[] = [
  // selectColumn<InvoiceType>(),
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
      <div className="text-xs xs:text-sm">{row.original.customer.name}</div>
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
          {isArabic
            ? arToLocaleDate.format(row.original.issuedAt)
            : enToLocaleDate.format(row.original.issuedAt)}
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
          {isArabic
            ? arToLocaleDate.format(row.original.dueAt)
            : enToLocaleDate.format(row.original.dueAt)}
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

      const formatted = isArabic
        ? syPound.format(total)
        : usDollar.format(total);

      return (
        <div className="font-medium text-primary text-xs xs:text-sm">
          {formatted}
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
      <div className="text-xs xs:text-sm">{row.original.createdBy.name}</div>
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
            {isArabic
              ? arDigitsNoGrouping.format(row.original._count.products)
              : row.original._count.products}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original;
      const { deleteInvoice, isLoading } = useInvoices();
      const router = useRouter();

      const t = useTranslations();

      const { isRoleUser, isRoleAdmin, isRoleSuperAdmin } = useRole();

      if (isRoleUser) return null;

      if (isLoading) return <DeletingLoader />;

      return (
        <DataTableActions
          editTrigger={
            (isRoleAdmin || isRoleSuperAdmin) && (
              <InvoiceCU mode="edit" invoice={invoice} />
            )
          }
          onDelete={async () => {
            const hasDeletePermission = await hasPermission({
              resource: "invoice",
              permission: ["delete"],
            });

            if (hasDeletePermission)
              deleteInvoice.mutate(invoice.id, {
                onSuccess: () => {
                  router.refresh();
                  toast.success(t("invoices.messages.success.delete"));
                },
              });
            else toast.error(t("invoices.messages.error.delete"));
          }}
          showDelete={isRoleSuperAdmin}
        >
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/api/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs xs:text-sm text-primary"
            >
              {t("invoices.download-invoice")}
            </Link>
          </DropdownMenuItem>
        </DataTableActions>
      );
    },
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
