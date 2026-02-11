import { ZodError } from "zod";

/** =======================
 * API ERROR TYPES
 * ======================= */

export type ValidationApiError = {
  error: "VALIDATION_ERROR";
  issues: ZodError["issues"];
};

export type GenericApiError = {
  error: string;
  message?: string;
};

export type ApiError = ValidationApiError | GenericApiError;

/** =======================
 * TYPE GUARDS
 * ======================= */

export function isValidationApiError(
  error: unknown,
): error is ValidationApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as any).error === "VALIDATION_ERROR" &&
    Array.isArray((error as any).issues)
  );
}
