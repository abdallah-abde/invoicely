"use client";

import { RevenueByDayProps } from "@/features/charts/charts.types";
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
import { getRangeLabel, capitalize, syPound } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: RevenueByDayProps[] }) {
  const params = useSearchParams();
  const range = params.get("range");

  const desc = getRangeLabel(range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by date</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 8,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);

                const options: Intl.DateTimeFormatOptions = {
                  month: "short",
                  day: "numeric",
                };
                return date.toLocaleString("en-US", options);
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value: string, name: string) => {
                const valueInDollar = syPound.format(Number(value));
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
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-primary)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total revenue for the {desc.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
