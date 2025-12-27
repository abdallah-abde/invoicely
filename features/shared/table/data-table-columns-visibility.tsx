import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { labels } from "@/lib/labels";

export default function DataTableColumnsVisibility<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="sm:ml-auto text-sm! sm:text-[16px]!"
        >
          Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const columnId = Object.keys(labels).find((f) => f === column.id);
            type ObjectKey = keyof typeof labels;

            let value = column.id;
            if (columnId) value = labels[columnId as ObjectKey];

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-sm sm:text-[16px]"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {value}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
