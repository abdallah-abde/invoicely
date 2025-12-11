import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import type { ReactElement } from "react";

export default async function BreadcrumbSlot({
  params,
}: {
  params: { all: string[] };
}) {
  const breadcrumbItems: ReactElement[] = [];

  let breadcrumbPage: ReactElement = <></>;

  const { all } = await params;

  console.log(all);

  let href = "/dashboard";

  for (let i = 0; i < all.length; i++) {
    const route = all[i];
    href = `${href}/${route}`;
    console.log(href);
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
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
