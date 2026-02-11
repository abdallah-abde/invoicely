"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { paymentSchema } from "@/features/payments/schemas/payment.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { toast } from "sonner";
import { PaymentType } from "@/features/payments/payment.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import {
  formatCurrency,
  localizeArabicCurrencySymbol,
} from "@/lib/utils/number.utils";
import { useIntlZodResolver } from "@/hooks/use-intl-zod-resolver";
import { CustomFormLabel } from "@/features/shared/components/form/custom-form-label";
import { CustomFormSubmitButton } from "@/features/shared/components/form/custom-form-submit-button";
import { useArabic } from "@/hooks/use-arabic";

import { Loader } from "lucide-react";
import { getPaymentMethodList } from "@/features/shared/utils/lists.utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Invoice, Payment } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { FormDateFieldPopOver } from "@/features/shared/components/form/form-date-field-popover";
import { OperationMode } from "@/features/shared/shared.types";
import { parseApiError } from "@/lib/api/parse-api-error";

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
  mode: OperationMode;
}) {
  const isOperationCreate = mode === OperationMode.CREATE;
  const [checkingPermission, setCheckingPermission] = useState(false);
  const { createPayment, updatePayment, isCreating, isUpdating } =
    usePayments();

  const isSubmitting = checkingPermission || isCreating || isUpdating;

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const methodList = getPaymentMethodList();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: useIntlZodResolver(paymentSchema),
    defaultValues: {
      invoiceId: [
        {
          label: payment?.invoice.number || undefined,
          value: payment?.invoiceId || undefined,
          disable: false,
        },
      ],
      amount: payment?.amountAsNumber.toString() || "",
      date: payment?.date ? new Date(payment?.date) : new Date(),
      method: payment?.method || undefined,
      notes: payment?.notes || "",
    },
  });

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    setCheckingPermission(true);

    try {
      const allowed = await hasPermission({
        resource: "payment",
        permission: [
          isOperationCreate ? OperationMode.CREATE : OperationMode.UPDATE,
        ],
      });

      if (!allowed) {
        toast.error(
          t(
            isOperationCreate
              ? "payments.messages.error.add"
              : "payments.messages.error.edit",
          ),
        );
        return;
      }

      if (isOperationCreate) {
        await createPayment.mutateAsync(values);
        toast.success(t("payments.messages.success.add"));
      } else {
        if (payment)
          await updatePayment.mutateAsync({ id: payment.id, data: values });
        toast.success(t("payments.messages.success.edit"));
      }
      setIsOpen(false);
      form.reset();
    } catch (err: unknown) {
      const parsed = parseApiError(err, t);

      if (parsed.type === "validation") {
        parsed.fields.forEach(({ path, message }) => {
          form.setError(path as any, {
            type: "server",
            message,
          });
        });
        return;
      }

      toast.error(parsed.message);
    } finally {
      setCheckingPermission(false);
    }
  }

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    !isOperationCreate
      ? [
          {
            label: payment?.invoice.number || "",
            value: payment?.invoiceId || "",
          },
        ]
      : [],
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
            `/api/payments/invoice/${encodeURIComponent(invoiceId[0].value)}`,
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
  }, [invoiceId]);

  useEffect(() => {
    if (!isOperationCreate && selectedOptions && selectedOptions.length > 0)
      onselectionchange(selectedOptions);
  }, []);

  const handleSearch = async (value: string) => {
    setIsTriggered(true);
    try {
      const res = await fetch(
        `/api/invoices/search/${encodeURIComponent(value)}`,
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
          0,
        ),
      );
      setInvoiceTotal(Number((invoiceData as Invoice).total));
    } catch (error) {
      console.error(error);
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
                <CustomFormLabel
                  label={t("Fields.invoicenumber.label")}
                  isRequired={true}
                />

                <FormControl>
                  <MultipleSelector
                    {...field}
                    className="w-full"
                    value={selectedOptions}
                    options={options}
                    hidePlaceholderWhenSelected
                    hideClearAllButton
                    disabled={isSubmitting}
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
                <CustomFormLabel label={t("Fields.notes.label")} />
                <FormControl>
                  <Textarea
                    className="resize-none h-20"
                    placeholder={t("Fields.notes.placeholder")}
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                    step={10}
                    placeholder={t("Fields.amount.placeholder")}
                    disabled={isSubmitting}
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
                <CustomFormLabel
                  label={t("Fields.invoicedate.label")}
                  isRequired={true}
                />
                <FormDateFieldPopOver
                  value={field.value}
                  label="date"
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <CustomFormSubmitButton
            isLoading={isSubmitting}
            label={t("Labels.save")}
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
