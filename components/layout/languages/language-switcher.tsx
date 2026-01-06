"use client";

import { usePathname, useRouter } from "@/i18n/navigation"; // Adjust the import path as necessary
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/hooks/use-direction";
import { useArabic } from "@/hooks/use-arabic";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("languages");
  const locale = useLocale();
  const dir = useDirection();
  const isArabic = useArabic();

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={isArabic ? "sm" : "icon"}
          className="cursor-pointer"
        >
          {t(locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-5" align="end">
        <DropdownMenuItem
          onClick={() => router.replace(pathname, { locale: "ar" })}
        >
          {t("ar")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.replace(pathname, { locale: "en" })}
        >
          {t("en")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
