"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/features/payments/schemas/payment.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { PaymentType } from "@/features/payments/payment.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Invoice, Payment } from "@/app/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getPaymentMethodList, syPound, usDollar } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { useArabic } from "@/hooks/use-arabic";

export type SelectedItem = {
  invoice: Invoice;
};

export default function PaymentForm({
  setIsOpen,
  payment,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  payment?: PaymentType | undefined;
  mode: "create" | "edit";
}) {
  const { createPayment, updatePayment, isLoading } = usePayments();
  const router = useRouter();

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const methodList = getPaymentMethodList();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: [
        {
          label: payment?.invoice.number || undefined,
          value: payment?.invoiceId || undefined,
          disable: false,
        },
      ],
      amount: payment?.amountAsNumber.toString() || "",
      date: payment?.date || new Date(),
      method: payment?.method || undefined,
      notes: payment?.notes || "",
    },
  });

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    if (mode === "create") {
      const hasCreatePermission = await hasPermission({
        resource: "payment",
        permission: ["create"],
      });

      if (hasCreatePermission) {
        createPayment.mutate(values, {
          onSuccess: () => {
            form.reset();
            router.refresh();
            setIsOpen(false);
            toast.success(t("payments.messages.success.add"));
          },
        });
      } else {
        toast.error(t("payments.messages.error.add"));
      }
    } else {
      if (payment) {
        const hasUpdatePermission = await hasPermission({
          resource: "payment",
          permission: ["update"],
        });

        if (hasUpdatePermission) {
          updatePayment.mutate(
            { id: payment?.id, data: values },
            {
              onSuccess: () => {
                form.reset();
                router.refresh();
                toast.success(t("payments.messages.success.edit"));
                setIsOpen(false);
              },
            }
          );
        } else {
          toast.error(t("payments.messages.error.edit"));
        }
      }
    }
  }

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    mode === "edit"
      ? [
          {
            label: payment?.invoice.number || "",
            value: payment?.invoiceId || "",
          },
        ]
      : []
  );
  const [options, setOptions] = useState<Option[]>();
  const [isTriggered, setIsTriggered] = useState(false);
  const [prevPayments, setPrevPayments] = useState<number | null>(null);
  const [invoiceTotal, setInvoiceTotal] = useState<number | null>(null);
  const [isNumbersLoading, setIsNumbersLoading] = useState(false);

  const invoiceId = form.watch("invoiceId");

  useEffect(() => {
    let mounted = true;
    if (!invoiceId) {
      setPrevPayments(null);
      setInvoiceTotal(null);
      return;
    }

    setIsNumbersLoading(true);
    setPrevPayments(null);
    setInvoiceTotal(null);

    (async () => {
      try {
        const [invoiceRes, paymentsRes] = await Promise.all([
          fetch(`/api/invoices/${encodeURIComponent(invoiceId[0].value)}`),
          fetch(
            `/api/payments/invoice/${encodeURIComponent(invoiceId[0].value)}`
          ),
        ]);

        if (!mounted) return;

        if (invoiceRes.ok) {
          const invoiceData = (await invoiceRes.json()) as Invoice;
          setInvoiceTotal(Number(invoiceData.total ?? 0));
        }

        if (paymentsRes.ok) {
          const paymentsData = (await paymentsRes.json()) as Payment[];
          setPrevPayments(
            paymentsData.reduce((acc, item) => Number(item.amount) + acc, 0)
          );
        }
      } catch (e) {
        console.error("Error fetching invoice numbers:", e);
      } finally {
        if (mounted) setIsNumbersLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [invoiceId]);

  useEffect(() => {
    if (mode === "edit" && selectedOptions && selectedOptions.length > 0)
      onselectionchange(selectedOptions);
  }, []);

  const handleSearch = async (value: string) => {
    setIsTriggered(true);
    try {
      const res = await fetch(
        `/api/invoices/search/${encodeURIComponent(value)}`
      );
      if (!res.ok) return [] as Option[];
      const data = (await res.json()) as Option[];
      setOptions(data);
      return data;
    } finally {
      setIsTriggered(false);
    }
  };

  const onselectionchange = async (opts: Option[]) => {
    setIsNumbersLoading(true);
    setPrevPayments(null);
    setInvoiceTotal(null);
    // setSelectedOptions(opts);

    try {
      const [invoice, payments] = await Promise.all([
        await fetch(`/api/invoices/${opts[0].value}`),
        await fetch(`/api/payments/invoice/${opts[0].value}`),
      ]);

      const [invoiceData, paymentsData] = await Promise.all([
        await invoice.json(),
        await payments.json(),
      ]);

      setPrevPayments(
        (paymentsData as Payment[]).reduce(
          (acc, item) => Number(item.amount) + acc,
          0
        )
      );
      setInvoiceTotal(Number((invoiceData as Invoice).total));
    } catch (error) {
      console.log(error);
    } finally {
      setIsNumbersLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[75vh] px-4" dir={dir}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid">
          <FormField
            control={form.control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Fields.invoicenumber.label")}</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    className="w-full"
                    value={selectedOptions}
                    options={options}
                    hidePlaceholderWhenSelected
                    hideClearAllButton
                    disabled={mode === "edit"}
                    onSearch={async (value) => {
                      return await handleSearch(value);
                    }}
                    placeholder={t("Fields.invoicenumber.select")}
                    loadingIndicator={
                      <p className="w-full flex items-center gap-2 p-2 text-center text-lg leading-10 text-muted-foreground">
                        <Loader className="animate-spin ms-auto" />{" "}
                        <span className="me-auto">
                          {t("Fields.invoicenumber.loading")}
                        </span>
                      </p>
                    }
                    emptyIndicator={
                      <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                        {t("Labels.no-results")}
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Fields.notes.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none h-20"
                    placeholder={t("Fields.notes.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Fields.method.label")}</FormLabel>
                <Select
                  dir={dir}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Fields.method.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {methodList.map((item) => (
                      <SelectItem key={item} value={item}>
                        {t(`Labels.${item.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!prevPayments || !!invoiceTotal ? (
            <div className="flex items-center justify-between text-sm border p-2 rounded-md">
              <p className="text-center">
                {t("Labels.total")}
                <Badge
                  variant="secondary"
                  className="text-[15px] ms-1 bg-primary"
                >
                  {isArabic
                    ? syPound.format(invoiceTotal ?? 0)
                    : usDollar.format(invoiceTotal ?? 0)}
                </Badge>
              </p>
              <p className="text-center">
                {t("Labels.rest")}
                <Badge variant="destructive" className="text-[15px] ms-1">
                  {isArabic
                    ? syPound.format((invoiceTotal ?? 0) - (prevPayments ?? 0))
                    : usDollar.format(
                        (invoiceTotal ?? 0) - (prevPayments ?? 0)
                      )}
                </Badge>
              </p>
            </div>
          ) : isNumbersLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" />
              <span className="animate-pulse">
                {t("Labels.loading-total-rest")}
              </span>
            </div>
          ) : null}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("Fields.amount.label", {
                    currency: isArabic ? "ل.س." : "$",
                  })}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={10}
                    placeholder={t("Fields.amount.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Fields.invoicedate.label")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full ps-3 text-start font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t("Fields.invoicedate.pick")}</span>
                        )}
                        <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? new Date(field.value) : new Date()
                      }
                      onSelect={field.onChange}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading || isTriggered || isNumbersLoading}
            size="lg"
            className="w-fit cursor-pointer ms-auto"
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <>{t("Labels.save")}</>
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
