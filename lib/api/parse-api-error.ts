import { ZodError } from "zod";
import { translateZodError } from "@/lib/utils/zod-intl";
import { isValidationApiError } from "./api-error";
import type { _Translator } from "next-intl";

export function parseApiError(
  error: unknown,
  t: _Translator<Record<string, any>>,
) {
  if (isValidationApiError(error)) {
    return {
      type: "validation" as const,
      fields: translateZodError({ issues: error.issues } as ZodError, t),
    };
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = String((error as any).message);

    return {
      type: "general" as const,
      message: t.has(msg) ? t(msg) : msg,
    };
  }

  return {
    type: "general" as const,
    message: t("common.messages.unexpected_error"),
  };
}
