import React from "react";
import type { ReactElement } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isLocaleArabic } from "@/lib/utils/locale.utils";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ all: string[] }>;
}) {
  const breadcrumbItems: ReactElement[] = [];

  let breadcrumbPage: ReactElement = <></>;

  const { all } = await params;

  let href = "/dashboard";

  const t = await getTranslations();
  const isArabic = await isLocaleArabic();

  for (let i = 0; i < all.length; i++) {
    const route = all[i];
    href = `${href}/${route}`;

    if (i === all.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {t(`${route}.label`)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbItem>
            <BreadcrumbLink href={href} className="capitalize">
              {t(`${route}.label`)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            {isArabic ? <ChevronLeft /> : <ChevronRight />}
          </BreadcrumbSeparator>
        </React.Fragment>
      );
    }
  }

  return (
    <Breadcrumb className="hidden xl:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt={`${t("app-name")} Logo`}
              width="20"
              height="20"
            />
            {t("dashboard")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          {isArabic ? <ChevronLeft /> : <ChevronRight />}
        </BreadcrumbSeparator>
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
