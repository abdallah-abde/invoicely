"use client";

import { Square, TrendingUp } from "lucide-react";
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
import { TopCustomerProps } from "@/lib/types/chart-types";
import { useSearchParams } from "next/navigation";
import { usDollar, getRangeLabel, capitalize } from "@/lib/utils";

export const description = "A horizontal bar chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TopCustomersChart({ data }: { data: TopCustomerProps[] }) {
  const params = useSearchParams();
  const range = params.get("range");

  const desc = getRangeLabel(range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              // type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => capitalize(value)}
            />
            <YAxis type="number" dataKey="total" />
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
            <Bar dataKey="total" fill="var(--color-primary)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-5">
          Showing top customers for the {desc.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
