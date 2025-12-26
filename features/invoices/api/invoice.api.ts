import { Invoice } from "@/app/generated/prisma/client";

export async function fetchInvoices(): Promise<Invoice[]> {
  const res = await fetch("/api/invoices");
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}

export async function createInvoice(data: Partial<Invoice>) {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create invoice");
  return res.json();
}

export async function updateInvoice(id: string, data: Partial<Invoice>) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update invoice");
  return res.json();
}

export async function deleteInvoice(id: string) {
  const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete invoice");
}
