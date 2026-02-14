"use client";

import PaymentForm from "@/features/payments/components/payment-form";
import { useState } from "react";
import { PaymentType } from "@/features/payments/payment.types";
import { OperationMode } from "@/features/shared/shared.types";
import CuDialog from "@/features/shared/components/cu-dialog";

export default function PaymentCU({
  payment = undefined,
  mode = OperationMode.CREATE,
}: {
  payment?: PaymentType | undefined;
  mode?: OperationMode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CuDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      mode={mode}
      label="payments"
      dialogMaxWidth="625px"
      mutationKey={["payments"]}
    >
      <PaymentForm setIsOpen={setIsOpen} payment={payment} mode={mode} />
    </CuDialog>
  );
}
