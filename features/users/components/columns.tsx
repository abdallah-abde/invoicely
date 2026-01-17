import { UserProps } from "@/features/users/hooks/use-users";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX } from "lucide-react";
import { CellActions } from "@/features/users/components/cell-actions";
import DataTableHeaderSort from "@/features/shared/components/table/data-table-header-sort";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { useRole } from "@/hooks/use-role";
import { caseInsensitiveSort } from "@/features/shared/utils/table.utils";

export const columns: ColumnDef<UserProps>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="name" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-4">
        <Avatar className="rounded-md size-6 xs:size-8">
          <AvatarImage src={row.original.image} alt={row.original.name} />
          <AvatarFallback className="rounded-md text-[10px] xs:text-xs">
            {row.original.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs xs:text-sm">{row.getValue("name")}</span>
      </div>
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
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="role" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => {
      const t = useTranslations();

      return (
        <div className="text-xs xs:text-sm">
          {t(`Labels.${row.original.role}-role`)}
        </div>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="emailverified" />;
    },
    cell: ({ row }) => {
      const t = useTranslations();

      return (
        <div className="capitalize">
          {row.original.emailVerified ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleCheck className="text-green-500 size-5 xs:size-6" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{t("Labels.verified")}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleX className="text-destructive size-5 xs:size-6" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{t("Labels.not-verified")}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { isRoleSuperAdmin } = useRole();

      return (
        <CellActions
          id={row.original.id}
          name={row.original.name}
          image={row.original.image}
          role={row.original.role}
          email={row.original.email}
          emailVerified={row.original.emailVerified}
          hasDeletePermission={row.original.hasDeletePermission}
          showDelete={isRoleSuperAdmin}
        />
      );
    },
  },
];
