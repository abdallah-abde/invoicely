"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";

import CountUp from "react-countup";

import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatNumbers, formatCurrency } from "@/lib/utils/number.utils";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { Badge } from "@/components/ui/badge";
import { KPIProps, OptionalKPIProps } from "../kpi.types";
import { useRole } from "@/hooks/use-role";
import { USER_ROLE } from "@/features/users/lib/user.constants";
import { authClient } from "@/features/auth/lib/auth-client";

export default function OptionalKPIContent({ data }: OptionalKPIProps) {
  // const t = useTranslations("KPI");
  const { data: session } = authClient.useSession();

  if (!session || !session.user || session.user.role === USER_ROLE) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <KPI
        icon={DollarSign}
        value={data.revenue}
        delta={data.revenueDelta}
        isCurrency={true}
        title="revenue"
      />

      <KPI
        icon={Users}
        value={data.customers}
        delta={data.customersDelta}
        title="customers"
      />

      <KPI
        icon={Package}
        value={data.topProduct ? data.topProduct.quantity : 0}
        suffix=" sold"
        title="products"
      />
    </div>
  );
}

function KPI({
  icon: Icon,
  value,
  prefix,
  suffix,
  delta,
  isCurrency = false,
  title,
}: KPIProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px", // triggers slightly before fully visible
  });

  const reduceMotion = useReducedMotion();

  const t = useTranslations("KPI");
  const isArabic = useArabic();

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
            <p className="max-w-[250px] text-xs">
              {t(`card-${title}.tooltip`)}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Label */}
        <p className="text-sm text-muted-foreground">
          {t(`card-${title}.title`)}
        </p>

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
                isCurrency
                  ? formatCurrency({
                      isArabic,
                      value: n,
                    })
                  : formatNumbers({
                      isArabic,
                      value: n,
                    }).toString()
              }
              startOnMount={false}
            />
          ) : null}
        </p>

        {/* Delta */}
        {delta ? (
          <div className="mt-8 text-sm font-medium flex items-center justify-center gap-2">
            {delta > 0 ? (
              <TrendingUp
                className={cn(
                  "size-4 self-start text-primary",
                  isArabic ? "rotate-y-180" : "",
                )}
              />
            ) : (
              <TrendingDown
                className={cn(
                  "size-4 self-start text-destructive",
                  isArabic ? "rotate-y-180" : "",
                )}
              />
            )}
            <Badge
              variant={delta > 0 ? "default" : "destructive"}
              className="text-sm"
            >
              {`${formatNumbers({
                isArabic,
                value: Math.abs(Number(delta.toFixed(1))),
              })}%`}
            </Badge>
            <span
              className={cn(delta > 0 ? "text-primary" : "text-destructive")}
            >
              {t("vs-last-month")}
            </span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
