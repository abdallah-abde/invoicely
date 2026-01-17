import { getLocale } from "next-intl/server";

export async function getDirection() {
  const locale = await getLocale();

  return locale === "ar" ? "rtl" : "ltr";
}
