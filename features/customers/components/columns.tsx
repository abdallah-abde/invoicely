"use client";

import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import DataTableActions from "@/features/shared/components/table/data-table-actions";
import { ColumnDef } from "@tanstack/react-table";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useRouter } from "next/navigation";
import CustomerCU from "./customer-cu";
import { toast } from "sonner";
import { arDigitsNoGrouping, caseInsensitiveSort } from "@/lib/utils";
import { CustomerType } from "../customer.types";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/features/auth/services/access";
import {
  DeletingLoader,
  selectColumn,
} from "@/features/shared/components/table/data-table-columns";
import { useRole } from "@/hooks/use-role";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export const columns: ColumnDef<CustomerType>[] = [
  // selectColumn<CustomerType>(),
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
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="email" />;
    },
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="phone" justTitle />;
    },
    cell: ({ row }) => {
      const value = Number(row.original.phone);
      // .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
      const isArabic = useArabic();

      return (
        <div className="text-xs xs:text-sm">
          {isArabic
            ? arDigitsNoGrouping
                .format(value)
                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
            : value.toString().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="address" justTitle />;
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="company" />;
    },
    sortingFn: caseInsensitiveSort,
    cell: ({ row }) => (
      <div className="text-xs xs:text-sm">{row.getValue("companyName")}</div>
    ),
  },
  {
    accessorKey: "taxNumber",
    header: ({ column }) => {
      return (
        <DataTableHeaderSort column={column} title="taxnumber" justTitle />
      );
    },
    enableSorting: false,
    cell: ({ row }) => {
      const isArabic = useArabic();

      return (
        <div className="text-xs xs:text-sm">
          {isArabic
            ? arDigitsNoGrouping.format(Number(row.original.taxNumber))
            : row.original.taxNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.invoices",
    header: ({ column }) => {
      return (
        <DataTableHeaderSort column={column} title="invoicescount" justTitle />
      );
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
      const customer = row.original;
      const { deleteCustomer, isLoading } = useCustomers();
      const router = useRouter();
      const t = useTranslations();

      const { isRoleUser, isRoleModerator, isRoleSuperAdmin } = useRole();

      if (isRoleUser || isRoleModerator) return null;

      if (isLoading) return <DeletingLoader />;

      return (
        <DataTableActions
          editTrigger={<CustomerCU mode="edit" customer={customer} />}
          onDelete={async () => {
            const hasDeletePermission = await hasPermission({
              resource: "customer",
              permission: ["delete"],
            });

            if (hasDeletePermission)
              deleteCustomer.mutate(customer.id, {
                onSuccess: () => {
                  router.refresh();
                  toast.success(t("customers.messages.success.delete"));
                },
              });
            else toast.error(t("customers.messages.error.delete"));
          }}
          showDelete={isRoleSuperAdmin}
        />
      );
    },
  },
];
