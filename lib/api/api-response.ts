import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ValidationApiError } from "./api-error";

/** =======================
 * ERROR RESPONSES
 * ======================= */

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      error: "VALIDATION_ERROR",
      issues: error.issues,
    } satisfies ValidationApiError,
    { status: 400 },
  );
}

export function badRequest(message: string) {
  return NextResponse.json(
    {
      error: "BAD_REQUEST",
      message,
    },
    { status: 400 },
  );
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ error: "NOT_FOUND", message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json(
    {
      error: "SERVER_ERROR",
      message,
    },
    { status: 500 },
  );
}
