"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { cn } from "@/lib/utils";

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
  const isActive = pathname === url;

  return (
    <SidebarMenuItem key={title} title={title}>
      <SidebarMenuButton
        asChild
        tooltip={title}
        className={cn(
          "transition",
          "duration-300",
          isActive ? "bg-primary/30 hover:bg-primary/20" : "",
          className
        )}
      >
        {children}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
