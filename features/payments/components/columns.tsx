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
import { PaymentType } from "@/features/payments/payment.types";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreVertical } from "lucide-react";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { caseInsensitiveSort } from "@/lib/utils";
import PaymentCU from "@/features/payments/components/payment-cu";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<PaymentType>[] = [
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
    accessorKey: "invoice.number",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Invoice Number" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.invoice.number}</div>,
  },
  {
    accessorKey: "invoice.customer.name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Customer" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.invoice.customer.name}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Payment Date" />;
    },
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.dateAsString}</div>,
  },
  {
    accessorKey: "amountAsNumber",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Amount" />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountAsNumber"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium text-primary">{formatted}</div>;
    },
  },
  {
    accessorKey: "method",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Method" />;
    },
    cell: ({ row }) => (
      <div>
        <Badge variant="secondary" className="select-none">
          {row.getValue("method")}
        </Badge>
      </div>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return <DataTableHeaderSort column={column} title="Created At" />;
  //   },
  //   cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  // },
  {
    accessorKey: "notes",
    header: "Notes",
    enableSorting: false,
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      const { deletePayment, isLoading } = usePayments();
      const router = useRouter();

      if (isLoading) {
        return (
          <p className="flex gap-1 items-center">
            <Loader className="animate-spin text-destructive" />{" "}
            <span className="text-destructive text-xs">Deleting...</span>{" "}
          </p>
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <PaymentCU
                mode="edit"
                payment={payment}
                trigger={
                  <div className="w-full text-left cursor-pointer hover:bg-secondary/20 px-2 py-1 rounded-md bg-secondary/50 text-primary">
                    Edit
                  </div>
                }
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={() => {
                deletePayment.mutate(payment.id, {
                  onSuccess: () => {
                    // optional UI refresh
                    router.refresh();
                    toast.success("Payment deleted successfully!");
                  },
                });
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
