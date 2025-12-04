import DataTableHeaderSort from "@/components/data-table/data-table-header-sort";
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
import { InvoiceType } from "@/lib/custom-types";
import { caseInsensitiveSort, cn, dateAsStringSort } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreVertical } from "lucide-react";
import { useInvoices } from "@/hooks/use-invoices";
import { useRouter } from "next/navigation";
import InvoiceCU from "./invoice-cu";
import { toast } from "sonner";

export const columns: ColumnDef<InvoiceType>[] = [
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
    accessorKey: "number",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Number" />;
    },
    enableHiding: false,
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Customer" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.customer.name}</div>,
  },
  {
    accessorKey: "issuedDateAsString",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Issued At" />;
    },
    enableHiding: false,
    sortingFn: dateAsStringSort,
    cell: ({ row }) => <div>{row.getValue("issuedDateAsString")}</div>,
  },
  {
    accessorKey: "dueDateAsString",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Due At" />;
    },
    sortingFn: dateAsStringSort,
    cell: ({ row }) => <div>{row.getValue("dueDateAsString")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Status" />;
    },
    cell: ({ row }) => (
      <div
        className={cn(
          ` text-[10px] border rounded-md p-1.5 w-fit tracking-widest`,
          `${
            row.original.status === "PAID"
              ? "text-purple-400"
              : row.original.status === "CANCELED"
              ? "text-red-400"
              : row.original.status === "DRAFT"
              ? "text-gray-400"
              : row.original.status === "SENT"
              ? "text-sky-400"
              : row.original.status === "OVERDUE"
              ? "text-red-400"
              : ""
          }`
        )}
      >
        {row.original.status}
      </div>
    ),
  },
  {
    accessorKey: "totalAsNumber",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Total" />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("totalAsNumber"));

      // Format the total as a dollar price
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total);

      return <div className="font-medium  text-primary">{formatted}</div>;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    enableSorting: false,
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
  },
  {
    accessorKey: "createdBy.name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Created By" />;
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => <div>{row.original.createdBy.name}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original;
      const { deleteInvoice, isLoading } = useInvoices();
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
              <InvoiceCU
                mode="edit"
                invoice={invoice}
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
                deleteInvoice.mutate(invoice.id, {
                  onSuccess: () => {
                    // optional UI refresh
                    router.refresh();
                    toast.success("Invoice deleted successfully!");
                  },
                });
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View invoice details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// function renderStatus(status: InvoiceStatus) {
//   let result = "";

//   switch (status) {
//     case InvoiceStatus.CANCELED:
//       result = "text-purple-300";
//       break;
//     case InvoiceStatus.DRAFT:
//       result = "text-gray-300";
//       break;
//     case InvoiceStatus.SENT:
//       result = "text-sky-300";
//       break;
//     case InvoiceStatus.PAID:
//       result = "text-green-300";
//       break;
//     case InvoiceStatus.OVERDUE:
//       result = "text-red-300";
//       break;
//     default:
//       result = "";
//       break;
//   }

//   return result;
// }
