"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { productSchema } from "@/features/products/schemas/product.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/features/products/hooks/use-products";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { ProductType } from "@/features/products/product.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { localizeArabicCurrencySymbol } from "@/lib/utils/number.utils";
import { useIntlZodResolver } from "@/hooks/use-intl-zod-resolver";
import { CustomFormLabel } from "@/features/shared/components/form/custom-form-label";
import { CustomFormSubmitButton } from "@/features/shared/components/form/custom-form-submit-button";
import { useArabic } from "@/hooks/use-arabic";

export default function ProductForm({
  setIsOpen,
  product,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product?: ProductType | undefined;
  mode: "create" | "edit";
}) {
  const [checkingPermission, setCheckingPermission] = useState(false);
  const { createProduct, updateProduct, isCreating, isUpdating } =
    useProducts();

  const isSubmitting = checkingPermission || isCreating || isUpdating;

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: useIntlZodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      unit: product?.unit || "",
      price: product?.priceAsNumber.toString() || "",
    },
  });

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setCheckingPermission(true);

    try {
      const allowed = await hasPermission({
        resource: "product",
        permission: [mode === "create" ? "create" : "update"],
      });

      if (!allowed) {
        toast.error(
          t(
            mode === "create"
              ? "products.messages.error.add"
              : "products.messages.error.edit"
          )
        );
        return;
      }

      if (mode === "create") {
        await createProduct.mutateAsync(values);
        toast.success(t("products.messages.success.add"));
      } else {
        if (product)
          await updateProduct.mutateAsync({ id: product.id, data: values });
        toast.success(t("products.messages.success.edit"));
      }
      form.reset();
      setIsOpen(false);
    } catch {
    } finally {
      setCheckingPermission(false);
    }
  }

  return (
    <ScrollArea className="h-[75vh] px-4" dir={dir}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grid grid-cols-1 gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.name.label")}
                  isRequired={true}
                />
                <FormControl>
                  <Input
                    placeholder={t("Fields.name.placeholder")}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel label={t("Fields.description.label")} />
                <FormControl>
                  <Textarea
                    className="resize-none h-20"
                    placeholder={t("Fields.description.placeholder")}
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
            name="unit"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.unit.label")}
                  isRequired={true}
                />
                <FormControl>
                  <Input
                    placeholder={t("Fields.unit.placeholder")}
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.price.label", {
                    currency: localizeArabicCurrencySymbol(isArabic),
                  })}
                  isRequired={true}
                />
                <FormControl>
                  <Input
                    type="number"
                    step={10}
                    placeholder={t("Fields.price.placeholder")}
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
