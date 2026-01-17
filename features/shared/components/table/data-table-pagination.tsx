import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { formatNumbers } from "@/lib/utils/number.utils";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { useDirection } from "@/hooks/use-direction";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  // const filteredSelectedRowModel =
  // table.getFilteredSelectedRowModel().rows.length;

  const filteredRowModel = table.getFilteredRowModel().rows.length;

  const currentPage = formatNumbers({
    isArabic,
    value: table.getState().pagination.pageIndex + 1,
  });

  const totalPages = formatNumbers({
    isArabic,
    value: table.getPageCount() || 1,
  });

  return (
    <div className="flex items-center justify-between py-2">
      <div className="hidden sm:block text-muted-foreground flex-1 text-sm">
        {t("Labels.rows-count", {
          count: formatNumbers({
            isArabic,
            value: filteredRowModel,
          }),
        })}
      </div>
      <div className="max-sm:w-full flex items-center justify-between space-x-6 lg:space-x-8">
        <div className="hidden sm:flex items-center space-x-2">
          <p className="text-sm font-medium">{t("Labels.rows-per-page")}</p>
          <Select
            dir={dir}
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {formatNumbers({
                    isArabic,
                    value: pageSize,
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          {t("Labels.page-of", { current: currentPage, total: totalPages })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            {isArabic ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            {isArabic ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            {isArabic ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            {isArabic ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
        </div>
      </div>
    </div>
  );
}
