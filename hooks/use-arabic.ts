import { useLocale } from "next-intl";

export function useArabic() {
  const locale = useLocale();

  return locale === "ar";
}
