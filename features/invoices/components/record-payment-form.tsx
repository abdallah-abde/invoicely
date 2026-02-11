"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIntlZodResolver } from "@/hooks/use-intl-zod-resolver";
import z from "zod";
import { recordPaymentSchema } from "@/features/payments/schemas/payment.schema";
import { PaymentMethod } from "@/features/payments/payment.types";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { useArabic } from "@/hooks/use-arabic";
import { getPaymentMethodList } from "@/features/shared/utils/lists.utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomFormLabel } from "@/features/shared/components/form/custom-form-label";
import { Textarea } from "@/components/ui/textarea";
import { useRecordPayments } from "@/features/payments/hooks/use-record-payments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  localizeArabicCurrencySymbol,
} from "@/lib/utils/number.utils";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomFormSubmitButton } from "@/features/shared/components/form/custom-form-submit-button";
import { Invoice, Payment } from "@/app/generated/prisma/client";
import { FormDateFieldPopOver } from "@/features/shared/components/form/form-date-field-popover";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { parseApiError } from "@/lib/api/parse-api-error";

export default function RecordPaymentForm({
  invoice,
  setIsOpen,
}: {
  invoice: InvoiceType;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { createRecordPayment, isCreating } = useRecordPayments();

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const methodList = getPaymentMethodList();

  const [prevPayments, setPrevPayments] = useState<number | null>(null);
  const [invoiceTotal, setInvoiceTotal] = useState<number | null>(null);
  const [isNumbersLoading, setIsNumbersLoading] = useState(false);
  const [isDueAtVisible, setIsDueAtVisible] = useState(false);

  const form = useForm<z.infer<typeof recordPaymentSchema>>({
    resolver: useIntlZodResolver(recordPaymentSchema),
    defaultValues: {
      invoiceId: invoice.id,
      amount: undefined,
      method: PaymentMethod.CASH,
      notes: "",
      dueAt: invoice.dueAt ? new Date(invoice.dueAt) : new Date(),
    },
  });

  useEffect(() => {
    let mounted = true;
    if (!invoice.id) {
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
          fetch(`/api/invoices/${encodeURIComponent(invoice.id)}`),
          fetch(`/api/payments/invoice/${encodeURIComponent(invoice.id)}`),
        ]);

        if (!mounted) return;

        if (invoiceRes.ok) {
          const invoiceData = (await invoiceRes.json()) as Invoice;
          setInvoiceTotal(Number(invoiceData.total ?? 0));
        }

        if (paymentsRes.ok) {
          const paymentsData = (await paymentsRes.json()) as Payment[];
          setPrevPayments(
            paymentsData.reduce((acc, item) => Number(item.amount) + acc, 0),
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
  }, [invoice.id]);

  async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
    try {
      await createRecordPayment.mutateAsync(values);
      toast.success(t("payments.messages.success.add"));

      setIsOpen(false);
      form.reset();
    } catch (err: unknown) {
      const parsed = parseApiError(err, t);

      toast.error(parsed.message);
    }
  }

  const amount = form.watch("amount");
  const dueAt = form.watch("dueAt");
  const rest = Number(invoiceTotal) - Number(prevPayments);

  useEffect(() => {
    if (!invoice.dueAt) {
      form.setValue("dueAt", Number(amount) < rest ? dueAt : undefined, {
        shouldDirty: true,
      });
      setIsDueAtVisible(Number(amount) !== rest);
    }
  }, [amount, form]);

  return (
    <ScrollArea className="h-[75vh] px-4" dir={dir}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid">
          <Input type="hidden" value={invoice.id} />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel label={t("Fields.notes.label")} />
                <FormControl>
                  <Textarea
                    className="resize-none h-20"
                    placeholder={t("Fields.notes.placeholder")}
                    disabled={isCreating}
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
                <CustomFormLabel
                  label={t("Fields.method.label")}
                  isRequired={true}
                />
                <Select
                  dir={dir}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isCreating}
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
                  {formatCurrency({
                    isArabic,
                    value: invoiceTotal ?? 0,
                  })}
                </Badge>
              </p>
              <p className="text-center">
                {t("Labels.rest")}
                <Badge variant="destructive" className="text-[15px] ms-1">
                  {formatCurrency({
                    isArabic,
                    value: (invoiceTotal ?? 0) - (prevPayments ?? 0),
                  })}
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
                <CustomFormLabel
                  label={t("Fields.amount.label", {
                    currency: localizeArabicCurrencySymbol(isArabic),
                  })}
                  isRequired={true}
                />

                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step={10}
                    placeholder={t("Fields.amount.placeholder")}
                    disabled={isCreating}
                    {...field}
                    // {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDueAtVisible && (
            <FormField
              control={form.control}
              name="dueAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <CustomFormLabel
                    label={t("Fields.dueat.label")}
                    isRequired={true}
                  />
                  <FormDateFieldPopOver
                    value={field.value}
                    label="dueat"
                    onChange={field.onChange}
                    disabled={isCreating}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <CustomFormSubmitButton
            isLoading={isCreating}
            label={t("Labels.save")}
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
