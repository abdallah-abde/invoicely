"use client";

import { Button } from "@/components/ui/button";
import { Loader, Plus, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomerForm from "@/features/customers/components/customer-form";
import { useState } from "react";
import type { Customer } from "@/app/generated/prisma/client";
import { useTranslations } from "next-intl";
import { useIsMutating } from "@tanstack/react-query";

export default function CustomerCU({
  customer = undefined,
  mode = "create",
}: {
  customer?: Customer | undefined;
  mode?: "create" | "edit";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const isMutating =
    useIsMutating({
      mutationKey: ["cusomters"],
    }) > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isMutating) setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button
            className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start group"
            variant="secondary"
          >
            <SquarePen className="group-hover:text-primary transition-colors duration-300" />
            {t("Labels.edit")}
          </Button>
        ) : (
          <Button className="cursor-pointer text-xs sm:text-sm">
            <Plus />{" "}
            <span className="hidden sm:block">{t("customers.add")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[625px]"
        onInteractOutside={(e) => {
          if (!isMutating) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!isMutating) e.preventDefault();
        }}
      >
        <>
          {isMutating && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )}

          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? t("customers.add-description")
                : t("customers.edit")}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm setIsOpen={setIsOpen} customer={customer} mode={mode} />
        </>
      </DialogContent>
    </Dialog>
  );
}
