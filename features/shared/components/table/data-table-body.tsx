import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender, Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export default function DataTableBody<TData>({
  table,
  columnsLength,
}: {
  table: Table<TData>;
  columnsLength: number;
}) {
  const t = useTranslations();

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="last-of-type:text-end">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columnsLength} className="h-24 text-center">
            {t("Labels.no-results")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
