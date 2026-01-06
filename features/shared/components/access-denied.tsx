import { Ban } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AccessDenied({
  errorName,
  message,
}: {
  errorName: string;
  message?: string | null;
}) {
  const t = useTranslations();

  return (
    <div className="h-[75vh] w-full flex flex-col items-center justify-center text-3xl gap-6 text-destructive">
      {errorName === "APIError" ? (
        <div className="flex items-center gap-4">
          <Ban /> <p>{t("Errors.access-denied")}</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Ban />
          <p>{message || t("Errors.something-went-wrong")}</p>
        </div>
      )}
    </div>
  );
}
