import { Payment } from "@/app/generated/prisma/client";

export interface PaymentType extends Omit<
  Omit<Payment, "amount">,
  "createdAt"
> {
  amountAsNumber: number;
  dateAsString: string;
  invoice: {
    number: string;
    customer: {
      name: string;
    };
  };
}
