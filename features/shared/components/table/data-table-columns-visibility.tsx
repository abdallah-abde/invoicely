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
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export default function DataTableColumnsVisibility<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="sm:ms-auto text-sm! sm:text-[16px]!"
        >
          <span className="hidden sm:block">{t("Table.columns")}</span>{" "}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isArabic ? "start" : "end"}>
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
                className="text-sm sm:text-[16px]"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(`Fields.${value.toLowerCase().split(" ").join("")}.label`)}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
