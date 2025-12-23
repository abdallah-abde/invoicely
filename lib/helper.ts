import type { Product } from "@/app/generated/prisma/client";
import { Option } from "@/components/ui/multiple-selector";

export function castProductsToOptions(products: Product[]) {
  return products.map((prod) => {
    const option: Option = {
      label: prod.name,
      value: prod.id,
    };
    return option;
  });
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

export function capitalize(value: string) {
  const firstLetter = value[0].toUpperCase();
  const rest = value.substring(1);

  return `${firstLetter}${rest}`;
}
