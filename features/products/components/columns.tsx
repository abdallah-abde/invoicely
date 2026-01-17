"use client";

import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumbers, formatCurrency } from "@/lib/utils/number.utils";
import { ProductType } from "@/features/products/product.types";
import { Badge } from "@/components/ui/badge";
import { useArabic } from "@/hooks/use-arabic";
import { caseInsensitiveSort } from "@/features/shared/utils/table.utils";
import { ProductRowActions } from "@/features/products/components/product-row-actions";

export const columns: ColumnDef<ProductType>[] = [
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
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <DataTableHeaderSort column={column} title="description" justTitle />
      );
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="unit" justTitle />;
    },
    sortingFn: caseInsensitiveSort,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("unit")}</div>
    ),
  },
  {
    accessorKey: "priceAsNumber",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="price" justTitle />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const isArabic = useArabic();

      const price = parseFloat(row.getValue("priceAsNumber"));

      return (
        <div className="font-medium text-primary text-xs xs:text-sm">
          {formatCurrency({
            isArabic,
            value: price,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.invoices",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="invoicescount" />;
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
    cell: ({ row }) => <ProductRowActions product={row.original} />,
  },
];
