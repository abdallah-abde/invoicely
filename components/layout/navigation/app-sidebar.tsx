import {
  Ban,
  Banknote,
  Barcode,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LucideProps,
  Receipt,
  TriangleAlert,
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { authSession } from "@/features/auth/lib/auth-utils";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import ActiveLink from "./active-link";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { isLocaleArabic } from "@/lib/utils/locale.utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface ItemProps {
  title: string;
  url?: string | null;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  deniedRoles?: string[] | null;
  group?: boolean | null;
  content?: Array<ItemProps> | null;
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
    group: true,
    Icon: Receipt,
    content: [
      {
        title: "working",
        url: "/dashboard/invoices",
        Icon: Receipt,
        deniedRoles: ["user"],
      },
      {
        title: "canceled",
        url: "/dashboard/invoices/canceled",
        Icon: Ban,
        deniedRoles: ["user"],
      },
      {
        title: "candidates",
        url: "/dashboard/invoices/overdue-candidates",
        Icon: TriangleAlert,
        deniedRoles: ["user"],
      },
    ],
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
                if (item.group && item.content) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <item.Icon
                                className={cn(
                                  "size-4",
                                  isArabic ? "rotate-y-180" : "",
                                )}
                              />
                              <span>{t(`${item.title}.label`)}</span>
                            </div>

                            <span className="ms-auto">
                              <span className="group-data-[state=closed]/collapsible:block group-data-[state=open]/collapsible:hidden">
                                {isArabic ? (
                                  <ChevronLeft className="h-4 w-4 opacity-70" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 opacity-70" />
                                )}
                              </span>
                            </span>

                            {/* Open */}
                            <span className="group-data-[state=open]/collapsible:block hidden">
                              <ChevronDown className="h-4 w-4 opacity-70" />
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.content?.map((c) => {
                              if (c.deniedRoles?.includes(role as string)) {
                                return null;
                              }

                              return (
                                // <SidebarMenuSubItem key={c.title}>
                                <ActiveLink
                                  key={c.title}
                                  title={t(`${c.title}.label`)}
                                  url={c.url || ""}
                                >
                                  <Link
                                    href={c.url || ""}
                                    className="flex items-center gap-2"
                                  >
                                    <c.Icon
                                      className={isArabic ? "rotate-y-180" : ""}
                                    />
                                    <span>
                                      {t(
                                        `${c.title === "dashboard" ? "dashboard" : `${c.title}.label`}`,
                                      )}
                                    </span>
                                  </Link>
                                </ActiveLink>
                                // </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                if (item.deniedRoles?.includes(role as string)) {
                  return null;
                }

                return (
                  <ActiveLink
                    key={item.title}
                    title={t(`${item.title}.label`)}
                    url={item.url || ""}
                  >
                    <Link
                      href={item.url || ""}
                      className="flex items-center gap-2"
                    >
                      <item.Icon className={isArabic ? "rotate-y-180" : ""} />
                      <span>
                        {t(
                          `${item.title === "dashboard" ? "dashboard.label" : `${item.title}.label`}`,
                        )}
                      </span>
                    </Link>
                  </ActiveLink>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
