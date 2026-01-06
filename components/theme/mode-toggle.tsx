"use client";

import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/use-direction";
import { useArabic } from "@/hooks/use-arabic";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100",
              isArabic ? "dark:-rotate-90" : "dark:rotate-0"
            )}
          />
          <span className="sr-only">{t("toggle-theme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-foreground"
        >
          {t("theme-mode.light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-foreground"
        >
          {t("theme-mode.dark")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
