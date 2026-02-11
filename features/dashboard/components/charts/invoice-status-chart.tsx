"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  InvoiceByStatusProps,
  STATUS_COLOR_MAP,
} from "@/features/dashboard/charts.types";
import { useSearchParams } from "next/navigation";
import { formatNumbers } from "@/lib/utils/number.utils";
import { capitalize } from "@/lib/utils/string.utils";
import { getRangeTranslationObjOptions } from "@/features/dashboard/chart.utils";
import { InvoiceStatus } from "@/app/generated/prisma/enums";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { Square } from "lucide-react";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const chartConfig = {
  count: {
    label: "Count",
  },
  draft: {
    label: "Draft",
    color: STATUS_COLOR_MAP[InvoiceStatus.DRAFT],
  },
  sent: {
    label: "Sent",
    color: STATUS_COLOR_MAP[InvoiceStatus.SENT],
  },
  paid: {
    label: "Paid",
    color: STATUS_COLOR_MAP[InvoiceStatus.PAID],
  },
  overdue: {
    label: "Overdue",
    color: STATUS_COLOR_MAP[InvoiceStatus.OVERDUE],
  },
  canceled: {
    label: "Canceled",
    color: STATUS_COLOR_MAP[InvoiceStatus.CANCELED],
  },
  partial_paid: {
    label: "Partial Paid",
    color: STATUS_COLOR_MAP[InvoiceStatus.PARTIAL_PAID],
  },
} satisfies ChartConfig;

export function InvoiceStatusChart({ data }: { data: InvoiceByStatusProps[] }) {
  const params = useSearchParams();
  const range = params.get("range");

  const t = useTranslations();
  const isArabic = useArabic();

  const desc = t(
    "Labels.last-days",
    getRangeTranslationObjOptions(range, isArabic),
  );

  const totalInvoices = React.useMemo(() => {
    return data.length
      ? data.reduce((acc, curr) => acc + curr._count.status, 0)
      : 0;
  }, [data]);

  const dataAfter = React.useMemo(() => {
    return data.map((d) => ({
      ...d,
      fill: STATUS_COLOR_MAP[d.status as InvoiceStatus],
    }));
  }, [data]);

  const tooltipFormatter = React.useCallback(
    (value: ValueType, name: NameType) => {
      const clrVar = STATUS_COLOR_MAP[name as InvoiceStatus];

      return (
        <div className="w-full flex gap-4 items-center justify-between">
          <div className="text-xs flex items-center gap-2">
            <div>
              <Square
                size={10}
                style={{ backgroundColor: clrVar, color: clrVar }}
                className="rounded-[2px]"
              />
            </div>
            <div className="text-muted-foreground">
              {t(`Labels.${name.toString().toLowerCase()}`)}
            </div>
          </div>
          <div className="font-semibold">
            {formatNumbers({
              isArabic,
              value: Number(value),
            })}
          </div>
        </div>
      );
    },
    [isArabic, t],
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("charts.invoices-by-status")}</CardTitle>
        <CardDescription>{capitalize(desc)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("charts.no-invoices")}
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart aria-label="Invoice status count">
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent hideLabel formatter={tooltipFormatter} />
                }
              />
              <Pie
                data={dataAfter}
                dataKey="_count.status"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                startAngle={isArabic ? -90 : 90}
                endAngle={isArabic ? 270 : 450}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {formatNumbers({
                              isArabic,
                              value: totalInvoices,
                            })}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            {t(`Labels.invoices`)}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="text-muted-foreground leading-5">
          {t("charts.invoices-by-status-footer")} {desc}
        </div>
      </CardFooter>
    </Card>
  );
}
