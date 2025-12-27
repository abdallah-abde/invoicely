import type { Metadata } from "next";

import { authIsRequired } from "@/features/auth/lib/auth-utils";

import { AppSidebar } from "@/components/layout/navigation/app-sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { ThemeColorToggle } from "@/components/theme/theme-color-toggle";
import AuthenticationToggle from "@/features/auth/components/authentication-toggle";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | Dashboard | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    "Overview of revenue, invoices, customers, and business insights.",
};

export default async function DashboardLayout({
  children,
  breadcrumb,
}: Readonly<{
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
}>) {
  await authIsRequired();

  return (
    <SidebarProvider className="overflow-hidden">
      <AppSidebar />

      <div className="w-full mx-6">
        <div className="flex items-center justify-start sm:justify-between gap-4 py-2 border-b w-full">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="cursor-pointer" />
            {breadcrumb}
          </div>
          <div className="flex items-center max-sm:mx-auto gap-4">
            <ThemeColorToggle />
            <ModeToggle />
            <AuthenticationToggle />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-75px)]">{children}</ScrollArea>
      </div>
    </SidebarProvider>
  );
}
