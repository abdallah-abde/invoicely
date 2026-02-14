import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import { OperationMode } from "@/features/shared/shared.types";
import { cn } from "@/lib/utils";
import { useIsMutating } from "@tanstack/react-query";

type ComponentProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode?: OperationMode;
  label: string;
  dialogMaxWidth?: string;
  mutationKey: string[];
  children: React.ReactNode;
};

export default function CuDialog({
  isOpen,
  setIsOpen,
  mode,
  label,
  dialogMaxWidth = "425px",
  mutationKey,
  children,
}: ComponentProps) {
  const isOperationCreate = mode === OperationMode.CREATE;

  const t = useTranslations();

  const BUTTON_SHARED_STYLES = "cursor-pointer text-xs sm:text-sm";

  const isMutating =
    useIsMutating({
      mutationKey,
    }) > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isMutating) setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {!isOperationCreate ? (
          <Button
            className={cn(
              BUTTON_SHARED_STYLES,
              "p-2 w-full justify-start group",
            )}
            variant="secondary"
          >
            <SquarePen className="group-hover:text-primary transition-colors duration-300" />
            {t("Labels.edit")}
          </Button>
        ) : (
          <Button className={BUTTON_SHARED_STYLES}>
            <Plus />{" "}
            <span className="hidden sm:block">{t(`${label}.add`)}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[1025px]`}
        style={{ maxWidth: dialogMaxWidth }}
        onInteractOutside={(e) => {
          if (!isMutating) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!isMutating) e.preventDefault();
        }}
      >
        <>
          <AlertDialogHeader>
            <DialogTitle className="me-auto">
              {isOperationCreate
                ? t(`${label}.add-description`)
                : t(`${label}.edit`)}
            </DialogTitle>
          </AlertDialogHeader>
          {children}
        </>
      </DialogContent>
    </Dialog>
  );
}
