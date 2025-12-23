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
import { ProductType } from "@/lib/types/custom-types";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreVertical } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useRouter } from "next/navigation";
import ProductCU from "./product-cu";
import { toast } from "sonner";
import { caseInsensitiveSort } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ProductType>[] = [
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
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    sortingFn: caseInsensitiveSort,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <div>{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "priceAsNumber",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Price ($)" />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("priceAsNumber"));

      // Format the price as a dollar price
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="font-medium text-primary">{formatted}</div>;
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return <DataTableHeaderSort column={column} title="Created At" />;
  //   },
  //   cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  // },
  {
    accessorKey: "_count.invoices",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Invoices Count" />;
    },
    cell: ({ row }) => (
      <div>
        <Badge variant="secondary" className="select-none">
          {row.original._count.invoices}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      const { deleteProduct, isLoading } = useProducts();
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
              <ProductCU
                mode="edit"
                product={product}
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
                deleteProduct.mutate(product.id, {
                  onSuccess: () => {
                    // optional UI refresh
                    router.refresh();
                    toast.success("Product deleted successfully!");
                  },
                });
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>View product details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
