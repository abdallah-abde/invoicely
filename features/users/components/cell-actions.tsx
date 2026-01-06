"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProps, useUsers } from "@/features/users/hooks/use-users";
import { authClient } from "@/features/auth/lib/auth-client";
import { Edit, MoreVertical, SquarePen, Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeletingLoader } from "@/features/shared/components/table/data-table-columns";
import { useDirection } from "@/hooks/use-direction";

interface Props extends UserProps {
  showEdit?: boolean;
  showDelete?: boolean;
}

export const CellActions = ({
  id,
  name,
  image,
  role,
  email,
  emailVerified,
  hasDeletePermission,
  showEdit = true,
  showDelete = true,
}: Props) => {
  const router = useRouter();

  const t = useTranslations();
  const dir = useDirection();

  const { setIsOpen, setUser } = useUsers();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRemoveUser = async () => {
    try {
      setIsLoading(true);
      const { error } = await authClient.admin.removeUser({ userId: id });

      if (error) {
        toast.error(error.message);
      }
    } catch {
      throw new Error(t("Errors.something-went-wrong"));
    } finally {
      router.refresh();
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <DeletingLoader />;

  return (
    <>
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

          {showEdit && (
            <DropdownMenuItem asChild>
              <Button
                className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start group"
                variant="secondary"
                onClick={() => {
                  setIsOpen(true);
                  setUser({
                    id,
                    name,
                    image,
                    role,
                    email,
                    emailVerified,
                    hasDeletePermission,
                  });
                }}
              >
                <SquarePen className="group-hover:text-primary transition-colors duration-300" />
                {t("Labels.edit")}
              </Button>
            </DropdownMenuItem>
          )}

          {showDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 group"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="group-hover:text-destructive transition-colors duration-300" />

                  {t(`Labels.delete`)}
                </Button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
          setIsDeleteModalOpen(isOpen);
        }}
      >
        <DialogContent className="flex flex-col items-start justify-center">
          <DialogHeader>
            <DialogTitle> {t("Labels.delete-user")} </DialogTitle>
          </DialogHeader>

          <DialogDescription style={{ whiteSpace: "pre-line" }}>
            {t("Labels.delete-user-message", { name })}
          </DialogDescription>

          <Button
            type="submit"
            className="cursor-pointer max-w-40 self-end my-6"
            variant="destructive"
            onClick={() => {
              setIsDeleteModalOpen(false);
              onRemoveUser();
            }}
          >
            {t("Labels.yes")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <>
      <div className="flex justify-end gap-6">
        <div
          className="cursor-pointer"
          title={t("Labels.edit")}
          onClick={() => {
            setIsOpen(true);
            setUser({
              id,
              name,
              image,
              role,
              email,
              emailVerified,
              hasDeletePermission,
            });
          }}
        >
          <Edit className="size-4 xs:size-5" />
        </div>

        {hasDeletePermission && (
          <div
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <Tooltip>
              <TooltipTrigger>
                <Trash className="text-rose-500 size-4 xs:size-5 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>{t("Labels.delete")}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};
