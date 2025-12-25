"use client";

import { Ban } from "lucide-react";
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

  return (
    <div className="h-[75vh] w-full flex flex-col items-center justify-center text-3xl gap-6 text-destructive">
      {error.name === "APIError" ? (
        <div className="flex items-center gap-4">
          <Ban /> <p>Access Denied</p>
        </div>
      ) : (
        <p>Something went wrong!</p>
      )}
    </div>
  );
}
