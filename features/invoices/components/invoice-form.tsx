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
import { invoiceSchema } from "@/features/invoices/schemas/invoice.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInvoices } from "@/features/invoices/hooks/use-invoices";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { InvoiceType } from "@/features/invoices/invoice.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, getInvoiceStatusList } from "@/lib/utils";
import { format } from "date-fns";
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
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { useArabic } from "@/hooks/use-arabic";

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
  const {
    createInvoiceWithRevalidate,
    updateInvoiceWithRevalidate,
    isLoading,
  } = useInvoices();
  const router = useRouter();

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const { data: session } = authClient.useSession();
  const statusList = getInvoiceStatusList();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: invoice?.number || "",
      notes: invoice?.notes || "",
      customerId: invoice?.customerId || "",
      createdById: invoice?.createdById || session?.user.id,
      issuedAt: invoice?.issuedAt || new Date(),
      dueAt: invoice?.dueAt || new Date(),
      total: invoice?.totalAsNumber.toString() || "",
      status: invoice?.status || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
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

    if (mode === "create") {
      const hasCreatePermission = await hasPermission({
        resource: "invoice",
        permission: ["create"],
      });

      if (hasCreatePermission) {
        const promise = createInvoiceWithRevalidate(payload);
        toast.promise(promise, {
          loading: t("invoices.messages.loading.add"),
          success: t("invoices.messages.success.add"),
          error: t("invoices.messages.error.add-failure"),
        });

        try {
          await promise;
          form.reset();
          router.refresh();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      } else {
        toast.error(t("invoices.messages.error.add"));
      }
    } else {
      if (invoice) {
        const hasUpdatePermission = await hasPermission({
          resource: "invoice",
          permission: ["update"],
        });

        if (hasUpdatePermission) {
          const promise = updateInvoiceWithRevalidate({
            id: invoice?.id,
            data: payload,
          });
          toast.promise(promise, {
            loading: t("invoices.messages.loading.edit"),
            success: t("invoices.messages.success.edit"),
            error: t("invoices.messages.error.edit-failure"),
          });

          try {
            await promise;
            form.reset();
            router.refresh();
            setIsOpen(false);
          } catch (err) {}
        } else {
          toast.error(t("invoices.messages.error.edit"));
        }
      }
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
                <FormLabel>{t("Fields.invoicenumber.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.invoicenumber.placeholder")}
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
            name="issuedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Fields.issuedat.label")}</FormLabel>
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
                        <>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("Fields.issuedat.pick")}</span>
                          )}
                        </>
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
          <FormField
            control={form.control}
            name="dueAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Fields.dueat.label")}</FormLabel>
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
                          <span>{t("Fields.dueat.pick")}</span>
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
          {!customersIsLoading ? (
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Fields.customer.label")}</FormLabel>
                  <Select
                    dir={dir}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                <FormLabel>{t("Fields.status.label")}</FormLabel>
                <Select
                  dir={dir}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
            <Label>{t("products.label")}</Label>
            <InvoiceProductForm initialItems={items} onChange={setItems} />
          </div>
          {/* <div className="w-1/2"> */}
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("Fields.total.label", {
                    currency: isArabic ? "ل.س." : "$",
                  })}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    type="number"
                    step={10}
                    placeholder={t("Fields.total.placeholder")}
                    className="w-1/2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </div> */}
          {/* </div> */}

          <Button
            type="submit"
            disabled={isLoading || !customers}
            size="lg"
            className="w-fit cursor-pointer ms-auto "
          >
            {isLoading || !customers ? (
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
