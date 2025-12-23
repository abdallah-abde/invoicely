"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentForm from "@/components/forms/payment-form";
import { useState } from "react";
import { PaymentType } from "@/lib/types/custom-types";

export default function PaymentCU({
  payment = undefined,
  mode = "create",
  trigger,
}: {
  payment?: PaymentType | undefined;
  mode?: "create" | "edit";
  trigger?: React.ReactNode; // custom trigger (Edit button)
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer">
            <Plus /> Add Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create" ? "Add Payment" : "Edit Payment"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new payment."
              : "Update this payment and save your changes."}
          </DialogDescription>
        </DialogHeader>
        <PaymentForm setIsOpen={setIsOpen} payment={payment} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
