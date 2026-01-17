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
import PaymentForm from "@/features/payments/components/payment-form";
import { useState } from "react";
import { PaymentType } from "@/features/payments/payment.types";
import { useTranslations } from "next-intl";

export default function PaymentCU({
  payment = undefined,
  mode = "create",
}: {
  payment?: PaymentType | undefined;
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
            variant="outline"
          >
            <SquarePen className="group-hover:text-primary transition-colors duration-300" />
            {t("Labels.edit")}
          </Button>
        ) : (
          <Button className="cursor-pointer text-xs sm:text-sm">
            <Plus />{" "}
            <span className="hidden sm:block">{t("payments.add")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? t("payments.add-description")
              : t("payments.edit")}
          </DialogTitle>
        </DialogHeader>
        <PaymentForm setIsOpen={setIsOpen} payment={payment} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
