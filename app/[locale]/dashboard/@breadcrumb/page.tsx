export const dynamic = "force-dynamic";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function BreadcrumbSlot() {
  const t = await getTranslations();

  return (
    <Breadcrumb className="hidden xl:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2">
            {" "}
            <Image
              src="/logos/logo.png"
              alt={`${t("app-name")} Logo`}
              width="20"
              height="20"
            />
            {t("dashboard.label")}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
