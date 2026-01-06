"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export function selectColumn<T>(): ColumnDef<T> {
  return {
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
  };
}

export function DeletingLoader() {
  const t = useTranslations();

  return (
    <Button
      className="flex gap-2 items-center justify-end px-2 w-full"
      variant="ghost"
      size="icon-lg"
    >
      <Loader className="animate-spin text-destructive" />
      <span className="text-destructive text-xs">{t("Labels.deleting")}</span>
    </Button>
  );
}
