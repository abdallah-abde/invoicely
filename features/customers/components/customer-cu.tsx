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
import CustomerForm from "@/features/customers/components/customer-form";
import { useState } from "react";
import type { Customer } from "@/app/generated/prisma/client";
import { useTranslations } from "next-intl";

export default function CustomerCU({
  customer = undefined,
  mode = "create",
}: {
  customer?: Customer | undefined;
  mode?: "create" | "edit";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create"
              ? t("customers.add-description")
              : t("customers.edit")}
          </DialogTitle>
          {/* <DialogDescription>
            {mode === "create"
              ? t("customers.add-description")
              : t("customers.edit-description")}
          </DialogDescription> */}
        </DialogHeader>
        <CustomerForm setIsOpen={setIsOpen} customer={customer} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
