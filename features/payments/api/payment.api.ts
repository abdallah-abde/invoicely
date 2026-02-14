import { PaymentType } from "@/features/payments/payment.types";

export async function fetchPayments(): Promise<PaymentType[]> {
  const res = await fetch("/api/payments");
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}
