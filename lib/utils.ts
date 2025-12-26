import { InvoiceStatus, PaymentMethod } from "@/app/generated/prisma/enums";
import { Row, SortingFn } from "@tanstack/react-table";
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

export const usDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getRangeLabel(range: string | null) {
  return range
    ? range === "7d"
      ? "Last 7 days"
      : range === "1m"
        ? "Last month"
        : range === "3m"
          ? "Last 3 months"
          : "Last 7 days"
    : "Last 7 days";
}

export function capitalize(value: string) {
  const firstLetter = value[0].toUpperCase();
  const rest = value.substring(1);

  return `${firstLetter}${rest}`;
}

export function getMonth(value: string) {
  let result = "";

  switch (value) {
    case "1":
      result = "Jan";
      break;
    case "2":
      result = "Feb";
      break;
    case "3":
      result = "Mar";
      break;
    case "4":
      result = "Apr";
      break;
    case "5":
      result = "May";
      break;
    case "6":
      result = "Jun";
      break;
    case "7":
      result = "Jul";
      break;
    case "8":
      result = "Aug";
      break;
    case "9":
      result = "Sep";
      break;
    case "10":
      result = "Oct";
      break;
    case "11":
      result = "Nov";
      break;
    case "12":
      result = "Dec";
      break;
    default:
      result = "";
  }

  return result;
}
