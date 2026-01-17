import { ZodError } from "zod";
import { useTranslations } from "next-intl";

type ZodIssue = ZodError["issues"][number];

const ISSUE_PRIORITY: Record<string, number> = {
  invalid_type: 1,
  required: 2,
  min: 3,
  max: 4,
  invalid_string: 5,
  custom: 6,
};

function extractZodParams(issue: ZodIssue): Record<string, string | number> {
  switch (issue.code) {
    case "too_small":
      return typeof issue.minimum === "number" ? { min: issue.minimum } : {};
    case "too_big":
      return typeof issue.maximum === "number" ? { max: issue.maximum } : {};
    default:
      return {};
  }
}

export function translateZodError(
  error: ZodError,
  t: ReturnType<typeof useTranslations>
) {
  const byPath = new Map<string, ZodIssue>();

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    const existing = byPath.get(path);

    if (
      !existing ||
      ISSUE_PRIORITY[issue.message] < ISSUE_PRIORITY[existing.message]
    ) {
      byPath.set(path, issue);
    }
  }

  return Array.from(byPath.entries()).map(([path, issue]) => ({
    path,
    message: safeT(
      t,
      issue.code === "invalid_type"
        ? "validation.required"
        : `validation.${issue.message}`,
      extractZodParams(issue)
    ),
  }));
}

function safeT(
  t: (key: string, values?: Record<string, any>) => string,
  key: string,
  values?: Record<string, any>
) {
  try {
    return t(key, values);
  } catch {
    return t("validation.default");
  }
}
