"use client";

import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumbers } from "@/lib/utils/number.utils";
import { CustomerType } from "../customer.types";
import { Badge } from "@/components/ui/badge";
import { useArabic } from "@/hooks/use-arabic";
import { caseInsensitiveSort } from "@/features/shared/utils/table.utils";
import { CustomerRowActions } from "@/features/customers/components/customer-row-actions";

export const columns: ColumnDef<CustomerType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="name" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="email" />;
    },
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="phone" justTitle />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-xs xs:text-sm">
          {row.original.phone.replace(
            /(\d{5})(\d{2})(\d{3})(\d{4})/,
            "$1-$2-$3-$4"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="address" justTitle />;
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="company" />;
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("companyName")}</div>
    ),
  },
  {
    accessorKey: "taxNumber",
    header: ({ column }) => {
      return (
        <DataTableHeaderSort column={column} title="taxnumber" justTitle />
      );
    },
    enableSorting: false,
    cell: ({ row }) => {
      return <div className="text-xs xs:text-sm">{row.original.taxNumber}</div>;
    },
  },
  {
    accessorKey: "_count.invoices",
    header: ({ column }) => {
      return (
        <DataTableHeaderSort column={column} title="invoicescount" justTitle />
      );
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
              value: row.original._count.invoices,
            })}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CustomerRowActions customer={row.original} />,
  },
];
