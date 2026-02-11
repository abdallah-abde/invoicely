// export const usDollar = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// export function formatSyrianPhoneNumber(input: string): string | null {
//   // 1. Sanitize the input to keep only digits and the potential leading '+'
//   const sanitized = input.replace(/(^|\+)[\s\D]+|(\D)/g, "$1$2");

//   // 2. Validate against a slightly more flexible regex for common formats
//   const validationRegex = /^((\+|00)?963|0)?(9[3-68]|11|21|31|41|51)\d{7}$/;
//   if (!validationRegex.test(sanitized)) {
//     return null; // Invalid number format
//   }

//   // console.log(sanitized);

//   // 3. Format the number (example format: +963 9x xxx xxxx)
//   // This is a simple formatting logic after validation:
//   if (sanitized.startsWith("+")) {
//     return sanitized.replace(/^(\+\d{1})(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3 $4");
//   } else if (sanitized.startsWith("0")) {
//     console.log(sanitized.replace(/^(\d{1})(\d{2})(\d{3})$/, "$2 $3 $4"));
//     return sanitized.replace(/^(0)(\d{2})(\d{3})(\d{4})$/, "($1)");
//   } else {
//     // Assume full national number without leading zero, prepend +963
//     return "+963 " + sanitized.replace(/^(\d{1})(\d{2})(\d{3})$/, "$2 $3 $4");
//   }
// }

export const enNumbers = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 0,
});

export const arNumbers = new Intl.NumberFormat("ar-SY", {
  style: "decimal",
  useGrouping: false,
});

const enNumbersWithCommas = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 0,
  useGrouping: true,
});

const syPound = new Intl.NumberFormat("ar-SY", {
  style: "currency",
  currency: "SYP",
  maximumFractionDigits: 5,
});

const arNumbersWithCommas = new Intl.NumberFormat("ar-SY", {
  style: "decimal",
  maximumFractionDigits: 0,
  useGrouping: true,
});

export function formatNumbers({
  isArabic,
  value,
  reverseArabicForPDF = false,
}: {
  isArabic: boolean;
  value: number;
  reverseArabicForPDF?: boolean | null;
}) {
  return isArabic
    ? reverseArabicForPDF
      ? toReversedArabicDigits(value)
      : arNumbers.format(value)
    : value.toString();
}

export function formatCurrency({
  isArabic,
  value,
  reverseArabicForPDF = false,
}: {
  isArabic: boolean;
  value: number;
  reverseArabicForPDF?: boolean | null;
}) {
  return isArabic
    ? reverseArabicForPDF
      ? toReversedArabicDigits(value)
      : syPound.format(value)
    : enNumbers.format(value) + " (SYP)";
}

export function formatCurrencyWithoutSymbols({
  isArabic,
  value,
  reverseArabicForPDF = false,
}: {
  isArabic: boolean;
  value: number;
  reverseArabicForPDF?: boolean | null;
}) {
  return isArabic
    ? reverseArabicForPDF
      ? toReversedArabicDigits(value)
      : arNumbersWithCommas.format(value)
    : enNumbersWithCommas.format(value);
}

export function toReversedArabicDigits(value: number) {
  return value
    .toLocaleString("ar-u-nu-arab")
    .split("")
    .reverse()
    .join("")
    .replace("٬", ",");
}

export function localizeArabicCurrencySymbol(isArabic: boolean) {
  return isArabic ? "ل.س." : "SYP";
}
