import { LAST_90_DAYS_VALUE } from "@/features/dashboard/charts.constants";
import { getLocale } from "next-intl/server";

export async function isLocaleArabic() {
  const locale = await getLocale();

  return locale === "ar";
}
