"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { useDirection } from "@/hooks/use-direction";

type Props = {
  editTrigger?: React.ReactNode;
  onDelete?: () => Promise<void> | void;
  showEdit?: boolean;
  showDelete?: boolean;
  deleteLabel?: string;
  children?: React.ReactNode;
};

export default function DataTableActions({
  editTrigger,
  onDelete,
  showEdit = true,
  showDelete = true,
  deleteLabel = "delete",
  children,
}: Props) {
  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 xs:h-8 w-6 xs:w-8 p-0 cursor-pointer"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs xs:text-sm">
          {t("Labels.actions")}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {showEdit && editTrigger && (
          <DropdownMenuItem asChild>{editTrigger}</DropdownMenuItem>
        )}

        {showDelete && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                variant="destructive"
                className="cursor-pointer text-xs sm:text-sm p-2 w-full items-center justify-start focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 group"
                onClick={onDelete}
              >
                <Trash2 className="group-hover:text-destructive transition-colors duration-300" />
                {t(`Labels.${deleteLabel}`)}
              </Button>
            </DropdownMenuItem>
          </>
        )}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
