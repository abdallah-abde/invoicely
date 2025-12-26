"use client";

import { useCustomers } from "../hooks/use-customers";
import { CustomersTable } from "./customers-table";

export default function CustomersComp() {
  const { customers, isLoading } = useCustomers();

  if (isLoading) return <p>Loading</p>;

  return <CustomersTable data={customers} />;
}
