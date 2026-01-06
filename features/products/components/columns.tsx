import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import {
  DeletingLoader,
  selectColumn,
} from "@/features/shared/components/table/data-table-columns";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import { ProductType } from "@/features/products/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { useProducts } from "@/features/products/hooks/use-products";
import { useRouter } from "next/navigation";
import ProductCU from "@/features/products/components/product-cu";
import { toast } from "sonner";
import { arDigitsNoGrouping, caseInsensitiveSort, syPound } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/features/auth/services/access";
import { useRole } from "@/hooks/use-role";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export const columns: ColumnDef<ProductType>[] = [
  // selectColumn<ProductType>(),
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
      const price = parseFloat(row.getValue("priceAsNumber"));

      // Format the price as a SYP price
      const formatted = syPound.format(price);

      return (
        <div className="font-medium text-primary text-xs xs:text-sm">
          {formatted}
        </div>
      );
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
            {isArabic
              ? arDigitsNoGrouping.format(row.original._count.invoices)
              : row.original._count.invoices}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      const { deleteProduct, isLoading } = useProducts();
      const router = useRouter();
      const t = useTranslations();

      const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

      if (isRoleUser || isRoleModerator) return null;

      if (isLoading) return <DeletingLoader />;

      return (
        <DataTableActions
          editTrigger={<ProductCU mode="edit" product={product} />}
          onDelete={async () => {
            const hasDeletePermission = await hasPermission({
              resource: "product",
              permission: ["delete"],
            });

            if (hasDeletePermission)
              deleteProduct.mutate(product.id, {
                onSuccess: () => {
                  router.refresh();
                  toast.success(t("products.messages.success.delete"));
                },
              });
            else toast.error(t("products.messages.error.delete"));
          }}
          showDelete={isRoleSuperAdmin}
        />
      );
    },
  },
];
