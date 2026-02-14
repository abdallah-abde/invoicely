"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import { DataTablePagination } from "@/features/shared/components/table/data-table-pagination";
import { getPaymentColumns } from "@/features/payments/components/columns";
import { PaymentType } from "@/features/payments/payment.types";
import DataTableSearchInput from "@/features/shared/components/table/data-table-search-input";
import DataTableColumnsVisibility from "@/features/shared/components/table/data-table-columns-visibility";
import DataTableHeader from "@/features/shared/components/table/data-table-header";
import DataTableBody from "@/features/shared/components/table/data-table-body";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments } from "@/features/payments/api/payment.api";
import { GC_TIME } from "@/features/dashboard/charts.constants";

export function PaymentsTable({ data }: { data: PaymentType[] }) {
  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    initialData: data,
    staleTime: GC_TIME,
  });

  const columns = React.useMemo(() => getPaymentColumns(), []);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "dateAsString", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ notes: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data: paymentsQuery.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-row items-start justify-between gap-2 py-4">
        <DataTableSearchInput
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <DataTableColumnsVisibility table={table} />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columnsLength={columns.length} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
