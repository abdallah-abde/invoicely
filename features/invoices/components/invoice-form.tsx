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
import { invoiceSchema } from "@/features/invoices/schemas/invoice.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { localizeArabicCurrencySymbol } from "@/lib/utils/number.utils";
import { useIntlZodResolver } from "@/hooks/use-intl-zod-resolver";
import { CustomFormLabel } from "@/features/shared/components/form/custom-form-label";
import { CustomFormSubmitButton } from "@/features/shared/components/form/custom-form-submit-button";
import { useArabic } from "@/hooks/use-arabic";

import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { getInvoiceStatusList } from "@/features/shared/utils/lists.utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/app/generated/prisma/client";
import InvoiceProductForm, {
  SelectedItem,
} from "@/features/invoices/components/invoice-product-form";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/auth/lib/auth-client";
import { FormDateFieldPopOver } from "@/features/shared/components/form/form-date-field-popover";

export default function InvoiceForm({
  setIsOpen,
  invoice,
  mode,
  customers,
  customersIsLoading,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  invoice?: InvoiceType | undefined;
  mode: "create" | "edit";
  customers: Customer[];
  customersIsLoading: boolean;
}) {
  const [checkingPermission, setCheckingPermission] = useState(false);
  const { createInvoice, updateInvoice, isCreating, isUpdating } =
    useInvoices();

  const isSubmitting = checkingPermission || isCreating || isUpdating;

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const { data: session } = authClient.useSession();
  const statusList = getInvoiceStatusList();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: useIntlZodResolver(invoiceSchema),
    defaultValues: {
      number: invoice?.number || "",
      notes: invoice?.notes || "",
      customerId: invoice?.customerId || "",
      createdById: invoice?.createdById || session?.user.id,
      issuedAt: invoice?.issuedAt ? new Date(invoice?.issuedAt) : new Date(),
      dueAt: invoice?.dueAt ? new Date(invoice?.dueAt) : new Date(),
      total: invoice?.totalAsNumber.toString() || "",
      status: invoice?.status || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    setCheckingPermission(true);

    try {
      const payload: any = {
        ...values,
        products: items.map((it) => ({
          productId: (it.product as any).id,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: it.price,
          totalPrice: it.price * it.quantity,
        })),
      };

      const allowed = await hasPermission({
        resource: "invoice",
        permission: [mode === "create" ? "create" : "update"],
      });

      if (!allowed) {
        toast.error(
          t(
            mode === "create"
              ? "invoices.messages.error.add"
              : "invoices.messages.error.edit"
          )
        );
        return;
      }

      if (mode === "create") {
        await createInvoice.mutateAsync(payload);
        toast.success(t("invoices.messages.success.add"));
      } else {
        if (invoice)
          await updateInvoice.mutateAsync({ id: invoice.id, data: payload });
        toast.success(t("invoices.messages.success.edit"));
      }
      form.reset();
      setIsOpen(false);
    } catch {
    } finally {
      setCheckingPermission(false);
    }
  }

  const [items, setItems] = useState<SelectedItem[]>(() => {
    const invAny = invoice as any;
    if (invAny && Array.isArray(invAny.products)) {
      return invAny.products.map((p: any) => {
        if (p.product) {
          return {
            product: p.product,
            price: Number(p.unitPrice ?? p.product.price ?? 0),
            quantity: Number(p.quantity ?? 1),
            unit: p.product.unit,
          } as SelectedItem;
        }

        if (p.productId) {
          return {
            product: { id: p.productId, name: p.name ?? "" } as any,
            price: Number(p.unitPrice ?? p.price ?? 0),
            quantity: Number(p.quantity ?? 1),
            unit: p.product.unit,
          } as SelectedItem;
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
        } as SelectedItem;
      });
    }
    return [];
  });

  useEffect(() => {
    const total = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.quantity),
      0
    );
    form.setValue("total", String(total));
  }, [items, form]);

  return (
    <ScrollArea className="h-[75vh] px-4" dir={dir}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.invoicenumber.label")}
                  isRequired={true}
                />
                <FormControl>
                  <Input
                    placeholder={t("Fields.invoicenumber.placeholder")}
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
            name="issuedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <CustomFormLabel
                  label={t("Fields.issuedat.label")}
                  isRequired={true}
                />
                <FormDateFieldPopOver
                  value={field.value}
                  label="issuedat"
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
                <FormMessage />
              </FormItem>
            )}
          />
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
                  disabled={isSubmitting}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {!customersIsLoading ? (
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel
                    label={t("Fields.customer.label")}
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.status.label")}
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
                        placeholder={t("Fields.status.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusList.map((item) => (
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
          <div className="space-y-1">
            <CustomFormLabel label={t("products.label")} isRequired={true} />
            <Label>{t("products.label")}</Label>
            <InvoiceProductForm initialItems={items} onChange={setItems} />
          </div>
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.total.label", {
                    currency: localizeArabicCurrencySymbol(isArabic),
                  })}
                />

                <FormControl>
                  <Input
                    type="number"
                    step={10}
                    placeholder={t("Fields.total.placeholder")}
                    className="w-1/2"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
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
