import { Invoice } from "@/app/generated/prisma/client";
import { InvoiceType } from "@/features/invoices/invoice.types";

export async function fetchWorkingInvoices(): Promise<InvoiceType[]> {
  const res = await fetch("/api/invoices");
  if (!res.ok) throw new Error("Failed to fetch working invoices");
  return res.json();
}

export async function fetchCanceledInvoices(): Promise<InvoiceType[]> {
  const res = await fetch("/api/invoices/canceled");
  if (!res.ok) throw new Error("Failed to fetch canceled invoices");
  return res.json();
}

export async function fetchOverdueCandidatesInvoices(): Promise<InvoiceType[]> {
  const res = await fetch("/api/invoices/overdue-candidates");
  if (!res.ok) throw new Error("Failed to fetch candidates overdue invoices");
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
