export const LAST_7_DAYS_VALUE = "7d";
export const LAST_30_DAYS_VALUE = "30d";
export const LAST_90_DAYS_VALUE = "90d";

export const LAST_7_DAYS_TRANSLATION_LABEL = "last-7-days";
export const LAST_30_DAYS_TRANSLATION_LABEL = "last-30-days";
export const LAST_90_DAYS_TRANSLATION_LABEL = "last-90-days";

export const RANGES = [
  { label: "last-7-days", value: LAST_7_DAYS_VALUE },
  { label: "last-30-days", value: LAST_30_DAYS_VALUE },
  { label: "last-90-days", value: LAST_90_DAYS_VALUE },
];

export const DASHBOARD_STALE_TIME = 30_000; // 30 seconds
export const GC_TIME = 5 * 60 * 1000; // 5 minutes
