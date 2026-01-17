import { buttonVariants } from "@/components/ui/button";
import { useArabic } from "@/hooks/use-arabic";
import { cn } from "@/lib/utils";
import { formatNumbers } from "@/lib/utils/number.utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations();
  const isArabic = useArabic();

  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between max-w-5xl mx-auto">
          <div className="max-md:text-center">
            <h3 className="text-lg font-semibold px-4">{t("app-name")}</h3>
            <p className="mt-2 w-full max-w-md mx-auto px-4 md:max-w-sm text-sm text-muted-foreground">
              {t("Footer.sub-title")}
            </p>
          </div>

          <nav className="flex flex-wrap px-4 gap-6 text-sm max-md:w-full max-md:justify-center">
            <Link
              href="/"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                buttonVariants({ variant: "ghost", size: "sm" })
              )}
            >
              {t("Footer.home-link-text")}
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                buttonVariants({ variant: "ghost", size: "sm" })
              )}
            >
              {t("Footer.dashboard-link-text")}
            </Link>

            <a
              href="https://github.com/abdallah-abde/invoicely"
              target="_blank"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                buttonVariants({ variant: "ghost", size: "sm" })
              )}
            >
              {t("Footer.github-link-text")}
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          {t("Footer.copy", {
            year: formatNumbers({
              isArabic,
              value: year,
            }),
          })}
        </div>
      </div>
    </footer>
  );
}
