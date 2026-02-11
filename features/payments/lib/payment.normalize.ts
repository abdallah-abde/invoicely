import {
  PaymentPrismaPayload,
  PaymentType,
} from "@/features/payments/payment.types";

export function mapPaymentsToDTO(
  payments: PaymentPrismaPayload[],
): PaymentType[] {
  const result = payments.map((payment) => {
    const { amount, ...restOfPayment } = payment;

    const paymentDate = payment.date.toLocaleDateString();

    return {
      ...restOfPayment,
      dateAsString: paymentDate,
      amountAsNumber: amount.toNumber(),
    };
  });

  return result;
}
