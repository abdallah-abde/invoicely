import { Payment } from "@/app/generated/prisma/client";
import { PaymentType } from "@/features/payments/payment.types";

export async function fetchPayments(): Promise<PaymentType[]> {
  const res = await fetch("/api/payments");
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

export async function createPayment(data: Partial<Payment>) {
  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create payment");
  return res.json();
}

export async function updatePayment(id: string, data: Partial<Payment>) {
  const res = await fetch(`/api/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update payment");
  return res.json();
}

export async function deletePayment(id: string) {
  const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete payment");
}
