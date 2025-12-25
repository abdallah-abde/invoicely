import { Payment } from "@/app/generated/prisma/client";

export interface PaymentType extends Omit<
  Omit<Payment, "amount">,
  "createdAt"
> {
  amountAsNumber: number;
  // createdAt: string;
  dateAsString: string;
  invoice: {
    number: string;
    customer: {
      name: string;
    };
  };
}
