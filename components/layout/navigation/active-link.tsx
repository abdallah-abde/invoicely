"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "../../ui/sidebar";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function ActiveLink({
  title,
  url,
  children,
  className,
}: {
  title: string;
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const fullPath = `/${locale}${url}`;

  const isActive = pathname === fullPath;

  return (
    <SidebarMenuItem key={title} title={title}>
      <SidebarMenuButton
        asChild
        tooltip={title}
        className={cn(
          "transition",
          "duration-300",
          isActive ? "bg-primary/30 hover:bg-primary/20" : "",
          className,
        )}
      >
        {children}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
