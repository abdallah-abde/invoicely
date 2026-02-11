"use client";

import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InvoiceForm from "@/features/invoices/components/invoice-form";
import { useState } from "react";
import {
  InvoiceCategory,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useTranslations } from "next-intl";
import { useIsMutating } from "@tanstack/react-query";
import { OperationMode } from "@/features/shared/shared.types";

export default function InvoiceCU({
  invoice = undefined,
  mode = OperationMode.CREATE,
  type,
}: {
  invoice?: InvoiceType | undefined;
  mode?: OperationMode;
  type: InvoiceCategory;
}) {
  const isOperationCreate = mode === OperationMode.CREATE;
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const { customersQuery } = useCustomers();
  const isMutating =
    useIsMutating({
      mutationKey: ["invoices", type],
    }) > 0;

  console.log("dialog open change:", isOpen);

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
        className="sm:max-w-[725px]"
        onInteractOutside={(e) => {
          if (!isMutating) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!isMutating) e.preventDefault();
        }}
      >
        <>
          {/* {isMutating && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )} */}

          <DialogHeader>
            <DialogTitle>
              {isOperationCreate
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
