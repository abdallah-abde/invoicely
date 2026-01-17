import { arNumbers } from "@/lib/utils/number.utils";

interface ExtractedNumber {
  value: number;
  startIndex: number;
  arabicForm: string;
}

export function replaceMissedupSymbols(value: string) {
  let result = "";

  value.split("").map((a) => {
    if (a === "(") result += ")";
    else if (a === ")") result += "(";
    else result += a;
  });

  return result;
}

export function extractNumbersWithIndex(
  text: string,
  isArabic: boolean
): string {
  const regex = /\d+(?:\.\d+)?/g;
  const matches: ExtractedNumber[] = [];

  for (const match of text.matchAll(regex)) {
    matches.push({
      value: Number(match[0]),
      startIndex: match.index!,
      arabicForm: arNumbers.format(Number(match[0])),
    });
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const { arabicForm, startIndex, value } = matches[i];
    const original = arabicForm;
    const reversed = isArabic
      ? arabicForm.split("").reverse().join("")
      : value.toString().split("").reverse().join("");

    text =
      text.slice(0, startIndex) +
      reversed +
      text.slice(startIndex + original.length);
  }

  return text;
}
