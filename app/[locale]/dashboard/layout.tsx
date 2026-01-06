import type { Metadata } from "next";

import { authIsRequired } from "@/features/auth/lib/auth-utils";

import { AppSidebar } from "@/components/layout/navigation/app-sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { ThemeColorToggle } from "@/components/theme/theme-color-toggle";
import AuthenticationToggle from "@/features/auth/components/authentication-toggle";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LanguageSwitcher from "@/components/layout/languages/language-switcher";

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
    <SidebarProvider>
      <AppSidebar />

      <div className="w-full">
        <div className="w-full px-6">
          <div className="flex items-center justify-start sm:justify-between gap-4 py-2 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="cursor-pointer" />
              {breadcrumb}
            </div>
            <div className="flex items-center max-sm:mx-auto gap-4">
              <ThemeColorToggle />
              <ModeToggle />
              <AuthenticationToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        <div className="px-6">{children}</div>
      </div>
    </SidebarProvider>
  );
}
