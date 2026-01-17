"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { TopProductProps } from "@/features/dashboard/charts.types";
import { useSearchParams } from "next/navigation";
import { GripVertical } from "lucide-react";
import { formatCurrency, formatNumbers } from "@/lib/utils/number.utils";
import { cn } from "@/lib/utils";
import { capitalize } from "@/lib/utils/string.utils";
import { getRangeTranslationObjOptions } from "@/features/dashboard/chart.utils";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { useCallback } from "react";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-2)",
  },
  quantity: {
    label: "Quantity",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function TopProductsChart({
  data,
  isFetching,
}: {
  data: TopProductProps[];
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
    (value: ValueType, name: NameType, item: any, index: any, payload: any) => {
      const unit = payload?.unit ?? "";

      const valueInSYP =
        name === "total"
          ? formatCurrency({
              isArabic,
              value: Number(value),
            })
          : `${formatNumbers({
              isArabic,
              value: Number(value),
            })} (${unit})`;

      return (
        <div className="w-full flex gap-1 items-center justify-between">
          <div className="text-xs flex items-center gap-1">
            <div>
              <GripVertical
                size={10}
                className="p-0 m-0"
                style={{
                  color:
                    name === "total"
                      ? "var(--color-chart-3)"
                      : "var(--color-chart-1)", // quantity
                }}
              />
            </div>
            <div className="text-muted-foreground">{t(`charts.${name}`)}</div>
          </div>
          <div className="font-semibold">{valueInSYP}</div>
        </div>
      );
    },
    [isArabic, t]
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("charts.top-products")}</CardTitle>
        <CardDescription>{capitalize(desc)}</CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("charts.no-top-products")}
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              aria-label="Top products revenue"
              data={data}
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
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dashed"
                    labelClassName="capitalize"
                    formatter={tooltipFormatter}
                  />
                }
              />

              <Bar
                dataKey="total"
                fill="var(--chart-2)"
                radius={4}
                isAnimationActive={!isFetching}
              />
              <Bar
                dataKey="quantity"
                fill="var(--chart-4)"
                radius={4}
                isAnimationActive={!isFetching}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="text-muted-foreground leading-5">
          {t("charts.top-products-footer")} {desc.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
