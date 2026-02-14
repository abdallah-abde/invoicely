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
