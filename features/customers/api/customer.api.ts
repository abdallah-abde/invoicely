import { CustomerType } from "@/features/customers/customer.types";

export async function fetchCustomers(): Promise<CustomerType[]> {
  const res = await fetch("/api/customers");
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}
