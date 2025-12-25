import { UserProps } from "@/features/users/hooks/use-users";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX } from "lucide-react";
import { CellActions } from "@/features/users/components/cell-actions";
import DataTableHeaderSort from "@/components/data-table/data-table-header-sort";
import { caseInsensitiveSort } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<UserProps>[] = [
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
      <div className="capitalize flex items-center gap-4">
        <Avatar className="rounded-md">
          <AvatarImage src={row.original.image} alt={row.original.name} />
          <AvatarFallback className="rounded-md">
            {row.original.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Email" />;
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Role" />;
    },
    sortingFn: caseInsensitiveSort,
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.role.toUpperCase()}</div>,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return <DataTableHeaderSort column={column} title="Email Verified" />;
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.emailVerified ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleCheck className="text-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Verified</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleX className="text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Not Verified</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <CellActions
          id={row.original.id}
          name={row.original.name}
          image={row.original.image}
          role={row.original.role}
          email={row.original.email}
          emailVerified={row.original.emailVerified}
          hasDeletePermission={row.original.hasDeletePermission}
        />
      );
    },
  },
];
