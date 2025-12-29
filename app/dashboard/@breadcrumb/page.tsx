export const dynamic = "force-dynamic";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

export default function BreadcrumbSlot() {
  return (
    <Breadcrumb className="hidden xl:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2">
            {" "}
            <Image
              src="/logos/logo.png"
              alt={`${process.env.NEXT_PUBLIC_APP_NAME} Logo`}
              width="20"
              height="20"
            />
            Dashboard
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
