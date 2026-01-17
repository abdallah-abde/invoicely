"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { useSearchParams } from "next/navigation";
import { formatNumbers } from "@/lib/utils/number.utils";
import { capitalize } from "@/lib/utils/string.utils";
import { getRangeTranslationObjOptions } from "@/features/dashboard/chart.utils";
import { NewCustomerCountProps } from "@/features/dashboard/charts.types";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { LAST_7_DAYS_VALUE } from "../../charts.constants";
import { Square } from "lucide-react";
import { useCallback } from "react";

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function NewCustomersCountChart({
  data,
  isFetching,
}: {
  data: NewCustomerCountProps[];
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

  const tickFormatter = useCallback(
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
            {formatNumbers({ isArabic, value })}
          </div>
        </div>
      );
    },
    [isArabic, t]
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("charts.new-customers")}</CardTitle>
        <CardDescription>{capitalize(desc)}</CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("charts.no-new-customers")}
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              aria-label="new customers count"
              data={data}
              margin={{
                left: 8,
                right: 8,
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
                tickFormatter={tickFormatter}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent labelFormatter={labelFormatter} />
                }
                formatter={tooltipFormatter}
              />
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCount)"
                fillOpacity={0.4}
                stroke="var(--chart-2)"
                stackId="a"
                isAnimationActive={!isFetching}
              />
            </AreaChart>
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
