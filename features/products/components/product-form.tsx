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
import { productSchema } from "@/features/products/schemas/product.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/features/products/hooks/use-products";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { ProductType } from "@/features/products/product.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useArabic } from "@/hooks/use-arabic";
import { useDirection } from "@/hooks/use-direction";

export default function ProductForm({
  setIsOpen,
  product,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product?: ProductType | undefined;
  mode: "create" | "edit";
}) {
  const { createProduct, updateProduct, isLoading } = useProducts();
  const router = useRouter();

  const t = useTranslations();
  const dir = useDirection();
  const isArabic = useArabic();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      unit: product?.unit || "",
      price: product?.priceAsNumber.toString() || "",
    },
  });

  async function onSubmit(values: z.infer<typeof productSchema>) {
    if (mode === "create") {
      const hasCreatePermission = await hasPermission({
        resource: "product",
        permission: ["create"],
      });

      if (hasCreatePermission) {
        createProduct.mutate(values, {
          onSuccess: () => {
            form.reset();
            router.refresh();
            setIsOpen(false);
            toast.success(t("products.messages.success.add"));
          },
        });
      } else {
        toast.error(t("products.messages.error.add"));
      }
    } else {
      if (product) {
        const hasUpdatePermission = await hasPermission({
          resource: "product",
          permission: ["update"],
        });

        if (hasUpdatePermission) {
          updateProduct.mutate(
            { id: product?.id, data: values },
            {
              onSuccess: () => {
                form.reset();
                router.refresh();
                toast.success(t("products.messages.success.edit"));
                setIsOpen(false);
              },
            }
          );
        } else {
          toast.error(t("products.messages.error.edit"));
        }
      }
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
                <FormLabel>{t("Fields.name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.name.placeholder")}
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
                <FormLabel>{t("Fields.description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none h-20"
                    placeholder={t("Fields.description.placeholder")}
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
                <FormLabel>{t("Fields.unit.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.unit.placeholder")}
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
                <FormLabel>
                  {t("Fields.price.label", {
                    currency: isArabic ? "ل.س." : "$",
                  })}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={10}
                    placeholder={t("Fields.price.placeholder", {
                      product: isArabic ? "المنتج" : "product",
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
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
