"use client";

import { Square } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
import { MonthlyRevenueProps } from "@/features/dashboard/charts.types";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils/number.utils";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { useCallback } from "react";

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

export function MonthlyRevenueChart({
  data,
  isFetching,
}: {
  data: MonthlyRevenueProps[];
  isFetching: boolean;
}) {
  const t = useTranslations();
  const isArabic = useArabic();

  const tickFormatter = useCallback(
    (value: string) => {
      const date = new Date(`${value}-01`);

      const options: Intl.DateTimeFormatOptions = {
        month: "short",
      };
      return date.toLocaleString(isArabic ? "ar-SY" : "en-US", options);
    },
    [isArabic]
  );

  const labelFormatter = useCallback(
    (label: string, payload: any) => (
      <>
        {new Date(`${label}-01`).toLocaleString(isArabic ? "ar-SY" : "en-US", {
          month: "long",
        })}
      </>
    ),
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

  const labelListFormatter = useCallback(
    (value: number) => {
      return formatCurrency({
        isArabic,
        value,
      });
    },
    [isArabic]
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("charts.monthly-revenue")}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("charts.no-monthly-revenue")}
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              aria-label="monthly revenue"
              data={data}
              margin={{
                top: 12,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="month"
                interval={0}
                angle={isArabic ? 0 : -20}
                textAnchor="end"
                height={60}
                minTickGap={0}
                tickLine={true}
                axisLine={true}
                reversed={isArabic}
                tickMargin={16}
                tickFormatter={tickFormatter}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent labelFormatter={labelFormatter} />
                }
                formatter={tooltipFormatter}
              />
              <Bar
                dataKey="revenue"
                fill="var(--chart-2)"
                radius={8}
                isAnimationActive={!isFetching}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-muted-foreground"
                  fontSize={12}
                  formatter={labelListFormatter}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-5">
          {t("charts.monthly-revenue-footer")}
        </div>
      </CardFooter>
    </Card>
  );
}
