"use client";

import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InvoiceForm from "@/features/invoices/components/invoice-form";
import { useState } from "react";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useTranslations } from "next-intl";

export default function InvoiceCU({
  invoice = undefined,
  mode = "create",
}: {
  invoice?: InvoiceType | undefined;
  mode?: "create" | "edit";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { customersQuery } = useCustomers();
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button
            className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start group"
            variant="outline"
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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create"
              ? t("invoices.add-description")
              : t("invoices.edit")}
          </DialogTitle>
          {/* <DialogDescription>
            {mode === "create"
              ? t("invoices.add-description")
              : t("invoices.edit-description")}
          </DialogDescription> */}
        </DialogHeader>
        <InvoiceForm
          setIsOpen={setIsOpen}
          invoice={invoice}
          mode={mode}
          customers={customersQuery.data || []}
          customersIsLoading={customersQuery.isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
