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
import CustomerForm from "@/components/forms/customer-form";
import { useState } from "react";
import { Customer } from "@/app/generated/prisma/client";

export default function CustomerCU({
  customer = undefined,
  mode = "create",
  trigger,
}: {
  customer?: Customer | undefined;
  mode?: "create" | "edit";
  trigger?: React.ReactNode; // custom trigger (Edit button)
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer">
            <Plus /> Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create" ? "Add Customer" : "Edit Customer"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new customer."
              : "Update this customer and save your changes."}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm setIsOpen={setIsOpen} customer={customer} mode={mode} />
      </DialogContent>
    </Dialog>
  );
}
