import {
  Banknote,
  Barcode,
  LayoutDashboard,
  LucideProps,
  Receipt,
  User,
  UserPen,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { authSession } from "@/features/auth/lib/auth-utils";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import ActiveLink from "./active-link";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { isLocaleArabic } from "@/lib/utils/locale.utils";

export interface ItemProps {
  title: string;
  url: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  deniedRoles: string[];
}

const items: ItemProps[] = [
  {
    title: "dashboard",
    url: "/dashboard",
    Icon: LayoutDashboard,
    deniedRoles: [],
  },
  {
    title: "customers",
    url: "/dashboard/customers",
    Icon: User,
    deniedRoles: ["user"],
  },
  {
    title: "products",
    url: "/dashboard/products",
    Icon: Barcode,
    deniedRoles: ["user"],
  },
  {
    title: "invoices",
    url: "/dashboard/invoices",
    Icon: Receipt,
    deniedRoles: ["user"],
  },
  {
    title: "payments",
    url: "/dashboard/payments",
    Icon: Banknote,
    deniedRoles: ["user"],
  },
  {
    title: "users",
    url: "/dashboard/users",
    Icon: Users,
    deniedRoles: ["user", "moderator"],
  },
  {
    title: "update-profile",
    url: "/dashboard/update-profile",
    Icon: UserPen,
    deniedRoles: [],
  },
];

export async function AppSidebar() {
  const session = await authSession();

  const t = await getTranslations();
  const isArabic = await isLocaleArabic();

  const role = session?.user.role;

  return (
    <Sidebar
      side={isArabic ? "right" : "left"}
      variant="floating"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[16px] pb-2 flex items-center mx-0 ms-4 gap-2">
            <Image
              src="/logos/logo.png"
              alt={`${t("app-name")} Logo`}
              width="25"
              height="25"
            />
            {t("app-name-dashboard")}
          </SidebarGroupLabel>
          <SidebarSeparator className="mb-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.deniedRoles.findIndex((a) => a === role) === -1) {
                  return (
                    <ActiveLink
                      key={item.title}
                      title={item.title}
                      url={item.url}
                    >
                      <Link href={item.url}>
                        <item.Icon className={isArabic ? "rotate-y-180" : ""} />
                        <span>
                          {t(
                            `${item.title === "dashboard" ? "dashboard" : `${item.title}.label`}`
                          )}
                        </span>
                      </Link>
                    </ActiveLink>
                  );
                } else {
                  return null;
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
