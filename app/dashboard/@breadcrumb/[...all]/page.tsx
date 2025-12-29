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

export default async function BreadcrumbSlot({
  params,
}: {
  params: { all: string[] };
}) {
  const breadcrumbItems: ReactElement[] = [];

  let breadcrumbPage: ReactElement = <></>;

  const { all } = await params;

  let href = "/dashboard";

  for (let i = 0; i < all.length; i++) {
    const route = all[i];
    href = `${href}/${route}`;

    if (i === all.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {" "}
            {route.split("-").join(" ")}
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbItem>
            <BreadcrumbLink href={href} className="capitalize">
              {route.split("-").join(" ")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
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
              alt={`${process.env.NEXT_PUBLIC_APP_NAME} Logo`}
              width="20"
              height="20"
            />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
