import { PaymentStatus } from "@/features/payments/payment.types";
import { useArabic } from "@/hooks/use-arabic";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const voidedClr = `bg-[oklch(0.145_0.246_16.439)]`;

  const activeClr = `bg-[oklch(0.396_0.17_162.48)]`;

  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={cn(
          `text-[8px] xs:text-[10px] border rounded-full p-1 px-2.5 w-fit tracking-widest select-none text-primary-foreground `,
          `${status === PaymentStatus.ACTIVE ? activeClr : voidedClr}`,
          isArabic ? "text-[11px] xs:text-[13px]" : "",
        )}
      >
        {t(`Labels.${status.toLowerCase()}`)}
      </div>
    </div>
  );
}
