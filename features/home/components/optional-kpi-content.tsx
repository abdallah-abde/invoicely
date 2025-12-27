"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";

import CountUp from "react-countup";

import { DollarSign, Users, Package, LucideIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usDollar } from "@/lib/utils";
import { useRef } from "react";

interface OptionalKPIProps {
  data: {
    revenue: number;
    revenueDelta: number | null;
    customers: number;
    customersDelta: number | null;
    topProduct: { productId: string; quantity: number } | null;
  };
}

interface KPIProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: number | null;
  tooltip: string;
  isCurrency?: boolean;
}

export default function OptionalKPIContent({ data }: OptionalKPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <KPI
        icon={DollarSign}
        label="Total Revenue (This Month)"
        value={data.revenue}
        prefix="$"
        delta={data.revenueDelta}
        tooltip="Total value of paid invoices generated during the current month."
        isCurrency={true}
      />

      <KPI
        icon={Users}
        label="New Customers (This Month)"
        value={data.customers}
        delta={data.customersDelta}
        tooltip="Number of customers added to your system during the current month."
      />

      <KPI
        icon={Package}
        label="Top Product"
        value={data.topProduct ? data.topProduct.quantity : 0}
        suffix=" sold"
        tooltip="Product with the highest number of units sold this month."
      />
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  prefix,
  suffix,
  delta,
  tooltip,
  isCurrency = false,
}: KPIProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px", // triggers slightly before fully visible
  });

  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative select-none
        rounded-xl border
        bg-background
        p-6 text-center
        transition
        duration-500
        hover:-translate-y-2
        hover:shadow-md
        dark:hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
        dark:border-muted-foreground/10"
    >
      <div
        className="
          pointer-events-none absolute inset-0 rounded-xl
          opacity-100 group-hover:opacity-50
          transition
          duration-500
          bg-linear-to-br
          from-chart-1/10 via-chart-5/10 to-transparent
          dark:from-chart-1/15 dark:via-chart-5/15"
      />
      <div className="relative z-10">
        {/* Icon */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 cursor-help">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-[250px]  text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>

        {/* Label */}
        <p className="text-sm text-muted-foreground">{label}</p>

        {/* Value */}
        <p className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
          {isInView ? (
            <CountUp
              end={value}
              duration={reduceMotion ? 0 : 1.2}
              separator=","
              prefix={prefix}
              suffix={suffix}
              formattingFn={(n) =>
                isCurrency ? usDollar.format(n) : n.toString()
              }
              startOnMount={false}
            />
          ) : (
            // prevents layout shift before animation
            <span>
              {prefix}0{suffix}
            </span>
          )}
        </p>

        {/* Delta */}
        {delta && (
          <p
            className={`mt-1 text-xs font-medium ${
              delta >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}% vs last month
          </p>
        )}
      </div>
    </motion.div>
  );
}
