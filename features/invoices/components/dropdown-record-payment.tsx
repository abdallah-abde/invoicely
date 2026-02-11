import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TicketCheck } from "lucide-react";
import { InvoiceType } from "@/features/invoices/invoice.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RecordPaymentForm from "@/features/invoices/components/record-payment-form";
import { useState } from "react";
import { useIsMutating } from "@tanstack/react-query";

export default function DropdownrecordPayment({
  invoice,
}: {
  invoice: InvoiceType;
}) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const isMutating =
    useIsMutating({
      mutationKey: ["payments", "invoices"],
    }) > 0;

  return (
    <>
      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <Dialog
          open={isOpen}
          onOpenChange={() => {
            if (!isMutating) setIsOpen(!isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer text-xs sm:text-sm p-2 w-full justify-start group"
              variant="secondary"
            >
              <TicketCheck className="group-hover:text-primary transition-colors duration-300" />
              {t("Labels.record_payment")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[825px]">
            <>
              <DialogHeader>
                <DialogTitle>{t("Labels.record_payment")}</DialogTitle>
              </DialogHeader>
              <RecordPaymentForm invoice={invoice} setIsOpen={setIsOpen} />
            </>
          </DialogContent>
        </Dialog>
      </DropdownMenuItem>
    </>
  );
}
