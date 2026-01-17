import {
  LAST_30_DAYS_VALUE,
  LAST_90_DAYS_VALUE,
} from "@/features/dashboard/charts.constants";
import { formatNumbers } from "@/lib/utils/number.utils";

export function getRangeTranslationObjOptions(
  range: string | null,
  isArabic: boolean
) {
  return {
    days:
      range === LAST_90_DAYS_VALUE
        ? formatNumbers({ isArabic, value: 90 })
        : range === LAST_30_DAYS_VALUE
          ? formatNumbers({ isArabic, value: 30 })
          : formatNumbers({ isArabic, value: 7 }),

    daysLabel:
      range === LAST_90_DAYS_VALUE
        ? isArabic
          ? "يوم"
          : "days"
        : range === LAST_30_DAYS_VALUE
          ? isArabic
            ? "يوم"
            : "days"
          : isArabic
            ? "أيام"
            : "days",
  };
}
