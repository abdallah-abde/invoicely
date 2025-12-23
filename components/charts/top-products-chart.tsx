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
import { TopProductProps } from "@/lib/chart-types";
import { useSearchParams } from "next/navigation";
import { capitalize, getRangeLabel, usDollar } from "@/lib/helper";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TopProductsChart({ data }: { data: TopProductProps[] }) {
  const params = useSearchParams();
  const range = params.get("range");

  const desc = getRangeLabel(range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => capitalize(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  labelClassName="capitalize"
                  formatter={(value, name) => {
                    const valueInDollar =
                      name === "total" || name === "price"
                        ? usDollar.format(Number(value))
                        : value;

                    return (
                      <div className="w-full flex gap-1 items-center justify-between">
                        <div className="text-xs flex items-center gap-1">
                          <div>
                            <GripVertical
                              size={10}
                              className={cn(
                                "p-0 m-0",
                                name === "total" ? `text-chart-1` : "",
                                name === "price" ? `text-chart-2` : "",
                                name === "quantity" ? `text-chart-3` : ""
                              )}
                            />
                          </div>
                          <div className="text-muted-foreground">
                            {capitalize(name as string)}
                          </div>
                        </div>
                        <div className="font-semibold">{valueInDollar}</div>
                      </div>
                    );
                  }}
                />
              }
            />

            <Bar dataKey="total" fill="var(--chart-1)" radius={4} />
            <Bar dataKey="price" fill="var(--chart-2)" radius={4} />
            <Bar dataKey="quantity" fill="var(--chart-3)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-5">
          Showing top products for the {desc.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
