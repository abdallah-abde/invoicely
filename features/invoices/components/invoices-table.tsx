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
import { DataTablePagination } from "@/features/shared/table/data-table-pagination";
import { columns } from "./columns";
import DataTableSearchInput from "@/features/shared/table/data-table-search-input";
import DataTableColumnsVisibility from "@/features/shared/table/data-table-columns-visibility";
import DataTableHeader from "@/features/shared/table/data-table-header";
import DataTableBody from "@/features/shared/table/data-table-body";
import { InvoiceType } from "@/features/invoices/invoice.types";

export function InvoicesTable({ data }: { data: InvoiceType[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "number", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ notes: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data,
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
      <div className="flex items-center py-4">
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
