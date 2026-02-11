"use client";

import { arNumbers, formatNumbers } from "@/lib/utils/number.utils";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  getMonthTranslationKey,
  getWeekTranslationKey,
  mergeDateWithLocalTime,
} from "@/lib/utils/date.utils";

export function FormDateFieldPopOver({
  value,
  onChange,
  label,
  disabled,
}: {
  value: Date | undefined;
  onChange: (...event: any[]) => void;
  label: string;
  disabled: boolean;
}) {
  const t = useTranslations();
  const isArabic = useArabic();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full ps-3 text-start font-normal",
              !value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <>
              {value ? (
                <_FormDateFieldInputLabel
                  isArabic={isArabic}
                  value={value}
                  month={t(`month.${format(value, "MMM").toLowerCase()}`)}
                />
              ) : (
                <span>{t(`Fields.${label}.pick`)}</span>
              )}
            </>
            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => {
            if (!date) return;

            onChange(mergeDateWithLocalTime(date, value));
          }}
          autoFocus
          formatters={
            isArabic
              ? {
                  formatDay: (x) => arNumbers.format(x.getDate()),
                  formatCaption: (x) => {
                    const monthTranslationKey = getMonthTranslationKey(
                      (x.getMonth() + 1).toString(),
                    );

                    return `${t(`month.${monthTranslationKey}`)} ${arNumbers.format(x.getFullYear())}`;
                  },
                  formatWeekdayName: (x) =>
                    t(`week.${getWeekTranslationKey(x.getDay().toString())}`),
                }
              : {}
          }
        />
      </PopoverContent>
    </Popover>
  );
}

function _FormDateFieldInputLabel({
  isArabic,
  value,
  month,
}: {
  isArabic: boolean;
  value: Date;
  month: string;
}) {
  return (
    <>
      {isArabic
        ? `${formatNumbers({
            isArabic,
            value: Number(format(value, "d")),
          })} ${month} ${formatNumbers({
            isArabic,
            value: Number(format(value, "Y")),
          })}`
        : `${format(value, "MMMM")} ${format(value, "do")}, ${formatNumbers({
            isArabic,
            value: Number(format(value, "Y")),
          })}`}
    </>
  );
}
