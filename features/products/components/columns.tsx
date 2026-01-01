import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
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
import { ProductType } from "@/features/products/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreVertical } from "lucide-react";
import { useProducts } from "@/features/products/hooks/use-products";
import { useRouter } from "next/navigation";
import ProductCU from "@/features/products/components/product-cu";
import { toast } from "sonner";
import { caseInsensitiveSort, syPound } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  hasPermission,
  isRoleModerator,
  isRoleSuperAdmin,
  isRoleUser,
} from "@/features/auth/services/access";

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
      return <DataTableHeaderSort column={column} title="Price (SYP)" />;
    },
    enableHiding: false,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("priceAsNumber"));

      // Format the price as a SYP price
      const formatted = syPound.format(price);

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
        <Badge
          variant="secondary"
          className="select-none text-xs xs:text-[13px] size-6 xs:size-7"
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
      const product = row.original;
      const { deleteProduct, isLoading } = useProducts();
      const router = useRouter();

      if (isRoleUser() || isRoleModerator()) return null;

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
            <Button
              variant="ghost"
              className="h-6 xs:h-8 w-6 xs:w-8 p-0 cursor-pointer"
            >
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

            {isRoleSuperAdmin() && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive text-xs xs:text-sm"
                  onClick={async () => {
                    const hasDeletePermission = await hasPermission({
                      resource: "product",
                      permission: ["delete"],
                    });

                    if (hasDeletePermission)
                      deleteProduct.mutate(product.id, {
                        onSuccess: () => {
                          router.refresh();
                          toast.success("Product deleted successfully!");
                        },
                      });
                    else
                      toast.error(
                        "You do not have permission to delete products."
                      );
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}

            {/* <DropdownMenuSeparator /> */}

            {/* <DropdownMenuItem>View product details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
