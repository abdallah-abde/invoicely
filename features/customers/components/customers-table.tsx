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
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { columns } from "./columns";
import DataTableSearchInput from "@/components/data-table/data-table-search-input";
import DataTableColumnsVisibility from "@/components/data-table/data-table-columns-visibility";
import DataTableHeader from "@/components/data-table/data-table-header";
import DataTableBody from "@/components/data-table/data-table-body";
import { CustomerType } from "@/features/customers/customer.types";

export function CustomersTable({ data }: { data: CustomerType[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
