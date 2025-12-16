"use client";

import { APIError } from "better-auth";
import { Ban } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[75vh] w-full flex flex-col items-center justify-center text-3xl gap-6 text-destructive">
      {/* <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button> */}
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
