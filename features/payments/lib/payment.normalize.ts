import { normalizeDecimal } from "@/lib/normalize/primitives";
import {
  PaymentPrismaPayload,
  PaymentType,
} from "@/features/payments/payment.types";

export function mapPaymentsToDTO(
  payments: PaymentPrismaPayload[],
): PaymentType[] {
  const result = payments.map((payment) => {
    const { amount, ...restOfPayment } = payment;

    const paymentDate = payment.date;

    return {
      ...restOfPayment,
      dateAsString: paymentDate.toString(),
      amountAsNumber: normalizeDecimal(amount),
    };
  });

  return result;
}
