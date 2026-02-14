"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, MoreVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMutating } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type Props = {
  editTrigger?: React.ReactNode;
  onDelete?: () => Promise<void> | void;
  isDeleting: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  deleteLabel?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resource: string;
};

export default function DataTableActions({
  editTrigger,
  onDelete,
  isDeleting,
  showEdit = true,
  showDelete = true,
  deleteLabel = "delete",
  children,
  isOpen,
  setIsOpen,
  resource,
}: Props) {
  const t = useTranslations();
  const dir = useDirection();

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 xs:h-8 w-6 xs:w-8 p-0 me-2 cursor-pointer"
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
              <AlertDialog
                open={isOpen}
                onOpenChange={() => {
                  if (!isDeleting) setIsOpen(!isOpen);
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer text-xs sm:text-sm p-2 w-full items-center justify-start focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 group"
                  >
                    <Trash2 className="group-hover:text-destructive transition-colors duration-300" />
                    {t(`Labels.${deleteLabel}`)}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t(`Labels.confirm-alert`)}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t(`Labels.confirm-alert-body`, {
                        resource: t(`Fields.${resource}.label`),
                      })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      {t(`Labels.cancel`)}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className={cn(
                        buttonVariants({ variant: "destructive" }),
                        "cursor-pointer",
                      )}
                      disabled={isDeleting}
                      onClick={onDelete}
                    >
                      {isDeleting ? (
                        <Loader className="animate-spin" />
                      ) : (
                        t(`Labels.delete`)
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </>
        )}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
