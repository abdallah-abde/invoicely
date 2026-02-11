import { getLocale } from "next-intl/server";

export async function isLocaleArabic() {
  const locale = await getLocale();

  return locale === "ar";
}
