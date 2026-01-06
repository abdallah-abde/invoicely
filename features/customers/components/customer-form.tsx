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
import { customerSchema } from "@/features/customers/schemas/customer.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import type { Customer } from "@/app/generated/prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";

export default function CustomerForm({
  setIsOpen,
  customer,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  customer?: Customer | undefined;
  mode: "create" | "edit";
}) {
  const { createCustomer, updateCustomer, isLoading } = useCustomers();
  const router = useRouter();

  const t = useTranslations();
  const dir = useDirection();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      companyName: customer?.companyName || "",
      address: customer?.address || "",
      phone: customer?.phone || "",
      taxNumber: customer?.taxNumber || "",
    },
  });

  async function onSubmit(values: z.infer<typeof customerSchema>) {
    if (mode === "create") {
      const hasCreatePermission = await hasPermission({
        resource: "customer",
        permission: ["create"],
      });

      if (hasCreatePermission) {
        createCustomer.mutate(values, {
          onSuccess: () => {
            form.reset();
            router.refresh();
            setIsOpen(false);
            toast.success(t("customers.messages.success.add"));
          },
        });
      } else {
        toast.error(t("customers.messages.error.add"));
      }
    } else {
      if (customer) {
        const hasUpdatePermission = await hasPermission({
          resource: "customer",
          permission: ["update"],
        });

        if (hasUpdatePermission) {
          updateCustomer.mutate(
            { id: customer?.id, data: values },
            {
              onSuccess: () => {
                form.reset();
                router.refresh();
                toast.success(t("customers.messages.success.edit"));
                setIsOpen(false);
              },
            }
          );
        } else {
          toast.error(t("customers.messages.error.edit"));
        }
      }
    }
  }

  return (
    <ScrollArea className="h-[75vh] px-4" dir={dir}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 grid grid-cols-2 gap-2"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Fields.phone.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.phone.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Fields.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("Fields.email.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Fields.address.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder={t("Fields.address.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Fields.company.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.company.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Fields.taxnumber.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.taxnumber.placeholder")}
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
            className="w-fit cursor-pointer ms-auto col-span-2"
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
