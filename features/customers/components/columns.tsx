"use client";

import DataTableHeaderSort from "@/features/shared/table/data-table-header-sort";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreVertical } from "lucide-react";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useRouter } from "next/navigation";
import CustomerCU from "./customer-cu";
import { toast } from "sonner";
import { caseInsensitiveSort } from "@/lib/utils";
import { CustomerType } from "../customer.types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<CustomerType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Name" />;
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
      return <DataTableHeaderSort column={column} title="Email" />;
    },
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">
        {row.original.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Company" />;
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("companyName")}</div>
    ),
  },
  {
    accessorKey: "taxNumber",
    header: "Tax Number",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("taxNumber")}</div>
    ),
  },
  {
    accessorKey: "_count.invoices",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Invoices Count" />;
    },
    cell: ({ row }) => (
      <div>
        <Badge
          variant="secondary"
          className="select-none text-xs xs:text-sm size-5 xs:size-6"
        >
          {row.original._count.invoices}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original;
      const { deleteCustomer, isLoading } = useCustomers();
      const router = useRouter();

      if (isLoading) {
        return (
          <p className="flex gap-1 items-center">
            <Loader className="animate-spin text-destructive size-4 xs:size-5" />{" "}
            <span className="text-destructive text-xs xs:text-sm">
              Deleting...
            </span>{" "}
          </p>
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 xs:h-8 w-6 xs:w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs xs:text-sm">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <CustomerCU
                mode="edit"
                customer={customer}
                trigger={
                  <div className="w-full text-left cursor-pointer hover:bg-secondary/20 px-2 py-1 rounded-md bg-secondary/50 text-primary text-xs xs:text-sm">
                    Edit
                  </div>
                }
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive text-xs xs:text-sm"
              onClick={() => {
                deleteCustomer.mutate(customer.id, {
                  onSuccess: () => {
                    router.refresh();
                    toast.success("Customer deleted successfully!");
                  },
                });
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="text-xs xs:text-sm">View customer details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
