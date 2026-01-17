import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export default function DropdownDownloadInvoice({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link
          href={`/api/invoices/${invoiceId}/pdf/${isArabic ? "ar" : "en"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs xs:text-sm text-primary"
        >
          {t("invoices.download-invoice")}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
