import { BanknoteX, Coins, Contact, HandCoins } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DashboardChartsData } from "@/features/dashboard/charts.types";
import { formatCurrency, formatNumbers } from "@/lib/utils/number.utils";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";

export default function KpisCards({
  totalRevenue,
  paidInvoices,
  overdueInvoices,
  customersCount,
}: Pick<
  DashboardChartsData,
  "totalRevenue" | "paidInvoices" | "overdueInvoices" | "customersCount"
>) {
  const t = useTranslations();
  const isArabic = useArabic();

  const items = [
    {
      title: t("charts.total-revenue"),

      value: formatCurrency({
        isArabic,
        value: totalRevenue,
      }),
      Icon: <Coins size="30" />,
    },
    {
      title: t("charts.paid-invoices"),
      value: formatNumbers({
        isArabic,
        value: paidInvoices,
      }),
      Icon: <HandCoins size="30" />,
    },
    {
      title: t("charts.overdue-invoices"),
      value: formatNumbers({
        isArabic,
        value: overdueInvoices,
      }),
      Icon: <BanknoteX size="30" />,
    },
    {
      title: t("charts.customers"),
      value: formatNumbers({
        isArabic,
        value: customersCount,
      }),
      Icon: <Contact size="30" />,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-center justify-center sm:justify-between gap-6">
      {items.map((a) => (
        <CardTemplate
          key={a.title}
          title={a.title}
          value={a.value}
          Icon={a.Icon}
        />
      ))}
    </div>
  );
}

function CardTemplate({
  title,
  Icon,
  value,
}: {
  title: string;
  Icon: React.ReactNode;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between text-muted-foreground w-auto">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{Icon}</CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-bold text-chart-2">
        {value}
      </CardContent>
    </Card>
  );
}
