import { Ban } from "lucide-react";

export default function AccessDenied({
  errorName,
  message,
}: {
  errorName: string;
  message?: string | null;
}) {
  return (
    <div className="h-[75vh] w-full flex flex-col items-center justify-center text-3xl gap-6 text-destructive">
      {errorName === "APIError" ? (
        <div className="flex items-center gap-4">
          <Ban /> <p>Access Denied</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Ban />
          <p>{message || "Something went wrong!"}</p>
        </div>
      )}
    </div>
  );
}
