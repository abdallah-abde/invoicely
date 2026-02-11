import { Customer } from "@/app/generated/prisma/client";
import { CustomerType } from "@/features/customers/customer.types";

export async function fetchCustomers(): Promise<CustomerType[]> {
  const res = await fetch("/api/customers");
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

// export async function createCustomer(data: Partial<Customer>) {
//   const res = await fetch("/api/customers", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Failed to create customer");
//   return res.json();
// }

// export async function updateCustomer(id: string, data: Partial<Customer>) {
//   const res = await fetch(`/api/customers/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Failed to update customer");
//   return res.json();
// }

// export async function deleteCustomer(id: string) {
//   const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
//   if (!res.ok) throw new Error("Failed to delete customer");
// }
