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
import InvoiceForm from "@/features/invoices/components/invoice-form";
import { useState } from "react";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";

export default function InvoiceCU({
  invoice = undefined,
  mode = "create",
  trigger,
}: {
  invoice?: InvoiceType | undefined;
  mode?: "create" | "edit";
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { customersQuery } = useCustomers();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="cursor-pointer text-xs sm:text-sm">
            <Plus /> <span className="hidden sm:block">Add Invoice</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {mode === "create" ? "Add Invoice" : "Edit Invoice"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new invoice."
              : "Update this invoice and save your changes."}
          </DialogDescription>
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
