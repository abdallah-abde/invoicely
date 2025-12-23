import { BanknoteX, Coins, Contact, HandCoins } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DashboardChartsData } from "@/lib/types/chart-types";
import { usDollar } from "@/lib/utils";

export default function KpiCards({
  totalRevenue,
  paidInvoices,
  overdueInvoices,
  customersCount,
}: Pick<
  DashboardChartsData,
  "totalRevenue" | "paidInvoices" | "overdueInvoices" | "customersCount"
>) {
  const items = [
    {
      title: "Total Revenue",
      value: usDollar.format(totalRevenue),
      Icon: <Coins size="30" />,
    },
    {
      title: "Paid Invoices",
      value: paidInvoices.toString(),
      Icon: <HandCoins size="30" />,
    },
    {
      title: "Overdue Invoices",
      value: overdueInvoices.toString(),
      Icon: <BanknoteX size="30" />,
    },
    {
      title: "Customers",
      value: customersCount.toString(),
      Icon: <Contact size="30" />,
    },
  ];

  return (
    <div className="w-full grid grid-cols-4 items-center justify-between gap-6">
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
      <CardHeader className="flex items-center justify-between text-muted-foreground">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{Icon}</CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-bold text-primary">
        {value}
      </CardContent>
    </Card>
  );
}
