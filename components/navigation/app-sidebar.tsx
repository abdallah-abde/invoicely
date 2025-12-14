import {
  Banknote,
  Barcode,
  LayoutDashboard,
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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Barcode,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: User,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: Receipt,
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: Banknote,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Update Profile",
    url: "/dashboard/update-profile",
    icon: UserPen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {process.env.NEXT_PUBLIC_APP_NAME} Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} title={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
