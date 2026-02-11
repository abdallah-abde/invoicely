import Link from "next/link";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { getHomeKPIs } from "@/features/dashboard/services/chart.services";
import { cn } from "@/lib/utils";
import { isLocaleArabic } from "@/lib/utils/locale.utils";

import OptionalKPISkeleton from "@/features/home/components/optional-kpi-skeleton";
import OptionalKPIContent from "@/features/home/components/optional-kpi-content";
import { buttonVariants } from "@/components/ui/button";

import { getTranslations } from "next-intl/server";

export const revalidate = 60 * 60; // 1 hour

export default async function OptionalKPISection() {
  const data = await getHomeKPIs();
  const isArabic = await isLocaleArabic();

  const t = await getTranslations("KPI");

  return (
    <section className="mx-auto pt-24 select-none max-w-5xl px-6" id="kpi">
      <div className="mb-12 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl  font-bold">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-md md:max-w-lg lg:max-w-2xl mx-auto text-muted-foreground text-sm md:text-[16px] lg:text-lg">
          {t("sub-title-1")}
        </p>
      </div>
      {/* <Suspense fallback={<OptionalKPISkeleton />}> */}
      <OptionalKPIContent data={data} />
      {/* </Suspense> */}
      <p className="max-w-md md:max-w-lg lg:max-w-2xl mx-auto text-muted-foreground text-sm md:text-[16px] lg:text-lg text-center mt-12">
        {t("sub-title-2")}
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "text-sm lg:text-[17px]",
            "group transition duration-300",
            isArabic ? "flex-row-reverse" : "",
          )}
        >
          {isArabic && (
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition duration-300" />
          )}
          {t("dashboard-link-text")}
          {!isArabic && (
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-300" />
          )}
        </Link>
      </div>
    </section>
  );
}
