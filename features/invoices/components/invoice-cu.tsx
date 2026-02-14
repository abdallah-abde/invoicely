"use client";

import InvoiceForm from "@/features/invoices/components/invoice-form";
import { useState } from "react";
import {
  InvoiceCategory,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { OperationMode } from "@/features/shared/shared.types";
import CuDialog from "@/features/shared/components/cu-dialog";

export default function InvoiceCU({
  invoice = undefined,
  mode = OperationMode.CREATE,
  type,
}: {
  invoice?: InvoiceType | undefined;
  mode?: OperationMode;
  type: InvoiceCategory;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { customersQuery } = useCustomers();

  return (
    <CuDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      mode={mode}
      label="invoices"
      dialogMaxWidth="725px"
      mutationKey={["invoices", type]}
    >
      <InvoiceForm
        setIsOpen={setIsOpen}
        invoice={invoice}
        mode={mode}
        customers={customersQuery.data || []}
        customersIsLoading={customersQuery.isLoading}
      />
    </CuDialog>
  );
}
