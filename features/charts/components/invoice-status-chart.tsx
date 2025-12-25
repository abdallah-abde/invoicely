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
import { InvoiceByStatusProps } from "@/features/charts/charts.types";
import { useSearchParams } from "next/navigation";
import { getRangeLabel } from "@/lib/utils";
import { InvoiceStatus } from "@/app/generated/prisma/enums";

const chartConfig = {
  count: {
    label: "Count",
  },
  draft: {
    label: "Draft",
    color: "var(--chart-1)",
  },
  sent: {
    label: "Sent",
    color: "var(--chart-2)",
  },
  paid: {
    label: "Paid",
    color: "var(--chart-3)",
  },
  overdue: {
    label: "Overdue",
    color: "var(--chart-4)",
  },
  canceled: {
    label: "Canceled",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function InvoiceStatusChart({ data }: { data: InvoiceByStatusProps[] }) {
  const totalInvoices = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  const dataAfter = data.map((d) => ({
    ...d,
    fill:
      d.status === InvoiceStatus.DRAFT
        ? "var(--chart-1)"
        : d.status === InvoiceStatus.SENT
          ? "var(--chart-2)"
          : d.status === InvoiceStatus.PAID
            ? "var(--chart-3)"
            : d.status === InvoiceStatus.OVERDUE
              ? "var(--chart-4)"
              : "var(--chart-5)",
  }));

  const params = useSearchParams();
  const range = params.get("range");

  const desc = getRangeLabel(range);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Invoices by status</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dataAfter}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
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
                          {totalInvoices.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Invoices
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-5">
          Showing invoices count by status for the {desc.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
