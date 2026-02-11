import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { localizeArabicCurrencySymbol } from "@/lib/utils/number.utils";

export default function DataTableHeaderSort<TData>({
  column,
  title,
  justTitle = false,
}: {
  column: Column<TData, unknown>;
  title: string;
  justTitle?: boolean;
}) {
  const t = useTranslations();
  const isArabic = useArabic();
  const monetoryColumns = ["price", "total", "amount", "paidamount", "rest"];
  const isTitleMonetory = monetoryColumns.includes(title);

  if (justTitle)
    return (
      <span className="text-center text-xs xs:text-sm">
        {t(
          `Fields.${title}.label`,
          isTitleMonetory
            ? { currency: localizeArabicCurrencySymbol(isArabic) }
            : {},
        )}
      </span>
    );

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="text-center text-xs xs:text-sm">
        {t(
          `Fields.${title}.label`,
          isTitleMonetory
            ? { currency: localizeArabicCurrencySymbol(isArabic) }
            : {},
        )}
      </span>
      {column.getIsSorted() ? (
        column.getIsSorted() === "asc" ? (
          <ChevronDown className="inline-block size-3.5" />
        ) : (
          <ChevronUp className="inline-block  size-3.5" />
        )
      ) : (
        <ArrowUpDown className=" size-3.5" />
      )}
    </Button>
  );
}
