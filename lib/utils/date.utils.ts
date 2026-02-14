import {
  LAST_30_DAYS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_90_DAYS_VALUE,
} from "@/features/dashboard/charts.constants";

export function getMonthTranslationKey(value: string) {
  let result = "";

  switch (value) {
    case "1":
    case "01":
      result = "jan";
      break;
    case "2":
    case "02":
      result = "feb";
      break;
    case "3":
    case "03":
      result = "mar";
      break;
    case "4":
    case "04":
      result = "apr";
      break;
    case "5":
    case "05":
      result = "may";
      break;
    case "6":
    case "06":
      result = "jun";
      break;
    case "7":
    case "07":
      result = "jul";
      break;
    case "8":
    case "08":
      result = "aug";
      break;
    case "9":
    case "09":
      result = "sep";
      break;
    case "10":
      result = "oct";
      break;
    case "11":
      result = "nov";
      break;
    case "12":
      result = "dec";
      break;
    default:
      result = "";
  }

  return result;
}

export function getWeekTranslationKey(value: string) {
  let result = "";

  switch (value) {
    case "0":
      result = "su";
      break;
    case "1":
      result = "mo";
      break;
    case "2":
      result = "tu";
      break;
    case "3":
      result = "we";
      break;
    case "4":
      result = "th";
      break;
    case "5":
      result = "fr";
      break;
    case "6":
      result = "sa";
      break;
    default:
      result = "";
  }

  return result;
}

export function mergeDateWithLocalTime(
  newDate: Date,
  previousDate?: Date | string,
) {
  const base =
    previousDate instanceof Date
      ? previousDate
      : previousDate
        ? new Date(previousDate)
        : new Date();

  return new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
    base.getHours(),
    base.getMinutes(),
    base.getSeconds(),
    base.getMilliseconds(),
  );
}

export function getDateBeginningOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
}

export function getFromDate(range: string) {
  const now = new Date();
  let from = new Date();

  switch (range) {
    case LAST_7_DAYS_VALUE:
      from.setDate(now.getDate() - 7);
      break;
    case LAST_30_DAYS_VALUE:
      from.setDate(now.getDate() - 30);
      break;
    case LAST_90_DAYS_VALUE:
      from.setDate(now.getDate() - 90);
      break;
  }

  return getDateBeginningOfDay(from);
}

export const arToLocaleDate = new Intl.DateTimeFormat("ar-SY", {
  dateStyle: "long",
});

const enToLocaleDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export function formatDates({
  isArabic,
  value,
}: {
  isArabic: boolean;
  value: Date | string | null | undefined;
}) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return "";

  return isArabic ? arToLocaleDate.format(date) : enToLocaleDate.format(date);
}

export function formatArabicDate(value: string) {
  const arr = value.split(" ");

  const year = arr.pop()?.split("").reverse().join("");
  const day = arr.shift()?.split("").reverse().join("");

  return `${day} ${arr.join(" ")} ${year}`;
}

export function toDateOnlyUTC(d: Date | string) {
  const date = new Date(d);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function parseLocalDateOnly(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function todayLocalDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
