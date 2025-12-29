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
    title: "Dashboard",
    url: "/dashboard",
    Icon: LayoutDashboard,
    deniedRoles: [],
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    Icon: User,
    deniedRoles: ["user"],
  },
  {
    title: "Products",
    url: "/dashboard/products",
    Icon: Barcode,
    deniedRoles: ["user"],
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    Icon: Receipt,
    deniedRoles: ["user"],
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    Icon: Banknote,
    deniedRoles: ["user"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    Icon: Users,
    deniedRoles: ["user"],
  },
  {
    title: "Update Profile",
    url: "/dashboard/update-profile",
    Icon: UserPen,
    deniedRoles: [],
  },
];

export async function AppSidebar() {
  const session = await authSession();

  const role = session?.user.role;

  return (
    <Sidebar side="left" variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[16px] pb-2 flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt={`${process.env.NEXT_PUBLIC_APP_NAME} Logo`}
              width="25"
              height="25"
            />{" "}
            {process.env.NEXT_PUBLIC_APP_NAME} Dashboard
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
                        <item.Icon />
                        <span>{item.title}</span>
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
