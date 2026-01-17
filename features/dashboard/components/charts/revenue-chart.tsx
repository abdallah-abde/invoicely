"use client";

import { RevenueByDayProps } from "@/features/dashboard/charts.types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Square } from "lucide-react";
import {
  formatCurrencyWithoutSymbols,
  formatCurrency,
} from "@/lib/utils/number.utils";
import { capitalize } from "@/lib/utils/string.utils";
import { getRangeTranslationObjOptions } from "@/features/dashboard/chart.utils";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { useCallback } from "react";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart({
  data,
  isFetching,
}: {
  data: RevenueByDayProps[];
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

  const xAxisTickFormatter = useCallback(
    (value: string) => {
      const date = new Date(value);

      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };

      return date.toLocaleString(isArabic ? "ar-SY" : "en-US", options);
    },
    [isArabic]
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
            <div className="text-muted-foreground">{t(`Labels.${name}`)}</div>
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

  const labelFormatter = useCallback(
    (label: string, payload: any) => (
      <>
        {new Date(label).toLocaleString(isArabic ? "ar-SY" : "en-US", {
          month: "long",
          day: "2-digit",
        })}
      </>
    ),
    [isArabic]
  );

  const yAxisTickFormatter = useCallback(
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
        <CardTitle>{t("charts.revenue-by-date")}</CardTitle>
        <CardDescription>{capitalize(desc)}</CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("charts.no-revenue-data")}
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              aria-label="Revenue by day"
              data={data}
              margin={{
                left: isArabic ? 30 : 5,
                right: isArabic ? 5 : 24,
                top: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="date"
                interval={range === LAST_7_DAYS_VALUE ? 0 : 1}
                angle={isArabic ? 0 : -20}
                textAnchor="end"
                height={60}
                minTickGap={0}
                tickLine={true}
                axisLine={true}
                reversed={isArabic}
                tickMargin={16}
                tickFormatter={xAxisTickFormatter}
              />
              <YAxis
                orientation={isArabic ? "right" : "left"}
                tickLine={true}
                axisLine
                tickMargin={5}
                tick={{
                  textAnchor: "end",
                }}
                tickFormatter={yAxisTickFormatter}
              />
              <ChartTooltip
                cursor={false}
                contentStyle={{
                  textAlign: isArabic ? "right" : "left",
                }}
                content={
                  <ChartTooltipContent labelFormatter={labelFormatter} />
                }
                formatter={tooltipFormatter}
              />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{
                  fill: "var(--chart-2)",
                }}
                activeDot={{
                  r: 6,
                }}
                isAnimationActive={!isFetching}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="text-muted-foreground leading-none">
          {t("charts.revenue-by-date-footer")} {desc}
        </div>
      </CardFooter>
    </Card>
  );
}
