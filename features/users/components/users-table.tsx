"use client";

import * as React from "react";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import { DataTablePagination } from "@/features/shared/components/table/data-table-pagination";
import { getUserColumns } from "@/features/users/components/columns";
import DataTableSearchInput from "@/features/shared/components/table/data-table-search-input";
import DataTableColumnsVisibility from "@/features/shared/components/table/data-table-columns-visibility";
import DataTableHeader from "@/features/shared/components/table/data-table-header";
import DataTableBody from "@/features/shared/components/table/data-table-body";
import { UserProps } from "@/features/users/hooks/use-users";
import { useDirection } from "@/hooks/use-direction";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/features/users/api/user.api";
import { GC_TIME } from "@/features/dashboard/charts.constants";

export function UsersTable({ data }: { data: UserProps[] }) {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    initialData: data,
    staleTime: GC_TIME,
  });

  const columns = React.useMemo(() => getUserColumns(), []);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data: usersQuery.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
      <div className="w-full rounded-md border">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columnsLength={columns.length} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
