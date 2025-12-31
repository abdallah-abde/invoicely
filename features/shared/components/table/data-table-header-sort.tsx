import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

export default function DataTableHeaderSort<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="text-xs xs:text-sm">{title}</span>
      {column.getIsSorted() ? (
        column.getIsSorted() === "asc" ? (
          <ChevronDown className="ml-2 inline-block" />
        ) : (
          <ChevronUp className="ml-2 inline-block" />
        )
      ) : (
        <ArrowUpDown />
      )}
    </Button>
  );
}
