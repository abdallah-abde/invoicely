"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  invoiceCreateSchema,
  invoiceDraftUpdateSchema,
  invoiceUpdateSchema,
} from "@/features/invoices/schemas/invoice.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  InvoiceCategory,
  InvoiceDraftUpdateInput,
  InvoiceEditPolicy,
  InvoiceFormProduct,
  InvoiceFormValues,
  InvoiceLockedUpdateInput,
  InvoiceStatus,
  InvoiceType,
} from "@/features/invoices/invoice.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { localizeArabicCurrencySymbol } from "@/lib/utils/number.utils";
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
import { type Customer } from "@/app/generated/prisma/client";
import InvoiceProductForm from "@/features/invoices/components/invoice-product-form";
import { authClient } from "@/features/auth/lib/auth-client";
import { FormDateFieldPopOver } from "@/features/shared/components/form/form-date-field-popover";
import { PaymentMethod } from "@/features/payments/payment.types";
import { OperationMode } from "@/features/shared/shared.types";
import { getInvoiceEditPolicy } from "@/features/invoices/lib/get-invoice-edit-policy";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { parseApiError } from "@/lib/api/parse-api-error";
import { formatDates } from "@/lib/utils/date.utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function InvoiceForm({
  setIsOpen,
  invoice,
  mode,
  customers,
  customersIsLoading,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  invoice?: InvoiceType | undefined;
  mode: OperationMode;
  customers: Customer[];
  customersIsLoading: boolean;
}) {
  const policy = getInvoiceEditPolicy(invoice);
  const canEdit = (field: keyof InvoiceEditPolicy) => policy[field];

  const isOperationCreate = mode === OperationMode.CREATE;
  const [checkingPermission, setCheckingPermission] = useState(false);
  const { createInvoice, updateInvoice, isCreating, isUpdating } = useInvoices(
    InvoiceCategory.WORKING,
  );

  const isSubmitting = checkingPermission || isCreating || isUpdating;

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const { data: session } = authClient.useSession();

  const schema =
    mode === OperationMode.CREATE || invoice?.status === InvoiceStatus.DRAFT
      ? invoiceCreateSchema
      : invoiceUpdateSchema;

  const form = useForm<InvoiceFormValues>({
    resolver: useIntlZodResolver(schema),
    defaultValues: {
      notes: invoice?.notes || "",
      customerId: invoice?.customerId || "",
      createdById: invoice?.createdById || session?.user.id,
      issuedAt: invoice?.issuedAt || undefined,
      dueAt: invoice?.dueAt ? new Date(invoice?.dueAt) : undefined,
      total: invoice?.totalAsNumber.toString() || "",
      status: invoice?.status || InvoiceStatus.DRAFT,
      paidAmount: isOperationCreate ? "0" : undefined,
      paymentMethod: isOperationCreate ? PaymentMethod.CASH : undefined,
      products: invoice?.products || [],
    },
  });

  const status = form.watch("status");

  useEffect(() => {
    if (status !== InvoiceStatus.PAID) {
      form.setValue("paidAmount", isOperationCreate ? "0" : undefined, {
        shouldDirty: true,
      });
      form.setValue(
        "paymentMethod",
        isOperationCreate ? PaymentMethod.CASH : undefined,
        { shouldDirty: true },
      );
    }
    if (status === InvoiceStatus.DRAFT) {
      form.setValue("dueAt", undefined, {
        shouldDirty: true,
      });
    }
  }, [status, form]);

  const total = form.watch("total");

  useEffect(() => {
    if (status === InvoiceStatus.PAID) {
      form.setValue("paidAmount", isOperationCreate ? "0" : undefined);
    }
  }, [total, status]);

  useEffect(() => {
    if (session?.user.id && !invoice) {
      form.setValue("createdById", session.user.id);
    }
  }, [session, invoice, form]);

  async function onSubmit(values: InvoiceFormValues) {
    try {
      setCheckingPermission(true);
      const allowed = await hasPermission({
        resource: "invoice",
        permission: [
          isOperationCreate ? OperationMode.CREATE : OperationMode.UPDATE,
        ],
      });

      if (!allowed) {
        toast.error(
          t(
            isOperationCreate
              ? "invoices.messages.error.add"
              : "invoices.messages.error.edit",
          ),
        );
        return;
      }

      const paid = Number(values.paidAmount ?? 0);

      const fullPayload: InvoiceDraftUpdateInput = {
        ...values,
        total: Number(values.total),
        paymentMethod: values.paymentMethod as PaymentMethod | undefined,
        issuedAt:
          mode === OperationMode.CREATE
            ? status === InvoiceStatus.DRAFT
              ? undefined
              : new Date()
            : values.issuedAt,
        status,
        paidAmount: paid > 0 ? paid : undefined,
        products: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: it.price,
          totalPrice: it.price * it.quantity,
        })),
      };

      const lockedPayload: InvoiceLockedUpdateInput = {
        notes: values.notes,
      };

      if (isOperationCreate) {
        await createInvoice.mutateAsync(fullPayload);
        toast.success(t("invoices.messages.success.add"));
      } else {
        if (!invoice) return;

        const isDraft = invoice.status === InvoiceStatus.DRAFT;
        await updateInvoice.mutateAsync({
          id: invoice.id,
          data: isDraft ? fullPayload : lockedPayload,
          isDraft,
        });

        toast.success(t("invoices.messages.success.edit"));
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

  const [items, setItems] = useState<InvoiceFormProduct[]>(() => {
    if (invoice && Array.isArray(invoice.products)) {
      return invoice.products.map((p: any) => {
        if (p.product) {
          return {
            product: p.product,
            price: Number(p.unitPrice ?? p.product.price ?? 0),
            quantity: Number(p.quantity ?? 1),
            unit: p.product.unit,
          } as InvoiceFormProduct;
        }

        if (p.productId) {
          return {
            product: { id: p.productId, name: p.name ?? "" } as any,
            price: Number(p.unitPrice ?? p.price ?? 0),
            quantity: Number(p.quantity ?? 1),
            unit: p.product.unit,
          } as InvoiceFormProduct;
        }

        return {
          product: {
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.unitPrice ?? p.price ?? 0,
            unit: p.unit,
          } as any,
          price: Number(p.unitPrice ?? p.price ?? 0),
          quantity: Number(p.quantity ?? 1),
        } as InvoiceFormProduct;
      });
    }
    return [];
  });

  useEffect(() => {
    const total = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.quantity),
      0,
    );

    form.setValue("total", String(total));

    form.setValue(
      "products",
      items.map((it) => {
        return {
          productId: it.product.id,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: it.price,
          totalPrice: Number(it.price) * Number(it.quantity),
        };
      }),
      {
        shouldDirty: true,
      },
    );
  }, [items, form]);

  const methodList = getPaymentMethodList();

  return (
    <ScrollArea className="h-[75vh] px-4" dir={dir}>
      {!isOperationCreate && (
        <>
          {" "}
          <Badge
            className={cn("absolute -top-11", isArabic ? "left-5" : "right-5")}
          >
            {invoice?.status
              ? t(`Labels.${invoice?.status.toLowerCase()}`)
              : ""}
          </Badge>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center justify-start p-2 rounded-2xl gap-4 text-lg border-2 border-primary/50 w-fit">
              <Badge
                variant="default"
                className="m-0 text-xs p-2 px-3 bg-primary/50"
              >
                {t("Fields.invoicenumber.label")}
              </Badge>
              <p className="text-primary text-sm">{invoice?.number}</p>
            </div>
            <div className="flex items-center justify-start p-2 rounded-2xl gap-4 text-lg border-2 border-primary/50 w-fit">
              <Badge
                variant="default"
                className="m-0 text-xs p-2 px-3 bg-primary/50"
              >
                {t("Fields.issuedat.label")}
              </Badge>
              <p className="text-primary text-sm">
                {invoice?.issuedAt
                  ? formatDates({ isArabic, value: invoice?.issuedAt })
                  : t("Labels.not-exist")}
              </p>
            </div>
            <div className="flex items-center justify-start p-2 rounded-2xl gap-4 text-lg border-2 border-primary/50 w-fit">
              <Badge
                variant="default"
                className="m-0 text-xs p-2 px-3 bg-primary/50"
              >
                {t("Fields.dueat.label")}
              </Badge>
              <p className="text-primary text-sm">
                {invoice?.dueAt
                  ? formatDates({ isArabic, value: invoice?.dueAt })
                  : t("Labels.not-exist")}
              </p>
            </div>
          </div>
        </>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid">
          <FormField
            control={form.control}
            name="products"
            render={() => <></>}
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
                    disabled={isSubmitting || !canEdit("notes")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-between gap-4">
            {!customersIsLoading ? (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <CustomFormLabel
                      label={t("Fields.customer.label")}
                      isRequired={true}
                    />
                    <Select
                      dir={dir}
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || !canEdit("customerId")}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("Fields.customer.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <Loader className="animate-spin" />
            )}

            {!isOperationCreate && (
              <div className="flex flex-col justify-start gap-[3px] w-full">
                <p className="font-medium text-sm">
                  {t("Fields.createdby.label")}
                </p>
                <p className="bg-primary/50 rounded-sm text-primary-foreground flex items-center p-3 py-[7px] w-full text-sm select-none">
                  {invoice?.createdBy?.name}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <CustomFormLabel
              label={t("products.label")}
              isRequired={true}
              className={cn(
                form.control.getFieldState("products").error
                  ? "text-destructive"
                  : "",
              )}
            />
            <InvoiceProductForm
              initialItems={items}
              onChange={setItems}
              disabled={!canEdit("products")}
              error={form.control.getFieldState("products").error}
            />
          </div>
          <div className="w-full flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem className="w-full">
                  <CustomFormLabel
                    label={t("Fields.total.label", {
                      currency: localizeArabicCurrencySymbol(isArabic),
                    })}
                  />
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      placeholder={t("Fields.total.placeholder")}
                      disabled
                      className={cn(
                        !isOperationCreate && status !== InvoiceStatus.DRAFT
                          ? "w-full"
                          : "w-1/2",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isOperationCreate && status !== InvoiceStatus.DRAFT && (
              <>
                <div className="flex flex-col justify-start gap-[3px] w-full">
                  <p className="font-medium text-sm">
                    {t("Fields.rest.label", {
                      currency: localizeArabicCurrencySymbol(isArabic),
                    })}
                  </p>
                  <p className="bg-primary/50 rounded-sm text-primary-foreground flex items-center p-3 py-[7px] w-full text-sm select-none">
                    {invoice?.rest}
                  </p>
                </div>
                <div className="flex flex-col justify-start gap-[3px] w-full">
                  <p className="font-medium text-sm">
                    {t("Fields.paidamount.label", {
                      currency: localizeArabicCurrencySymbol(isArabic),
                    })}
                  </p>
                  <p className="bg-primary/50 rounded-sm text-primary-foreground flex items-center p-3 py-[7px] w-full text-sm select-none">
                    {invoice?.paidAmount}
                  </p>
                </div>
              </>
            )}
          </div>
          {!isOperationCreate && status !== InvoiceStatus.DRAFT && (
            <div className="flex flex-col justify-start gap-[3px] w-full">
              <p className="font-medium text-sm">
                {t("Fields.paymentscount.label")}
              </p>
              <Badge className="bg-primary/50 p-4 py-[7px] text-sm select-none">
                {invoice?._count.Payments}
              </Badge>
            </div>
          )}
          {isOperationCreate && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel
                    label={t("Fields.status.label")}
                    isRequired={true}
                  />
                  <RadioGroup
                    value={field.value}
                    className="w-fit flex"
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={"DRAFT"} id="DRAFT" />
                      <Label htmlFor="DRAFT">DRAFT</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="SENT" id="SENT" />
                      <Label htmlFor="SENT">SENT</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="PAID" id="PAID" />
                      <Label htmlFor="PAID">PAID</Label>
                    </div>
                  </RadioGroup>{" "}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isOperationCreate && status !== InvoiceStatus.DRAFT && (
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
                    disabled={isSubmitting || !canEdit("dueAt")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isOperationCreate && status === InvoiceStatus.PAID && (
            <>
              <FormField
                control={form.control}
                name="paidAmount"
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
                        step={0.01}
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel
                      label={t("Fields.method.label")}
                      isRequired={true}
                    />
                    <Select
                      dir={dir}
                      onValueChange={field.onChange}
                      value={field.value}
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
            </>
          )}

          <CustomFormSubmitButton
            isLoading={isSubmitting}
            label={t("Labels.save")}
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
