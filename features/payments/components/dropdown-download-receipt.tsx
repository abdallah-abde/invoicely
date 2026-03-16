import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export default function DropdownDownloadReceipt({
  paymentId,
}: {
  paymentId: string;
}) {
  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link
          href={`/api/payments/${paymentId}/pdf/${isArabic ? "ar" : "en"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs xs:text-sm text-primary"
        >
          {t("payments.download-receipt")}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
