"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { customerSchema } from "@/features/customers/schemas/customer.schema";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { CircleQuestionMark } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import type { Customer } from "@/app/generated/prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasPermission } from "@/features/auth/services/access";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIntlZodResolver } from "@/hooks/use-intl-zod-resolver";
import { CustomFormLabel } from "@/features/shared/components/form/custom-form-label";
import { CustomFormSubmitButton } from "@/features/shared/components/form/custom-form-submit-button";
import { OperationMode } from "@/features/shared/shared.types";
import { parseApiError } from "@/lib/api/parse-api-error";

export default function CustomerForm({
  setIsOpen,
  customer,
  mode,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  customer?: Customer | undefined;
  mode: OperationMode;
}) {
  const isOperationCreate = mode === OperationMode.CREATE;

  const [checkingPermission, setCheckingPermission] = useState(false);
  const { createCustomer, updateCustomer, isCreating, isUpdating } =
    useCustomers();

  const isSubmitting = checkingPermission || isCreating || isUpdating;

  const t = useTranslations();
  const dir = useDirection();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: useIntlZodResolver(customerSchema),
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
    setCheckingPermission(true);

    try {
      const allowed = await hasPermission({
        resource: "customer",
        permission: [
          isOperationCreate ? OperationMode.CREATE : OperationMode.UPDATE,
        ],
      });

      if (!allowed) {
        toast.error(
          t(
            isOperationCreate
              ? "customers.messages.error.add"
              : "customers.messages.error.edit",
          ),
        );
        return;
      }
      if (isOperationCreate) {
        await createCustomer.mutateAsync(values);
        toast.success(t("customers.messages.success.add"));
      } else {
        if (customer)
          await updateCustomer.mutateAsync({ id: customer.id, data: values });
        toast.success(t("customers.messages.success.edit"));
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.phone.label")}
                  isRequired={true}
                >
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark className="size-3 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent dir="ltr">00963xxxxxxxxx</TooltipContent>
                  </Tooltip>
                </CustomFormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Fields.phone.placeholder")}
                    disabled={isSubmitting}
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
                  <CustomFormLabel
                    label={t("Fields.email.label")}
                    isRequired={true}
                  />
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("Fields.email.placeholder")}
                      disabled={isSubmitting}
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
                  <CustomFormLabel
                    label={t("Fields.address.label")}
                    isRequired={true}
                  />
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder={t("Fields.address.placeholder")}
                      disabled={isSubmitting}
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
                <CustomFormLabel label={t("Fields.company.label")} />
                <FormControl>
                  <Input
                    placeholder={t("Fields.company.placeholder")}
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
            name="taxNumber"
            render={({ field }) => (
              <FormItem>
                <CustomFormLabel
                  label={t("Fields.taxnumber.label")}
                  isRequired={true}
                />
                <FormControl>
                  <Input
                    placeholder={t("Fields.taxnumber.placeholder")}
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
            className="col-span-2"
          />
        </form>
      </Form>
    </ScrollArea>
  );
}
