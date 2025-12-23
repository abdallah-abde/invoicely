"use client";

import { Square, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

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
import { MonthlyRevenueProps } from "@/lib/types/chart-types";
import { useSearchParams } from "next/navigation";
import { usDollar, getRangeLabel, getMonth, capitalize } from "@/lib/utils";

export const description = "A bar chart with negative values";

// const chartData = [
//   { month: "January", visitors: 186 },
//   { month: "February", visitors: 205 },
//   { month: "March", visitors: -207 },
//   { month: "April", visitors: 173 },
//   { month: "May", visitors: -209 },
//   { month: "June", visitors: 214 },
// ]

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

export function MonthlyRevenueChart({ data }: { data: MonthlyRevenueProps[] }) {
  const params = useSearchParams();
  const range = params.get("range");

  const desc = getRangeLabel(range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monathly Revenue</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => getMonth(value.split("-")[1])}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value: string, name: string) => {
                const valueInDollar = usDollar.format(Number(value));
                return (
                  <div className="w-full flex gap-4 items-center justify-between">
                    <div className="text-xs flex items-center gap-2">
                      <div>
                        <Square
                          size={10}
                          className="p-0 m-0 text-(--color-primary) bg-primary rounded-[2px]"
                        />
                      </div>
                      <div className="text-muted-foreground">
                        {capitalize(name)}
                      </div>
                    </div>
                    <div className="font-semibold">{valueInDollar}</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="revenue" fill="var(--color-primary)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-muted-foreground"
                fontSize={12}
                formatter={(value: number) => {
                  return usDollar.format(value);
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-5">
          Showing monthly revenue for one year
        </div>
      </CardFooter>
    </Card>
  );
}
