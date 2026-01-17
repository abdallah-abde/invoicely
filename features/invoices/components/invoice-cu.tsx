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
import InvoiceForm from "@/features/invoices/components/invoice-form";
import { useState } from "react";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useTranslations } from "next-intl";
import { useIsMutating } from "@tanstack/react-query";

export default function InvoiceCU({
  invoice = undefined,
  mode = "create",
}: {
  invoice?: InvoiceType | undefined;
  mode?: "create" | "edit";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const { customersQuery } = useCustomers();
  const isMutating =
    useIsMutating({
      mutationKey: ["invoices"],
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
            <span className="hidden sm:block">{t("invoices.add")}</span>
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
                ? t("invoices.add-description")
                : t("invoices.edit")}
            </DialogTitle>
          </DialogHeader>
          <InvoiceForm
            setIsOpen={setIsOpen}
            invoice={invoice}
            mode={mode}
            customers={customersQuery.data || []}
            customersIsLoading={customersQuery.isLoading}
          />
        </>
      </DialogContent>
    </Dialog>
  );
}
