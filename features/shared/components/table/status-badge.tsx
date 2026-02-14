import { InvoiceStatus } from "@/features/invoices/invoice.types";
import { useArabic } from "@/hooks/use-arabic";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const paidClr = `bg-[oklch(0.488_0.243_264.376)]`;

  const sentClr = `bg-[oklch(0.696_0.17_162.48)]`;

  const overdueClr = `bg-[oklch(0.769_0.188_70.08)]`;

  const draftClr = `bg-[oklch(0.627_0.265_303.9)]`;

  const canceledClr = `bg-[oklch(0.645_0.246_16.439)]`;

  const partialPaidClr = `bg-[oklch(0.772_0.205_149.54)]`;

  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={cn(
          `text-[8px] xs:text-[10px] border rounded-full p-1.5 px-3.5 w-fit tracking-widest select-none text-primary-foreground `,
          `${
            status === InvoiceStatus.PAID
              ? paidClr //"text-chart-1" // text-purple-400
              : status === InvoiceStatus.SENT
                ? sentClr // text-red-400
                : status === InvoiceStatus.DRAFT
                  ? draftClr // text-sky-400
                  : status === InvoiceStatus.OVERDUE
                    ? overdueClr // text-gray-400
                    : status === InvoiceStatus.CANCELED
                      ? canceledClr // text-red-400
                      : status === InvoiceStatus.PARTIAL_PAID
                        ? partialPaidClr // text-green-400
                        : ""
          }`,
          isArabic ? "text-[11px] xs:text-[13px]" : "",
        )}
      >
        {t(`Labels.${status.toLowerCase()}`)}
      </div>
    </div>
  );
}
