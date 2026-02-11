import { Decimal } from "@prisma/client/runtime/client";

export function normalizeDecimal(
  value: Decimal | number | null | undefined,
): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value);
}

// export function normalizeDate(
//   value: Date | null | undefined,
//   isArabic: boolean,
// ): string | null {
//   return value ? value.toLocaleDateString(isArabic ? "ar-SA" : "en-US") : null;
// }
