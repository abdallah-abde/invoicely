"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LAST_7_DAYS_VALUE, RANGES } from "../charts.constants";
import { useTranslations } from "next-intl";
import { getRangeTranslationObjOptions } from "@/features/dashboard/chart.utils";
import { capitalize } from "@/lib/utils/string.utils";
import { useArabic } from "@/hooks/use-arabic";

export default function DashboardFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const active = params.get("range") || LAST_7_DAYS_VALUE;

  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {RANGES.map((r) => (
        <Button
          key={r.value}
          variant={active === r.value ? "default" : "outline"}
          disabled={active === r.value}
          onClick={() => router.replace(`?range=${r.value}`, { scroll: false })}
          className="cursor-pointer"
        >
          {capitalize(
            t(
              "Labels.last-days",
              getRangeTranslationObjOptions(r.value, isArabic)
            )
          )}
        </Button>
      ))}
    </div>
  );
}
