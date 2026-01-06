"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function DataTableSearchInput({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  const t = useTranslations();

  return (
    <Input
      placeholder={t("Fields.search.placeholder")}
      value={globalFilter ?? ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="max-w-xs sm:max-w-sm text-sm sm:text-[16px]"
    />
  );
}
