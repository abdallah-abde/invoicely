import { InvoiceStatus, PaymentMethod } from "@/app/generated/prisma/enums";
import { Row, SortingFn, sortingFns } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const caseInsensitiveSort: SortingFn<any> = (
  rowA: Row<any>,
  rowB: Row<any>,
  columnId: string
) => {
  const valueA = String(rowA.getValue(columnId)).toLowerCase();
  const valueB = String(rowB.getValue(columnId)).toLowerCase();
  return valueA.localeCompare(valueB);
};

export const dateAsStringSort: SortingFn<any> = (
  rowA: Row<any>,
  rowB: Row<any>,
  columnId: string
) => {
  const valueA = new Date(rowA.getValue(columnId));
  const valueB = new Date(rowB.getValue(columnId));
  if (valueA.getTime() < valueB.getTime()) {
    return -1;
  } else if (valueA.getTime() > valueB.getTime()) {
    return 1;
  } else {
    return 0;
  }
};

export function getInvoiceStatusList() {
  return Object.values(InvoiceStatus);
}

export function getPaymentMethodList() {
  return Object.values(PaymentMethod);
}
