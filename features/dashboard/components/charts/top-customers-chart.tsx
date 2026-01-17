"use client";

import { Square } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { TopCustomerProps } from "@/features/dashboard/charts.types";
import { useSearchParams } from "next/navigation";
import {
  formatCurrencyWithoutSymbols,
  formatCurrency,
} from "@/lib/utils/number.utils";
import { capitalize } from "@/lib/utils/string.utils";
import { getRangeTranslationObjOptions } from "@/features/dashboard/chart.utils";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { useCallback } from "react";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TopCustomersChart({
  data,
  isFetching,
}: {
  data: TopCustomerProps[];
  isFetching: boolean;
}) {
  const params = useSearchParams();
  const range = params.get("range");

  const t = useTranslations();
  const isArabic = useArabic();

  const desc = t(
    "Labels.last-days",
    getRangeTranslationObjOptions(range, isArabic)
  );

  const tooltipFormatter = useCallback(
    (value: number, name: string) => {
      return (
        <div className="w-full flex gap-4 items-center justify-between">
          <div className="text-xs flex items-center gap-2">
            <div>
              <Square
                size={10}
                className="p-0 m-0 rounded-[2px]"
                style={{
                  backgroundColor: "var(--chart-3)",
                  color: "var(--chart-3)",
                }}
              />
            </div>
            <div className="text-muted-foreground">{t(`charts.${name}`)}</div>
          </div>
          <div className="font-semibold">
            {formatCurrency({
              isArabic,
              value,
            })}
          </div>
        </div>
      );
    },
    [isArabic, t]
  );

  const tickFormatter = useCallback(
    (value: number) =>
      formatCurrencyWithoutSymbols({
        isArabic,
        value,
      }),
    [isArabic]
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("charts.top-customers")}</CardTitle>
        <CardDescription>{capitalize(desc)}</CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("charts.no-top-customers")}
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              aria-label="Top customers revenue"
              data={data}
              margin={{ right: 25, left: 25 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                angle={isArabic ? 0 : -20}
                textAnchor="end"
                height={60}
                tickLine={true}
                axisLine={true}
                reversed={isArabic}
                tickMargin={16}
                tickFormatter={(value: string) => capitalize(value)}
              />
              <YAxis
                dataKey="total"
                type="number"
                orientation={isArabic ? "right" : "left"}
                tickLine={true}
                axisLine
                tickMargin={5}
                tick={{
                  textAnchor: "end",
                }}
                tickFormatter={tickFormatter}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                formatter={tooltipFormatter}
              />
              <Bar
                dataKey="total"
                fill="var(--chart-2)"
                radius={8}
                isAnimationActive={!isFetching}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="text-muted-foreground leading-5">
          {t("charts.top-customers-footer")} {desc.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
