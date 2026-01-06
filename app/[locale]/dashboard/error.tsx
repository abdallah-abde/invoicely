"use client";

import AccessDenied from "@/features/shared/components/access-denied";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <AccessDenied errorName={error.name} />;
}
